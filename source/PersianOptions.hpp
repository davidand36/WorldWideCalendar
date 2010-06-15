#ifndef PERSIANOPTIONS_HPP
#define PERSIANOPTIONS_HPP
/*
  PersianOptions.hpp
  Copyright © 2010 David M. Anderson

  PersianOptions class: options (methods) for Persian calendar.
*/


#include "CalendarService.hpp"
#include <string>


namespace EpsilonDelta
{                                                      //namespace EpsilonDelta

//*****************************************************************************


class PersianOptions
{
public:
    static void Set( );
    static std::string Get( CalendarService::Format format );
    static std::string GetAvailable( CalendarService::Format format );
};


//*****************************************************************************

}                                                      //namespace EpsilonDelta

#endif //PERSIANOPTIONS_HPP
