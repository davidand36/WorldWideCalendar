#
# CMakeLists.txt
# Copyright (C) 2009 David M. Anderson
#
# Top-level CMake script for WorldWideCalendar CGI server
#
#
cmake_minimum_required( VERSION 2.6 )

project( WorldWideCalendar )

set( CMAKE_MODULE_PATH  ${CMAKE_MODULE_PATH} ${CMAKE_SOURCE_DIR}/CMakeModules )
include( CheckIncludeFile )
include( CheckLibraryExists )
include( FindPackageHandleStandardArgs )

if ( ${CMAKE_BUILD_TYPE} MATCHES Debug )
   add_definitions( -DDEBUG )
endif ( ${CMAKE_BUILD_TYPE} MATCHES Debug )

set ( useEpsilonDelta true )
if ( useEpsilonDelta )
    find_package( EpsilonDelta  REQUIRED )
    link_directories( ${EpsilonDelta_LIBRARY_DIR} )
endif ( useEpsilonDelta )

set( useBoost true )  #required, for now at least
if ( useBoost )
    find_package( Boost  REQUIRED )
    if ( Boost_FOUND )
        add_definitions( -DUSE_BOOST )
        include_directories( "${Boost_INCLUDE_DIRS}" )
    endif ( Boost_FOUND )
endif ( useBoost )

option( useFastCGI  "True to use FastCGI"  true )
if ( useFastCGI )
    find_package( FastCGI  REQUIRED )
    if ( FastCGI_FOUND )
        add_definitions( -DUSE_FASTCGI )
        include_directories( ${FastCGI_INCLUDE_DIR} )
    endif ( FastCGI_FOUND )
endif ( useFastCGI )

if ( ${MSVC} )
    add_definitions( -D_USE_MATH_DEFINES )
    add_definitions( -D_CRT_SECURE_NO_WARNINGS )
    add_definitions( -D_SCL_SECURE_NO_WARNINGS )
endif ( ${MSVC} )


set( LIBRARY_OUTPUT_PATH  ${CMAKE_SOURCE_DIR} )
set( EXECUTABLE_OUTPUT_PATH  ${CMAKE_SOURCE_DIR} )

add_subdirectory( "source" )

