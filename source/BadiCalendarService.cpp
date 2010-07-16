/*
  BadiCalendarService.cpp
  Copyright © 2010 David M. Anderson

  BadiCalendarService class: Web service for the Badi calendar.
*/


#include "BadiCalendarService.hpp"
#include <BadiCalendar.hpp>
#include <BahaiWeek.hpp>
#include <BadiDate.hpp>
#include <CGIInput.hpp>
#include <JSON.hpp>
#include <DivMod.hpp>
#include <Exception.hpp>


namespace EpsilonDelta
{                                                      //namespace EpsilonDelta

//*****************************************************************************


std::string
BadiCalendarService::Respond( CalendarService::Action action,
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
    case CalendarService::MonthData:
        return MonthData( calendarName, format );
    default:
        throw Exception( "Unexpected action for "
                         + calendarName + " calendar." );
    }
}

//=============================================================================

std::string
BadiCalendarService::Names( std::string calendarName,
                            CalendarService::Format format )
{
    std::vector< std::string > dayNames;
    int maxDaysInMonth = 19;
    for ( int d = 1; d <= maxDaysInMonth; ++d )
        dayNames.push_back( BadiCalendar::DayName( d ) );
    std::vector< std::string > monthNames;
    for ( int m = 1; m <= BadiCalendar::MonthsInYear( ); ++m )
        monthNames.push_back( BadiCalendar::MonthName( m ) );
    std::vector< std::string > yearNames;
    for ( int y = 1; y <= BadiCalendar::YearsInVahid(); ++y )
        yearNames.push_back( BadiCalendar::YearName( y ) );
    std::vector< std::string > weekdayNames;
    for ( int i = 0; i < BahaiWeek::DaysInWeek(); ++i )
        weekdayNames.push_back( BahaiWeek::WeekDayName( i ) );
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "calendar" ] = ToJSON( calendarName );
        jsonObj[ "dayNames" ] = ToJSON( dayNames );
        jsonObj[ "monthNames" ] = ToJSON( monthNames );
        jsonObj[ "yearNames" ] = ToJSON( yearNames );
        jsonObj[ "weekdayNames" ] = ToJSON( weekdayNames );
        return ToJSON( jsonObj );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}

//=============================================================================

std::string
BadiCalendarService::DateToJD( std::string calendarName,
                               CalendarService::Format format )
{
    CGIInput & cgiInput = CGIInput::Instance();
    int day = std::atoi( cgiInput[ "day" ].c_str() );
    int month = std::atoi( cgiInput[ "month" ].c_str() );
    int year = std::atoi( cgiInput[ "year" ].c_str() );
    int vahid = std::atoi( cgiInput[ "vahid" ].c_str() );
    long kulliShay = std::atoi( cgiInput[ "kulliShay" ].c_str() );
    BadiDate date( day, month, year, vahid, kulliShay );
    date.MakeValid( );
    long julianDay = date.JulianDay();
    BadiCalendar::JulianDayToDMYVK( julianDay,
                                    &day, &month, &year, &vahid, &kulliShay );
    int dayOfWeek = (int)ModP( (julianDay + BahaiWeek::DayOfWeekOfJD0()),
                               (long)BahaiWeek::DaysInWeek() );
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
        jsonObj[ "vahid" ] = ToJSON( vahid );
        jsonObj[ "kulliShay" ] = ToJSON( kulliShay );
        jsonObj[ "dayOfWeek" ] = ToJSON( dayOfWeek );
        return ToJSON( jsonObj );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}

//=============================================================================

std::string
BadiCalendarService::JDToDate( std::string calendarName,
                               CalendarService::Format format )
{
    CGIInput & cgiInput = CGIInput::Instance();
    long julianDay = std::atol( cgiInput[ "julianDay" ].c_str() );
    int day, month, year, vahid;
    long kulliShay;
    BadiCalendar::JulianDayToDMYVK( julianDay,
                                    &day, &month, &year, &vahid, &kulliShay );
    int dayOfWeek = (int)ModP( (julianDay + BahaiWeek::DayOfWeekOfJD0()),
                               (long)BahaiWeek::DaysInWeek() );
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
        jsonObj[ "vahid" ] = ToJSON( vahid );
        jsonObj[ "kulliShay" ] = ToJSON( kulliShay );
        jsonObj[ "dayOfWeek" ] = ToJSON( dayOfWeek );
        return ToJSON( jsonObj );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}

//=============================================================================

std::string
BadiCalendarService::MonthData( std::string calendarName,
                                CalendarService::Format format )
{
    std::vector< std::string > monthNames;
    CGIInput & cgiInput = CGIInput::Instance();
    int month = std::atoi( cgiInput[ "month" ].c_str() );
    int year = std::atoi( cgiInput[ "year" ].c_str() );
    int vahid = std::atoi( cgiInput[ "vahid" ].c_str() );
    long kulliShay = std::atoi( cgiInput[ "kulliShay" ].c_str() );
    int monthLength = BadiCalendar::DaysInMonth( month, year,
                                                 vahid, kulliShay );
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "calendar" ] = ToJSON( calendarName );
        jsonObj[ "month" ] = ToJSON( month );
        jsonObj[ "year" ] = ToJSON( year );
        jsonObj[ "vahid" ] = ToJSON( vahid );
        jsonObj[ "kulliShay" ] = ToJSON( kulliShay );
        jsonObj[ "monthLength" ] = ToJSON( monthLength );
        return ToJSON( jsonObj );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}


//*****************************************************************************

}                                                      //namespace EpsilonDelta
