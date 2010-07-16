/*
    ChineseCalendarPage.js
    David M. Anderson
    wwwCalendar

    ChineseCalendarPage "class": manages display of, and interaction with, Web
    calendar page for the Chinese calendar.
*/


//*****************************************************************************


εδ.WWCal.ChineseCalendarPage = function( )
{                                                           /*ChineseCalendar*/
//-----------------------------------------------------------------------------
/*
  Returns an object with these methods:
      Start( )
      ChangeJulianDay( )
*/
//-----------------------------------------------------------------------------

    var theObject = { };
    var currentDate = Date( 0, 0, false, 0, 0, 0, 0, 0, 0, 0 );
    var firstDate = Date( 0, 0, false, 0, 0, 0, 0, 0, 0, 0 );
    var monthLength = 0;
    var requestsPending = 0;

    var calendarName = 'Chinese';
    var serverURL = εδ.WWCal.app.ServerURL();
    var errorHandler = εδ.WWCal.errorHandler;
    var majorTerms = [];
    var minorTerms = [];

    var numStems = 10;
    var stemNames = [ "Jiǎ", "Yǐ", "Bǐng", "Dīng", "Wù", "Jǐ", "Gēng", "Xīn",
                      "Rén", "Guǐ" ];
    var numBranches = 12;
    var branchNames = [ "Zǐ", "Chǒu", "Yín", "Mǎo", "Chén", "Sì", "Wǔ", "Wèi",
                        "Shēn", "Yǒu", "Xū", "Hài" ];
    var branchNamesEnglish = [ "Rat", "Ox", "Tiger", "Hare", "Dragon", "Snake",
                             "Horse", "Sheep", "Monkey", "Fowl", "Dog", "Pig" ];
    var numMajorSolarTerms = 12;
    var majorSolarTermNames = [ "Yǔshuǐ", "Chūnfēn", "Gǔyǔ", "Xiǎomǎn",
                                "Xiàzhì", "Dàshǎ", "Chǔshǔ", "Qiūfēn",
                                "Shuāngjiàng", "Xiǎoxuě", "Dōngzhì", "Dàhán" ];
    var majorSolarTermNamesEnglish = [ "Rain Water", "Spring Equinox",
                                       "Grain Rain", "Grain Full",
                                       "Summer Solstice", "Great Heat",
                                       "Limit of Heat", "Autumnal Equinox",
                                       "Descent of Frost", "Slight Snow",
                                       "Winter Solstice", "Great Cold" ];
    var numMinorSolarTerms = 12;
    var minorSolarTermNames = [ "Lìchūn", "Jīngzhé", "Qīngmíng", "Lìxià",
                                "Mángzhòng", "Xiǎoshǔ", "Lìqiū", "Báilù",
                                "Hánlù", "Lìdōng", "Dàxuě", "Xiǎohán" ];
    var minorSolarTermNamesEnglish = [ "Beginning of Spring",
                                       "Waking of Insects", "Pure Brightness",
                                       "Beginning of Summer", "Grain in Ear",
                                       "Slight Heat", "Beginning of Autumn",
                                       "White Dew", "Cold Dew",
                                       "Beginning of Winter", "Great Snow",
                                       "Slight Cold" ];
    var CurDateRqst = 1 << 0;
    var FirstDateRqst = 1 << 1;
    var MonthLengthRqst = 1 << 2;
    var SolarTermsRqst = 1 << 3;

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

    function Date( julianDay, day, month, leap, year,
                   dayCyclical, monthCyclical, yearCyclical, yearCycle,
                   majorTerm, minorTerm )
    {
        var theObject =
            {
                julianDay: julianDay,
                day: day,
                month: month,
                leap: leap,
                year: year,
                dayCyclical: dayCyclical,
                monthCyclical: monthCyclical,
                yearCyclical: yearCyclical,
                yearCycle: yearCycle,
                majorTerm: majorTerm,
                minorTerm: minorTerm
            };
        return theObject;
    }

//-----------------------------------------------------------------------------

    function GetStemBranchText( cyclical )
    {
        cyclical = εδ.Math.ModP( cyclical - 1, 60 ) + 1;
        var stem = (cyclical - 1) % 10  +  1;
        var branch = (cyclical - 1) % 12  +  1;
        return  '(' + cyclical + ') ' + stemNames[ stem - 1 ]  +  '-'
            +  branchNames[ branch - 1 ]
            +  ' ('  +  branchNamesEnglish[ branch - 1 ]  + ') ';
    }

//-----------------------------------------------------------------------------

    function GetShortStemBranchText( cyclical )
    {
        cyclical = εδ.Math.ModP( cyclical - 1, 60 ) + 1;
        var stem = (cyclical - 1) % 10  +  1;
        var branch = (cyclical - 1) % 12  +  1;
        return  stemNames[ stem - 1 ]  +  '-'  +  branchNames[ branch - 1 ];
    }

//-----------------------------------------------------------------------------

    function ComputeMajorSolarTerm( day )
    {
        var term = firstDate.majorTerm;
        for ( var i = 0; i < majorTerms.length; ++i )
        {
            if ( majorTerms[i].day <= day )
                term = majorTerms[i].term;
        }
        return term;
    }

//-----------------------------------------------------------------------------

    function GetMajorSolarTermText( term )
    {
        return 'Major solar term: ' + majorSolarTermNames[ term - 1 ]
            + ' (' + majorSolarTermNamesEnglish[ term - 1 ] + '). ';
    }

//-----------------------------------------------------------------------------

    function ComputeMinorSolarTerm( day )
    {
        var term = firstDate.minorTerm;
        for ( var i = 0; i < minorTerms.length; ++i )
        {
            if ( minorTerms[i].day <= day )
                term = minorTerms[i].term;
        }
        return term;
    }

//-----------------------------------------------------------------------------

    function GetMinorSolarTermText( term )
    {
        return 'Minor solar term: ' + minorSolarTermNames[ term - 1 ]
            + ' (' + minorSolarTermNamesEnglish[ term - 1 ] + ').';
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
                       leap: currentDate.leap,
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
                            dateRsp.leap, dateRsp.year,
                            dateRsp.dayCyclical, dateRsp.monthCyclical,
                            dateRsp.yearCyclical, dateRsp.yearCycle,
                            dateRsp.majorTerm, dateRsp.minorTerm );
        requestsPending &= ~ CurDateRqst;
        εδ.WWCal.app.SetJulianDay( currentDate.julianDay );
        GetFirstDate( );
        GetMonthData( );
        DisplayDateForm( );
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
                       leap: currentDate.leap,
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
                          dateRsp.leap, dateRsp.year,
                          dateRsp.dayCyclical, dateRsp.monthCyclical,
                          dateRsp.yearCyclical, dateRsp.yearCycle,
                          dateRsp.majorTerm, dateRsp.minorTerm );
        requestsPending &= ~ FirstDateRqst;
        DisplayMonthTable( );
        GetSolarTerms( );
    }

