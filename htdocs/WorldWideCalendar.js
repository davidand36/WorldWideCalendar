/*
    WorldWideCalendar.js
    Copyright © 2010 David M. Anderson

    The main App object for the WorldWideCalendar.info Web site.
*/


//*****************************************************************************


εδ.WWCal = { };

εδ.WWCal.errorHandler
    = εδ.ErrorHandler( { messageElementName: '#ErrorMessageDiv' } );


//*****************************************************************************


εδ.WWCal.App = function( spec )
{                                                        //WorldWideCalendarApp
//-----------------------------------------------------------------------------
/*
  Returns an object with these methods:
      Start( )
      CurrentJulianDay( ): int
      SetJulianDay( [int] jd )
      TodayGregorian( ): GregorianDate
      ServerURL( ): string
*/
//-----------------------------------------------------------------------------

    var theObject = { };
    var serverURL = spec.serverURL;
    var errorHandler = εδ.WWCal.errorHandler;
    var calendarNames = [];
    var calendarPages = {};
    var curCalName = 'Gregorian';
    var currentJulianDay = -1000000;
    var todayGregorian = εδ.WWCal.GregorianDate( 0, 0, 0, 0 );

//-----------------------------------------------------------------------------

    theObject.Start = function( )
    {
        errorHandler.ClearError( );
        $(window).error( errorHandler.ReportJSError );
        SetupAJAX( );
        GetToday( false );
        currentJulianDay = todayGregorian.julianDay;
        GetCalendarNames( );
        DisplayJulianDayForm( );
        DisplayTodayButton( );
    };

//-----------------------------------------------------------------------------

    theObject.CurrentJulianDay = function( )
    {
        return currentJulianDay;
    };

//.............................................................................

    theObject.SetJulianDay = function( jd )
    {
        currentJulianDay = jd;
        $('#JDField').val( jd );
    };

//.............................................................................

    theObject.TodayGregorian = function( )
    {
        return todayGregorian;
    };

//-----------------------------------------------------------------------------

    theObject.ServerURL = function( )
    {
        return serverURL;
    };

//-----------------------------------------------------------------------------

    function SetupAJAX( )
    {
        $.ajaxSetup(
            {
                error: errorHandler.ReportAJAXError
            } );
    }

//-----------------------------------------------------------------------------

    function GetToday( asynch )
    {
        var todayGreg = new Date( );
        $.ajax(
            {
                url: serverURL,
                data:
                {
                    action: 'DateToJD',
                    calendar: 'Gregorian',
                    day: todayGreg.getDate(),
                    month: todayGreg.getMonth() + 1,
                    year: todayGreg.getFullYear(),
                    format: 'JSON'
                },
                async: asynch,
                type: 'GET',
                dataType: 'json',
                success: ProcessToday
            } );
    }

//.............................................................................

    function ProcessToday( ajaxResponse )
    {
        if ( ajaxResponse.Error )
        {
            errorHandler.ReportError( ajaxResponse.Error );
            return;
        }

        var todayRsp = ajaxResponse;
        todayGregorian
            = εδ.WWCal.GregorianDate( todayRsp.julianDay, todayRsp.day,
                                      todayRsp.month, todayRsp.year );
    }

//-----------------------------------------------------------------------------

    function GetCalendarNames( )
    {
        $.getJSON( serverURL,
                   {
                       action: "ListCalendars",
                       format: "JSON"
                   },
                   ProcessCalendarNames );
    }

//.............................................................................

    function ProcessCalendarNames( ajaxResponse )
    {
        if ( ajaxResponse.Error )
        {
            errorHandler.ReportError( ajaxResponse.Error );
            return;
        }

        calendarNames = ajaxResponse;

        CreateCalendarObjects( );
        DisplayCalendarMenu( );
        ChangeCalendar( );
    }

//-----------------------------------------------------------------------------

    function CreateCalendarObjects( )
    {
        for ( var i = 0; i < calendarNames.length; ++i )
        {
            var name = calendarNames[ i ];
            switch ( name )
            {
            case 'Mayan':
                calendarPages[ name ] = εδ.WWCal.MayanCalendarPage( );
                break;
            case 'Chinese':
                calendarPages[ name ] = εδ.WWCal.ChineseCalendarPage( );
                break;
            case 'Hindu solar':
                calendarPages[ name ]
                    = εδ.WWCal.DMYWCalendarPage(
                        {
                            name: name,
                            options: εδ.WWCal.HinduSolarOptions()
                        } );
                break;
            case 'Hindu lunisolar':
                //!!!
                break;
            case 'French Revolutionary':
                //!!!
                break;
            case 'Badi':
                calendarPages[ name ] = εδ.WWCal.BadiCalendarPage( );
                break;
            case 'ISO 8601':
                //!!!
                break;
            default:
                calendarPages[ name ]
                    = εδ.WWCal.DMYWCalendarPage( { name: name } );
                break;
            }
        }
    }

//-----------------------------------------------------------------------------

    function DisplayCalendarMenu( )
    {
        var html = '';
        html += '<form name="CalendarForm">' +
           '<select class="DatePart" name="CalendarMenu" id="CalendarMenu">';
        for ( var i = 0; i < calendarNames.length; ++i )
        {
            html += '<option value="' + calendarNames[ i ] + '">' +
                calendarNames[ i ] + ' calendar' +
                '</option>';
        }
        html += '</select>' +
            '<input type="submit" class="Button" id="ChangeCalendar"' +
            ' value="Change" />' +
            '</form>';
        $('#CalendarMenuDiv').html( html );

        $('#CalendarMenu').val( curCalName );

        $('#ChangeCalendar').click( SelectCalendar );
    }

//.............................................................................

    function SelectCalendar( )
    {
        var newCalName = $('#CalendarMenu').val();
        if ( newCalName != curCalName )
        {
            curCalName = newCalName;
            ChangeCalendar( );
        }
        return false;
    }

//.............................................................................

    function ChangeCalendar( )
    {
        calendarPages[ curCalName ].Start( );
    }

//-----------------------------------------------------------------------------

    function DisplayJulianDayForm( )
    {
        var html = '';
        html += '<form name="JDForm">' +
            '<label for="JDField" class="DatePart">' +
            'Julian Day: ' +
            '</label>' +
            '<input type="text" class="DatePart" name="JD" id="JDField"' +
            ' maxlength="7" size="7" />' +
            '<input type="submit" class="Button" id="ChangeJD"' +
            ' value="Change" />' +
            '</form>';
        $('#JulianDayDiv' ).html( html );

        $('#JDField').val( currentJulianDay );

        $('#JDField').change( CheckJulianDay );
        $('#ChangeJD').click( ChangeJulianDay );
    }

//.............................................................................

    function CheckJulianDay( )
    {
        var jd = parseInt( $("#JDField").val() );
        if ( isNaN( jd ) || ! isFinite( jd ) )
            $('#JDField').val( currentJulianDay );
    }

//.............................................................................

    function ChangeJulianDay( )
    {
        currentJulianDay = parseInt( $('#JDField').val() );
        calendarPages[ curCalName ].ChangeJulianDay( );
        return false;
    }

//-----------------------------------------------------------------------------

    function DisplayTodayButton( )
    {
        var html = '';
        html += '<form name="TodayForm">' +
            '<input type="submit" class="Button" id="ChangeToday"' +
            ' value="Today" />' +
            '</form>';
        $('#TodayDiv').html( html );

        $('#ChangeToday').click( ChangeToToday );
    }

//.............................................................................

    function ChangeToToday( )
    {
        var now = new Date( );
        if ( (now.getDate() != todayGregorian.day)
             || (now.getMonth() + 1 != todayGregorian.month)
             || (now.getFullYear() != todayGregorian.year) )
            GetToday( false );
        theObject.SetJulianDay( todayGregorian.julianDay );
        calendarPages[ curCalName ].ChangeJulianDay( );
        return false;
    }

//-----------------------------------------------------------------------------

    return theObject;
};                                                       //WorldWideCalendarApp


//*****************************************************************************


εδ.WWCal.GregorianDate = function( julianDay, day, month, year )
{
    var theObject =
        {
            julianDay: julianDay,
            day: day,
            month: month,
            year: year
        };
    return theObject;
};


//*****************************************************************************


εδ.WWCal.app = εδ.WWCal.App( { serverURL:'/srvc/WorldWideCalendar' } );


//*****************************************************************************


$(document).ready( εδ.WWCal.app.Start );


//*****************************************************************************
