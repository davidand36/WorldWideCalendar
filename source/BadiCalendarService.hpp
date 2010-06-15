#ifndef BADICALENDARSERVICE_HPP
#define BADICALENDARSERVICE_HPP
/*
  BadiCalendarService.hpp
  Copyright © 2010 David M. Anderson

  BadiCalendarService class: Web service for the Badi calendar.
*/


#include "CalendarService.hpp"
#include <string>


namespace EpsilonDelta
{                                                      //namespace EpsilonDelta

//*****************************************************************************


class BadiCalendarService
{
public:
    static std::string Respond( CalendarService::Action action,
                                std::string calendarName,
                                CalendarService::Format format );

private:
    static std::string Names( std::string calendarName,
                              CalendarService::Format format );
    static std::string DateToJD( std::string calendarName,
                                 CalendarService::Format format );
    static std::string JDToDate( std::string calendarName,
                                 CalendarService::Format format );
    static std::string MonthData( std::string calendarName,
                                  CalendarService::Format format );
};


//*****************************************************************************

}                                                      //namespace EpsilonDelta

#endif //BADICALENDARSERVICE_HPP
