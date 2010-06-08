/*
    DMYWCalendarPage.js
    David M. Anderson
    wwwCalendar

    DMYWCalendarPage "class": manages display of, and interaction with, Web
    calendar page for Day/Month/Year/Week calendars (i.e., most of the
    common calendars in the world).
*/


//*****************************************************************************


εδ.WWCal.DMYWCalendarPage = function( spec )
{                                                              /*DMYWCalendar*/
//-----------------------------------------------------------------------------
/*
  Returns an object with these methods:
      Start( )
      ChangeJulianDay( )
*/
//-----------------------------------------------------------------------------

    var theObject = { };
    var weekdayNames = [];
    var daysInWeek = 0;
    var monthNames = [];
    var currentDate = Date( 0, 0, 0, 0, 0 );
    var firstDate = Date( 0, 0, 0, 0, 0 );
    var monthLength = 0;
    var requestsPending = 0;

    var calendarName = spec.name;
    var serverURL = εδ.WWCal.app.ServerURL();
    var errorHandler = εδ.WWCal.errorHandler;

    var CurDateRqst = 1 << 0;
    var FirstDateRqst = 1 << 1;
    var MonthLengthRqst = 1 << 2;
    var MonthNamesRqst = 1 << 3;
    var WeekdayNamesRqst = 1 << 4;

//=============================================================================

    theObject.Start = function( )
    {
        GetWeekdayNames( );
        StartNewMonth( true );
    };

//-----------------------------------------------------------------------------

    theObject.ChangeJulianDay = function( )
    {
        var day = εδ.WWCal.app.CurrentJulianDay() - firstDate.julianDay + 1;
        if ( (day >= 1) && (day <= monthLength) )
            ChangeDay( day );
        else
            StartNewMonth( true );
    };

//=============================================================================

    function Date( julianDay, day, month, year, dayOfWeek )
    {
        var theObject =
            {
                julianDay: julianDay,
                day: day,
                month: month,
                year: year,
                dayOfWeek: dayOfWeek
            };
        return theObject;
    }

//=============================================================================

    function GetWeekdayNames( )
    {
        if ( daysInWeek > 0 )
            return;
        $.getJSON( serverURL,
                   {
                       action: 'WeekdayNames',
                       calendar: calendarName,
                       format: 'JSON'
                   },
                   ProcessWeekdayNames );
        requestsPending |= WeekdayNamesRqst;
    }

//.............................................................................

    function ProcessWeekdayNames( ajaxResponse )
    {
        if ( ajaxResponse.Error )
        {
            errorHandler.ReportError( ajaxResponse.Error );
            return;
        }

        var weekdayRsp = ajaxResponse;
        weekdayNames = weekdayRsp.weekdayNames;
        daysInWeek = weekdayNames.length;
        requestsPending &= ~ WeekdayNamesRqst;
        if ( daysInWeek === 0 )
            εδ.WWCal.errorHandler.ReportError(
                'An error occurred: daysInWeek = 0' );

        DisplayDateForm( );
        DisplayMonthTable( );
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
                       day: currentDate.day,
                       month: currentDate.month,
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
        currentDate = Date( dateRsp.julianDay, dateRsp.day, dateRsp.month,
                            dateRsp.year, dateRsp.dayOfWeek );
        requestsPending &= ~ CurDateRqst;
        εδ.WWCal.app.SetJulianDay( currentDate.julianDay );
        GetMonthNames( );
        GetFirstDate( );
        GetMonthLength( );
    }

//-----------------------------------------------------------------------------

    function GetMonthNames( )
    {
        $.getJSON( serverURL,
                   {
                       action: 'MonthNames',
                       calendar: calendarName,
                       year: currentDate.year,
                       format: 'JSON'
                   },
                   ProcessMonthNames );
        requestsPending |= MonthNamesRqst;
    }

//.............................................................................

    function ProcessMonthNames( ajaxResponse )
    {
        if ( ajaxResponse.Error )
        {
            errorHandler.ReportError( ajaxResponse.Error );
            return;
        }

        monthNames = ajaxResponse.monthNames;
        requestsPending &= ~ MonthNamesRqst;
        if ( monthNames.length === 0 )
        {
            εδ.WWCal.app.ReportError(
                'An error occurred: monthNames.length = 0' );
            return;
        }
        DisplayDateForm( );
        DisplayMonthTable( );
    }

//-----------------------------------------------------------------------------

    function GetFirstDate( )
    {
        $.getJSON( serverURL,
                   {
                       action: 'DateToJD',
                       calendar: calendarName,
                       day: 1,
                       month: currentDate.month,
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
        firstDate = Date( dateRsp.julianDay, dateRsp.day, dateRsp.month,
                          dateRsp.year, dateRsp.dayOfWeek );
        requestsPending &= ~ FirstDateRqst;
        DisplayDateForm( );
        DisplayMonthTable( );
    }

//-----------------------------------------------------------------------------

    function GetMonthLength( )
    {
        $.getJSON( serverURL,
                   {
                       action: 'MonthLength',
                       calendar: calendarName,
                       month: currentDate.month,
                       year: currentDate.year,
                       format: 'JSON'
                   },
                   ProcessMonthLength );
        requestsPending |= MonthLengthRqst;
    }

//.............................................................................

    function ProcessMonthLength( ajaxResponse )
    {
        if ( ajaxResponse.Error )
        {
            errorHandler.ReportError( ajaxResponse.Error );
            return;
        }

        monthLength = ajaxResponse.monthLength;
        requestsPending &= ~ MonthLengthRqst;
        if ( monthLength === 0 )
        {
            εδ.WWCal.errorHandler.ReportError(
                'An error occurred: monthLength=0' );
            return;
        }
        if ( currentDate.day > monthLength )
        {
            currentDate.day = monthLength;
        }
        DisplayDateForm( );
        DisplayMonthTable( );
    }

//=============================================================================

    function DisplayDateForm( )
    {
        if ( (requestsPending &
             (CurDateRqst | FirstDateRqst | MonthNamesRqst | WeekdayNamesRqst |
              MonthLengthRqst)) != 0 )
            return;
        var html = '';
        html += '<form name="DateForm">' +
            '<span class="DatePart" id="Weekday">' +
            '</span>' +
            ', ' +
            '<input type="text" class="DatePart" name="Day" id="DayField"' +
            ' maxlength="2" size="2" />' +
            '<select class="DatePart" name="MonthList" id="MonthList">';
        for ( var i = 1; i <= monthNames.length; ++i )
        {
            html += '<option value="' + i + '">' +
                monthNames[ i - 1 ] + ' (' + i + ')' +
                '</option>';
        }
        html += '</select>' +
            '<input type="text" class="DatePart" name="Year" id="YearField"' +
            ' maxlength="5" size="4" />' +
            '<span class="Button" id="ChangeDate">' +
            'Change' +
            '</span>' +
            '</form>';
        $('#DateDiv').html( html );

        $('#Weekday').html( weekdayNames[ currentDate.dayOfWeek ] );
        $('#DayField').val( currentDate.day );
        $('#MonthList').val( currentDate.month );
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
        var month = parseInt( $('#MonthList').val() );
        var year = parseInt( $('#YearField').val() );
        if ( (month === currentDate.month) &&
             (year === currentDate.year) )
            ChangeDay( day );
        else
            ChangeFullDate( day, month, year );
        return false;
    }

//.............................................................................

    function ChangeDay( day )
    {
        var oldDay = currentDate.day;
        day = εδ.Math.MakeFinite( day, oldDay );
        day = εδ.Math.Clamp( day, 1, monthLength );
        currentDate.day = day;
        $('#Day' + oldDay).removeClass( 'CurDay' );
        $('#Day' + day).addClass( 'CurDay' );

        var weekday = (firstDate.dayOfWeek + day - 1) % daysInWeek;
        $('#Weekday').html( weekdayNames[ weekday ] );
        $('#DayField').val( day );

        var jd = firstDate.julianDay + day - 1;
        εδ.WWCal.app.SetJulianDay( jd );
    }

//.............................................................................

    function ChangeFullDate( day, month, year )
    {
        currentDate.day = day;
        currentDate.month = month;
        currentDate.year = year;
        StartNewMonth( false );
    }

//=============================================================================

    function DisplayMonthTable( )
    {
        if ( (requestsPending & (CurDateRqst | FirstDateRqst |
                                 MonthNamesRqst | MonthLengthRqst |
                                 WeekdayNamesRqst)) != 0 )
            return;

        var i, d;
        var html = '';
        html += '<table class="MonthTable">' +
            '<thead>' +
            '<tr>' +
            '<td colspan="' + daysInWeek + '">' +
            monthNames[ currentDate.month - 1 ] +
            ' ' + currentDate.year +
            '</td>' +
            '</tr>' +
            '</thead>';
        html += '<tr>';
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
            html += '<td>'
                + '</td>';
            ++wd;
        }
        var today = εδ.WWCal.app.TodayGregorian().julianDay -
            firstDate.julianDay + 1;
        for ( d = 1; d <= monthLength; ++d, ++wd )
        {
            if ( wd >= daysInWeek )
            {
                html += '</tr>' +
                    '<tr>';
                wd = 0;
            }
            var className = 'MTDay';
            if ( d === currentDate.day )
                className += ' CurDay';
            if ( d === today )
                className += ' Today';
            html += '<td class="' + className + '" id="Day' + d + '">';
            html += d;
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

    function HandleDayClick()
    {
        var id = $(this).attr( 'id' );
        var day = parseInt( id.substr( 3 ) );
        ChangeDay( day );
        return false;
    }

//=============================================================================

    return theObject;

};                                                             /*DMYWCalendar*/


//*****************************************************************************
