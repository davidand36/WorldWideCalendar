/*
  WorldWideCalendar.cpp
  Copyright © 2010 David M. Anderson

  Main module for WorldWideCalendar: CGI server.
*/


#include "CalendarService.hpp"
#include "DMYWCalendarService.hpp"
#include "NoOptions.hpp"
#include "MayanCalendarService.hpp"
#include "ChineseCalendarService.hpp"
#include "HinduSolarOptions.hpp"
#include "HinduLunisolarCalendarService.hpp"
#include "PersianOptions.hpp"
#include "FrenchRevolutionaryCalendarService.hpp"
#include "BadiCalendarService.hpp"
#include "ISO8601CalendarService.hpp"
#include <Exception.hpp>
#include <CGIInput.hpp>
#include <CGIOutput.hpp>
#include <JSON.hpp>
#include <JPLEphemeris.hpp>
#include <WesternWeek.hpp>
#include <EgyptianCalendar.hpp>
#include <ArmenianCalendar.hpp>
#include <ArmenianWeek.hpp>
#include <JulianCalendar.hpp>
#include <CopticCalendar.hpp>
#include <CopticWeek.hpp>
#include <EthiopianCalendar.hpp>
#include <EthiopianWeek.hpp>
#include <HebrewCalendar.hpp>
#include <HebrewWeek.hpp>
#include <HinduWeek.hpp>
#include <IslamicCalendar.hpp>
#include <IslamicWeek.hpp>
#include <HinduSolarCalendar.hpp>
#include <PersianCalendar.hpp>
#include <PersianWeek.hpp>
#include <GregorianCalendar.hpp>
#include <BahaiCalendar.hpp>
#include <BahaiWeek.hpp>
#include <string>
#include <fstream>
#include <cstdlib>
using namespace std;
using namespace std::tr1;
using namespace EpsilonDelta;


//*****************************************************************************


namespace
{                                                                   //namespace

//=============================================================================

enum Calendar
{
    Egyptian,
    Mayan,
    Chinese,
    Armenian,
    Julian,
    Coptic,
    Ethiopian,
    Hebrew,
    HinduSolar,
    HinduLunisolar,
    Islamic,
    Persian,
    Gregorian,
    FrenchRevolutionary,
    Bahai,
    Badi,
    ISO8601,
    NumCalendars
};

const array< string, NumCalendars > s_calendarNames
= {
    "Egyptian",
    "Mayan",
    "Chinese",
    "Armenian",
    "Julian",
    "Coptic",
    "Ethiopian",
    "Hebrew",
    "Hindu solar",
    "Hindu lunisolar",
    "Islamic",
    "Persian",
    "Gregorian",
    "French Revolutionary",
    "Bahai",
    "Badi",
    "ISO 8601"
    };

const array< string, CalendarService::NumActions > s_actionNames
= {
    "ListCalendars",
    "AvailableOptions",
    "Names",
    "DateToJD",
    "JDToDate",
    "MonthData",
    "SolarTerms"
};

const array< string, CalendarService::NumFormats > s_formatNames
= {
    "JSON"
};

string s_calendarName = "";
Calendar s_calendar = Gregorian;
CalendarService::Action s_action = CalendarService::NumActions;
CalendarService::Format s_format = CalendarService::JSON;


void GetCgiGlobals( );
string WriteHttpResponse( );


//=============================================================================

}                                                                   //namespace


//*****************************************************************************


int main( int argc, char ** argv )
{
    bool firstTime = true;
    string responseText;
    string errorMsg;
    JPLEphemeris de405;
    JPLEphemeris de406;

    try
    {
        while ( CGIInput::Instance().ReadInput( 200 ) )
        {
            CGIOutput::Instance().Reset( );
            CGIOutput::Instance().SetContentType( "text/plain" );
            if ( firstTime )
            {
                firstTime = false;
                de405.Init( "JPL_DE405.be", false );
                de406.Init( "JPL_DE406.be", false );
                JPLEphemeris::RegisterEphemeris( de405 );
                JPLEphemeris::RegisterEphemeris( de406 );
            }
            GetCgiGlobals( );
            string response = WriteHttpResponse( );
            CGIOutput::Instance().Send( response );
        }
    }
    catch ( Exception & Except )
    {
        errorMsg = Except.Description();
    }
    catch ( exception & Except )
    {
        errorMsg = Except.what();
    }
    catch ( ... )
    {
        errorMsg = "Unknown exception!";
    }

    if ( errorMsg.length() > 0 )
    {
        JSONObject jsonObj;
        jsonObj[ "Error" ] = ToJSON( errorMsg );
        responseText = ToJSON( jsonObj );
        CGIOutput::Instance().Send( responseText );
    }

    return 0;
}


