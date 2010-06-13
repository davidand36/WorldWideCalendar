#ifndef NOOPTIONS_HPP
#define NOOPTIONS_HPP
/*
  NoOptions.hpp
  Copyright Å© 2010 David M. Anderson

  NoOptions class: for DMYW calendars with nothing extra needed for
  version, etc.
*/


#include "CalendarService.hpp"
#include <JSON.hpp>
#include <Exception.hpp>
#include <string>


namespace EpsilonDelta
{                                                      //namespace EpsilonDelta

//*****************************************************************************


class NoOptions
{
public:
    static void Set( );
    static std::string Get( CalendarService::Format format );
    static std::string GetAvailable( CalendarService::Format format );
};


//*****************************************************************************


inline
void
NoOptions::Set( )
{
}

//=============================================================================

inline
std::string
NoOptions::Get( CalendarService::Format format )
{
    switch ( format )
    {
    case CalendarService::JSON:
    {
        return ToJSON( "" );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}

//=============================================================================

inline
std::string
NoOptions::GetAvailable( CalendarService::Format format )
{
    switch ( format )
    {
    case CalendarService::JSON:
    {
        return ToJSON( "" );
    }
    default:
        throw Exception( "Unexpected format" );
    }
}


//*****************************************************************************

}                                                      //namespace EpsilonDelta

#endif //NOOPTIONS_HPP
