#ifndef DMYWCALENDARSERVICE_HPP
#define DMYWCALENDARSERVICE_HPP
/*
  DMYWCalendarService.hpp
  Copyright © 2010 David M. Anderson

  DMYWCalendarService template class: Web service for DMYW calendars.
*/


#include "CalendarService.hpp"
#include <DMYDate.hpp>
#include <CGIInput.hpp>
#include <JSON.hpp>
#include <DivMod.hpp>
#include <Exception.hpp>
#include <string>
#include <vector>
#include <cstdlib>


namespace EpsilonDelta
{                                                      //namespace EpsilonDelta

//*****************************************************************************


template < typename Cal, typename WeekType, typename Options >
class DMYWCalendarService
{
public:
    static std::string Respond( CalendarService::Action action,
                                std::string calendarName,
                                CalendarService::Format format );

private:
    static std::string AvailableOptions( std::string calendarName,
                                         CalendarService::Format format );
    static std::string Names( std::string calendarName,
                              CalendarService::Format format );
    static std::string DateToJD( std::string calendarName,
                                 CalendarService::Format format );
    static std::string JDToDate( std::string calendarName,
                                 CalendarService::Format format );
    static std::string MonthData( std::string calendarName,
                                  CalendarService::Format format );
};


//#############################################################################


template <typename C, typename W, typename O>
std::string
DMYWCalendarService< C, W, O >::Respond( CalendarService::Action action,
                                         std::string calendarName,
                                         CalendarService::Format format )
{
    O::Set( );
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

template <typename C, typename W, typename O>
std::string
DMYWCalendarService< C, W, O >::AvailableOptions( std::string calendarName,
                                                CalendarService::Format format )
{
    std::vector< std::string > monthNames;
    CGIInput & cgiInput = CGIInput::Instance();
    std::string availableOptions = O::GetAvailable( format );
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "calendar" ] = ToJSON( calendarName );
        jsonObj[ "availableOptions" ] = availableOptions;
        return ToJSON( jsonObj );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}

//=============================================================================

template <typename C, typename W, typename O>
std::string
DMYWCalendarService< C, W, O >::Names( std::string calendarName,
                                       CalendarService::Format format )
{
    CGIInput & cgiInput = CGIInput::Instance();
    std::string options = O::Get( format );
    int month = std::atoi( cgiInput[ "month" ].c_str() );
    long year = std::atol( cgiInput[ "year" ].c_str() );
    std::vector< std::string > weekdayNames;
    for ( int i = 0; i < W::DaysInWeek(); ++i )
        weekdayNames.push_back( W::WeekDayName( i ) );
    std::vector< std::string > monthNames;
    for ( int m = 1; m <= C::MonthsInYear( year ); ++m )
        monthNames.push_back( C::MonthName( m, year ) );
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "calendar" ] = ToJSON( calendarName );
        jsonObj[ "options" ] = options;
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

template <typename C, typename W, typename O>
std::string
DMYWCalendarService< C, W, O >::DateToJD( std::string calendarName,
                                          CalendarService::Format format )
{
    CGIInput & cgiInput = CGIInput::Instance();
    int day = std::atoi( cgiInput[ "day" ].c_str() );
    int month = std::atoi( cgiInput[ "month" ].c_str() );
    long year = std::atol( cgiInput[ "year" ].c_str() );
    DMYDate<C> date( day, month, year );
    date.MakeValid( );
    long julianDay = date.JulianDay();
    C::JulianDayToDMY( julianDay, &day, &month, &year );
    int dayOfWeek = (int)ModP( (julianDay + W::DayOfWeekOfJD0()),
                               (long)W::DaysInWeek() );
    std::string options = O::Get( format );
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "calendar" ] = ToJSON( calendarName );
        jsonObj[ "options" ] = options;
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

template <typename C, typename W, typename O>
std::string
DMYWCalendarService< C, W, O >::JDToDate( std::string calendarName,
                                          CalendarService::Format format )
{
    CGIInput & cgiInput = CGIInput::Instance();
    long julianDay = std::atol( cgiInput[ "julianDay" ].c_str() );
    int day, month;
    long year;
    C::JulianDayToDMY( julianDay, &day, &month, &year );
    int dayOfWeek = (int)ModP( (julianDay + W::DayOfWeekOfJD0()),
                               (long)W::DaysInWeek() );
    std::string options = O::Get( format );
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "calendar" ] = ToJSON( calendarName );
        jsonObj[ "options" ] = options;
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

template <typename C, typename W, typename O>
std::string
DMYWCalendarService< C, W, O >::MonthData( std::string calendarName,
                                           CalendarService::Format format )
{
    CGIInput & cgiInput = CGIInput::Instance();
    int month = std::atoi( cgiInput[ "month" ].c_str() );
    long year = std::atol( cgiInput[ "year" ].c_str() );
    int monthLength = C::DaysInMonth( month, year );
    std::string options = O::Get( format );
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "calendar" ] = ToJSON( calendarName );
        jsonObj[ "options" ] = options;
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

#endif //DMYWCALENDARSERVICE_HPP
