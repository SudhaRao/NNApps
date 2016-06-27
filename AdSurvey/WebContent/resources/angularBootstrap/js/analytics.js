
/*
|--------------------------------------------------------------------------
| insite.analytics
|--------------------------------------------------------------------------
|
*/

insite.analytics = (function() {

  return {

    property_id : null,
    user_id : null,
    cookie_domain : 'auto',



    /*
    |-----------------------------------
    | insite.analytics.init
    |-----------------------------------
    |
    */

    init : function()
    {

      // set property_id
      if( window.location.hostname == 'insite.spartannash-uat.com' )
        insite.analytics.property_id = 'UA-33272186-1';
      else if( window.location.hostname == 'insite.spartannash-dev.com' )
        insite.analytics.property_id = 'UA-33272186-4';
      else
        insite.analytics.property_id = 'UA-33272186-3';

      // let GA run on localhost
      if( document.domain == 'localhost' )
        insite.analytics.cookie_domain = 'none';

      // set user_id
      // if( jQuery( '#up_doc_unid' ).length )
      //   insite.analytics.user_id = jQuery( '#up_doc_unid' ).attr( 'data-value' );

      // track pageview
      insite.analytics.pageview();

    },



    /*
    |-----------------------------------
    | insite.analytics.pageview
    |-----------------------------------
    |
    */

    pageview : function()
    {
      // only record pageview if top window
      if( window.self !== window.top )
        return;

      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      if( insite.analytics.user_id !== null )
        ga('create', insite.analytics.property_id, { 'userId' : insite.analytics.user_id, 'cookieDomain' : insite.analytics.cookie_domain } );
      else
        ga('create', insite.analytics.property_id, insite.analytics.cookie_domain );

      ga('send', 'pageview');

    },



    /*
    |-----------------------------------
    | insite.analytics.event
    |-----------------------------------
    |
    */
    event : function( category, action, label, value )
    {
      if( typeof label !== 'undefined' && typeof value !== 'undefined' )
        ga( 'send', 'event', category, action, label, value );
      else if( typeof label !== 'undefined' && typeof value === 'undefined' )
        ga( 'send', 'event', category, action, label );
      else
        ga( 'send', 'event', category, action );
    }

  };

}());
