/*
  ChineseCalendarService.hpp
  Copyright © 2010 David M. Anderson

  ChineseCalendarService class: Web service for the Chinese calendar.
*/


#include "ChineseCalendarService.hpp"
#include <ChineseCalendar.hpp>
#include <ChineseDate.hpp>
#include <CGIInput.hpp>
#include <JSON.hpp>
#include <DivMod.hpp>
#include <Exception.hpp>
using namespace std;


namespace EpsilonDelta
{                                                      //namespace EpsilonDelta

//*****************************************************************************


string
ChineseCalendarService::Respond( CalendarService::Action action,
                                 string calendarName,
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
    case CalendarService::SolarTerms:
        return SolarTerms( calendarName, format );
    default:
        throw Exception( "Unexpected action for "
                         + calendarName + " calendar." );
    }
}

//=============================================================================

string
ChineseCalendarService::DateToJD( string calendarName,
                               CalendarService::Format format )
{
    CGIInput & cgiInput = CGIInput::Instance();
    int day = atoi( cgiInput[ "day" ].c_str() );
    int month = atoi( cgiInput[ "month" ].c_str() );
    bool leap = (cgiInput[ "leap" ] == "true");
    int year = atoi( cgiInput[ "year" ].c_str() );
    if ( year < -360 )
        year = -360;
    else if ( year > 5635 )
        year = 5635;
    ChineseDate date( day, month, leap, year );
    date.MakeValid( );
    int julianDay = date.JulianDay();
    int dayCyclical = ChineseCalendar::DayCyclical( julianDay );
    int monthCyclical = ChineseCalendar::MonthCyclical( month, year );
    int yearCyclical, yearCycle;
    ChineseCalendar::LinearToSexagesimal( year, &yearCyclical, &yearCycle );
    int majorTerm, minorTerm;
    ChineseCalendar::SolarTerms( julianDay, &majorTerm, &minorTerm );
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "calendar" ] = ToJSON( calendarName );
        jsonObj[ "julianDay" ] = ToJSON( julianDay );
        jsonObj[ "day" ] = ToJSON( day );
        jsonObj[ "month" ] = ToJSON( month );
        jsonObj[ "leap" ] = ToJSON( leap );
        jsonObj[ "year" ] = ToJSON( year );
        jsonObj[ "dayCyclical" ] = ToJSON( dayCyclical );
        jsonObj[ "monthCyclical" ] = ToJSON( monthCyclical );
        jsonObj[ "yearCyclical" ] = ToJSON( yearCyclical );
        jsonObj[ "yearCycle" ] = ToJSON( yearCycle );
        jsonObj[ "majorTerm" ] = ToJSON( majorTerm );
        jsonObj[ "minorTerm" ] = ToJSON( minorTerm );
        return ToJSON( jsonObj );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}

//=============================================================================

string
ChineseCalendarService::JDToDate( string calendarName,
                               CalendarService::Format format )
{
    CGIInput & cgiInput = CGIInput::Instance();
    int julianDay = atoi( cgiInput[ "julianDay" ].c_str() );
    if ( julianDay < 626471 )
        julianDay = 626471;
    else if ( julianDay > 2816459 )
        julianDay = 2816459;
    ChineseDate date( julianDay );
    int day = date.Day();
    int month = date.MonthNumber();
    bool leap = date.IsMonthLeap();
    int year = date.Year();
    int dayCyclical = ChineseCalendar::DayCyclical( julianDay );
    int monthCyclical = ChineseCalendar::MonthCyclical( month, year );
    int yearCyclical, yearCycle;
    ChineseCalendar::LinearToSexagesimal( year, &yearCyclical, &yearCycle );
    int majorTerm, minorTerm;
    ChineseCalendar::SolarTerms( julianDay, &majorTerm, &minorTerm );
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "calendar" ] = ToJSON( calendarName );
        jsonObj[ "julianDay" ] = ToJSON( julianDay );
        jsonObj[ "day" ] = ToJSON( day );
        jsonObj[ "month" ] = ToJSON( month );
        jsonObj[ "leap" ] = ToJSON( leap );
        jsonObj[ "year" ] = ToJSON( year );
        jsonObj[ "dayCyclical" ] = ToJSON( dayCyclical );
        jsonObj[ "monthCyclical" ] = ToJSON( monthCyclical );
        jsonObj[ "yearCyclical" ] = ToJSON( yearCyclical );
        jsonObj[ "yearCycle" ] = ToJSON( yearCycle );
        jsonObj[ "majorTerm" ] = ToJSON( majorTerm );
        jsonObj[ "minorTerm" ] = ToJSON( minorTerm );
        return ToJSON( jsonObj );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}

//=============================================================================

