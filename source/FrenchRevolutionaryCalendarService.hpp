#ifndef FRENCHREVOLUTIONARYCALENDARSERVICE_HPP
#define FRENCHREVOLUTIONARYCALENDARSERVICE_HPP
/*
  FrenchRevolutionaryCalendarService.hpp
  Copyright © 2010 David M. Anderson

  FrenchRevolutionaryCalendarService class: Web service for the French
  Revolutionary calendar.
*/


#include "CalendarService.hpp"
#include <string>


namespace EpsilonDelta
{                                                      //namespace EpsilonDelta

//*****************************************************************************


class FrenchRevolutionaryCalendarService
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

#endif //FRENCHREVOLUTIONARYCALENDARSERVICE_HPP
