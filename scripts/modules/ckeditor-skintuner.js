/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( function () {

    return {

        /**
         * @param {CKEDITOR} CKEDITOR
         * @param {HTMLElement} container
         * @return {void}
         */
        presentEditorElements: function ( CKEDITOR, container ) {
            console.log(arguments);
        }

    };

} );

// // $.themed/inline( 'container id', {editor config} );
// $.themed( 'fullThemed', { language: 'en', toolbarCanCollapse: true } );

// $.themed( 'fullThemedRTL', { language: 'he', toolbarCanCollapse: true } );

// $.themed( 'basicThemed', { language: 'en', removePlugins: 'elementspath,resize', height: 50,
//     toolbar: [[ 'Source', '-', 'Bold', 'Italic', 'Underline' ]]
// });

// $.themed( 'basicThemedRTL', { language: 'he', removePlugins: 'elementspath,resize', height:50,
//     toolbar : [[ 'Source', '-', 'Bold', 'Italic', 'Underline' ]]
// });

// $.inline( 'fullInline', { language: 'en',
//     toolbar: [
//         [ 'Source', '-', 'Bold', 'Italic', 'Underline' ],
//         [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent' ],
//         '/',
//         [ 'Styles', 'About' ]
//     ]
// });

// $.inline( 'fullInlineRTL', { language: 'he',
//     toolbar: [
//         [ 'Source', '-', 'Bold', 'Italic', 'Underline' ],
//         [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent' ],
//         '/',
//         [ 'Styles', 'About' ]
//     ]
// });

// // $.dialog( 'container id', 'dialog name', 'tab name', {editor config} );
// $.dialog( 'linkDialog', 'link', { language: 'en', extraPlugins: 'link' } );
// $.dialog( 'linkDialogAdvTab', 'link', 'advanced', { language: 'en', extraPlugins: 'link' } );
// $.dialog( 'linkDialogRTL', 'link', { language: 'he', extraPlugins: 'link' } );
// $.dialog( 'linkDialogRTLAdvTab', 'link', 'advanced', { language: 'he', extraPlugins: 'link' } );


// var items = 'link(on),unlink(disabled),table,tabledelete,tablecell';

// // $.menu( 'container id', 'menu item1, menu item1, ...', {editor config} );
// $.menu( 'contextMenu', items, { language: 'en' } );
// $.menu( 'contextMenuRTL', items, { language: 'he' } );

// // $.combo( 'container id', 'combo name', 'selected item', {editor config} );
// $.combo( 'stylesCombo', 'Styles', 'Red Title', { language: 'en' } );
// $.combo( 'stylesComboRTL', 'Styles', 'Red Title', { language: 'he' } );
// $.combo( 'formatCombo', 'Format', 'h3', { language: 'en' } );
// $.combo( 'formatComboRTL', 'Format', 'h3', { language: 'he' } );
