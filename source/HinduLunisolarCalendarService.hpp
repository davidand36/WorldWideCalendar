#ifndef HINDULUNISOLARCALENDARSERVICE_HPP
#define HINDULUNISOLARCALENDARSERVICE_HPP
/*
  HinduLunisolarCalendarService.hpp
  Copyright © 2010 David M. Anderson

  HinduLunisolarCalendarService class: Web service for the Hindu lunisolar
  calendar.
*/


#include "CalendarService.hpp"
#include <string>


namespace EpsilonDelta
{                                                      //namespace EpsilonDelta

//*****************************************************************************


class HinduLunisolarCalendarService
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


//*****************************************************************************

}                                                      //namespace EpsilonDelta

#endif //HINDULUNISOLARCALENDARSERVICE_HPP
