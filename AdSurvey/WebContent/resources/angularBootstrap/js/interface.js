
/*
|--------------------------------------------------------------------------
| insite.interface
|--------------------------------------------------------------------------
|
*/

insite.interface = (function() {

  return {

    touchmove : false,


    /*
    |-----------------------------------
    | insite.interface.init
    |-----------------------------------
    |
    */

    init : function()
    {

      // back buttons
      jQuery( document ).on( 'click', '.btn-back', function(e) {
        e.preventDefault();
        window.history.back();
      });

      // for touch devices are we tapping or moving? moving
      jQuery( document ).on( 'touchmove', 'body', function() {
        insite.interface.touchmove = true;
      });

      // for touch devices are we tapping or moving? tapping
      jQuery( document ).on( 'touchstart', 'body', function() {
        insite.interface.touchmove = false;
      });


      // initialize page tooltips
      jQuery( '[data-toggle="tooltip"]' ).tooltip();


      // show environment flag
      insite.interface.show_envflag();

      // hide environment flag
      jQuery( document ).on( 'click', '.navbar.env i.fa-times-circle', function( e ) {
        insite.interface.hide_envflag();
      });

      // fix form bar if env bar is showing
      jQuery( document ).on( 'scroll', function() {
        if( jQuery( '.env.navbar' ).length && jQuery( '.sticky #OptionsBarWrapper' ).length )
          jQuery( '.sticky #OptionsBarWrapper' ).css( 'top', '30px' );
      });


    },




    /*
    |-----------------------------------
    | insite.interface.show_envflag
    |-----------------------------------
    |
    */

    show_envflag : function()
    {
      if( jQuery.cookie( 'LrvlHideEnvFlag' ) || window.self !== window.top )
        return;

      if( insite.env == 'local' )
        var text = 'Localhost';
      else if( insite.env == 'dev' )
        var text = 'Development';
      else if( insite.env == 'uat' )
        var text = 'User Acceptance Testing';
      else if( insite.env == 'prod' && jQuery( '#menu-user' ).attr( 'data-up_roles_assign' ) == 'SUPPORT' )
        var text = 'Production';
      else
        return;

      var navbar = '<nav class="env ' + insite.env + ' navbar navbar-default navbar-fixed-top">';
          navbar+= '<div class="container">' + text + '</div><i class="fa fa-fw fa-times-circle"></i>';
          navbar+= '</div>';

      jQuery( 'body' ).css( 'padding-top', '30px' ).append( navbar );

    },


    /*
    |-----------------------------------
    | insite.interface.hide_environment
    |-----------------------------------
    |
    */

    hide_envflag : function()
    {

      bootbox.dialog({
        message: 'Yes, hide the environment flag for the...',
        title: 'Hide Environment Flag?',
        buttons: {
          session: {
            label: 'Session',
            className: 'btn-default',
            callback: function() {
              jQuery( '.navbar.env' ).remove();
              jQuery( 'body' ).css( 'padding-top', '0px' );
              jQuery.cookie( 'LrvlHideEnvFlag', true, { domain: '.' + insite.hostname , path: '/' } );
              jQuery( '.sticky #OptionsBarWrapper' ).css( 'top', '0px' );
            }
          },
          page: {
            label: 'Page',
            className: 'btn-default',
            callback: function() {
              jQuery( '.navbar.env' ).remove();
              jQuery( 'body' ).css( 'padding-top', '0px' );
              jQuery( '.sticky #OptionsBarWrapper' ).css( 'top', '0px' );
            }
          }
        }
      });


    },



    /*
    |-----------------------------------
    | insite.interface.on_screen
    |-----------------------------------
    |
    */

    on_screen : function( element )
    {

      var window_top = jQuery( window ).scrollTop();
      var window_bot = window_top + jQuery( window ).height();

      var element_top = jQuery( element ).offset().top;
      var element_bot = element_top + jQuery( element ).height();

      return ( ( element_bot <= window_bot ) && ( element_top >= window_top ) );

    },



    /*
    |-----------------------------------
    | insite.interface.is_touch
    |-----------------------------------
    |
    */

    is_touch : function()
    {
      return 'ontouchstart' in window // works on most browsers
          || 'onmsgesturechange' in window; // works on ie10
    }

  };

}());
