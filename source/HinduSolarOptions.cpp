/*
  HinduSolarOptions.cpp
  Copyright © 2010 David M. Anderson

  HinduSolarOptions class: options (versions) for Hindu Solar calendars.
*/


#include "HinduSolarOptions.hpp"
#include <HinduSolarCalendar.hpp>
#include <CGIInput.hpp>
#include <JSON.hpp>
#include <Exception.hpp>
#include <tr1/array>
using namespace std;
using namespace std::tr1;


namespace EpsilonDelta
{                                                      //namespace EpsilonDelta

//*****************************************************************************

namespace
{                                                                   //namespace

const array< string, HinduSolarCalendar::NumVersions > s_versionNames
= {
    "Modern",
    "Old"
  };

}                                                                   //namespace

//*****************************************************************************


void
HinduSolarOptions::Set( )
{
    CGIInput & cgiInput = CGIInput::Instance();
    string versionName = cgiInput[ "version" ];
    HinduSolarCalendar::EVersion version = HinduSolarCalendar::Modern;
    for ( int i = 0; i < HinduSolarCalendar::NumVersions; ++i )
        if ( s_versionNames[ i ] == versionName )
        {
            version = (HinduSolarCalendar::EVersion)i;
            break;
        }
    HinduSolarCalendar::SetVersion( version );
}

//=============================================================================

string
HinduSolarOptions::Get( CalendarService::Format format )
{
    string versionName = s_versionNames[ HinduSolarCalendar::GetVersion() ];
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "version" ] = ToJSON( versionName );
        return ToJSON( jsonObj );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}

//=============================================================================

string
HinduSolarOptions::GetAvailable( CalendarService::Format format )
{
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "versions" ] = ToJSON( s_versionNames );
        return ToJSON( jsonObj );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}


//*****************************************************************************

}                                                      //namespace EpsilonDelta
