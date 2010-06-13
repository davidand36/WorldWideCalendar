#ifndef HINDUSOLAROPTIONS_HPP
#define HINDUSOLAROPTIONS_HPP
/*
  HinduSolarOptions.hpp
  Copyright © 2010 David M. Anderson

  HinduSolarOptions class: options (versions) for Hindu Solar calendars.
*/


#include "CalendarService.hpp"
#include <string>


namespace EpsilonDelta
{                                                      //namespace EpsilonDelta

//*****************************************************************************


class HinduSolarOptions
{
public:
    static void Set( );
    static std::string Get( CalendarService::Format format );
    static std::string GetAvailable( CalendarService::Format format );
};


//*****************************************************************************

}                                                      //namespace EpsilonDelta

#endif //HINDUSOLAROPTIONS_HPP