//*****************************************************************************


namespace
{                                                                   //namespace

//=============================================================================


void 
GetCgiGlobals( )
{
    const CGIInput & cgiInput = CGIInput::Instance();

    s_action = CalendarService::NumActions;
    string actionName = cgiInput[ "action" ];
    if ( actionName == "" )
        throw Exception( "No action specified" );
    for ( int i = 0; i < CalendarService::NumActions; ++i )
        if ( s_actionNames[ i ] == actionName )
        {
            s_action = CalendarService::Action( i );
            break;
        }
    if ( s_action == CalendarService::NumActions )
        throw Exception( "Unexpected action" );

    if ( s_action != CalendarService::ListCalendars )
    {
        s_calendar = NumCalendars;
        s_calendarName = cgiInput[ "calendar" ];
        if ( s_calendarName == "" )
            throw Exception( "No calendar specified" );
        for ( int i = 0; i < NumCalendars; ++i )
            if ( s_calendarNames[ i ] == s_calendarName )
            {
                s_calendar = Calendar( i );
                break;
            }
        if ( s_calendar == NumCalendars )
            throw Exception( "Unexpected calendar" );
    }

    s_format = CalendarService::NumFormats;
    string formatName = cgiInput[ "format" ];
    if ( formatName == "" )
        throw Exception( "No format specified" );
    for ( int i = 0; i < CalendarService::NumFormats; ++i )
        if ( s_formatNames[ i ] == formatName )
        {
            s_format = CalendarService::Format( i );
            break;
        }
    if ( s_format == CalendarService::NumFormats )
        throw Exception( "Unexpected format" );
}

//=============================================================================

string
WriteHttpResponse( )
{
    const CGIInput & cgiInput = CGIInput::Instance();

    if ( s_action == CalendarService::ListCalendars )
        switch ( s_format )
        {
        case CalendarService::JSON:
            return ToJSON( s_calendarNames );
        default:
            throw Exception( "Unexpected format" );
        }

    switch ( s_calendar )
    {
    case Egyptian:
        return DMYWCalendarService< EgyptianCalendar, WesternWeek, NoOptions >::
                Respond( s_action, s_calendarName, s_format );
    case Mayan:
        return MayanCalendarService::
                Respond( s_action, s_calendarName, s_format );
    case Chinese:
        return ChineseCalendarService::
                Respond( s_action, s_calendarName, s_format );
    case Armenian:
        return DMYWCalendarService< ArmenianCalendar, ArmenianWeek, NoOptions >::
                Respond( s_action, s_calendarName, s_format );
    case Julian:
        return DMYWCalendarService< JulianCalendar, WesternWeek, NoOptions >::
                Respond( s_action, s_calendarName, s_format );
    case Coptic:
        return DMYWCalendarService< CopticCalendar, CopticWeek, NoOptions >::
                Respond( s_action, s_calendarName, s_format );
    case Ethiopian:
        return DMYWCalendarService< EthiopianCalendar, EthiopianWeek, NoOptions >::
                Respond( s_action, s_calendarName, s_format );
    case Hebrew:
        return DMYWCalendarService< HebrewCalendar, HebrewWeek, NoOptions >::
                Respond( s_action, s_calendarName, s_format );
    case HinduSolar:
        return DMYWCalendarService< HinduSolarCalendar, HinduWeek,
                HinduSolarOptions >::
                Respond( s_action, s_calendarName, s_format );
    case HinduLunisolar:
        return HinduLunisolarCalendarService::
                Respond( s_action, s_calendarName, s_format );
    case Islamic:
        return DMYWCalendarService< IslamicCalendar, IslamicWeek, NoOptions >::
                Respond( s_action, s_calendarName, s_format );
    case Persian:
        return DMYWCalendarService< PersianCalendar, PersianWeek,
                PersianOptions >::
                Respond( s_action, s_calendarName, s_format );
    case Gregorian:
        return DMYWCalendarService< GregorianCalendar, WesternWeek, NoOptions >::
                Respond( s_action, s_calendarName, s_format );
    case FrenchRevolutionary:
        return FrenchRevolutionaryCalendarService::
                Respond( s_action, s_calendarName, s_format );
    case Bahai:
        return DMYWCalendarService< BahaiCalendar, BahaiWeek, NoOptions >::
                Respond( s_action, s_calendarName, s_format );
    case Badi:
        return BadiCalendarService::
                Respond( s_action, s_calendarName, s_format );
    case ISO8601:
        return ISO8601CalendarService::
                Respond( s_action, s_calendarName, s_format );
    default:
        throw Exception( "Unexpected calendar" );
    }
}

//=============================================================================

}                                                                   //namespace


//*****************************************************************************
