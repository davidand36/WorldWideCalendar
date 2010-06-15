/*
  PersianOptions.cpp
  Copyright © 2010 David M. Anderson

  PersianOptions class: options (methods) for Persian calendar.
*/


#include "PersianOptions.hpp"
#include <PersianCalendar.hpp>
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

const array< string, PersianCalendar::NumMethods > s_methodNames
= {
    "Astronomical",
    "Arithmetic"
  };

}                                                                   //namespace

//*****************************************************************************


void
PersianOptions::Set( )
{
    CGIInput & cgiInput = CGIInput::Instance();
    string methodName = cgiInput[ "method" ];
    PersianCalendar::EMethod method = PersianCalendar::Astronomical;
    for ( int i = 0; i < PersianCalendar::NumMethods; ++i )
        if ( s_methodNames[ i ] == methodName )
        {
            method = PersianCalendar::EMethod( i );
            break;
        }
    PersianCalendar::SetMethod( method );
}

//=============================================================================

string
PersianOptions::Get( CalendarService::Format format )
{
    string methodName = s_methodNames[ PersianCalendar::GetMethod() ];
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "method" ] = ToJSON( methodName );
        return ToJSON( jsonObj );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}

//=============================================================================

string
PersianOptions::GetAvailable( CalendarService::Format format )
{
    switch ( format )
    {
    case CalendarService::JSON:
    {
        JSONObject jsonObj;
        jsonObj[ "methods" ] = ToJSON( s_methodNames );
        return ToJSON( jsonObj );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}


//*****************************************************************************

}                                                      //namespace EpsilonDelta
