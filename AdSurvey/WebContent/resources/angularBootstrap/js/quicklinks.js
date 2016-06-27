
/*
|--------------------------------------------------------------------------
| insite.quicklinks
|--------------------------------------------------------------------------
|
*/

insite.quicklinks = (function() {

  return {

    /*
    |-----------------------------------
    | insite.quicklinks.init
    |-----------------------------------
    |
    */

    init : function()
    {

      // keep drop down open
      jQuery( document ).on( 'click', '.dropdown-menu.quicklinks', function( e ) {
        e.stopPropagation();
      });

      // show/hide edit functions
      jQuery( document ).on( 'click', '.dropdown-menu.quicklinks .edit', function(){
        insite.quicklinks.edit();
      });

      // create quicklink
      jQuery( document ).on( 'click', '.dropdown-menu.quicklinks .add button', function( e ) {
        e.preventDefault();
        insite.quicklinks.create();
      });

      // destroy quicklink
      jQuery( document ).on( 'click', '.dropdown-menu.quicklinks i.delete', function( e ) {
        insite.quicklinks.destroy( jQuery( this ).attr( 'data-index' ) );
      });

    },


    /*
    |-----------------------------------
    | insite.quicklinks.indices
    |-----------------------------------
    |
    */


    indices : function()
    {
      jQuery( '.dropdown-menu.quicklinks i.delete' ).each( function( i ) {
        jQuery( this ).attr( 'data-index', i );
      });
    },



    /*
    |-----------------------------------
    | insite.quicklinks.fill
    |-----------------------------------
    |
    */


    fill : function()
    {
      if( ! jQuery( 'img#quickLink-add' ).length )
        return;

      jQuery( '#quicklink-add-title' ).val( jQuery( 'img#quickLink-add' ).attr( 'linktitle' ) );
      jQuery( '#quicklink-add-url' ).val( jQuery( 'img#quickLink-add' ).attr( 'linkurl' ) );
    },


    /*
    |-----------------------------------
    | insite.quicklinks.shuffle
    |-----------------------------------
    |
    */


    shuffle : function( from )
    {
      var col1links = jQuery( '.dropdown-menu.quicklinks ul.column1 li.quicklink' ).length;
      var col2links = jQuery( '.dropdown-menu.quicklinks ul.column2 li.quicklink' ).length;

      if( from == 'create' )
      {
        // col1
        if( col1links <= col2links )
        {
          jQuery( '.dropdown-menu.quicklinks ul.column1' ).append(
            jQuery( '.dropdown-menu.quicklinks ul.column2 li:nth-child(2)' )
          );
        }
      }
      else if ( from == 'destroy' )
      {

        // col2 had more? move first link of col2 to bottom of col1
        if( col2links > col1links )
        {
          jQuery( '.dropdown-menu.quicklinks ul.column1' ).append(
            jQuery( '.dropdown-menu.quicklinks ul.column2 li:nth-child(2)' )
          );
        }

        // col1 has 2 more than col2? move last of col1 to top of col2
        if( col1links == (col2links + 2) )
        {
          jQuery( '.dropdown-menu.quicklinks ul.column2 li:first-child' ).after(
            jQuery( '.dropdown-menu.quicklinks ul.column1 li:last-child' )
          );
        }

      }


    },


    /*
    |-----------------------------------
    | insite.quicklinks.edit
    |-----------------------------------
    |
    */


    edit : function()
    {
      if( jQuery( '.dropdown-menu.quicklinks .edit' ).html() == 'Edit' )
      {
        jQuery( '.dropdown-menu.quicklinks .edit' ).html( 'Done' );
        jQuery( '.dropdown-menu.quicklinks i.delete' ).css( 'visibility', 'visible' );
        jQuery( '.dropdown-menu.quicklinks div.row.add' ).css( 'display', 'block' );

        insite.quicklinks.indices();

        insite.quicklinks.fill();
      }
      else
      {
        jQuery( '.dropdown-menu.quicklinks .edit' ).html( 'Edit' );
        jQuery( '.dropdown-menu.quicklinks i.delete' ).css( 'visibility', 'hidden' );
        jQuery( '.dropdown-menu.quicklinks div.row.add' ).css( 'display', 'none' );
      }
    },


    /*
    |-----------------------------------
    | insite.quicklinks.create
    |-----------------------------------
    |
    */


    create : function()
    {

      var title = jQuery( '#quicklink-add-title' ).val();
      var url = jQuery( '#quicklink-add-url' ).val();

      // clear any previous validation
      jQuery( '.dropdown-menu.quicklinks .add .form-group' ).removeClass( 'has-error' );

      // validate fields
      if( title == '' )
      {
        jQuery( '#quicklink-add-title' ).parent( '.form-group' ).addClass( 'has-error' );
        return;
      }

      if( url == '' )
      {
        jQuery( '#quicklink-add-url' ).parent( '.form-group' ).addClass( 'has-error' );
        return;
      }

      if( url.substr( 0, 4 ) != 'http' && url.substr( 0, 3 ) != 'ftp' && url.substr( 0, 6 ) != 'mailto' )
        url = 'http://' + url;

      // show ajax spinner
      jQuery( '.dropdown-menu.quicklinks .add button i' ).show();

      jQuery.ajax({
        url: 'https://' + insite.hostname + '/extras/menus/quicklink',
        data: {
          username : jQuery( '#up_doc_unid' ).attr( 'data-value' ),
          qltitle : title,
          qlurl : url
        },
        type: 'POST',
        dataType: 'json'
      })
      .fail(function( json ) {

      })
      .done(function( json ) {

        // show check mark, fade out, prep for next add
        jQuery( '.dropdown-menu.quicklinks .add button i' )
          .removeClass( 'fa-spinner fa-spin')
          .addClass( 'fa-check' )
          .delay( 1500 )
          .fadeOut( 'slow', function() {
            jQuery( '.dropdown-menu.quicklinks .add button i' )
              .removeClass( 'fa-check')
              .addClass( 'fa-spinner fa-spin' );
          });

        // empty the fields
        jQuery( '.dropdown-menu.quicklinks .add input[type="text"]' ).val( '' );

        // keep our colums even
        insite.quicklinks.shuffle( 'create' );

        // append new item
        jQuery( '.dropdown-menu.quicklinks ul.column2' ).append(function() {

          var li = '<li class="quicklink">';
              li+= '<i class="fa fa-fw fa-trash-o delete" style="visibility: visible;"></i>';
              li+= '<a href="' + url + '">' + title + '</a>';
              li+= '</li>';

          return li;

        });

        // re-index
        insite.quicklinks.indices();


      });


    },


    /*
    |-----------------------------------
    | insite.quicklinks.destroy
    |-----------------------------------
    |
    */


    destroy : function( index )
    {

      jQuery.ajax({
        url: 'https://' + insite.hostname + '/extras/menus/quicklink/' + index,
        data: { username : jQuery( '#up_doc_unid' ).attr( 'data-value' ) },
        type: 'DELETE',
        dataType: 'json'
      })
      .fail(function( json ) {

      })
      .done(function( json ) {

        jQuery( '.dropdown-menu.quicklinks i.delete[data-index="' + index + '"]' )
          .parent( 'li' )
          .fadeOut( 500, function() {

            jQuery( this ).remove().queue(function() {
              // keep our colums even
              insite.quicklinks.shuffle( 'destroy' );

              // re-index
              insite.quicklinks.indices();

              jQuery( this ).dequeue();

            });

          });

      });




    }

  };

}());
