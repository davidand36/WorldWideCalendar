/*
    EpsilonDelta.js
    Copyright © 2010 David M. Anderson

    εδ global object: a "namespace" for our functions and objects.
    Some generally useful functions:
    ReflectAsHTML returns a string describing the item.
    ErrorHandler returns an object with methods for reporting errors.
*/


var εδ = { };


//*****************************************************************************


εδ.ReflectAsHTML = function ReflectAsHTML( item, depth )
{
    var recursionLimit = 3;
    depth = depth || 0;
    if ( depth > recursionLimit )
        return '(recursion limit reached)';
    if ( item === undefined )
        return '(undefined)';
    if ( item === null )
        return '(null)';
    if ( typeof item === 'number' )
        return item.toString();
    if ( typeof item === 'string' )
        return item;
    if ( typeof item === 'boolean' )
        return item ? 'true' : 'false';
    if ( typeof item === 'function' )
        return '(function)';
    if ( typeof item === 'object' )
    {
        if ( Object.prototype.toString.apply( item ) === '[object Array]' )
        {
            var html = '<ol>\n';
            var i;
            for ( i = 0; i < item.length; ++i )
                html += '<li>[' + i.toString() + '] ' +
                    ReflectAsHTML( item[ i ], depth + 1 ) + '</li>\n';
            html += '</ol>\n';
            return html;
        }
        var html = Object.prototype.toString.apply( item );
        html += '<ul>\n';
        var propName;
        for ( propName in item )
        {
            if ( item.hasOwnProperty( propName ) )
            {
                if ( typeof item[ propName ] != 'function' )
                {
                    html += '<li>' + propName + ': ' +
                        ReflectAsHTML( item[ propName ], depth + 1 ) +
                        '</li>\n';
                }
            }
        }
        html += '</ul>\n';
        return html;
    }
    return '(unknown type)';
};


//*****************************************************************************


εδ.ErrorHandler = function( spec )
{                                                             //εδ.ErrorHandler
//-----------------------------------------------------------------------------
/*
  Returns an object with these methods:
      ReportError( [string] errorMsg )
      ClearError( )
      ReportJSError( [string] errorMsg, [string] url, [int] line )
      ReportAJAXError( )
*/
//-----------------------------------------------------------------------------

    var theObject = { },
        messageElementName = spec.messageElementName;

//-----------------------------------------------------------------------------

    theObject.ReportError = function( errorMsg )
    {
        $(messageElementName).html( errorMsg );
        $(messageElementName).show( );
        window.scrollTo( 0, 0 );
    };

//.............................................................................

    theObject.ClearError = function( )
    {
        $(messageElementName).hide( );
        $(messageElementName).html("");
    };
//.............................................................................

    theObject.ReportJSError = function( errorMsg, url, line )
    {
        var msg = 'An error occurred.<br />';
/*
        if ( arguments.length > 0 )
        {
            msg += "Arguments: <ul>";
            var i;
            for ( i = 0; i < arguments.length; ++i )
            {
                msg += "<li>" + εδ.ReflectAsHTML( arguments[ i ] ) + "</li>";
            }
            msg += "</ul>";
        }
*/
        theObject.ReportError(  msg );
/*
        var msg = 'An error occurred at ' +
            url + ' (' + line + ')<br />' +
            errorMsg;
        theObject.ReportError( msg );
*/
    };

//.............................................................................

    theObject.ReportAJAXError = function( ) //Arguments?
    {
        var msg = 'An AJAX error occurred.<br />';
        if ( arguments.length > 0 )
        {
            msg += "Arguments: <ul>";
            var i;
            for ( i = 0; i < arguments.length; ++i )
            {
                msg += "<li>" + εδ.ReflectAsHTML( arguments[ i ] ) + "</li>";
            }
            msg += "</ul>";
        }
        theObject.ReportError(  msg );
    };

//-----------------------------------------------------------------------------

    return theObject;
};                                                            //εδ.ErrorHandler


//*****************************************************************************


εδ.Math = { };

//-----------------------------------------------------------------------------

εδ.Math.ModP = function( dividend, divisor )
{
    var rem = dividend % divisor;
    if ( rem < 0 )
        rem += divisor;
    return rem;
};

//.............................................................................

εδ.Math.DivModP = function( dividend, divisor )
{
    var qr = { };
    qr.quotient = Math.floor( dividend / divisor );
    qr.remainder = dividend % divisor;
    if ( qr.remainder < 0 )
        qr.remainder += divisor;
    return qr;
};

//-----------------------------------------------------------------------------

εδ.Math.MakeFinite = function( num, fallback )
{
    if ( isNaN( num ) || ! isFinite( num ) )
        return fallback;
    return num;
};

//-----------------------------------------------------------------------------

εδ.Math.Clamp = function( num, min, max )
{
    if ( num < min )
        return min;
    if ( num > max )
        return max;
    return num;
};


//*****************************************************************************
