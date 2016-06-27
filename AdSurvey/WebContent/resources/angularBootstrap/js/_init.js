
/*
|--------------------------------------------------------------------------
| insite
|--------------------------------------------------------------------------
|
*/

  if ( typeof jQuery === 'undefined' ) {
    throw new Error( 'Insite requires jQuery' );
  }

  insite = typeof insite !== 'undefined' ? insite : {};

  // set the host name and cdn
  if( window.location.hostname == 'localhost' )
  {
    insite.env = 'local';
    insite.hostname = window.location.hostname + ':' + window.location.port;
    insite.cdn = '/assets'
  }
  else
  {
    insite.hostname = window.location.hostname;

    if( insite.hostname == 'insite.spartannash-dev.com' || insite.hostname == 'dev.spartanstores.com' )
    {
      insite.env = 'dev';
      insite.cdn = 'https://cdn.spartannash-dev.com/insitemino';
    }
    else if( insite.hostname == 'insite.spartannash-uat.com' || insite.hostname == 'uat.spartanstores.com' )
    {
      insite.env = 'uat';
      insite.cdn = 'https://cdn.spartannash-uat.com/insitemino';
    }
    else
    {
      insite.env = 'prod';
      insite.cdn = 'https://cdn.spartannash.com/insitemino';
    }

  }



  /*
  |-----------------------------------
  | inits
  |-----------------------------------
  |
  */

  jQuery( document ).ready( function() {

    // google analytics
    insite.analytics.init();

    // interface
    insite.interface.init();

    // menus
    if( ! jQuery( '.row.login' ).length )
    {
      insite.menus.init();
      insite.quicklinks.init();
    }

    // cart
    if( jQuery( '#menu-user li.user-cart' ).length )
      insite.cart.init();

    // forms
    insite.forms.init();

    // login
    if( jQuery( '.row.login' ).length )
      insite.login.init();

  });
