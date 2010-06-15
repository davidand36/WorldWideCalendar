/*
    ISO8601CalendarPage.js
    David M. Anderson
    wwwCalendar

    ISO8601CalendarPage "class": manages display of, and interaction with, Web
    calendar page for the ISO 8601 calendar.
*/


//*****************************************************************************


εδ.WWCal.ISO8601CalendarPage = function( )
{                                                           /*ISO8601Calendar*/
//-----------------------------------------------------------------------------
/*
  Returns an object with these methods:
      Start( )
      ChangeJulianDay( )
*/
//-----------------------------------------------------------------------------

    var theObject = { };
    var currentDate = Date( 0, 0, 0, 0 );
    var firstDate = Date( 0, 0, 0, 0 );
    var requestsPending = 0;

    var calendarName = 'ISO 8601';
    var serverURL = εδ.WWCal.app.ServerURL();
    var errorHandler = εδ.WWCal.errorHandler;

    var daysInWeek = 7;
    var weekdayNames = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
                         'Friday', 'Saturday', 'Sunday' ];

    var CurDateRqst = 1 << 0;

//=============================================================================

    theObject.Start = function( )
    {
        StartNewWeek( true );
    };

//-----------------------------------------------------------------------------

    theObject.ChangeJulianDay = function( )
    {
        var day = εδ.WWCal.app.CurrentJulianDay() - firstDate.julianDay + 1;
        if ( (day >= 1) && (day <= daysInWeek) )
            ChangeDay( day );
        else
            StartNewWeek( true );
    };

//=============================================================================

    function Date( julianDay, day, week, year )
    {
        var theObject =
            {
                julianDay: julianDay,
                day: day,
                week: week,
                year: year
            };
        return theObject;
    }

//=============================================================================

    function StartNewWeek( fromJD )
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
                       week: currentDate.week,
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
        currentDate = Date( dateRsp.julianDay, dateRsp.day, dateRsp.week,
                            dateRsp.year );
        firstDate = Date( (currentDate.julianDay - currentDate.day + 1),
                          1, currentDate.week, currentDate.year );
        requestsPending &= ~ CurDateRqst;
        εδ.WWCal.app.SetJulianDay( currentDate.julianDay );
        DisplayDateForm( );
        DisplayWeekTable( );
    }

//=============================================================================

    function DisplayDateForm( )
    {
        if ( (requestsPending & (CurDateRqst)) != 0 )
            return;
        var i;
        var html = '';
        html += '<form name="DateForm">' +
            '<label for="DayField" class="DatePart">Day: </label>' +
            '<input type="text" class="DatePart"' +
            ' name="Day" id="DayField" maxlength="1" size="1" />' +
            '<label for="WeekField" class="DatePart"> Week: </label>' +
            '<input type="text" class="DatePart"' +
            ' name="Week" id="WeekField" maxlength="2" size="2" />' +
            '<label for="YearField" class="DatePart"> Year: </label>' +
            '<input type="text" class="DatePart"' +
            ' name="Year" id="YearField" maxlength="5" size="4" />' +
            '<span class="Button" id="ChangeDate">' +
            'Change' +
            '</span>' +
            '</form>';
        $('#DateDiv').html( html );

        $('#DayField').val( currentDate.day );
        $('#WeekField').val( currentDate.week );
        $('#YearField').val( currentDate.year );

        $('#DayField').change( CheckDay );
        $('#WeekField').change( CheckWeek );
        $('#YearField').change( CheckYear );
        $('#ChangeDate').click( ChangeDate );
    }

//.............................................................................

    function CheckDay( )
    {
        var day = parseInt( $('#DayField').val() );
        var fixedDay = εδ.Math.MakeFinite( day, currentDate.day );
        fixedDay = εδ.Math.Clamp( fixedDay, 1, daysInWeek );
        if ( fixedDay != day )
            $('#DayField').val( fixedDay );
    }

//.............................................................................

    function CheckWeek( )
    {
        var week = parseInt( $('#WeekField').val() );
        var fixedWeek = εδ.Math.MakeFinite( week, currentDate.week );
        fixedWeek = Math.max( fixedWeek, 1 );
        if ( fixedWeek != week )
            $('#WeekField').val( fixedWeek );
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
        var week = parseInt( $('#WeekField').val() );
        var year = parseInt( $('#YearField').val() );
        if ( (week === currentDate.week) &&
             (year === currentDate.year) )
            ChangeDay( day );
        else
            ChangeFullDate( day, week, year );
        return false;
    }

//.............................................................................

    function ChangeDay( day )
    {
        var oldDay = currentDate.day;
        day = εδ.Math.MakeFinite( day, oldDay );
        day = εδ.Math.Clamp( day, 1, daysInWeek );
        currentDate.day = day;

        $('#DayField').val( day );

        $('#Day' + oldDay).removeClass( 'CurDay' );
        $('#Day' + day).addClass( 'CurDay' );

        var jd = firstDate.julianDay + day - 1;
        εδ.WWCal.app.SetJulianDay( jd );
    }

//.............................................................................

    function ChangeFullDate( day, week, year )
    {
        currentDate.day = day;
        currentDate.week = week;
        currentDate.year = year;
        StartNewWeek( false );
    }

//=============================================================================

    function DisplayWeekTable( )
    {
        if ( (requestsPending & (CurDateRqst)) != 0 )
            return;
        var html = '';
        var today = εδ.WWCal.app.TodayGregorian().julianDay -
            firstDate.julianDay + 1;
        var i, d;
        html += '<table class="MonthTable">' +
            '<thead>' +
            '<tr>' +
            '<td colspan="' + daysInWeek + '">' +
            'Week ' + currentDate.week + ' of ' + currentDate.year +
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
        for ( d = 1; d <= daysInWeek; ++d )
        {
            var className = "MTDay";
            if ( d === currentDate.day )
                className += " CurDay";
            if ( d === today )
                className += " Today";
            html += '<td class="' + className + '" id="Day' + d + '">';
            html += d;
            html += '</td>';
        }
        html += '</tr>' +
            '</tbody>' +
            '</table>';
        $('#MonthTableDiv').html( html );

        for ( d = 1; d <= daysInWeek; ++d )
        {
            $('#Day' + d).click( HandleDayClick );
        }
    }

//.............................................................................

    function HandleDayClick( event )
    {
        var id = $(this).attr( 'id' );
        var day = parseInt( id.substr( 3 ) );
        ChangeDay( day );
        return false;
    }


//=============================================================================

    return theObject;
};                                                          /*ISO8601Calendar*/


//*****************************************************************************
