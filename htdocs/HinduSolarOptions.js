/*
    HinduSolarOptions.js
    Copyright © 2010 David M. Anderson
    WorldWideCalendar.info

  HinduSolarOptions "class": options (versions) for Hindu Solar calendars.
*/


//*****************************************************************************


εδ.WWCal.HinduSolarOptions = function( )
{                                                           //HinduSolarOptions
//-----------------------------------------------------------------------------
/*
  Returns an object with these methods:
      boolean HaveOptions( )
      ProcessAvailableOptions( ajaxResponse )
      AddAjaxData( ajaxData )
      string WriteFormHtml( )
      UpdateForm( )
      boolean HasFormChanged( )
      GetFormData( )
*/
//-----------------------------------------------------------------------------

    var theObject = { };
    var versions = [];
    var version;

//=============================================================================

    theObject.HaveOptions = function( )
    {
        return versions.length > 0;
    };

//-----------------------------------------------------------------------------

    theObject.ProcessAvailableOptions = function( ajaxResponse )
    {
        var availableOptions = ajaxResponse.availableOptions;
        if ( availableOptions )
        {
            versions = availableOptions.versions;
            if ( versions.length > 0 )
                version = versions[ 0 ];
        }
    };

//-----------------------------------------------------------------------------

    theObject.AddAjaxData = function( ajaxData )
    {
        if ( version )
            ajaxData.version = version;
    };

//-----------------------------------------------------------------------------

    theObject.WriteFormHtml = function( )
    {
        var html = '';
        var i;
        if ( versions.length > 0 )
        {
            html +=
            '<label for="VersionList" class="DatePart">Version: </label>' +
            '<select class="DatePart" ' +
                'name="VersionList" id="VersionList">';
            for ( i = 0; i < versions.length; ++i )
            {
                html += '<option value="' + versions[i] + '">' +
                    versions[ i ] +
                    '</option>';
            }
            html += '</select>';
        }
        return html;
    };

//-----------------------------------------------------------------------------

    theObject.UpdateForm = function( )
    {
        if ( version )
            $('#VersionList').val( version );
    };

//-----------------------------------------------------------------------------

    theObject.HasFormChanged = function( )
    {
        return ($('#VersionList').val() != version);
    };

//-----------------------------------------------------------------------------

    theObject.GetFormData = function( )
    {
        version = $('#VersionList').val();
    };

//=============================================================================

    return theObject;

};                                                          //HinduSolarOptions


//*****************************************************************************
