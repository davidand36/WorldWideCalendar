/*
    HinduLunisolarCalendarPage.js
    David M. Anderson
    wwwCalendar

    HinduLunisolarCalendarPage "class": manages display of, and interaction
    with, Web calendar page for the Hindu lunisolar calendar.
*/


//*****************************************************************************


εδ.WWCal.HinduLunisolarCalendarPage = function( )
{                                                    /*HinduLunisolarCalendar*/
//-----------------------------------------------------------------------------
/*
  Returns an object with these methods:
      Start( )
      ChangeJulianDay( )
*/
//-----------------------------------------------------------------------------

    var theObject = { };
    var currentDate = Date( 0, 0, false, 0, false, 0, 0 );
    var firstDate = Date( 0, 0, false, 0, false, 0, 0 );
    var lastDay = 0;
    var lostDay = 0;
    var leapDay = 0;
    var monthLength = 0;
    var versions = [];
    var version;
    var requestsPending = 0;

    var calendarName = 'Hindu lunisolar';
    var serverURL = εδ.WWCal.app.ServerURL();
    var errorHandler = εδ.WWCal.errorHandler;

    var numMonths = 12;
    var monthNames = [ "Chaitra", "Vaishākh", "Jyaishtha", "Āshādha",
                       "Shrāvana", "Bhādrapad", "Āshwin", "Kārtik",
                       "Mārgashīrsha", "Paush", "Māgh", "Phālgun" ];
    var daysInWeek = 7;
    var weekdayNames = [ "Ravi vāsara", "Soma vāsara", "Mangala vāsara",
                         "Budha vāsara", "Guru vāsara", "Shukra vāsara",
                         "Shani vāsara" ];

    var CurDateRqst = 1 << 0;
    var FirstDateRqst = 1 << 1;
    var MonthDataRqst = 1 << 2;
    var AvailableOptionsRqst = 1 << 3;

//=============================================================================

    theObject.Start = function( )
    {
        GetAvailableOptions( );
        StartNewMonth( true );
    };

//-----------------------------------------------------------------------------

    theObject.ChangeJulianDay = function( )
    {
        var seqDay = εδ.WWCal.app.CurrentJulianDay() - firstDate.julianDay + 1;
        if ( (seqDay >= 1) && (seqDay <= monthLength) )
            ChangeDay( seqDay );
        else
            StartNewMonth( true );
    };

//=============================================================================

    function Date( julianDay, day, dayLeap, month, monthLeap, year, dayOfWeek )
    {
        var theObject =
            {
                julianDay: julianDay,
                day: day,
                dayLeap: dayLeap,
                month: month,
                monthLeap: monthLeap,
                year: year,
                dayOfWeek: dayOfWeek
            };
        return theObject;
    }

//-----------------------------------------------------------------------------

    function DayPair( number, dayLeap )
    {
        var theObject =
            {
                number: number,
                leap: dayLeap
            };
        return theObject;
    }

//.............................................................................

    function SeqDayToDayPair( seqDay )
    {
        var dayNumber = seqDay;
        var dayLeap = false;
        if ( dayNumber >= lostDay )
            ++dayNumber;
        if ( dayNumber == (leapDay + 1) )
        {
            --dayNumber;
            dayLeap = true;
        }
        if ( dayNumber > leapDay )
            --dayNumber;
        if ( dayNumber == lostDay )
            --dayNumber;
        return DayPair( dayNumber, dayLeap );
    }

//.............................................................................

    function DayPairToSeqDay( dayPair )
    {
        var seqDay = dayPair.number;
        if ( (seqDay > leapDay) || dayPair.leap )
            ++seqDay;
        if ( seqDay > lostDay )
            --seqDay;
        return seqDay;
    }

//=============================================================================

    function GetAvailableOptions( )
    {
        if ( versions.length === 0 )
        {
            var ajaxData
                = {
                    action: 'AvailableOptions',
                    calendar: calendarName,
                    format: 'JSON'
                };
            $.getJSON( serverURL, ajaxData, ProcessAvailableOptions );
            requestsPending |= AvailableOptionsRqst;
        }
    }

//.............................................................................

    function ProcessAvailableOptions( ajaxResponse )
    {
        if ( ajaxResponse.Error )
        {
            errorHandler.ReportError( ajaxResponse.Error );
            return;
        }

        var availableOptions = ajaxResponse.availableOptions;
        if ( availableOptions )
        {
            versions = availableOptions.versions;
            if ( versions.length > 0 )
                version = versions[ 0 ];
        }
        requestsPending &= ~ AvailableOptionsRqst;
        DisplayDateForm( );
    }

//-----------------------------------------------------------------------------

    function StartNewMonth( fromJD )
    {
        if ( fromJD )
            GetCurrentDate( );
        else
            GetCurrentJD( );
    }

//-----------------------------------------------------------------------------

    function GetCurrentDate( )
    {
        $.getJSON( serverURL,
                   {
                       action: 'JDToDate',
                       calendar: calendarName,
                       version: version,
                       julianDay: εδ.WWCal.app.CurrentJulianDay(),
                       format: 'JSON'
                   },
                   ProcessCurrentDate );
        requestsPending |= CurDateRqst;
    }

//.............................................................................

    function GetCurrentJD( )
    {
        $.getJSON( serverURL,
                   {
                       action: 'DateToJD',
                       calendar: calendarName,
                       version: version,
                       day: currentDate.day,
                       dayLeap: currentDate.dayLeap,
                       month: currentDate.month,
                       monthLeap: currentDate.monthLeap,
                       year: currentDate.year,
                       format: 'JSON'
                   },
                   ProcessCurrentDate );
        requestsPending |= CurDateRqst;
    }

//.............................................................................

    function ProcessCurrentDate( ajaxResponse )
    {
        if ( ajaxResponse.Error )
        {
            errorHandler.ReportError( ajaxResponse.Error );
            return;
        }

        var dateRsp = ajaxResponse;
        currentDate = Date( dateRsp.julianDay, dateRsp.day, dateRsp.dayLeap,
                            dateRsp.month, dateRsp.monthLeap, dateRsp.year,
                            dateRsp.dayOfWeek );
        requestsPending &= ~ CurDateRqst;
        εδ.WWCal.app.SetJulianDay( currentDate.julianDay );
        GetFirstDate( );
        GetMonthData( );
    }

//-----------------------------------------------------------------------------

    function GetFirstDate( )
    {
        $.getJSON( serverURL,
                   {
                       action: 'DateToJD',
                       calendar: calendarName,
                       version: version,
                       day: 1,
                       dayLeap: false,
                       month: currentDate.month,
                       monthLeap: currentDate.monthLeap,
                       year: currentDate.year,
                       format: 'JSON'
                   },
                   ProcessFirstDate );
        requestsPending |= FirstDateRqst;
    }

//.............................................................................

    function ProcessFirstDate( ajaxResponse )
    {
        if ( ajaxResponse.Error )
        {
            errorHandler.ReportError( ajaxResponse.Error );
            return;
        }

        var dateRsp = ajaxResponse;
        firstDate = Date( dateRsp.julianDay, dateRsp.day, dateRsp.dayLeap,
                          dateRsp.month, dateRsp.monthLeap, dateRsp.year,
                          dateRsp.dayOfWeek );
        requestsPending &= ~ FirstDateRqst;
        DisplayDateForm( );
        DisplayMonthTable( );
    }

//-----------------------------------------------------------------------------

    function GetMonthData( )
    {
        $.getJSON( serverURL,
                   {
                       action: 'MonthData',
                       calendar: calendarName,
                       version: version,
                       month: currentDate.month,
                       monthLeap: currentDate.monthLeap,
                       year: currentDate.year,
                       format: 'JSON'
                   },
                   ProcessMonthData );
        requestsPending |= MonthDataRqst;
    }

//.............................................................................

    function ProcessMonthData( ajaxResponse )
    {
        if ( ajaxResponse.Error )
        {
            errorHandler.ReportError( ajaxResponse.Error );
            return;
        }
        lastDay = ajaxResponse.lastDay;
        lostDay = ajaxResponse.lostDay;
        leapDay = ajaxResponse.leapDay;
        monthLength
            = DayPairToSeqDay( DayPair( lastDay, (leapDay === lastDay) ) );
        if ( currentDate.day > lastDay )
            currentDate.day = lastDay;
        requestsPending &= ~ MonthDataRqst;
        DisplayDateForm( );
        DisplayMonthTable( );
    }

//=============================================================================

    function DisplayDateForm( )
    {
        if ( (requestsPending &
              (CurDateRqst | FirstDateRqst | MonthDataRqst)) != 0 )
            return;
        var i;
        var html = '';
        html += '<form name="DateForm">' +
            '<div>';
        if ( versions.length > 0 )
        {
            html +=
            '<label for="VersionList" class="DatePart">Version: </label>' +
            '<select class="DatePart" ' +
                'name="VersionList" id="VersionList">';
            for ( i = 0; i < versions.length; ++i )
            {
                html += '<option value="' + versions[i] + '">' +
                    versions[ i ] +
                    '</option>';
            }
            html += '</select>';
        }
        html += '</div>' +
            '<div>' +
            '<span class="DatePart" id="Weekday">' +
            '</span>' +
            ', ' +
            '<input class="DatePart" type="text" ' +
            'name="DayField" id="DayField" ' +
            'maxlength="2" size="2" />' +
            '<select class="DatePart" name="DayLeapList" id="DayLeapList">' +
            '<option value="common">common</option>' +
            '<option value="leap">leap</option>' +
            '</select> ' +
            '<select class="DatePart" name="MonthList" id="MonthList">';
        for ( i = 1; i <= numMonths; ++i )
        {
            html +='<option value="' + i + '">' +
                monthNames[ i - 1 ] + ' (' + i + ')' +
                '</option>';
        }
        html += '<select class="DatePart"' +
            ' name="MonthLeapList" id="MonthLeapList">' +
            '<option value="common">common</option>' +
            '<option value="leap">leap</option>' +
            '</select> ' +
            '<input class="DatePart" type="text" ' +
            'name="YearField" id="YearField" ' +
            'maxlength="5" size="4" />' +
            '<input type="submit" class="Button" id="ChangeDate"' +
            ' value="Change" />' +
            '</div>' +
            '</form>';
        $('#DateDiv').html( html );

        if ( version )
            $('#VersionList').val( version );
        $('#Weekday').html( weekdayNames[ currentDate.dayOfWeek ] );
        $('#DayField').val( currentDate.day );
        $('#DayLeapList').val( currentDate.dayLeap ? 'leap' : 'common' );
        $('#MonthList').val( currentDate.month );
        $('#MonthLeapList').val( currentDate.monthLeap ? 'leap' : 'common' );
        $('#YearField').val( currentDate.year );

        $('#DayField').change( CheckDay );
        $('#YearField').change( CheckYear );
        $('#ChangeDate').click( ChangeDate );
    }

//.............................................................................

    function CheckDay( )
    {
        var day = parseInt( $('#DayField').val() );
        var fixedDay = εδ.Math.MakeFinite( day, currentDate.day );
        fixedDay = Math.max( fixedDay, 1 );
        if ( fixedDay != day )
            $('#DayField').val( fixedDay );
    }

//.............................................................................

    function CheckYear( )
    {
        var year = parseInt( $('#YearField').val() );
        var fixedYear = εδ.Math.MakeFinite( year, currentDate.year );
        if ( fixedYear != year )
            $('#YearField').val( fixedYear );
    }

//.............................................................................

    function ChangeDate( )
    {
        var day = parseInt( $('#DayField').val() );
        var dayLeap = ($('#DayLeapList').val() === 'leap');
        var month = parseInt( $('#MonthList').val() );
        var monthLeap = ($('#MonthLeapList').val() === 'leap');
        var year = parseInt( $('#YearField').val() );
        if ( ($('#VersionList').val() === version) &&
            (month === currentDate.month) &&
             (monthLeap === currentDate.monthLeap) &&
             (year === currentDate.year) )
            ChangeDay( DayPairToSeqDay( day, dayLeap ) );
        else
            ChangeFullDate( day, dayLeap, month, monthLeap, year );
        return false;
    }

//.............................................................................

    function ChangeDay( seqDay )
    {
        var oldDayPair = DayPair( currentDate.day, currentDate.dayLeap );
        var oldSeqDay = DayPairToSeqDay( oldDayPair );
        seqDay = εδ.Math.MakeFinite( seqDay, oldSeqDay );
        seqDay = εδ.Math.Clamp( seqDay, 1, monthLength );
        var newDayPair = SeqDayToDayPair( seqDay );

        currentDate.day = newDayPair.number;
        currentDate.dayLeap = newDayPair.leap;

        var weekday = (firstDate.dayOfWeek + seqDay - 1) % daysInWeek;
        $('#Weekday').html( weekdayNames[ weekday ] );
        $('#DayField').val( currentDate.day );
        $('#DayLeapList').val( currentDate.dayLeap ? 'leap' : 'common' );

        $('#Day' + oldSeqDay).removeClass( 'CurDay' );
        $('#Day' + seqDay).addClass( 'CurDay' );

        var jd = firstDate.julianDay + seqDay - 1;
        εδ.WWCal.app.SetJulianDay( jd );
    }

//.............................................................................

    function ChangeFullDate( day, dayLeap, month, monthLeap, year )
    {
        version = $('#VersionList').val();
        currentDate.day = day;
        currentDate.dayLeap = dayLeap;
        currentDate.month = month;
        currentDate.monthLeap = monthLeap;
        currentDate.year = year;
        StartNewMonth( false );
    }

//=============================================================================

    function DisplayMonthTable( )
    {
        if ( (requestsPending & (CurDateRqst | FirstDateRqst |
                                  MonthDataRqst)) != 0 )
            return;
        var html = '';
        var i, d;
        html += '<table class="MonthTable">' +
            '<thead>' +
            '<tr>' +
            '<td colspan="' + daysInWeek + '">' +
            monthNames[ currentDate.month - 1 ] +
            '</td>' +
            '</tr>' +
            '</thead>' +
            '<tr>';
        for ( i = 0; i < daysInWeek; ++i )
        {
            html += '<th>' +
                weekdayNames[i] +
                '</th>';
        }
        html += '</tr>';
        html += '<tbody>' +
            '<tr>';
        var wd = 0;
        for ( i = 0; i < firstDate.dayOfWeek; ++i )
        {
            html += '<td>' +
                '</td>';
            ++wd;
        }
        var today = εδ.WWCal.app.TodayGregorian().julianDay -
            firstDate.julianDay + 1;
        var curSeqDay = DayPairToSeqDay(
            DayPair( currentDate.day, currentDate.dayLeap ) );
        for ( d = 1; d <= monthLength; ++d, ++wd )
        {
            if ( wd >= daysInWeek )
            {
                html += '</tr>' +
                    '<tr>';
                wd = 0;
            }
            var className = 'MTDay';
            if ( d === curSeqDay )
                className += ' CurDay';
            if ( d === today )
                className += ' Today';
            html += '<td class="' + className + '" id="Day' + d + '">';
            var dayPair = SeqDayToDayPair( d );
            html += dayPair.number;
            if ( dayPair.leap )
                html += ' (Leap)';
            html += '</td>';
        }
        html += '</tr>' +
            '</tbody>' +
            '</table>';
        $('#MonthTableDiv').html( html );

        for ( d = 1; d <= monthLength; ++d )
        {
            $('#Day' + d).click( HandleDayClick );
        }
    }

//.............................................................................

    function HandleDayClick( event )
    {
        var id = $(this).attr( 'id' );
        var seqDay = parseInt( id.substr( 3 ) );
        ChangeDay( seqDay );
        return false;
    }


//=============================================================================

    return theObject;
};                                                   /*HinduLunisolarCalendar*/


//*****************************************************************************
