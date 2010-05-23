# - Find FastCGI
# Find the FastCGI (version 3) includes and library
# This module defines
#  FastCGI_FOUND, If false, do not try to use FastCGI.
#  FastCGI_INCLUDE_DIR, where to find fcgi_stdio.h, etc.
#  FastCGI_LIBRARIES, the libraries needed to use FastCGI.

find_path( FastCGI_INCLUDE_DIR fcgi_stdio.h)

set( FastCGI_NAMES  ${FastCGI_NAMES} fcgi )
find_library( FastCGI_LIBRARIES  NAMES ${FastCGI_NAMES} )

find_package_handle_standard_args( FastCGI  DEFAULT_MSG
                                   FastCGI_LIBRARIES  FastCGI_INCLUDE_DIR )
set( FastCGI_FOUND ${FASTCGI_FOUND} )

mark_as_advanced( FastCGI_LIBRARIES  FastCGI_INCLUDE_DIR )
