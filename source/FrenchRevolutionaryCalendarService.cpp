/*
  FrenchRevolutionaryCalendarService.cpp
  Copyright © 2010 David M. Anderson

  FrenchRevolutionaryCalendarService class: Web service for the French
  Revolutionary calendar.
*/


#include "FrenchRevolutionaryCalendarService.hpp"
#include <FrenchRevolutionaryCalendar.hpp>
#include <FrenchRevolutionaryDate.hpp>
#include <CGIInput.hpp>
#include <JSON.hpp>
#include <DivMod.hpp>
#include <Exception.hpp>
#include <string>
#include <vector>
#include <cstdlib>
using namespace std;


namespace EpsilonDelta
{                                                      //namespace EpsilonDelta

//*****************************************************************************


string
FrenchRevolutionaryCalendarService::Respond( CalendarService::Action action,
                                             string calendarName,
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
    case CalendarService::MonthData:
        return MonthData( calendarName, format );
    default:
        throw Exception( "Unexpected action for "
                         + calendarName + " calendar." );
    }
}

//=============================================================================

string
FrenchRevolutionaryCalendarService::Names( string calendarName,
                                           CalendarService::Format format )
{
    CGIInput & cgiInput = CGIInput::Instance();
    int month = atoi( cgiInput[ "month" ].c_str() );
    int year = atoi( cgiInput[ "year" ].c_str() );

    vector< string > weekdayNames;
    int numWeekdays = (( month < 13 )  ?
                        FrenchRevolutionaryCalendar::DaysInDecade()  :
                        FrenchRevolutionaryCalendar::DaysInMonth( month, year ));
    for ( int d = 1; d <= numWeekdays; ++d )
    {
        weekdayNames.push_back(
            FrenchRevolutionaryCalendar::DayName( d, month, year ) );
    }
    
    vector< string > monthNames;
    for ( int m = 1;
          m <= FrenchRevolutionaryCalendar::MonthsInYear( year ); ++m )
    {
        monthNames.push_back(
            FrenchRevolutionaryCalendar::MonthName( m, year ) );
    }

    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "calendar" ] = ToJSON( calendarName );
        jsonObj[ "month" ] = ToJSON( month );
        jsonObj[ "year" ] = ToJSON( year );
        jsonObj[ "weekdayNames" ] = ToJSON( weekdayNames );
        jsonObj[ "monthNames" ] = ToJSON( monthNames );
        return ToJSON( jsonObj );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}

//=============================================================================

string
FrenchRevolutionaryCalendarService::DateToJD( string calendarName,
                                              CalendarService::Format format )
{
    CGIInput & cgiInput = CGIInput::Instance();
    int day = atoi( cgiInput[ "day" ].c_str() );
    int month = atoi( cgiInput[ "month" ].c_str() );
    int year = atoi( cgiInput[ "year" ].c_str() );
    FrenchRevolutionaryDate date( day, month, year );
    date.MakeValid( );
    int julianDay = date.JulianDay();
    FrenchRevolutionaryCalendar::JulianDayToDMY( julianDay, &day, &month, &year );
    int dayOfWeek = ModP( (day - 1), 10 );
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "calendar" ] = ToJSON( calendarName );
        jsonObj[ "julianDay" ] = ToJSON( julianDay );
        jsonObj[ "day" ] = ToJSON( day );
        jsonObj[ "month" ] = ToJSON( month );
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
FrenchRevolutionaryCalendarService::JDToDate( string calendarName,
                                              CalendarService::Format format )
{
    CGIInput & cgiInput = CGIInput::Instance();
    int julianDay = atoi( cgiInput[ "julianDay" ].c_str() );
    int day, month, year;
    FrenchRevolutionaryCalendar::JulianDayToDMY( julianDay, &day, &month, &year );
    int dayOfWeek = ModP( (day - 1), 10 );
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "calendar" ] = ToJSON( calendarName );
        jsonObj[ "julianDay" ] = ToJSON( julianDay );
        jsonObj[ "day" ] = ToJSON( day );
        jsonObj[ "month" ] = ToJSON( month );
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
FrenchRevolutionaryCalendarService::MonthData( string calendarName,
                                               CalendarService::Format format )
{
    CGIInput & cgiInput = CGIInput::Instance();
    int month = atoi( cgiInput[ "month" ].c_str() );
    int year = atoi( cgiInput[ "year" ].c_str() );
    int monthLength = FrenchRevolutionaryCalendar::DaysInMonth( month, year );
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "calendar" ] = ToJSON( calendarName );
        jsonObj[ "month" ] = ToJSON( month );
        jsonObj[ "year" ] = ToJSON( year );
        jsonObj[ "monthLength" ] = ToJSON( monthLength );
        return ToJSON( jsonObj );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}


//*****************************************************************************

}                                                      //namespace EpsilonDelta
