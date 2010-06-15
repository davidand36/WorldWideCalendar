/*
  HinduLunisolarCalendarService.cpp
  Copyright © 2010 David M. Anderson

  HinduLunisolarCalendarService class: Web service for the Hindu lunisolar
  calendar.
*/


#include "HinduLunisolarCalendarService.hpp"
#include <HinduLunisolarCalendar.hpp>
#include <HinduLunisolarDate.hpp>
#include <HinduWeek.hpp>
#include <CGIInput.hpp>
#include <JSON.hpp>
#include <DivMod.hpp>
#include <Exception.hpp>
#include <tr1/array>
using namespace std;
using namespace std::tr1;


namespace EpsilonDelta
{                                                      //namespace EpsilonDelta

//*****************************************************************************

namespace
{                                                                   //namespace

const array< string, HinduLunisolarCalendar::NumVersions > s_versionNames
= {
    "Modern",
    "Old"
  };

}                                                                   //namespace

//*****************************************************************************


string
HinduLunisolarCalendarService::Respond( CalendarService::Action action,
                                        string calendarName,
                                        CalendarService::Format format )
{
    CGIInput & cgiInput = CGIInput::Instance();
    string versionName = cgiInput[ "version" ];
    HinduLunisolarCalendar::EVersion version = HinduLunisolarCalendar::Modern;
    for ( int i = 0; i < HinduLunisolarCalendar::NumVersions; ++i )
        if ( s_versionNames[ i ] == versionName )
        {
            version = HinduLunisolarCalendar::EVersion( i );
            break;
        }
    HinduLunisolarCalendar::SetVersion( version );

    switch ( action )
    {
    case CalendarService::AvailableOptions:
        return AvailableOptions( calendarName, format );
    case CalendarService::Names:
        return Names( calendarName, format );
    case CalendarService::DateToJD:
        return DateToJD( calendarName, format );
    case CalendarService::JDToDate:
        return JDToDate( calendarName, format );
    case CalendarService::MonthData:
        return MonthData( calendarName, format );
    default:
        throw Exception( "Unexpected action for "
                         + calendarName + " calendar." );
    }
}

//=============================================================================

string
HinduLunisolarCalendarService::AvailableOptions( string calendarName,
                                                CalendarService::Format format )
{
    vector< string > monthNames;
    CGIInput & cgiInput = CGIInput::Instance();
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "calendar" ] = ToJSON( calendarName );
        JSONObject availableOptions;
        availableOptions[ "versions" ] = ToJSON( s_versionNames );
        jsonObj[ "availableOptions" ] = ToJSON( availableOptions );
        return ToJSON( jsonObj );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}

//=============================================================================

string
HinduLunisolarCalendarService::Names( string calendarName,
                                      CalendarService::Format format )
{
    vector< string > monthNames;
    for ( int m = 0; m < 12; ++m )
        monthNames.push_back( HinduLunisolarCalendar::MonthName( m ) );
    vector< string > weekdayNames;
    for ( int i = 0; i < HinduWeek::DaysInWeek(); ++i )
        weekdayNames.push_back( HinduWeek::WeekDayName( i ) );
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "calendar" ] = ToJSON( calendarName );
        jsonObj[ "monthNames" ] = ToJSON( monthNames );
        jsonObj[ "weekdayNames" ] = ToJSON( weekdayNames );
        return ToJSON( jsonObj );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}

//=============================================================================

string
HinduLunisolarCalendarService::DateToJD( string calendarName,
                                         CalendarService::Format format )
{
    CGIInput & cgiInput = CGIInput::Instance();
    int day = atoi( cgiInput[ "day" ].c_str() );
    bool dayLeap = (cgiInput[ "dayLeap" ] == "leap");
    int month = atoi( cgiInput[ "month" ].c_str() );
    bool monthLeap = (cgiInput[ "monthLeap" ] == "leap");
    int year = atoi( cgiInput[ "year" ].c_str() );
    HinduLunisolarDate date( day, dayLeap, month, monthLeap, year );
    date.MakeValid( );
    int julianDay = date.JulianDay();
    HinduLunisolarCalendar::JulianDayToDLMLY( julianDay, &day, &dayLeap,
                                              &month, &monthLeap, &year );
    int dayOfWeek = ModP( (julianDay + HinduWeek::DayOfWeekOfJD0()),
                          HinduWeek::DaysInWeek() );
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "calendar" ] = ToJSON( calendarName );
        jsonObj[ "julianDay" ] = ToJSON( julianDay );
        jsonObj[ "day" ] = ToJSON( day );
        jsonObj[ "dayLeap" ] = ToJSON( dayLeap );
        jsonObj[ "month" ] = ToJSON( month );
        jsonObj[ "monthLeap" ] = ToJSON( monthLeap );
        jsonObj[ "year" ] = ToJSON( year );
        jsonObj[ "dayOfWeek" ] = ToJSON( dayOfWeek );
        return ToJSON( jsonObj );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}

//=============================================================================

string
HinduLunisolarCalendarService::JDToDate( string calendarName,
                                         CalendarService::Format format )
{
    CGIInput & cgiInput = CGIInput::Instance();
    int julianDay = atoi( cgiInput[ "julianDay" ].c_str() );
    int day, month, year;
    bool dayLeap, monthLeap;
    HinduLunisolarCalendar::JulianDayToDLMLY( julianDay,
                                              &day, &dayLeap, &month,
                                              &monthLeap, &year );
    int dayOfWeek = ModP( (julianDay + HinduWeek::DayOfWeekOfJD0()),
                          HinduWeek::DaysInWeek() );
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "calendar" ] = ToJSON( calendarName );
        jsonObj[ "julianDay" ] = ToJSON( julianDay );
        jsonObj[ "day" ] = ToJSON( day );
        jsonObj[ "dayLeap" ] = ToJSON( dayLeap );
        jsonObj[ "month" ] = ToJSON( month );
        jsonObj[ "monthLeap" ] = ToJSON( monthLeap );
        jsonObj[ "year" ] = ToJSON( year );
        jsonObj[ "dayOfWeek" ] = ToJSON( dayOfWeek );
        return ToJSON( jsonObj );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}

//=============================================================================

string
HinduLunisolarCalendarService::MonthData( string calendarName,
                                          CalendarService::Format format )
{
    vector< string > monthNames;
    CGIInput & cgiInput = CGIInput::Instance();
    int month = atoi( cgiInput[ "month" ].c_str() );
    bool monthLeap = (cgiInput[ "monthLeap" ] == "leap");
    int year = atoi( cgiInput[ "year" ].c_str() );
    int lastDay = HinduLunisolarCalendar::LastDayOfMonth( month, monthLeap,
                                                          year );
    int lostDay = HinduLunisolarCalendar::LostDay( month, monthLeap, year );
    int leapDay = HinduLunisolarCalendar::LeapDay( month, monthLeap, year );
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "calendar" ] = ToJSON( calendarName );
        jsonObj[ "month" ] = ToJSON( month );
        jsonObj[ "monthLeap" ] = ToJSON( monthLeap );
        jsonObj[ "year" ] = ToJSON( year );
        jsonObj[ "lastDay" ] = ToJSON( lastDay );
        jsonObj[ "lostDay" ] = ToJSON( lostDay );
        jsonObj[ "leapDay" ] = ToJSON( leapDay );
        return ToJSON( jsonObj );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}


//*****************************************************************************

}                                                      //namespace EpsilonDelta
