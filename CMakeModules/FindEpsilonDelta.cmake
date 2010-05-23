# - Find EpsilonDelta
# Find the EpsilonDelta includes and library
# This module defines
#  EpsilonDelta_FOUND, If false, do not try to use EpsilonDelta.
#  EpsilonDelta_INCLUDE_DIR, where to find util/VMap.hpp, etc.
#  EpsilonDelta_LIBRARIES, the EpsilonDelta libraries.

find_path( EpsilonDelta_INCLUDE_DIR
  NAMES util/VMap.hpp
  PATHS ~/Projects/libEpsilonDelta  /Projects/libEpsilonDelta )

set( EpsilonDelta_NAMES
     ${EpsilonDelta_NAMES} EpsilonDelta_util )
find_library( EpsilonDelta_LIBRARIES
  NAMES ${EpsilonDelta_NAMES}
  PATHS ~/Projects/libEpsilonDelta  /Projects/libEpsilonDelta )
#This doesn't seem to work.
get_filename_component( EpsilonDelta_LIBRARY_DIR  EpsilonDelta_LIBRARIES
  PATH  CACHE )

find_package_handle_standard_args( EpsilonDelta  DEFAULT_MSG
  EpsilonDelta_LIBRARIES  EpsilonDelta_INCLUDE_DIR )
set( EpsilonDelta_FOUND  ${EPSILONDELTA_FOUND} )

mark_as_advanced( EpsilonDelta_INCLUDE_DIR
  EpsilonDelta_LIBRARY_DIR  EpsilonDelta_LIBRARIES )
