/*
    DMYWCalendarPage.js
    David M. Anderson
    WorldWideCalendar.info

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
    var options = spec.options;
    var serverURL = εδ.WWCal.app.ServerURL();
    var errorHandler = εδ.WWCal.errorHandler;

    var AvailableOptionsRqst = 1 << 0;
    var CurDateRqst = 1 << 1;
    var FirstDateRqst = 1 << 2;
    var NamesRqst = 1 << 3;
    var MonthDataRqst = 1 << 4;

//=============================================================================

    theObject.Start = function( )
    {
        GetAvailableOptions( );
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

    function GetAvailableOptions( )
    {
        if ( options && ! options.HaveOptions() )
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

        if ( options )
            options.ProcessAvailableOptions( ajaxResponse );
        requestsPending &= ~ AvailableOptionsRqst;
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
        var ajaxData
            = {
                action: 'JDToDate',
                calendar: calendarName,
                julianDay: εδ.WWCal.app.CurrentJulianDay(),
                format: 'JSON'
            };
        if ( options )
            options.AddAjaxData( ajaxData );
        $.getJSON( serverURL, ajaxData, ProcessCurrentDate );
        requestsPending |= CurDateRqst;
    }

//.............................................................................

    function GetCurrentJD( )
    {
        var ajaxData
            = {
                action: 'DateToJD',
                calendar: calendarName,
                day: currentDate.day,
                month: currentDate.month,
                year: currentDate.year,
                format: 'JSON'
            };
        if ( options )
            options.AddAjaxData( ajaxData );
        $.getJSON( serverURL, ajaxData, ProcessCurrentDate );
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
        GetNames( );
        GetFirstDate( );
        GetMonthData( );
    }

//-----------------------------------------------------------------------------

    function GetNames( )
    {
        var ajaxData
            = {
                action: 'Names',
                calendar: calendarName,
                month: currentDate.month,
                year: currentDate.year,
                format: 'JSON'
            };
        if ( options )
            options.AddAjaxData( ajaxData );
        $.getJSON( serverURL, ajaxData, ProcessNames );
        requestsPending |= NamesRqst;
    }

//.............................................................................

    function ProcessNames( ajaxResponse )
    {
        if ( ajaxResponse.Error )
        {
            errorHandler.ReportError( ajaxResponse.Error );
            return;
        }

        monthNames = ajaxResponse.monthNames;
        weekdayNames = ajaxResponse.weekdayNames;
        daysInWeek = weekdayNames.length;
        requestsPending &= ~ NamesRqst;
        if ( monthNames.length === 0 )
        {
            εδ.WWCal.app.ReportError(
                'An error occurred: monthNames.length = 0' );
            return;
        }
        if ( weekdayNames.length === 0 )
        {
            εδ.WWCal.app.ReportError(
                'An error occurred: weekdayNames.length = 0' );
            return;
        }
        DisplayDateForm( );
        DisplayMonthTable( );
    }

//-----------------------------------------------------------------------------

    function GetFirstDate( )
    {
        var ajaxData
            = {
                action: 'DateToJD',
                calendar: calendarName,
                day: 1,
                month: currentDate.month,
                year: currentDate.year,
                format: 'JSON'
            };
        if ( options )
            options.AddAjaxData( ajaxData );
        $.getJSON( serverURL, ajaxData, ProcessFirstDate );
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

    function GetMonthData( )
    {
        var ajaxData
            = {
                action: 'MonthData',
                calendar: calendarName,
                month: currentDate.month,
                year: currentDate.year,
                format: 'JSON'
            };
        if ( options )
            options.AddAjaxData( ajaxData );
        $.getJSON( serverURL, ajaxData, ProcessMonthData );
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

        monthLength = ajaxResponse.monthLength;
        requestsPending &= ~ MonthDataRqst;
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
             (AvailableOptionsRqst | CurDateRqst | FirstDateRqst | NamesRqst |
              MonthDataRqst)) != 0 )
            return;
        var html = '';
        html += '<form name="DateForm">' +
            '<div>';
        if ( options )
            html += options.WriteFormHtml( );
        html += '</div>' +
            '<div>' +
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
            '</div>' +
            '</form>';
        $('#DateDiv').html( html );

        if ( options )
            options.UpdateForm( );
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
        var optionsChanged = false;
        if ( options )
            optionsChanged = options.HasFormChanged( );
        var day = parseInt( $('#DayField').val() );
        var month = parseInt( $('#MonthList').val() );
        var year = parseInt( $('#YearField').val() );
        if ( (month === currentDate.month) &&
             (year === currentDate.year) &&
             ! optionsChanged )
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
        if ( options )
            options.GetFormData( );
        currentDate.day = day;
        currentDate.month = month;
        currentDate.year = year;
        StartNewMonth( false );
    }

//=============================================================================

    function DisplayMonthTable( )
    {
        if ( (requestsPending &
              (CurDateRqst | FirstDateRqst | NamesRqst | MonthDataRqst)) != 0 )
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
