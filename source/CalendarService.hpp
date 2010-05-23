#ifndef CALENDARSERVICE_HPP
#define CALENDARSERVICE_HPP
/*
  CalendarService.hpp
  Copyright © 2010 David M. Anderson

  CalendarService namespace: definitions for Web service
*/


namespace EpsilonDelta
{                                                      //namespace EpsilonDelta

//*****************************************************************************


namespace CalendarService
{

enum Action
{
    ListCalendars,
    DateToJD,
    JDToDate,
    Names,
    WeekdayNames,
    MonthNames,
    MonthLength,
    NumActions
};

enum Format
{
    JSON,
    NumFormats
};

}


//*****************************************************************************

}                                                      //namespace EpsilonDelta

#endif //CALENDARSERVICE_HPP
