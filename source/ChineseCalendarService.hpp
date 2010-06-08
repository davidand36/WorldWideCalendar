#ifndef CHINESECALENDARSERVICE_HPP
#define CHINESECALENDARSERVICE_HPP
/*
  ChineseCalendarService.hpp
  Copyright © 2010 David M. Anderson

  ChineseCalendarService class: Web service for the Chinese calendar.
*/


#include "CalendarService.hpp"
#include <string>


namespace EpsilonDelta
{                                                      //namespace EpsilonDelta

//*****************************************************************************


class ChineseCalendarService
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
    static std::string MonthLength( std::string calendarName,
                                    CalendarService::Format format );
    static std::string SolarTerms( std::string calendarName,
                                   CalendarService::Format format );
};


//*****************************************************************************

}                                                      //namespace EpsilonDelta

#endif //CHINESECALENDARSERVICE_HPP
