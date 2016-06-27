
/*
|--------------------------------------------------------------------------
| insite.forms
|--------------------------------------------------------------------------
|
*/

insite.forms = (function() {

  return {


    /*
    |-----------------------------------
    | insite.forms.init
    |-----------------------------------
    |
    */

    init : function()
    {

      // static buttons
      jQuery( window ).scroll(function() {
        insite.forms.static_buttons();
      });



      // tooltips
      jQuery( '.form [data-toggle="tooltip"]' ).tooltip();

      // datepickers
      jQuery( '.form [data-toggle="datepicker"]' ).datepicker({
        autoclose : true,
        orientation: 'right',
        clearBtn: true
      });

      // lookups
      jQuery( document ).on( 'focus', '.form [data-toggle="lookup"]', function(e) {
        insite.forms.lookup( this );
      });

      // submit
      jQuery( document ).on( 'click', '.form button[type="submit"]', function(e) {
        e.preventDefault();
        insite.forms.validate( this );
      });

      // placeholders for old browsers
      jQuery( 'input, textarea' ).placeholder();

      // placeholders for selects
      jQuery( document ).on( 'change', '.form select', function(e) {
        insite.forms.selectholders( this );
      });

      // checkboxes, radios in ie8
      if( jQuery( 'html.ie8' ).length )
      {
        insite.forms.ie8_checkboxes();

        jQuery( document ).on( 'click', '.checkbox-group label', function() {
          insite.forms.ie8_checkbox( this );
        });
      }

    },


    /*
    |-----------------------------------
    | insite.forms.static_buttons
    |-----------------------------------
    |
    */

    static_buttons : function()
    {

      if( jQuery(window).scrollTop() > 145)
      {
        jQuery( '.button-control' ).css( 'position', 'fixed' )
          .css( 'display', 'block' )
          .css( 'background', 'rgba( 255, 255, 255, 0.9 )' )
          .css( 'border-bottom', '1px solid #ddd' )
          .css( 'top', '0' )
          .css( 'right', '0' )
          .css( 'margin-bottom', '0px' );

          jQuery( '.button-control .logo' ).css( 'display', 'block' );

      }
      else
      {
        jQuery( '.button-control' ).css( 'position', 'relative' )
          .css( 'display', 'inline' )
          .css( 'background', 'transparent' )
          .css( 'margin-bottom', '15px' );

          jQuery( '.button-control .logo' ).css( 'display', 'none' );
      }

    },


    /*
    |-----------------------------------
    | insite.forms.lookup
    |-----------------------------------
    |
    */

    lookup : function( input )
    {

      var iframe = jQuery( input ).attr( 'data-lookup-src' );
      var title = jQuery( input ).attr( 'data-lookup-title' );

      bootbox.dialog({
        message: '<iframe src="' + iframe + '" width="100%" height="500" frameborder="0" scrolling="no"></iframe>',
        title: title
      });


    },


    /*
    |-----------------------------------
    | insite.forms.selectholders
    |-----------------------------------
    |
    */

    selectholders : function( select )
    {
      if( jQuery( select ).find( 'option:selected' ).hasClass( 'selectholder' ) )
        jQuery( select ).css( 'color', '#d9d9d9' );
      else
        jQuery( select ).css( 'color', '#333' );
    },


    /*
    |-----------------------------------
    | insite.forms.validate
    |-----------------------------------
    |
    */
    validate : function( submit )
    {

      // clear all errors
      jQuery( '.form-group' ).removeClass( 'has-error' );
      jQuery( submit ).popover( 'destroy' );

      // show error on field
      jQuery( 'input[name="req-text"]' ).parents( '.form-group' ).addClass( 'has-error' );

      // show error at button
      jQuery( submit ).popover({
        html: true,
        content: '<h4 class="oops">Oops!</h4> Please be sure to complete all required fields.'
      }).popover( 'show' );

      setTimeout( function() {
        jQuery( submit ).popover( 'destroy' );
      }, 2500 );

    },


    /*
    |-----------------------------------
    | insite.forms.ie8_checkboxes
    |-----------------------------------
    |
    */

    ie8_checkboxes : function()
    {
      jQuery( '.checkbox-group input' ).each( function() {
        if( jQuery( this ).prop( 'checked' ) )
          jQuery( this ).addClass( 'checked' );
      });
    },


    /*
    |-----------------------------------
    | insite.forms.ie8_checkbox
    |-----------------------------------
    |
    */

    ie8_checkbox : function( label )
    {
      var input = jQuery( label ).find( 'input' );

      if( input.prop( 'checked' ) )
      {
        input.prop( 'checked', false );
        input.removeClass( 'checked' );
      }
      else
      {
        input.prop( 'checked', true );
        input.addClass( 'checked' );
      }

    }

  };

}());