//-----------------------------------------------------------------------------

    function GetMonthData( )
    {
        $.getJSON( serverURL,
                   {
                       action: 'MonthData',
                       calendar: calendarName,
                       month: currentDate.month,
                       leap: currentDate.leap,
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
            εδ.errorHandler.ReportError( 'An error occurred: monthLength=0' );
            return;
        }
        if ( currentDate.day > monthLength )
        {
            currentDate.day = monthLength;
            DisplayDateForm( );
        }
        DisplayMonthTable( );
        GetSolarTerms( );
    }

//-----------------------------------------------------------------------------

    function GetSolarTerms( )
    {
        if ( (requestsPending & (FirstDateRqst | MonthLengthRqst)) != 0 )
            return;
        $.getJSON( serverURL,
                   {
                       action: 'SolarTerms',
                       calendar: calendarName,
                       firstJD: firstDate.julianDay,
                       firstMajorTerm: firstDate.majorTerm,
                       firstMinorTerm: firstDate.minorTerm,
                       monthLength: monthLength,
                       format: 'JSON'
                   },
                   ProcessSolarTerms );
        requestsPending |= SolarTermsRqst;
    }

//.............................................................................

    function ProcessSolarTerms( ajaxResponse )
    {
        if ( ajaxResponse.Error )
        {
            errorHandler.ReportError( ajaxResponse.Error );
            return;
        }
        majorTerms = ajaxResponse.majorSolarTerms;
        minorTerms = ajaxResponse.minorSolarTerms;
        requestsPending &= ~ SolarTermsRqst;
        DisplayDateForm( );
    }

//=============================================================================

    function DisplayDateForm( )
    {
        if ( (requestsPending & (CurDateRqst | FirstDateRqst)) != 0 )
            return;
        var i;
        var html = '';
        html += '<form name="DateForm">' +
            '<table>' +
            '<tr>' +
            '<td class="ChineseDay">' +
            '<label for="DayField" class="DatePart">Day: </label>' +
            '<input type="text" class="DatePart" name="Day" id="DayField"' +
            ' maxlength="2" size="2" />' +
            '</td>' +
            '<td class="ChineseMonth">' +
            '<label for="MonthField" class="DatePart">Month: </label>' +
            '<input type="text" class="DatePart" name="Month" id="MonthField"' +
            ' maxlength="2" size="2" />' +
            '<select class="DatePart" name="LeapList">' +
            '<option value="common">common</option>' +
            '<option value="leap">leap</option>' +
            '</select>' +
            '<td class="ChineseYear">' +
            '<label for="YearField" class="DatePart">Year: </label>' +
            '<input type="text" class="DatePart" name="Year" id="YearField"' +
            ' maxlength="4" size="4" />' +
            '</td>' +
            '<td rowspan="2">' +
            '<input type="submit" class="Button" id="ChangeDate"' +
            ' value="Change" />' +
            '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>' +
            '<span class="DatePart2" id="DayStemBranch">' +
            '</span>' +
            '</td>' +
            '<td>' +
            '<span class="DatePart2" id="MonthStemBranch">' +
            '</span>' +
            '</td>' +
            '<td>' +
            '<span class="DatePart2" id="YearStemBranch">' +
            '</span>' +
            '<span class="DatePart2" id="YearCycle">' +
            '</span>' +
            '</td>' +
            '</tr>' +
            '<tr>' +
            '<td colspan="4">' +
            '<span class="DatePart2" id="MajorSolarTerm">' +
            '</span>' +
            '<span class="DatePart2" id="MinorSolarTerm">' +
            '</span>' +
            '</td>' +
            '</tr>' +
            '</table>' +
            '</form>';
        $('#DateDiv').html( html );

        $('#DayField').val( currentDate.day );
        $('#MonthField').val( currentDate.month );
        $('#LeapList').val( currentDate.leap ? 'leap' : 'common' );
        $('#YearField').val( currentDate.year );
        $('#DayStemBranch').html(
            GetStemBranchText( currentDate.dayCyclical ) );
        $('#MonthStemBranch').html(
            GetStemBranchText( currentDate.monthCyclical ) );
        $('#YearStemBranch').html(
            GetStemBranchText( currentDate.yearCyclical ) );
        $('#MajorSolarTerm').html(
            GetMajorSolarTermText( currentDate.majorTerm ) );
        $('#MinorSolarTerm').html(
            GetMinorSolarTermText( currentDate.minorTerm ) );
        $('#YearCycle').html( 'Cycle ' + currentDate.yearCycle );

        $('#DayField').change( CheckDay );
        $('#MonthField').change( CheckMonth );
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

    function CheckMonth( )
    {
        var month = parseInt( $('#MonthField').val() );
        var fixedMonth = εδ.Math.MakeFinite( month, currentDate.month );
        fixedMonth = Math.max( fixedMonth, 1 );
        if ( fixedMonth != month )
            $('#MonthField').val( fixedMonth );
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
        var month = parseInt( $('#MonthField').val() );
        var leap = ($('#LeapList').val() === 'leap');
        var year = parseInt( $('#YearField').val() );
        if ( (month === currentDate.month) &&
             (leap === currentDate.leap ) &&
             (year === currentDate.year) )
            ChangeDay( day );
        else
            ChangeFullDate( day, month, leap, year );
        return false;
    }

//.............................................................................

    function ChangeDay( day )
    {
        var oldDay = currentDate.day;
        day = εδ.Math.MakeFinite( day, oldDay );
        day = εδ.Math.Clamp( day, 1, monthLength );
        currentDate.day = day;
        currentDate.dayCyclical =
            εδ.Math.ModP( firstDate.dayCyclical + day - 1, 60 );
        currentDate.majorTerm = ComputeMajorSolarTerm( day );
        currentDate.minorTerm = ComputeMinorSolarTerm( day );

        $('#DayField').val( day );
        $('#DayStemBranch').html(
            GetStemBranchText( currentDate.dayCyclical ) );
        $('#MajorSolarTerm').html(
            GetMajorSolarTermText( currentDate.majorTerm ) );
        $('#MinorSolarTerm').html(
            GetMinorSolarTermText( currentDate.minorTerm ) );

        $('#Day' + oldDay).removeClass( 'CurDay' );
        $('#Day' + day).addClass( 'CurDay' );

        var jd = firstDate.julianDay + day - 1;
        εδ.WWCal.app.SetJulianDay( jd );
    }

//.............................................................................

    function ChangeFullDate( day, month, leap, year )
    {
        currentDate.day = day;
        currentDate.month = month;
        currentDate.leap = leap;
        currentDate.year = year;
        StartNewMonth( false );
    }

//=============================================================================

    function DisplayMonthTable( )
    {
        var html = '';
        var i, d;
        var stemOfFirst = 0;
        var st = 0;
        var today = εδ.WWCal.app.TodayGregorian().julianDay -
            firstDate.julianDay + 1;
        var className = '';
        if ( (requestsPending
             & (CurDateRqst | FirstDateRqst | MonthLengthRqst |
                SolarTermsRqst)) != 0 )
            return;
        html += '<table class="MonthTable Cols10">' +
            '<thead>' +
            '<tr>' +
            '<td colspan="' + numStems + '">' +
            'Month ' + currentDate.month +
            (currentDate.leap  ?  ' (Leap)'  :  '') +
            ' of Year ' + GetShortStemBranchText( currentDate.yearCyclical ) +
            '</td>' +
            '</tr>' +
            '</thead>' +
            '<tr>';
        for ( i = 0; i < numStems; ++i )
        {
            html += '<th>' +
                stemNames[i] +
                '</th>';
        }
        html += '</tr>';
        html += '<tbody>' +
            '<tr>';
        stemOfFirst = (firstDate.dayCyclical - 1) % 10  +  1;
        st = 1;
        for ( i = 1; i < stemOfFirst; ++i, ++st )
        {
            html += '<td>' +
                '</td>';
        }
        for ( d = 1; d <= monthLength; ++d, ++st )
        {
            if ( st > numStems )
            {
                html += '</tr>' +
                    '<tr>';
                st = 1;
            }
            className = "MTDay";
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
};                                                          /*ChineseCalendar*/


//*****************************************************************************
