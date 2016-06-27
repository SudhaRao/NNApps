
/*
|--------------------------------------------------------------------------
| insite.login
|--------------------------------------------------------------------------
|
*/

insite.login = (function() {

  return {

    unid : null,

    username : null,


    /*
    |-----------------------------------
    | insite.login.init
    |-----------------------------------
    |
    */

    init : function()
    {

      // show login form
      insite.login.show_modal();

      // check browser
      insite.login.check_browser();

      // logout of non- .insite.spartannash.com sites
      insite.login.logouts();

      // check for message to user
      insite.login.check_cookie( 'LoginMsg' );

      // submit current view on enter
      jQuery( document ).on( 'keypress', function( e ) {
        if( e.which == 13 )
          jQuery( '.btn-submit:visible' ).trigger( 'click' );
      });

      // submit signin
      jQuery( document ).on( 'click', '.signin .btn-submit', function( e ) {
        e.preventDefault();
        insite.login.submit_signin();
      });




      // show user forgot
      jQuery( document ).on( 'click', '.signin .btn-forgot', function( e ) {
        e.preventDefault();
        insite.login.show_user_forgot();
        insite.login.hide_success();
      });

      // hide forgot
      jQuery( document ).on( 'click', '.forgot .btn-cancel', function( e ) {
        e.preventDefault();
        insite.login.hide_forgot();
        insite.login.hide_success();
      });

      // submit user forgot
      jQuery( document ).on( 'click', '.forgot.user .btn-submit', function( e ) {
        e.preventDefault();
        insite.login.submit_user_forgot();
      });

      // submit associate forgot
      jQuery( document ).on( 'click', '.forgot.associate .btn-submit', function( e ) {
        e.preventDefault();
        insite.login.submit_associate_forgot();
      });

      // submit reset forgot
      jQuery( document ).on( 'click', '.forgot.reset .btn-submit', function( e ) {
        e.preventDefault();
        insite.login.submit_reset_forgot();
      });





      // show associate signup
      jQuery( document ).on( 'click', '.signups .btn-associate', function( e ) {
        e.preventDefault();
        insite.login.show_associate_signup();
      });

      // hide associate signup
      jQuery( document ).on( 'click', '.signup .btn-cancel', function( e ) {
        e.preventDefault();
        insite.login.hide_success();
        insite.login.hide_associate_signup();
      });

      // submit associate signup
      jQuery( document ).on( 'click', '.signup.associate .btn-submit', function( e ) {
        e.preventDefault();
        insite.login.submit_associate_signup();
      });

      // submit associate signup
      jQuery( document ).on( 'click', '.signup.set .btn-submit', function( e ) {
        e.preventDefault();
        insite.login.submit_set_signup();
      });


      // goto partner signup
      jQuery( document ).on( 'click', 'a[href="/sctyform.nsf/F_MAIN_FORM?OpenForm"]', function( e ) {
        e.preventDefault();
        insite.login.goto_guest( this );
      });


      // goto terms
      jQuery( document ).on( 'click', 'a[href="/security.nsf/F_TERMS_OF_USE_VERBIAGE?OpenForm"]', function( e ) {
        e.preventDefault();
        insite.login.goto_guest( this );
      });



    },


    /*
    |-----------------------------------
    | insite.login.submit_signin
    |-----------------------------------
    |
    */

    submit_signin : function()
    {

      insite.login.hide_error();
      insite.login.hide_success();
      insite.login.hide_warning();

      // error out if empty, else trim whitespace
      if( jQuery( '#signin_username' ).val().length === 0 )
      {
        insite.login.show_error( 'signin_username', 'Please enter your Insite username.' );
        return;
      }
      else
        jQuery( '#signin_username' ).val( jQuery.trim( jQuery( '#signin_username' ).val() ) );

      // error out if empty, else trim whitespace
      if( jQuery( '#signin_password' ).val().length === 0 )
      {
        insite.login.show_error( 'signin_password', 'Please enter your Insite password.' );
        return;
      }
      else
        jQuery( '#signin_password' ).val( jQuery.trim( jQuery( '#signin_password' ).val() ) );

      jQuery( '#_CustomLoginForm' ).submit();

    },


    /*
    |-----------------------------------
    | insite.login.show_forgot
    |-----------------------------------
    |
    */

    show_user_forgot: function()
    {

      jQuery( '.row.signin' ).fadeOut( 'fast', function() {
        insite.login.hide_error();
        jQuery( '.row.forgot.user' ).fadeIn( 'fast', function() {

          if( ! insite.interface.is_touch() && ! jQuery( 'html.ie8' ).length )
            jQuery( '#forgot_username' ).focus();

        });
      });
    },


    /*
    |-----------------------------------
    | insite.login.submit_user_forgot
    |-----------------------------------
    |
    */

    submit_user_forgot: function()
    {
      insite.login.hide_error();
      insite.login.hide_warning();

      var username = jQuery( '#forgot_username' ).val();

      if( username.length === 0 )
      {
        insite.login.show_error( 'forgot_username', 'Please enter your Insite username.' );
        return;
      }

      jQuery( '.forgot.user .btn-submit .fa-spinner' ).show();

      var jqxhr = jQuery.ajax({
        type: 'GET',
        url: 'https://' + insite.hostname + '/security.nsf/A_WS_GET_USER_PWCHDT_JSON?OpenAgent',
        dataType: 'json',
        data: {
          userid: username
        }
      })
      .fail(function( json ) {
        insite.login.show_error( 'forgot_username', 'Something went wrong. Please contact Computer Support at 616-878-2480 for assistance.' );
        jQuery( '.forgot.user .btn-submit .fa-spinner' ).hide();
      })
      .done(function( json ) {

        if( json.user[ 0 ].up_password_change_allowed == 'true' )
          insite.login.process_user_forgot( username );
        else
        {
          insite.login.show_error( 'forgot_username', 'Please wait at least 15 minutes between password changes. Please contact Computer Support at 616-878-2480 if you require additional assistance.' );
          jQuery( '.forgot.user .btn-submit .fa-spinner' ).hide();
        }

      });

    },

    /*
    |-----------------------------------
    | insite.login.process_user_forgot
    |-----------------------------------
    |
    */

    process_user_forgot: function( username )
    {

      var jqxhr = jQuery.ajax({
        type: 'POST',
        url: 'https://' + insite.hostname + '/security.nsf/A_USER_FORGOTPW?OpenAgent',
        dataType: 'json',
        data: {
          Id: username
        }
      })
      .fail(function( json ) {

        insite.login.show_error( 'forgot_username', 'Something went wrong. Please contact Computer Support at 616-878-2480 for assistance.' );

      })
      .done(function( json ) {

        if( json.response[0].status == 'Success' )
        {

          if( json.response[0].return_code == 'resetSptnPassword' )
          {
            insite.login.show_associate_forgot();
          }
          else if( json.response[0].return_code == 'resetExtPassword' )
          {
            insite.login.hide_forgot();
            insite.login.show_success( 'Your new password has been emailed to you. Please contact Computer Support at 616-878-2480 if you require additional assistance.' );

            // record event
            insite.analytics.event( 'Login', 'Forgot Password', 'Partner Password Reset' );
          }
        }
        else
          insite.login.show_error( 'forgot_username', json.response[ 0 ].message );


      })
      .always(function(json) {
        jQuery( '.forgot.user .btn-submit .fa-spinner' ).hide();
      });


    },


    /*
    |-----------------------------------
    | insite.login.hide_forgot
    |-----------------------------------
    |
    */

    hide_forgot: function()
    {
      jQuery( '.row.forgot:visible' ).fadeOut( 'fast', function() {
        insite.login.hide_error();
        insite.login.hide_warning();
        insite.login.clear_form();
        jQuery( '.row.signin' ).fadeIn( 'fast', function() {

          if( ! insite.interface.is_touch() && ! jQuery( 'html.ie8' ).length )
            jQuery( '#signin_username' ).focus();

        });
      });
    },



    /*
    |-----------------------------------
    | insite.login.show_asscoiate_forgot
    |-----------------------------------
    |
    */

    show_associate_forgot: function()
    {
      jQuery( '.row.forgot:visible' ).fadeOut( 'fast', function() {
        insite.login.hide_error();
        insite.login.hide_warning();
        jQuery( '.row.forgot.associate' ).fadeIn( 'fast', function() {

          if( ! insite.interface.is_touch() && ! jQuery( 'html.ie8' ).length )
            jQuery( '#forgot_peoplesoftid' ).focus();

        });
      });
    },


    /*
    |-----------------------------------
    | insite.login.submit_asscoiate_forgot
    |-----------------------------------
    |
    */

    submit_associate_forgot: function()
    {

      insite.login.hide_error();
      insite.login.hide_warning();

      if( jQuery( '#forgot_peoplesoftid' ).val().length < 6 )
      {
        insite.login.show_error( 'forgot_peoplesoftid', 'Please enter your six digit PeopleSoft ID.' );
        return;
      }

      if( jQuery( '#forgot_zipcode' ).val().length < 4 )
      {
        insite.login.show_error( 'forgot_zipcode', 'Please enter your five digit home zip code.' );
        return;
      }

      if( jQuery( '#forgot_birthyear' ).val().length < 4 )
      {
        insite.login.show_error( 'forgot_birthyear', 'Please enter your four digit birth year.' );
        return;
      }

      if( jQuery( '#forgot_lastfourssn' ).val().length < 4 )
      {
        insite.login.show_error( 'forgot_lastfourssn', 'Please enter the last four digits of your Social Security number.' );
        return;
      }

      jQuery( '.forgot.associate .btn-submit .fa-spinner' ).show();
      var jqxhr = jQuery.ajax({
          type: 'POST',
          url: 'https://' + insite.hostname + '/security.nsf/A_USER_ACTIVATESPRTN?OpenAgent',
          dataType: 'json',
          data: {
            PeopleSoftId: jQuery( '#forgot_peoplesoftid' ).val(),
            ZipCode: jQuery( '#forgot_zipcode' ).val(),
            BirthYear: jQuery( '#forgot_birthyear' ).val(),
            LastFourSsn: jQuery( '#forgot_lastfourssn' ).val(),
            Task: 'pwd'
          }
      })
      .fail(function( json ) {

        insite.login.show_error( '', 'Something went wrong. Please contact Computer Support at 616-878-2480 for assistance.' );
        return;

      })
      .done(function( json ) {

        if( json.response[0].status == 'Success' )
        {
          insite.login.unid = json.response[0].unid;
          insite.login.show_reset_forgot();
          insite.login.show_success( 'Your identity has been verified.' );
        }
        else
          insite.login.show_error( '', 'Something went wrong. ' + json.response[0].message );

      })
      .always(function(json) {
        jQuery( '.forgot.associate .btn-submit .fa-spinner' ).hide();
      });;


    },


    /*
    |-----------------------------------
    | insite.login.show_reset_forgot
    |-----------------------------------
    |
    */

    show_reset_forgot: function()
    {
      jQuery( '.row.forgot:visible' ).fadeOut( 'fast', function() {
        insite.login.hide_error();
        insite.login.hide_warning();
        jQuery( '.row.forgot.reset' ).fadeIn( 'fast', function() {

          if( ! insite.interface.is_touch() && ! jQuery( 'html.ie8' ).length )
            jQuery( '#forgot_reset' ).focus();

        });
      });
    },


    /*
    |-----------------------------------
    | insite.login.submit_reset_forgot
    |-----------------------------------
    |
    */

    submit_reset_forgot : function()
    {

      insite.login.hide_error();
      insite.login.hide_success();
      insite.login.hide_warning();

      if( jQuery( '#forgot_reset' ).val().length < 6 )
      {
        insite.login.show_error( 'forgot_reset', 'Your password must be at least six characters.' );
        return;
      }

      if( ! isNaN( jQuery( '#forgot_reset' ).val().charAt( 0 ) ) )
      {
        insite.login.show_error( 'forgot_reset', 'Your password may not begin with a number.' );
        return;
      }

      if( jQuery( '#forgot_reset' ).val() != jQuery( '#forgot_reset_confirmation' ).val() )
      {
        insite.login.show_error( 'forgot_reset', 'Your password and confirmation do not match.' );
        return;
      }


      jQuery( '.forgot.reset .btn-submit .fa-spinner' ).show();
      var jqxhr = jQuery.ajax({
          type: 'POST',
          url: 'https://' + insite.hostname + '/security.nsf/A_USER_CHANGEPW?OpenAgent',
          dataType: 'json',
          data: {
            Unid: insite.login.unid,
            Pwd: jQuery( '#forgot_reset' ).val()
          }
      })
      .fail(function( json ) {

        insite.login.show_error( '', 'Something went wrong. Please contact Computer Support at 616-878-2480 for assistance.' );
        return;

      })
      .done(function( json ) {

        if( json.response[0].status == 'Success' )
        {
          insite.login.hide_forgot();
          insite.login.show_success( 'Your password has been reset. Please login below.' );

          // record event
          insite.analytics.event( 'Login', 'Forgot Password', 'Associate Password Reset' );

          // set cookie
          var e = new Date();
          e.setTime( e.getTime() + ( 10 * 60 * 1000 ) );
          jQuery.cookie( 'LoginRst', 'Please wait at least 15 minutes between password resets.',
            { epires: e,
              path: '/',
              domain: '.' + insite.domain
            });
        }
        else
        {
          insite.login.show_error( '', 'Something went wrong. ' + json.response[0].message );
        }

      })
      .always(function(json){
        jQuery( '.forgot.reset .btn-submit .fa-spinner' ).hide();
      });


    },










    /*
    |-----------------------------------
    | insite.login.show_associate_signup
    |-----------------------------------
    |
    */

    show_associate_signup: function()
    {
      jQuery( '.row.signin:visible, .row.forgot:visible' ).fadeOut( 'fast', function() {
        insite.login.hide_error();
        insite.login.hide_warning();
        jQuery( '.row.signup.associate' ).fadeIn( 'fast', function() {

          if( ! insite.interface.is_touch() && ! jQuery( 'html.ie8' ).length )
            jQuery( '#signup_peoplesoftid' ).focus();

        });
      });
    },



    /*
    |-----------------------------------
    | insite.login.hide_associate_signup
    |-----------------------------------
    |
    */

    hide_associate_signup: function()
    {
      jQuery( '.row.signup:visible' ).fadeOut( 'fast', function() {
        insite.login.hide_error();
        insite.login.hide_warning();
        insite.login.clear_form();
        jQuery( '.row.signin' ).fadeIn( 'fast', function() {

          if( ! insite.interface.is_touch() && ! jQuery( 'html.ie8' ).length )
            jQuery( '#signin_username' ).focus();

        });
      });
    },


    /*
    |-----------------------------------
    | insite.login.process_signup
    |-----------------------------------
    |
    */

    submit_associate_signup: function()
    {

      insite.login.hide_error();
      insite.login.hide_warning();

      if( jQuery( '#signup_peoplesoftid' ).val().length < 6 )
      {
        insite.login.show_error( 'signup_peoplesoftid', 'Please enter your six digit PeopleSoft ID.' );
        return;
      }

      if( jQuery( '#signup_zipcode' ).val().length < 4 )
      {
        insite.login.show_error( 'signup_zipcode', 'Please enter your five digit home zip code.' );
        return;
      }

      if( jQuery( '#signup_birthyear' ).val().length < 4 )
      {
        insite.login.show_error( 'signup_birthyear', 'Please enter your four digit birth year.' );
        return;
      }

      if( jQuery( '#signup_lastfourssn' ).val().length < 4 )
      {
        insite.login.show_error( 'signup_lastfourssn', 'Please enter the last four digits of your Social Security number.' );
        return;
      }

      if( ! jQuery( '#signup_terms' ).prop( 'checked' ) )
      {
        insite.login.show_error( 'signup_terms', 'You must accept the Insite Terms of Use.' );
        return;
      }

      jQuery( '.signup.associate .btn-submit .fa-spinner' ).show();

      var jqxhr = jQuery.ajax({
          type: 'POST',
          url: 'https://' + insite.hostname + '/security.nsf/A_USER_ACTIVATESPRTN?OpenAgent',
          dataType: 'json',
          data: {
            PeopleSoftId: jQuery( '#signup_peoplesoftid' ).val(),
            ZipCode: jQuery( '#signup_zipcode' ).val(),
            BirthYear: jQuery( '#signup_birthyear' ).val(),
            LastFourSsn: jQuery( '#signup_lastfourssn' ).val(),
            Task: 'verify'
          }
      })
      .fail(function( json ) {

        insite.login.show_error( '', json.response[0].message );
        return;

      })
      .done(function( json ) {

        if( json.response[0].status == 'Success' )
        {
          insite.login.unid = json.response[0].unid;
          insite.login.username = json.response[0].userid;
          insite.login.show_set_signup();
          insite.login.show_success( 'Your account is almost ready. You just need to set a password below.' );

          // record event
          insite.analytics.event( 'Login', 'Sign Up', 'Associate Profile Created' );

        }
        else
          insite.login.show_error( '', json.response[0].message );

      })
      .always(function(json) {
        jQuery( '.signup.associate .btn-submit .fa-spinner' ).hide();
      });


    },


    /*
    |-----------------------------------
    | insite.login.show_set_signup
    |-----------------------------------
    |
    */

    show_set_signup: function()
    {
      jQuery( '.row.signup:visible' ).fadeOut( 'fast', function() {
        insite.login.hide_error();
        insite.login.hide_warning();
        jQuery( '.row.signup.set' ).fadeIn( 'fast', function() {

          if( ! insite.interface.is_touch() && ! jQuery( 'html.ie8' ).length )
            jQuery( '#signup_set' ).focus();

        });
      });
    },



    /*
    |-----------------------------------
    | insite.login.submit_set_signup
    |-----------------------------------
    |
    */

    submit_set_signup : function()
    {

      insite.login.hide_error();
      insite.login.hide_success();
      insite.login.hide_warning();

      if( jQuery( '#signup_set' ).val().length < 6 )
      {
        insite.login.show_error( 'signup_set', 'Your password must be at least six characters.' );
        return;
      }

      if( ! isNaN( jQuery( '#signup_set' ).val().charAt( 0 ) ) )
      {
        insite.login.show_error( 'signup_set', 'Your password may not begin with a number.' );
        return;
      }

      if( jQuery( '#signup_set' ).val() != jQuery( '#signup_set_confirmation' ).val() )
      {
        insite.login.show_error( 'signup_set', 'Your password and confirmation do not match.' );
        return;
      }

      if( ! jQuery( '#signup_terms' ).prop( 'checked' ) )
      {
        insite.login.show_error( 'signup_terms', 'You must accept Insite\'s Terms of Use.' );
        return;
      }


      jQuery( '.signup.set .btn-submit .fa-spinner' ).show();
      var jqxhr = jQuery.ajax({
          type: 'POST',
          url: 'https://' + insite.hostname + '/security.nsf/A_USER_CHANGEPW?OpenAgent',
          dataType: 'json',
          data: {
            Unid: insite.login.unid,
            Pwd: jQuery( '#signup_set' ).val()
          }
      })
      .fail(function( json ) {

        insite.login.show_error( '', 'Something went wrong. Please contact Computer Support at 616-878-2480 for assistance.' );
        return;

      })
      .done(function( json ) {

        if( json.response[0].status == 'Success' )
        {
          insite.login.hide_associate_signup();
          insite.login.show_success( 'Thank you for signing up. Your new Insite username is <b>' + insite.login.username + '</b>. Please allow five minutes while we complete your setup. At which point, you may login below.' );

          // record event
          insite.analytics.event( 'Login', 'Sign Up', 'Associate Password Set' );
        }
        else
          insite.login.show_error( '', 'Something went wrong. ' + json.response[0].message );

      })
      .always(function( json ) {
        jQuery( '.signup.set .btn-submit .fa-spinner' ).show();
      });

    },



    /*
    |-----------------------------------
    | insite.login.goto_guest
    |-----------------------------------
    |
    */

    goto_guest: function( a )
    {
      var uri = 'https://' + insite.hostname + '/names.nsf?Login=$$LoginUserForm';
          uri+= '&Username=guest&Password=guest100';
          uri+= '&RedirectTo=' + jQuery( a ).attr( 'href' );

      if( jQuery( a ).attr( 'target' ) == '_blank' )
        window.open( uri );
      else
        window.location = uri;
    },



    /*
    |-----------------------------------
    | insite.login.show_modal
    |-----------------------------------
    |
    */

    show_modal: function()
    {

      jQuery( '.login .modal' ).modal({
        keyboard: false
      }).css( 'background-image', 'url(' + insite.cdn + '/img/login-bg-' + ( Math.round( Math.random() * 1 ) + 1 ) + '.jpg)' );

      jQuery( '.login .modal' ).on( 'hide.bs.modal', function (e) {
        e.preventDefault();
      });

      if( ! insite.interface.is_touch() && ! jQuery( 'html.ie8' ).length )
        setTimeout( function() { jQuery( '#signin_username' ).focus() }, 500 );

    },

    /*
    |-----------------------------------
    | insite.login.check_browser
    |-----------------------------------
    |
    */

    check_browser : function()
    {

      if( jQuery( 'html.ie6' ).length || jQuery( 'html.ie7' ).length )
      {
        var msg = 'Your web browser is no longer supported.';
            msg+= ' Please update <a href="http://microsoft.com/ie">Internet Explorer</a>.';
            msg+= ' Alternatively, you may install and use either Google\'s <a href="http://google.com/chrome">Chrome</a>';
            msg+= ' or Mozilla\'s <a href="http://mozilla.org/firefox">Firefox</a> browser. Both are available without cost.';

            jQuery( '.error' ).show().find( '.alert' ).html( '<b>Uh oh!</b> ' + msg );
            jQuery( 'input, button' ).prop( 'disabled', true );
      }
      else if( jQuery( 'html.ie8' ).length )
      {
        var msg = 'You are using Internet Explorer 8. Beginning January 12, 2016, your web browser will <a href="http://support.microsoft.com/en-us/gp/microsoft-internet-explorer" target="_blank">no longer be supported</a>.';
            msg+= ' Please update <a href="http://microsoft.com/ie">Internet Explorer</a>.';
            msg+= ' Alternatively, you may install and use either Google\'s <a href="http://google.com/chrome">Chrome</a>';
            msg+= ' or Mozilla\'s <a href="http://mozilla.org/firefox">Firefox</a> browser. Both are available without cost.';

            jQuery( '.warning' ).show().find( '.alert' ).html( '<b>Warning!</b> ' + msg );
      }

    },


    /*
    |-----------------------------------
    | insite.login.check_cookie
    |-----------------------------------
    |
    */

    check_cookie : function( name )
    {
      var message = jQuery.cookie( name );

      if( message === undefined || message === 'undefined' || message === null )
        return;

      insite.login.show_warning( message );
      jQuery.removeCookie( name, { domain: '.' + insite.hostname } );

    },


    /*
    |-----------------------------------
    | insite.login.show_warning
    |-----------------------------------
    |
    */

    show_warning: function( message )
    {
      jQuery( '.warning' ).show().find( '.alert' ).html( '<b>Warning!</b> ' + message );
    },


    /*
    |-----------------------------------
    | insite.login.hide_success
    |-----------------------------------
    |
    */

    hide_warning: function()
    {
      jQuery( '.warning' ).hide().find( '.alert' ).html( '' );
    },


    /*
    |-----------------------------------
    | insite.login.show_success
    |-----------------------------------
    |
    */

    show_success: function( message )
    {
      jQuery( '.success' ).show().find( '.alert' ).html( '<b>Success!</b> ' + message );
    },

    /*
    |-----------------------------------
    | insite.login.hide_success
    |-----------------------------------
    |
    */

    hide_success: function()
    {
      jQuery( '.success' ).hide().find( '.alert' ).html( '' );
    },


    /*
    |-----------------------------------
    | insite.login.show_error
    |-----------------------------------
    |
    */

    show_error: function( field_id, message )
    {
      if( field_id != '' )
      {
        jQuery( '#' + field_id ).parents( '.form-group' ).addClass( 'has-error' );
        jQuery( '#' + field_id ).val( '' );

        if( ! insite.interface.is_touch() && ! jQuery( 'html.ie8' ).length )
          jQuery( '#' + field_id ).focus();
      }

      jQuery( '.error' ).show().find( '.alert' ).html( '<b>Oops!</b> ' + message );
    },


    /*
    |-----------------------------------
    | insite.login.hide_error
    |-----------------------------------
    |
    */

    hide_error: function()
    {
      jQuery( '.error' ).hide().find( '.alert' ).html( '' );
      jQuery( '.form-group' ).removeClass( 'has-error' );
    },


    /*
    |-----------------------------------
    | insite.login.hide_error
    |-----------------------------------
    |
    */

    clear_form: function()
    {
      jQuery( '.login input[type="text"], .login input[type="password"]' ).val( '' );
    },


    /*
    |-----------------------------------
    | insite.login.logouts
    |-----------------------------------
    |
    */

    logouts: function()
    {
      jQuery( '<iframe />', {
        width: '1',
        height: '1',
        src: 'https://sp2.spartanstores.com/names.nsf?Logout',
        style: 'display:none;'
      }).appendTo( 'body' );
    }



  };

}());
