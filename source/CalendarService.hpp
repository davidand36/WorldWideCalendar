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
    AvailableOptions,
    Names,
    DateToJD,
    JDToDate,
    MonthData,
    SolarTerms,
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
