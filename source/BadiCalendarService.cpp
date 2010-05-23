/*
  BadiCalendarService.cpp
  Copyright © 2010 David M. Anderson

  BadiCalendarService template class: Web service for the Badi calendar.
*/


#include "BadiCalendarService.hpp"
#include <BadiCalendar.hpp>
#include <BahaiWeek.hpp>
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
    case CalendarService::DateToJD:
        return DateToJD( calendarName, format );
    case CalendarService::JDToDate:
        return JDToDate( calendarName, format );
    case CalendarService::Names:
        return Names( calendarName, format );
    case CalendarService::MonthLength:
        return MonthLength( calendarName, format );
    default:
        throw Exception( "Unexpected action for "
                         + calendarName + " calendar." );
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
    int kulliShay = std::atoi( cgiInput[ "kulliShay" ].c_str() );
    int julianDay = BadiCalendar::DMYVKToJulianDay( day, month, year,
                                                    vahid, kulliShay );
    int dayOfWeek = ModP( (julianDay + BahaiWeek::DayOfWeekOfJD0()),
                          BahaiWeek::DaysInWeek() );
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
    int julianDay = std::atoi( cgiInput[ "julianDay" ].c_str() );
    int day, month, year, vahid, kulliShay;
    BadiCalendar::JulianDayToDMYVK( julianDay,
                                    &day, &month, &year, &vahid, &kulliShay );
    int dayOfWeek = ModP( (julianDay + BahaiWeek::DayOfWeekOfJD0()),
                          BahaiWeek::DaysInWeek() );
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
BadiCalendarService::Names( std::string calendarName,
                            CalendarService::Format format )
{
    std::vector< std::string > dayNames;
    int maxDaysInMonth = 19;
    for ( int d = 0; d < maxDaysInMonth; ++d )
        dayNames.push_back( BadiCalendar::MonthName( d ) );
    std::vector< std::string > monthNames;
    for ( int m = 0; m < BadiCalendar::MonthsInYear( ); ++m )
        monthNames.push_back( BadiCalendar::MonthName( m ) );
    std::vector< std::string > yearNames;
    for ( int y = 0; y < BadiCalendar::YearsInVahid(); ++y )
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
BadiCalendarService::MonthLength( std::string calendarName,
                                  CalendarService::Format format )
{
    std::vector< std::string > monthNames;
    CGIInput & cgiInput = CGIInput::Instance();
    int month = std::atoi( cgiInput[ "month" ].c_str() );
    int year = std::atoi( cgiInput[ "year" ].c_str() );
    int vahid = std::atoi( cgiInput[ "vahid" ].c_str() );
    int kulliShay = std::atoi( cgiInput[ "kulliShay" ].c_str() );
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
