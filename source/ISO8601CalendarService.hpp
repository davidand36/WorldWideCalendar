#ifndef ISO8601CALENDARSERVICE_HPP
#define ISO8601CALENDARSERVICE_HPP
/*
  ISO8601CalendarService.hpp
  Copyright © 2010 David M. Anderson

  ISO8601CalendarService class: Web service for the ISO 8601 calendar.
*/


#include "CalendarService.hpp"
#include <string>


namespace EpsilonDelta
{                                                      //namespace EpsilonDelta

//*****************************************************************************


class ISO8601CalendarService
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
};


//*****************************************************************************

}                                                      //namespace EpsilonDelta

#endif //ISO8601CALENDARSERVICE_HPP
