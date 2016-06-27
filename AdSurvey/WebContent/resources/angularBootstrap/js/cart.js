
/*
|--------------------------------------------------------------------------
| insite.cart
|--------------------------------------------------------------------------
|
*/

insite.cart = (function() {

  return {

    /*
    |-----------------------------------
    | insite.cart.init
    |-----------------------------------
    |
    */

    init : function()
    {

      // fetch
      if( jQuery( '#menu-user li.user-cart' ).length )
        insite.cart.fetch();

      // hide_cart
      jQuery( document ).on( 'click', '#menu-user .cart-popover i.fa-close', function(e) {
        insite.cart.hide();
      });

    },


    /*
    |-----------------------------------
    | insite.cart.fetch
    |-----------------------------------
    |
    */


    fetch : function()
    {



      jQuery.ajax({
        url: 'https://' + insite.hostname + '/extras/menus/carts',
        type: 'GET',
        dataType: 'json'
      })
      .fail(function( json ) {

      })
      .done(function( json ) {

        var count = 0;

        html = '<div class="cart-popover">';
        html+= '  <i class="fa fa-close"></i>';

        if( jQuery( '#menu-user li.user-cart' ).attr( 'data-presell' ) == 'yes' )
        {
          html+= '  <div class="cart-presell">';
          html+= '    <h4 class="cart-title">Presell Cart</h4>';
          html+= '    <p>';
          html+= '      <div class="cart-num">'+json.carts.presell_customer.count+'</div>';

          if( json.carts.presell_customer.count > 0 )
          {
            // update our total count
            count+= json.carts.presell_customer.count;

            html+= '      You have '+json.carts.presell_customer.count+' items in your Presell Cart. ';
            html+= '    </p>';
            html+= '    <div class="row">';
            html+= '      <div class="col-xs-6">';
            html+= '        <a role="button" href="/presellcart.nsf" class="btn btn-null btn-block">View Cart</a>';
            html+= '      </div>';
            html+= '      <div class="col-xs-6">';
            html+= '        <a role="button" href="/presellcart.nsf" class="btn btn-default btn-block">Checkout</a>';
            html+= '      </div>';
            html+= '    </div>';
            html+= '  </div>';
          }
          else
          {
            html+= '      You have no items in your Presell Cart. Why not <a href="/presell.nsf/F_DASHBOARD_RETAIL">add some</a>?';
            html+= '    </p>';
          }

        }

        if( jQuery( '#menu-user li.user-cart' ).attr( 'data-presell' ) == 'yes' && jQuery( '#menu-user li.user-cart' ).attr( 'data-product' ) == 'yes' )
          html+= '<hr>';

        if( jQuery( '#menu-user li.user-cart' ).attr( 'data-product' ) == 'yes' )
        {
          html+= '  <div class="cart-product">';
          html+= '    <h4 class="cart-title">Product Cart</h4>';
          html+= '    <p>';
          html+= '      <div class="cart-num">'+json.carts.product.count+'</div>';

          if( json.carts.product.count > 0 )
          {
            // update our total count
            count+= json.carts.product.count;

            html+= '      You have '+json.carts.product.count+' items in your Product Cart. ';
            html+= '    </p>';
            html+= '    <div class="row">';
            html+= '      <div class="col-xs-6">';
            html+= '        <a role="button" href="/carts.nsf/A_CART_ACTIONS?OpenAgent&action=GOTOCART" class="btn btn-null btn-block">View Cart</a>';
            html+= '      </div>';
            html+= '      <div class="col-xs-6">';
            html+= '        <a role="button" href="/carts.nsf/A_CART_ACTIONS?OpenAgent&action=GOTOCART" class="btn btn-default btn-block">Checkout</a>';
            html+= '      </div>';
            html+= '    </div>';
            html+= '  </div>';
          }
          else
          {
            html+= '      You have no items in your Product Cart. Why not <a href="/items.nsf/F_SEARCH">add some</a>?';
            html+= '    </p>';
          }
        }

        html+= '</div>';

        jQuery( '#menu-user li.user-cart a[data-toggle="popover"]' ).popover({
          html: true,
          placement: 'bottom',
          content: html
        });

        // highlight carts with items in them
        if( count > 0 )
        {
          jQuery( '#menu-user li.user-cart a[data-toggle="popover"]' )
            .addClass( 'full' )
            .html( 'My Carts (' + count + ')' );

          // expand if on home page
          if( jQuery( 'body.root .home' ).length && ! jQuery.cookie( 'LrvlCartAcknowledged' ) )
            setTimeout( function() {
              insite.cart.show();
            }, 1000 );

        }


      });

    },

    /*
    |-----------------------------------
    | insite.cart.show
    |-----------------------------------
    |
    */

    show : function()
    {
      jQuery( '#menu-user li.user-cart a[data-toggle="popover"]' ).popover( 'show' );
    },


    /*
    |-----------------------------------
    | insite.cart.hide
    |-----------------------------------
    |
    */

    hide : function()
    {
      jQuery( '#menu-user li.user-cart a[data-toggle="popover"]' ).popover( 'hide' );
      jQuery.cookie( 'LrvlCartAcknowledged', true, { domain: '.' + insite.hostname , path: '/' } );
    }

  };

}());