string
ChineseCalendarService::Names( string calendarName,
                            CalendarService::Format format )
{
    vector< string > stemNames;
    for ( int s = 1; s <= 10; ++s )
        stemNames.push_back( ChineseCalendar::CelestialStemName( s ) );
    vector< string > branchNames;
    for ( int b = 1; b <= 12; ++b )
        branchNames.push_back( ChineseCalendar::TerrestrialBranchName( b ) );
    vector< string > branchEnglishNames;
    for ( int b = 1; b <= 12; ++b )
        branchEnglishNames.push_back(
            ChineseCalendar::TerrestrialBranchName( b, true ) );
    vector< string > majorSolarTermNames;
    for ( int t = 1; t <= 12; ++t )
        majorSolarTermNames.push_back(
            ChineseCalendar::MajorSolarTermName( t ) );
    vector< string > majorSolarTermEnglishNames;
    for ( int t = 1; t <= 12; ++t )
        majorSolarTermEnglishNames.push_back(
            ChineseCalendar::MajorSolarTermName( t, true ) );
    vector< string > minorSolarTermNames;
    for ( int t = 1; t <= 12; ++t )
        minorSolarTermNames.push_back(
            ChineseCalendar::MinorSolarTermName( t ) );
    vector< string > minorSolarTermEnglishNames;
    for ( int t = 1; t <= 12; ++t )
        minorSolarTermEnglishNames.push_back(
            ChineseCalendar::MinorSolarTermName( t, true ) );
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "calendar" ] = ToJSON( calendarName );
        jsonObj[ "stemNames" ] = ToJSON( stemNames );
        jsonObj[ "branchNames" ] = ToJSON( branchNames );
        jsonObj[ "branchEnglishNames" ] = ToJSON( branchEnglishNames );
        jsonObj[ "majorSolarTermNames" ] = ToJSON( majorSolarTermNames );
        jsonObj[ "majorSolarTermEnglishNames" ]
                = ToJSON( majorSolarTermEnglishNames );
        jsonObj[ "minorSolarTermNames" ] = ToJSON( minorSolarTermNames );
        jsonObj[ "minorSolarTermEnglishNames" ]
                = ToJSON( minorSolarTermEnglishNames );
        return ToJSON( jsonObj );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}

//=============================================================================

string
ChineseCalendarService::MonthLength( string calendarName,
                                     CalendarService::Format format )
{
    CGIInput & cgiInput = CGIInput::Instance();
    int month = atoi( cgiInput[ "month" ].c_str() );
    bool leap = (cgiInput[ "leap" ] == "true");
    int year = atoi( cgiInput[ "year" ].c_str() );
    ChineseDate dt( 1, month, leap, year );
    int monthLength = ChineseCalendar::DaysInMonth( dt.TrueMonth(), year );
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "calendar" ] = ToJSON( calendarName );
        jsonObj[ "month" ] = ToJSON( month );
        jsonObj[ "leap" ] = ToJSON( leap );
        jsonObj[ "year" ] = ToJSON( year );
        jsonObj[ "monthLength" ] = ToJSON( monthLength );
        return ToJSON( jsonObj );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}

//=============================================================================

namespace
{                                                                   //namespace
//.............................................................................

struct DayTerm
{
    int day;
    int term;
};
    
//.............................................................................

string ToJSON( const DayTerm & dt )
{
    JSONObject jsonObj;
    jsonObj[ "day" ] = EpsilonDelta::ToJSON( dt.day );
    jsonObj[ "term" ] = EpsilonDelta::ToJSON( dt.term );
    return EpsilonDelta::ToJSON( jsonObj );
}

//.............................................................................
}                                                                   //namespace

//-----------------------------------------------------------------------------

string
ChineseCalendarService::SolarTerms( string calendarName,
                                    CalendarService::Format format )
{
    CGIInput & cgiInput = CGIInput::Instance();
    int firstJD = atoi( cgiInput[ "firstJD" ].c_str() );
    int majorTerm = atoi( cgiInput[ "firstMajorTerm" ].c_str() );
    int minorTerm = atoi( cgiInput[ "firstMinorTerm" ].c_str() );
    int monthLength = atoi( cgiInput[ "monthLength" ].c_str() );
    vector< DayTerm > majorTerms;
    int jd = firstJD;
    int day = 1;
    do
    {
        if ( ++majorTerm > 12 )
            majorTerm = 1;
        jd = ChineseCalendar::JDofNextSolarTerm( jd, majorTerm, true );
        day = jd - firstJD + 1;
        if ( day <= monthLength )
        {
            DayTerm dayTerm = { day, majorTerm };
            majorTerms.push_back( dayTerm );
        }
    } while ( day <= monthLength );
    vector< DayTerm > minorTerms;
    jd = firstJD;
    day = 1;
    do
    {
        if ( ++minorTerm > 12 )
            minorTerm = 1;
        jd = ChineseCalendar::JDofNextSolarTerm( jd, minorTerm, false );
        day = jd - firstJD + 1;
        if ( day <= monthLength )
        {
            DayTerm dayTerm = { day, minorTerm };
            minorTerms.push_back( dayTerm );
        }
    } while ( day <= monthLength );

    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "calendar" ] = ToJSON( calendarName );
        jsonObj[ "firstJD" ] = ToJSON( firstJD );
        jsonObj[ "firstMajorTerm" ] = ToJSON( majorTerm );
        jsonObj[ "firstMinorTerm" ] = ToJSON( minorTerm );
        jsonObj[ "monthLength" ] = ToJSON( monthLength );
        jsonObj[ "majorSolarTerms" ] = ToJSON( majorTerms );
        jsonObj[ "minorSolarTerms" ] = ToJSON( minorTerms );
        return ToJSON( jsonObj );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}


//*****************************************************************************

}                                                      //namespace EpsilonDelta
