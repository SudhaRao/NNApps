
/*
|--------------------------------------------------------------------------
| insite.menus
|--------------------------------------------------------------------------
|
*/

insite.menus = (function() {

  return {

    /*
    |-----------------------------------
    | insite.menus.init
    |-----------------------------------
    |
    */

    init : function()
    {

      if( window.self !== window.top )
        return;

      // toggle #menu-side kid
      jQuery(document).on('click', '#menu-side ul > li > span', function(e) {
        e.preventDefault();
				insite.menus.toggle_side_kid( this );
			});

      // build our menus
      insite.menus.build();

      // handle opened #menu-app kid
      insite.menus.prep_app_kid();

      // toggle #menu-app kid
      jQuery( document ).on( 'click', '#menu-app .menu-toggle', function(e) {
        e.preventDefault();
        insite.menus.toggle_app_kid( this );
      });

      // show/hide back to top link
      insite.menus.toggle_back_top();

      // show stock price in user menu
      insite.menus.get_user_stock();

      // keep menus on the screen
      jQuery( document ).on( 'click', 'a.dropdown-toggle', function( e ) {
        insite.menus.onscreen_main_drops( this );
      });

      // animate back to top
      jQuery(document).on('click', 'a[href="#top"]', function(e) {
        e.preventDefault();
        insite.menus.go_back_top();
      });

      //
      jQuery(document).on('click', 'a.btn-menu-app', function(e) {
        jQuery( '#menu-app' ).removeClass( 'closed' ).addClass( 'opened' );
      });

      jQuery(document).on('click', '#menu-app a[href="#top"]', function(e) {
        jQuery( '#menu-app' ).addClass( 'closed' ).removeClass( 'opened' );
      });

      if( jQuery( 'html.ie8' ).length )
        insite.menus.ie_hacks();

    },


    /*
    |-----------------------------------
    | insite.menus.build
    |-----------------------------------
    |
    */

    build : function()
    {

      // Double encode the username just in case it contains any '/'
      // characters. Otherwise, Apache treats the single encoded slash
      // as a directory separator.

      var userid = jQuery( '#up_doc_unid' ).attr( 'data-value' );

      if( userid == 'guest' || userid == 'Anonymous' || userid == '' || typeof userid === 'undefined' )
        return;

      url = 'https://' + insite.hostname + '/extras/menus/user/';
      url+= encodeURIComponent( encodeURIComponent( userid ) );

      jQuery.getJSON( url, function( json ) {

        //jQuery( '#menu-main' ).html( jQuery( '<div/>' ).html( json.menu.main ).text() );
        jQuery( '#menu-main' ).html( json.menu.main );

        jQuery( '#menu-side' ).html( json.menu.side );

        jQuery( '#menu-foot' ).html( json.menu.foot );

      })
      .done(function() {
        // set #menu-main dropdown widths
        insite.menus.prep_main_cols();

        // set feedback link
        jQuery( 'a#feedback-nsf' ).attr( 'href', '/feedback.nsf/F_MAIN_FORM?OpenForm&db=' + encodeURIComponent( window.location.pathname ) );
      });



    },



    /*
    |-----------------------------------
    | insite.menus.prep_main_cols
    |-----------------------------------
    |
    */

    prep_main_cols : function()
    {

      jQuery( '#menu-main .dropdown-menu .row:first-child' ).each(function() {

        // remove any empty columns
        jQuery( this ).children( 'div' ).each(function() {
          if( ! jQuery.trim( jQuery( this ).html() ) )
            jQuery( this ).remove();
        });

        cols = jQuery( this ).children( 'div' ).length;

        jQuery( this ).css( 'width', ( 240 * cols ) + 'px' );

        jQuery( this ).find( 'div' ).each(function() {
          jQuery( this ).addClass( 'col-md-' + Math.floor( (12/cols) ) );
        });

      });

    },


    /*
    |-----------------------------------
    | insite.menus.onscreen_main_drops
    |-----------------------------------
    |
    */

    onscreen_main_drops : function( toggle )
    {

      var dropdown = jQuery( toggle ).parent( 'li.dropdown' ).find( 'ul.dropdown-menu' );
      var offset = jQuery( dropdown ).offset();

      if( offset.left + dropdown.width() > jQuery( window ).width() )
      {
        var moved = jQuery( window ).width() - ( offset.left + dropdown.width() + 20 );
        dropdown.css( { left: moved } );
      }

    },


    /*
    |-----------------------------------
    | insite.menus.prep_app_kid
    |-----------------------------------
    |
    */

    prep_app_kid : function()
    {

      jQuery( '#menu-app li li.active' ).parents( 'ul' )
        .css( 'display', 'block' );

      jQuery( '#menu-app li li.active' ).parents( 'li' )
        .addClass( 'open' )
        .find( 'i' )
        .removeClass( 'fa-caret-right' )
        .addClass( 'fa-caret-down' );

    },


    /*
    |-----------------------------------
    | insite.menus.toggle_app_kid
    |-----------------------------------
    |
    */

    toggle_app_kid : function( mom )
    {

      if( jQuery( mom ).parent( 'li' ).hasClass( 'open' ) )
      {
        jQuery( mom ).parent( 'li' ).removeClass( 'open' );
        jQuery( mom ).parent( 'li' ).find( 'ul[role="menu"]' ).slideUp();
        jQuery( mom ).find( 'i' ).removeClass( 'fa-caret-down' ).addClass( 'fa-caret-right' );
      }
      else
      {
        // close other menus
        jQuery( '#menu-app .menu-toggle i' ).removeClass( 'fa-caret-down' ).addClass( 'fa-caret-right' );
        jQuery( mom ).parent( 'li' ).siblings().find( 'ul[role="menu"]' ).slideUp();
        jQuery( mom ).parent( 'li' ).siblings().removeClass( 'open' );
        // open this menu
        jQuery( mom ).find( 'i' ).addClass( 'fa-caret-down' ).removeClass( 'fa-caret-right' );
        jQuery( mom ).parent( 'li' ).find( 'ul[role="menu"]' ).slideDown();
        jQuery( mom ).parent( 'li' ).addClass( 'open' );
      }

    },



    /*
    |-----------------------------------
    | insite.menus.toggle_side_kid
    |-----------------------------------
    |
    */

    toggle_side_kid : function( mom )
    {

      if( jQuery( mom ).parent('li').find( '>ul' ).is( ':visible' ) )
      {
        jQuery( mom ).find( 'i' ).removeClass( 'fa-caret-down' ).addClass( 'fa-caret-right' );
        jQuery( mom ).parent('li').find( '>ul' ).slideUp();
      }
      else
      {
        jQuery( mom ).parent( 'li' ).siblings().find( 'ul:visible' ).slideUp( function() {
          jQuery( this ).parent( 'li' ).find('i.fa-caret-down').removeClass( 'fa-caret-down' ).addClass( 'fa-caret-right' );
        });

        jQuery( mom ).find( 'i' ).removeClass( 'fa-caret-right' ).addClass( 'fa-caret-down' );
        jQuery( mom ).parent('li').find( '>ul' ).slideDown();
      }

    },


    /*
    |-----------------------------------
    | insite.menus.get_user_stock
    |-----------------------------------
    |
    */

    get_user_stock : function()
    {
      var url = 'https://' + insite.hostname + '/extras/widgets/stock/SPTN';

      jQuery.getJSON( url, function( json ) {

        jQuery( '#menu-user .sptn-stock .ask' ).html( json.stock.last_trade.price );
        jQuery( '#menu-user .sptn-stock .change' ).removeClass( 'up down' ).html( json.stock.change.price );

        if( json.stock.change.percent !== null )
        {
          if( json.stock.change.percent.charAt( 0 ) == '+' )
            jQuery( '#menu-user .sptn-stock .change' ).addClass( 'up' );
          else
            jQuery( '#menu-user .sptn-stock .change' ).addClass( 'down' );
        }

      });

    },



    /*
    |-----------------------------------
    | insite.menus.toggle_back_top
    |-----------------------------------
    |
    */

    toggle_back_top : function()
    {

      jQuery( window ).scroll(function () {

        clearTimeout( jQuery.data( this, 'scrollTimer' ) ) ;

        jQuery.data(this, 'scrollTimer', setTimeout(function() {
          jQuery('#back-top').fadeOut();
        }, 2500));

        if ( jQuery(this).scrollTop() > 100 )
          jQuery('#back-top').fadeIn();
        else
          jQuery('#back-top').fadeOut();

      });

    },



    /*
    |-----------------------------------
    | insite.menus.go_back_top
    |-----------------------------------
    |
    */

    go_back_top : function()
    {

      jQuery('body,html').animate({
        scrollTop: 0
      }, 400);

    },

    /*
    |-----------------------------------
    | insite.menus.ie_hacks
    |-----------------------------------
    |
    */
    ie_hacks : function()
    {
      jQuery( '#menu-user .menu-items ul li:last-child' ).css( 'border-right', '0' );

      jQuery( '#menu-user .cart-popover .row div:last-child' ).css( 'border-right', '0' );

      jQuery( '#menu-main .navbar-nav >li.dropdown:last-child .dropdown-menu' ).css( 'right', '0' );

      jQuery( '#menu-main .navbar-nav >li.dropdown:last-child >a' )
        .css( 'padding-left', '0' )
        .css( 'padding-right', '0' );

    }

  };

}());
