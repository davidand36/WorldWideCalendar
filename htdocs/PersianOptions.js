/*
    PersianOptions.js
    Copyright © 2010 David M. Anderson
    WorldWideCalendar.info

    PersianOptions "class": options (methods) for Persian calendar.
*/


//*****************************************************************************


εδ.WWCal.PersianOptions = function( )
{                                                              //PersianOptions
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
    var methods = [];
    var method;

//=============================================================================

    theObject.HaveOptions = function( )
    {
        return methods.length > 0;
    };

//-----------------------------------------------------------------------------

    theObject.ProcessAvailableOptions = function( ajaxResponse )
    {
        var availableOptions = ajaxResponse.availableOptions;
        if ( availableOptions )
        {
            methods = availableOptions.methods;
            if ( methods.length > 0 )
                method = methods[ 0 ];
        }
    };

//-----------------------------------------------------------------------------

    theObject.AddAjaxData = function( ajaxData )
    {
        if ( method )
            ajaxData.method = method;
    };

//-----------------------------------------------------------------------------

    theObject.WriteFormHtml = function( )
    {
        var html = '';
        var i;
        if ( methods.length > 0 )
        {
            html +=
            '<label for="MethodList" class="DatePart">Method: </label>' +
            '<select class="DatePart" ' +
                'name="MethodList" id="MethodList">';
            for ( i = 0; i < methods.length; ++i )
            {
                html += '<option value="' + methods[i] + '">' +
                    methods[ i ] +
                    '</option>';
            }
            html += '</select>';
        }
        return html;
    };

//-----------------------------------------------------------------------------

    theObject.UpdateForm = function( )
    {
        if ( method )
            $('#MethodList').val( method );
    };

//-----------------------------------------------------------------------------

    theObject.HasFormChanged = function( )
    {
        return ($('#MethodList').val() != method);
    };

//-----------------------------------------------------------------------------

    theObject.GetFormData = function( )
    {
        method = $('#MethodList').val();
    };

//=============================================================================

    return theObject;

};                                                             //PersianOptions


//*****************************************************************************
