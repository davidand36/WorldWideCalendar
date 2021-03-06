/*
    BadiCalendarPage.js
    David M. Anderson
    wwwCalendar

    BadiCalendarPage "class": manages display of, and interaction with, Web
    calendar page for the Badi calendar.
*/


//*****************************************************************************


εδ.WWCal.BadiCalendarPage = function( )
{                                                              /*BadiCalendar*/
//-----------------------------------------------------------------------------
/*
  Returns an object with these methods:
      Start( )
      ChangeJulianDay( )
*/
//-----------------------------------------------------------------------------

    var theObject = { };
    var currentDate = Date( 0, 0, 0, 0, 0, 0, 0 );
    var firstDate = Date( 0, 0, 0, 0, 0, 0, 0 );
    var monthLength = 0;
    var requestsPending = 0;

    var calendarName = "Eastern Bahá'í";
    var serverURL = εδ.WWCal.app.ServerURL();
    var errorHandler = εδ.WWCal.errorHandler;

    var numDays = 19;
    var dayNames = [ "Bahā`", "Jalāl", "Jamāl", "`Aẓamat", "Nūr", "Raḥmat",
                     "Kalimāt", "Kamāl", "Asmā'", "`Izzat", "Mashīyyat",
                     "`Ilm", "Qudrat", "Qawl", "Masā'il", "Sharaf", "Sulṭān",
                     "Mulk", "`Alā'" ];
    var numMonths = 20;
    var monthNames = [ "Bahā`", "Jalāl", "Jamāl", "`Aẓamat", "Nūr", "Raḥmat",
                     "Kalimāt", "Kamāl", "Asmā'", "`Izzat", "Mashīyyat",
                     "`Ilm", "Qudrat", "Qawl", "Masā'il", "Sharaf", "Sulṭān",
                     "Mulk", "Ayyām-i-Hā", "`Alā'" ];
    var numYears = 19;
    var yearNames = [ "Alif", "Bā'", "Āb", "Dāl", "Bāb", "Vāv", "Abad", "Jād",
                      "Bahā'", "Ḥubb", "Bahhāj", "Javāb", "Aḥad", "Vahhāb",
                      "Vidād", "Badī'", "Bahī", "Abhā", "Vāḥid" ];
    var daysInWeek = 7;
    var weekdayNames = [ "Jalāl", "Jamāl", "Kamāl", "Fidāl", "`Idāl",
                         "Istijlāl", "Istiqlāl" ];
    var CurDateRqst = 1 << 0;
    var FirstDateRqst = 1 << 1;
    var MonthLengthRqst = 1 << 2;

//=============================================================================

    theObject.Start = function( )
    {
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

    function Date( julianDay, day, month, year, vahid, kulliShay, dayOfWeek )
    {
        var theObject =
            {
                julianDay: julianDay,
                day: day,
                month: month,
                year: year,
                vahid: vahid,
                kulliShay: kulliShay,
                dayOfWeek: dayOfWeek
            };
        return theObject;
    }

//=============================================================================

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
                       vahid: currentDate.vahid,
                       kulliShay: currentDate.kulliShay,
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
                            dateRsp.year, dateRsp.vahid, dateRsp.kulliShay,
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
                       day: 1,
                       month: currentDate.month,
                       year: currentDate.year,
                       vahid: currentDate.vahid,
                       kulliShay: currentDate.kulliShay,
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
                          dateRsp.year, dateRsp.vahid, dateRsp.kulliShay,
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
                       month: currentDate.month,
                       year: currentDate.year,
                       vahid: currentDate.vahid,
                       kulliShay: currentDate.kulliShay,
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
        if ( monthLength === 0 )
        {
            εδ.errorHandler.ReportError( 'An error occurred: monthLength=0' );
            return;
        }
        if ( currentDate.day > monthLength )
            currentDate.day = monthLength;
        requestsPending &= ~ MonthLengthRqst;
        DisplayDateForm( );
        DisplayMonthTable( );
    }

//=============================================================================

    function DisplayDateForm( )
    {
        if ( (requestsPending & (CurDateRqst | FirstDateRqst |
                                 MonthLengthRqst)) != 0 )
            return;
        var i;
        var html = '';
        html += '<form name="DateForm">' +
            '<span class="DatePart" id="Weekday">' +
            weekdayNames[ currentDate.dayOfWeek ] +
            '</span>' +
            ', ' +
            '<label for="DayList" class="DatePart">Day: </label>' +
            '<select class="DatePart" name="DayList" id="DayList">';
        for ( i = 1; i <= numDays; ++i )
        {
            html += '<option value="' + i + '">' +
                dayNames[ i - 1 ] + ' (' + i + ')' +
                '</option>';
        }
        html += '</select>' +
            '<label for="MonthList" class="DatePart"> Month: </label>' +
            '<select class="DatePart" name="MonthList" id="MonthList">';
        for ( i = 1; i <= numMonths; ++i )
        {
            html +='<option value="' + i + '">' +
                monthNames[ i - 1 ] + ' (' + i + ')' +
                '</option>';
        }
        html += '</select>' +
            '<label for="YearList" class="DatePart"> Year: </label>' +
            '<select class="DatePart" name="YearList" id="YearList">';
        for ( i = 1; i <= numYears; ++i )
        {
            html += '<option value="' + i + '">' +
                yearNames[ i - 1 ] + ' (' + i + ')' +
                '</option>';
        }
        html += '</select>' +
            '<label for="VahidField" class="DatePart"> Váḥid: </label>' +
            '<input type="text" class="DatePart"' +
            ' name="Vahid" id="VahidField" maxlength="2" size="2" />' +
            '<label for="KulliShayField" class="DatePart"> Kull-i-Shay: ' +
            '</label>' +
            '<input type="text" class="DatePart"' +
            ' name="KulliShay" id="KulliShayField" maxlength="3" size="2" />' +
            '<input type="submit" class="Button" id="ChangeDate"' +
            ' value="Change" />' +
            '</form>';
        $('#DateDiv').html( html );

        $('#DayList').val( currentDate.day );
        $('#MonthList').val( currentDate.month );
        $('#YearList').val( currentDate.year );
        $('#VahidField').val( currentDate.vahid );
        $('#KulliShayField').val( currentDate.kulliShay );

        $('#VahidField').change( CheckVahid );
        $('#KulliShayField').change( CheckKulliShay );
        $('#ChangeDate').click( ChangeDate );
    }

//.............................................................................

    function CheckVahid( )
    {
        var vahid = parseInt( $('#VahidField').val() );
        var fixedVahid = εδ.Math.MakeFinite( vahid, currentDate.vahid );
        fixedVahid = εδ.Math.Clamp( fixedVahid, 1, 19 );
        if ( fixedVahid != vahid )
            $('#VahidField').val( fixedVahid );
    }

//.............................................................................

    function CheckKulliShay( )
    {
        var kulliShay = parseInt( $('#KulliShayField').val() );
        var fixedKulliShay =
            εδ.Math.MakeFinite( kulliShay, currentDate.kulliShay );
        if ( fixedKulliShay != kulliShay )
            $('#KulliShayField').val( fixedKulliShay );
    }

//.............................................................................

    function ChangeDate( )
    {
        var day = parseInt( $('#DayList').val() );
        var month = parseInt( $('#MonthList').val() );
        var year = parseInt( $('#YearList').val() );
        var vahid = parseInt( $('#VahidField').val() );
        var kulliShay = parseInt( $('#KulliShayField').val() );
        if ( (month === currentDate.month) &&
             (year === currentDate.year) &&
             (vahid === currentDate.vahid) &&
             (kulliShay === currentDate.kulliShay) )
            ChangeDay( day );
        else
            ChangeFullDate( day, month, year, vahid, kulliShay );
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
        $('#DayList').val( day );

        var jd = firstDate.julianDay + day - 1;
        εδ.WWCal.app.SetJulianDay( jd );
    }

//.............................................................................

    function ChangeFullDate( day, month, year, vahid, kulliShay )
    {
        currentDate.day = day;
        currentDate.month = month;
        currentDate.year = year;
        currentDate.vahid = vahid;
        currentDate.kulliShay = kulliShay;
        StartNewMonth( false );
    }

//=============================================================================

    function DisplayMonthTable( )
    {
        if ( (requestsPending & (CurDateRqst | FirstDateRqst |
                                  MonthLengthRqst)) != 0 )
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
        for ( d = 1; d <= monthLength; ++d, ++wd )
        {
            if ( wd >= daysInWeek )
            {
                html += '</tr>' +
                    '<tr>';
                wd = 0;
            }
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

        for ( d = 1; d <= monthLength; ++d )
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
};                                                             /*BadiCalendar*/


//*****************************************************************************
