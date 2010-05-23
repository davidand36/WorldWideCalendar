#ifndef MAYANCALENDARSERVICE_HPP
#define MAYANCALENDARSERVICE_HPP
/*
  MayanCalendarService.hpp
  Copyright © 2010 David M. Anderson

  MayanCalendarService template class: Web service for the Mayan calendar.
*/


#include "CalendarService.hpp"
#include <string>


namespace EpsilonDelta
{                                                      //namespace EpsilonDelta

//*****************************************************************************


class MayanCalendarService
{
public:
    static std::string Respond( CalendarService::Action action,
                                std::string calendarName,
                                CalendarService::Format format );

private:
    static std::string DateToJD( std::string calendarName,
                                 CalendarService::Format format );
    static std::string JDToDate( std::string calendarName,
                                 CalendarService::Format format );
    static std::string Names( std::string calendarName,
                                     CalendarService::Format format );
    static std::string HaabMonthLength( std::string calendarName,
                                        CalendarService::Format format );
};


//*****************************************************************************

}                                                      //namespace EpsilonDelta

#endif //MAYANCALENDARSERVICE_HPP
