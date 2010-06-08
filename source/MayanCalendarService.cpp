/*
  MayanCalendarService.cpp
  Copyright © 2010 David M. Anderson

  MayanCalendarService class: Web service for the Mayan calendar.
*/


#include "MayanCalendarService.hpp"
#include <MayanLongCountCalendar.hpp>
#include <MayanHaabCalendar.hpp>
#include <MayanTzolkinCalendar.hpp>
#include <CGIInput.hpp>
#include <JSON.hpp>
#include <DivMod.hpp>
#include <Exception.hpp>


namespace EpsilonDelta
{                                                      //namespace EpsilonDelta

//*****************************************************************************


std::string
MayanCalendarService::Respond( CalendarService::Action action,
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
        return HaabMonthLength( calendarName, format );
    default:
        throw Exception( "Unexpected action for "
                         + calendarName + " calendar." );
    }
}

//=============================================================================

std::string
MayanCalendarService::DateToJD( std::string calendarName,
                               CalendarService::Format format )
{
    CGIInput & cgiInput = CGIInput::Instance();
    int kin = std::atoi( cgiInput[ "kin" ].c_str() );
    int uinal = std::atoi( cgiInput[ "uinal" ].c_str() );
    int tun = std::atoi( cgiInput[ "tun" ].c_str() );
    int katun = std::atoi( cgiInput[ "katun" ].c_str() );
    int baktun = std::atoi( cgiInput[ "baktun" ].c_str() );
    int pictun = std::atoi( cgiInput[ "pictun" ].c_str() );
    int calabtun = std::atoi( cgiInput[ "calabtun" ].c_str() );
    int kinchiltun = std::atoi( cgiInput[ "kinchiltun" ].c_str() );
    int alautun = std::atoi( cgiInput[ "alautun" ].c_str() );
    int julianDay = MayanLongCountCalendar::LongCountToJulianDay( kin, uinal,
                                                tun, katun, baktun, pictun,
                                                calabtun, kinchiltun, alautun );
    int day, month, year;
    MayanHaabCalendar::JulianDayToDMY( julianDay, &day, &month, &year );
    int trecena, veintena;
    MayanTzolkinCalendar::JulianDayToTzolkin( julianDay, &trecena, &veintena );
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "calendar" ] = ToJSON( calendarName );
        jsonObj[ "julianDay" ] = ToJSON( julianDay );
        jsonObj[ "kin" ] = ToJSON( kin );
        jsonObj[ "uinal" ] = ToJSON( uinal );
        jsonObj[ "tun" ] = ToJSON( tun );
        jsonObj[ "katun" ] = ToJSON( katun );
        jsonObj[ "baktun" ] = ToJSON( baktun );
        jsonObj[ "pictun" ] = ToJSON( pictun );
        jsonObj[ "calabtun" ] = ToJSON( calabtun );
        jsonObj[ "kinchiltun" ] = ToJSON( kinchiltun );
        jsonObj[ "alautun" ] = ToJSON( alautun );
        jsonObj[ "haabDay" ] = ToJSON( day );
        jsonObj[ "haabMonth" ] = ToJSON( month );
        jsonObj[ "haabYear" ] = ToJSON( year );
        jsonObj[ "trecena" ] = ToJSON( trecena );
        jsonObj[ "veintena" ] = ToJSON( veintena );
        return ToJSON( jsonObj );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}

//=============================================================================

std::string
MayanCalendarService::JDToDate( std::string calendarName,
                               CalendarService::Format format )
{
    CGIInput & cgiInput = CGIInput::Instance();
    int julianDay = std::atoi( cgiInput[ "julianDay" ].c_str() );
    int kin, uinal, tun, katun, baktun, pictun, calabtun, kinchiltun, alautun;
    MayanLongCountCalendar::JulianDayToLongCount( julianDay,
                                                  &kin, &uinal, &tun, &katun,
                                                  &baktun, &pictun, &calabtun,
                                                  &kinchiltun, &alautun );
    int day, month, year;
    MayanHaabCalendar::JulianDayToDMY( julianDay, &day, &month, &year );
    int trecena, veintena;
    MayanTzolkinCalendar::JulianDayToTzolkin( julianDay, &trecena, &veintena );
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "calendar" ] = ToJSON( calendarName );
        jsonObj[ "julianDay" ] = ToJSON( julianDay );
        jsonObj[ "kin" ] = ToJSON( kin );
        jsonObj[ "uinal" ] = ToJSON( uinal );
        jsonObj[ "tun" ] = ToJSON( tun );
        jsonObj[ "katun" ] = ToJSON( katun );
        jsonObj[ "baktun" ] = ToJSON( baktun );
        jsonObj[ "pictun" ] = ToJSON( pictun );
        jsonObj[ "calabtun" ] = ToJSON( calabtun );
        jsonObj[ "kinchiltun" ] = ToJSON( kinchiltun );
        jsonObj[ "alautun" ] = ToJSON( alautun );
        jsonObj[ "haabDay" ] = ToJSON( day );
        jsonObj[ "haabMonth" ] = ToJSON( month );
        jsonObj[ "haabYear" ] = ToJSON( year );
        jsonObj[ "trecena" ] = ToJSON( trecena );
        jsonObj[ "veintena" ] = ToJSON( veintena );
        return ToJSON( jsonObj );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}

//=============================================================================

std::string
MayanCalendarService::Names( std::string calendarName,
                            CalendarService::Format format )
{
    std::vector< std::string > haabMonthNames;
    for ( int m = 1; m <= MayanHaabCalendar::MonthsInYear(); ++m )
        haabMonthNames.push_back( MayanHaabCalendar::MonthName( m ) );
    std::vector< std::string > veintenaNames;
    for ( int v = 1; v <= 20; ++v )
        veintenaNames.push_back( MayanTzolkinCalendar::VeintenaName( v ) );
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "calendar" ] = ToJSON( calendarName );
        jsonObj[ "haabMonthNames" ] = ToJSON( haabMonthNames );
        jsonObj[ "veintanaNames" ] = ToJSON( veintenaNames );
        return ToJSON( jsonObj );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}

//=============================================================================

std::string
MayanCalendarService::HaabMonthLength( std::string calendarName,
                                       CalendarService::Format format )
{
    CGIInput & cgiInput = CGIInput::Instance();
    int month = std::atoi( cgiInput[ "haabMonth" ].c_str() );
    int monthLength = MayanHaabCalendar::DaysInMonth( month );
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "calendar" ] = ToJSON( calendarName );
        jsonObj[ "haabMonth" ] = ToJSON( month );
        jsonObj[ "monthLength" ] = ToJSON( monthLength );
        return ToJSON( jsonObj );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}


//*****************************************************************************

}                                                      //namespace EpsilonDelta
