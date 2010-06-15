#
# CMakeLists.txt
# Copyright (C) 2009 David M. Anderson
#
# CMake script for WorldWideCalendar CGI server
#
#

set( sources
     WorldWideCalendar.cpp
     MayanCalendarService.cpp
     ChineseCalendarService.cpp
     HinduLunisolarCalendarService.cpp
     FrenchRevolutionaryCalendarService.cpp
     BadiCalendarService.cpp
     HinduSolarOptions.cpp
     PersianOptions.cpp
   )

set( EpsilonDeltaLibs
     calendar astro time math cgi util
   )
set( libs "" )
foreach( lib ${EpsilonDeltaLibs} )
    include_directories( "${EpsilonDelta_INCLUDE_DIR}/${lib}" )
    set( libs  ${libs} "EpsilonDelta_${lib}" )
endforeach( lib )

if ( useFastCGI )
    set( libs  ${libs} ${FastCGI_LIBRARIES} )
endif ( useFastCGI )

add_executable( WorldWideCalendar  ${sources} )
target_link_libraries( WorldWideCalendar  ${libs} )
