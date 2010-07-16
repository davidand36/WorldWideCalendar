/*
  ISO8601CalendarService.cpp
  Copyright © 2010 David M. Anderson

  ISO8601CalendarService class: Web service for the ISO 8601 calendar.
*/


#include "ISO8601CalendarService.hpp"
#include <ISO8601Calendar.hpp>
#include <ISO8601Date.hpp>
#include <WesternWeek.hpp>
#include <CGIInput.hpp>
#include <JSON.hpp>
#include <DivMod.hpp>
#include <Exception.hpp>


namespace EpsilonDelta
{                                                      //namespace EpsilonDelta

//*****************************************************************************


std::string
ISO8601CalendarService::Respond( CalendarService::Action action,
                                 std::string calendarName,
                                 CalendarService::Format format )
{
    switch ( action )
    {
    case CalendarService::Names:
        return Names( calendarName, format );
    case CalendarService::DateToJD:
        return DateToJD( calendarName, format );
    case CalendarService::JDToDate:
        return JDToDate( calendarName, format );
    default:
        throw Exception( "Unexpected action for "
                         + calendarName + " calendar." );
    }
}

//=============================================================================

std::string
ISO8601CalendarService::Names( std::string calendarName,
                               CalendarService::Format format )
{
    int daysInWeek = WesternWeek::DaysInWeek();
    std::vector< std::string > weekdayNames;
    for ( int i = 1; i <= daysInWeek; ++i )
        weekdayNames.push_back( WesternWeek::WeekDayName( i % daysInWeek ) );
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "calendar" ] = ToJSON( calendarName );
        jsonObj[ "weekdayNames" ] = ToJSON( weekdayNames );
        return ToJSON( jsonObj );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}

//=============================================================================

std::string
ISO8601CalendarService::DateToJD( std::string calendarName,
                               CalendarService::Format format )
{
    CGIInput & cgiInput = CGIInput::Instance();
    int day = std::atoi( cgiInput[ "day" ].c_str() );
    int week = std::atoi( cgiInput[ "week" ].c_str() );
    long year = std::atol( cgiInput[ "year" ].c_str() );
    ISO8601Date date( day, week, year );
    date.MakeValid( );
    long julianDay = date.JulianDay();
    ISO8601Calendar::JulianDayToDWY( julianDay, &day, &week, &year );
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "calendar" ] = ToJSON( calendarName );
        jsonObj[ "julianDay" ] = ToJSON( julianDay );
        jsonObj[ "day" ] = ToJSON( day );
        jsonObj[ "week" ] = ToJSON( week );
        jsonObj[ "year" ] = ToJSON( year );
        return ToJSON( jsonObj );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}

//=============================================================================

std::string
ISO8601CalendarService::JDToDate( std::string calendarName,
                               CalendarService::Format format )
{
    CGIInput & cgiInput = CGIInput::Instance();
    long julianDay = std::atol( cgiInput[ "julianDay" ].c_str() );
    int day, week;
    long year;
    ISO8601Calendar::JulianDayToDWY( julianDay, &day, &week, &year );
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "calendar" ] = ToJSON( calendarName );
        jsonObj[ "julianDay" ] = ToJSON( julianDay );
        jsonObj[ "day" ] = ToJSON( day );
        jsonObj[ "week" ] = ToJSON( week );
        jsonObj[ "year" ] = ToJSON( year );
        return ToJSON( jsonObj );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}


//*****************************************************************************

}                                                      //namespace EpsilonDelta
