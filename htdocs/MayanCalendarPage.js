/*
    MayanCalendarPage.js
    David M. Anderson
    wwwCalendar

    MayanCalendarPage "class": manages display of, and interaction with, Web
    calendar page for the Mayan calendar.
*/


//*****************************************************************************


εδ.WWCal.MayanCalendarPage = function( )
{                                                             /*MayanCalendar*/
//-----------------------------------------------------------------------------
/*
  Returns an object with these methods:
      Start( )
      ChangeJulianDay( )
*/
//-----------------------------------------------------------------------------

    var theObject = { };
    var calendarName = 'Mayan';
    var errorHandler = εδ.WWCal.errorHandler;

    var currentLongCount = LongCount( 0, 0, 0, 0, 0, 0, 0 );
    var currentHaab = Haab( 0, 0, 0 );
    var zerothHaabJD = 0;

    var longCountEpoch = 584283;
    var haabEpoch = 583935;
    var tzolkinEpoch = 584124;
    var haabMonthNames = [ "Pop", "Uo", "Zip", "Zotz", "Tzec", "Xul", "Yaxkin",
                           "Mol", "Chen", "Yax", "Zac", "Ceh", "Mac", "Kankin",
                           "Muan", "Pax", "Kayab", "Cumku", "Uayeb" ];
    var tzolkinVeintenaNames = [ "Imix", "Ik", "Akbal", "Kan", "Chicchan",
                                 "Cimi", "Manik", "Lamat", "Muluc", "Oc",
                                 "Chuen", "Eb", "Ben", "Ix", "Men", "Cib",
                                 "Caban", "Etznab", "Cauac", "Ahau" ];

//-----------------------------------------------------------------------------

    theObject.Start = function( )
    {
        DisplayDateForms( );
    };

//-----------------------------------------------------------------------------

    theObject.ChangeJulianDay = function( )
    {
        UpdateLongCount( );
        UpdateHaab( );
        UpdateTzolkin( );
    };

//-----------------------------------------------------------------------------

    function LongCount( kin, uinal, tun, katun, baktun,
                        pictun, calabtun, kinchiltun, alautun )
    {
        var theObject =
            {
                kin: kin,
                uinal: uinal,
                tun: tun,
                katun: katun,
                baktun: baktun,
                pictun: pictun,
                calabtun: calabtun,
                kinchiltun: kinchiltun,
                alautun: alautun
            };
        return theObject;
    }

//.............................................................................

    function Haab( day, month, year )
    {
        var theObject =
            {
                day: day,
                month: month,
                year: year
            };
        return theObject;
    }

//.............................................................................

    function Tzolkin( trecena, veintena )
    {
        var theObject =
            {
                trecena: trecena,
                veintena: veintena
            };
        return theObject;
    }

//-----------------------------------------------------------------------------

    function LongCountToJulianDay( lc )
    {
        var jd = longCountEpoch + lc.kin  +  20 * (lc.uinal  +
                 18 * (lc.tun  +  20 * (lc.katun  +  20 * (lc.baktun  +
                 20 * (lc.pictun  +  20 * (lc.calabtun +  20 * lc.kinchiltun  +
                 20 * lc.alautun))))));
        return jd;
    }

//.............................................................................

    function JulianDayToLongCount( julianDay )
    {
        var d = julianDay - longCountEpoch;
        var qr = εδ.Math.DivModP( d, 20 );
        var kin = qr.remainder;
        qr = εδ.Math.DivModP( qr.quotient, 18 );
        var uinal = qr.remainder;
        qr = εδ.Math.DivModP( qr.quotient, 20 );
        var tun = qr.remainder;
        qr = εδ.Math.DivModP( qr.quotient, 20 );
        var katun = qr.remainder;
        qr = εδ.Math.DivModP( qr.quotient, 20 );
        var baktun = qr.remainder;
        qr = εδ.Math.DivModP( qr.quotient, 20 );
        var pictun = qr.remainder;
        qr = εδ.Math.DivModP( qr.quotient, 20 );
        var calabtun = qr.remainder;
        qr = εδ.Math.DivModP( qr.quotient, 20 );
        var kinchiltun = qr.remainder;
        var alautun = εδ.Math.ModP( qr.quotient, 20 );
        return LongCount( kin, uinal, tun, katun, baktun, pictun,
                              calabtun, kinchiltun, alautun );
    }

//.............................................................................

    function JulianDayToHaab( julianDay )
    {
        var days = julianDay - haabEpoch;
        var year = Math.floor( days / 365 );
        var rem = εδ.Math.ModP( days, 365 );
        var month = Math.floor( rem / 20 )  +  1;
        var day = εδ.Math.ModP( rem, 20 );
        return Haab( day, month, year );
    }

//.............................................................................


    function JulianDayToTzolkin( julianDay )
    {
        var days = julianDay - tzolkinEpoch;
        var trecena = εδ.Math.ModP( days, 13 )  +  1;
        var veintena = εδ.Math.ModP( days, 20 )  +  1;
        return Tzolkin( trecena, veintena );
    }

//.............................................................................

    function HaabMonthLength( haabMonth )
    {
        return (haabMonth < 19)  ?  20  :  5;
    }

//-----------------------------------------------------------------------------

    function DisplayDateForms( )
    {
        var html = '';
        html += '<form name="LongCountForm">' +
            '<table>' +
            '<tr>' +
            '<td class="DatePart">alautun</td>' +
            '<td class="DatePart">kinchiltun</td>' +
            '<td class="DatePart">calabtun</td>' +
            '<td class="DatePart">pictun</td>' +
            '<td class="DatePart">baktun</td>' +
            '<td class="DatePart">katun</td>' +
            '<td class="DatePart">tun</td>' +
            '<td class="DatePart">uinal</td>' +
            '<td class="DatePart">kin</td>' +
            '<td rowspan="2">' +
            '<span class="Button" id="ChangeLongCount">' +
            'Change' +
            '</span>' +
            '</td>' +
            '</tr>' +
            '<tr class="DatePart">' +
            '<td>' +
            '<input type="text" name="Alautun"' +
            ' class="DatePart" id="AlautunField"' +
            ' maxlength="2" size="2" />' +
            '.' +
            '</td>' +
            '<td>' +
            '<input type="text" name="Kinchiltun"' +
            ' class="DatePart" id="KinchiltunField"' +
            ' maxlength="2" size="2" />' +
            '.' +
            '</td>' +
            '<td>' +
            '<input type="text" name="Calabtun"' +
            ' class="DatePart" id="CalabtunField"' +
            ' maxlength="2" size="2" />' +
            '.' +
            '</td>' +
            '<td>' +
            '<input type="text" name="Pictun"' +
            ' class="DatePart" id="PictunField"' +
            ' maxlength="2" size="2" />' +
            '.' +
            '</td>' +
            '<td>' +
            '<input type="text" name="Baktun"' +
            ' class="DatePart" id="BaktunField"' +
            ' maxlength="2" size="2" />' +
            '.' +
            '</td>' +
            '<td>' +
            '<input type="text" name="Katun"' +
            ' class="DatePart" id="KatunField"' +
            ' maxlength="2" size="2" />' +
            '.' +
            '</td>' +
            '<td>' +
            '<input type="text" name="Tun"' +
            ' class="DatePart" id="TunField"' +
            ' maxlength="2" size="2" />' +
            '.' +
            '</td>' +
            '<td>' +
            '<input type="text" name="Uinal"' +
            ' class="DatePart" id="UinalField"' +
            ' maxlength="2" size="2" />' +
            '.' +
            '</td>' +
            '<td>' +
            '<input type="text" name="Kin"' +
            ' class="DatePart" id="KinField"' +
            ' maxlength="2" size="2" />' +
            '</td>' +
            '</tr>' +
            '</table>' +
            '</form>' +
            '<form name="HaabForm">' +
            '<span class="DatePart">Haab: </span>' +
            '<span class="DatePart" id="HaabDayField"></span>' +
            ' ' +
            '<span class="DatePart" id="HaabMonthField"></span>' +
            '</form>' +
            '<form name="TzolkinForm">' +
            '<span class="DatePart">Tzolkin: </span>' +
            '<span class="DatePart" id="TzolkinTrecenaField"></span>' +
            ' ' +
            '<span class="DatePart" id="TzolkinVeintenaField"></span>' +
            '</form>';
        $('#DateDiv').html( html );

        UpdateLongCount( );
        UpdateHaab( );
        UpdateTzolkin( );

        $('#KinField').change( CheckLongCountField );
        $('#UinalField').change( CheckLongCountField );
        $('#TunField').change( CheckLongCountField );
        $('#KatunField').change( CheckLongCountField );
        $('#BaktunField').change( CheckLongCountField );
        $('#PictunField').change( CheckLongCountField );
        $('#CalabtunField').change( CheckLongCountField );
        $('#KinchiltunField').change( CheckLongCountField );
        $('#AlautunField').change( CheckLongCountField );
        $('#ChangeLongCount').click( ChangeLongCount );
    }

//.............................................................................

    function CheckLongCountField( )
    {
        var f = $(this).attr( 'id' );
        f = f.substring( 0, f.length - "Field".length ).toLowerCase();
        var val = parseInt( $(this).val() );
        var curVal = currentLongCount[ f ];
        var fixedVal = εδ.Math.MakeFinite( val, curVal );
        var maxVal = (f === 'uinal')  ?  17  :  19;
        fixedVal = εδ.Math.Clamp( fixedVal, 0, maxVal );
        if ( fixedVal != val )
            $(this).val( fixedVal );
    }

//-----------------------------------------------------------------------------

    function ChangeLongCount( )
    {
        var kin = parseInt( $("#KinField").val() );
        var uinal = parseInt( $("#UinalField").val() );
        var tun = parseInt( $("#TunField").val() );
        var katun = parseInt( $("#KatunField").val() );
        var baktun = parseInt( $("#BaktunField").val() );
        var pictun = parseInt( $("#PictunField").val() );
        var calabtun = parseInt( $("#CalabtunField").val() );
        var kinchiltun = parseInt( $("#KinchiltunField").val() );
        var alautun = parseInt( $("#AlautunField").val() );
        currentLongCount = LongCount( kin, uinal, tun, katun, baktun, pictun,
                                      calabtun, kinchiltun, alautun );
        var jd = LongCountToJulianDay( currentLongCount );
        εδ.WWCal.app.SetJulianDay( jd );
        UpdateHaab( );
        UpdateTzolkin( );
        return false;
    }

//.............................................................................

    function ChangeHaabDay( day )
    {
        var oldDay = currentHaab.day;
        day = εδ.Math.MakeFinite( day, oldDay );
        var monthLength = HaabMonthLength( currentHaab.month );
        day = εδ.Math.Clamp( day, 0, monthLength - 1 );
        currentHaab.day = day;
        $('#Day' + oldDay).removeClass( 'CurDay' );
        $('#Day' + day).addClass( 'CurDay' );

        $('#HaabDayField').text( currentHaab.day );

        var jd = zerothHaabJD + day;
        εδ.WWCal.app.SetJulianDay( jd );
        UpdateLongCount( );
        UpdateTzolkin( );
    }

//-----------------------------------------------------------------------------

    function UpdateLongCount( )
    {
        var jd = εδ.WWCal.app.CurrentJulianDay();
        currentLongCount = JulianDayToLongCount( jd );

        $('#KinField').val( currentLongCount.kin );
        $('#UinalField').val( currentLongCount.uinal );
        $('#TunField').val( currentLongCount.tun );
        $('#KatunField').val( currentLongCount.katun );
        $('#BaktunField').val( currentLongCount.baktun );
        $('#PictunField').val( currentLongCount.pictun );
        $('#CalabtunField').val( currentLongCount.calabtun );
        $('#KinchiltunField').val( currentLongCount.kinchiltun );
        $('#AlautunField').val( currentLongCount.alautun );
    }

//.............................................................................

    function UpdateHaab( )
    {
        var oldHaab = currentHaab;
        var jd = εδ.WWCal.app.CurrentJulianDay();
        currentHaab = JulianDayToHaab( jd );
        zerothHaabJD = jd - currentHaab.day;

        $('#HaabDayField').text( currentHaab.day );
        $('#HaabMonthField').text( haabMonthNames[ currentHaab.month - 1 ] );

        if ( currentHaab.month === oldHaab.month )
        {
            $('#Day' + oldHaab.day).removeClass( 'CurDay' );
            $('#Day' + currentHaab.day).addClass( 'CurDay' );
        }
        else
        {
            DisplayMonthTable( );
        }
    }

//.............................................................................

    function UpdateTzolkin( )
    {
        var jd = εδ.WWCal.app.CurrentJulianDay();
        var tzolkin = JulianDayToTzolkin( jd );

        $('#TzolkinTrecenaField').text( tzolkin.trecena );
        $('#TzolkinVeintenaField').text(
            tzolkinVeintenaNames[ tzolkin.veintena - 1 ] );
    }

//-----------------------------------------------------------------------------

    function DisplayMonthTable( )
    {
        var daysInWeek = 5; //arbitrary
        var monthLength = HaabMonthLength( currentHaab.month );
        var html = '';
        var i, d;
        html += '<table class="CalTable">' +
            '<thead>' +
            '<tr>' +
            '<td colspan="' + daysInWeek + '" class="CalMonth">' +
            haabMonthNames[ currentHaab.month - 1 ] +
            '</td>' +
            '</tr>' +
            '</thead>';
        html += '<tbody>' +
            '<tr>';
        var wd = 0;
        var today = εδ.WWCal.app.TodayGregorian().julianDay - zerothHaabJD;
        for ( d = 0; d < monthLength; ++d, ++wd )
        {
            if ( wd >= daysInWeek )
            {
                html += '</tr>' +
                    '<tr>';
                wd = 0;
            }
            var className = "CalDay";
            if ( d == currentHaab.day )
                className += " CurDay";
            if ( d == today )
                className += " Today";
            html += '<td class="' + className + '" id="Day' + d + '">';
            html += d;
            html += '</td>';
        }
        html += '</tr>' +
            '</tbody>' +
            '</table>';
        $('#CalendarTableDiv').html( html );

        for ( d = 0; d < monthLength; ++d )
        {
            $('#Day' + d).click( HandleDayClick );
        }
    }

//.............................................................................

    function HandleDayClick( event )
    {
        var id = $(this).attr( 'id' );
        var day = parseInt( id.substr( 3 ) );
        ChangeHaabDay( day );
        return false;
    }


//-----------------------------------------------------------------------------

    return theObject;
};                                                            /*MayanCalendar*/


//*****************************************************************************
