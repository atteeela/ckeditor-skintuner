/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
;( function () {

    "use strict";

    var editorScriptElement,
        initializeEditor,
        insertTimeout = 10,
        onEditorInitialized,
        possibleEditorLocations = [
            // skintuner is most probably placed inside /dev/skintuner
            // directory; no further search is needed
            "../../ckeditor.js",
            "./components/ckeditor/ckeditor.js",
            "./ckeditor.js",
            "../ckeditor.js"
        ];

    require.config({
        baseUrl: "./scripts/"
    });

    /**
     * @return {void}
     */
    initializeEditor = function () {
        if ( window.CKEDITOR || possibleEditorLocations.length < 1 ) {
            return;
        }

        if ( editorScriptElement ) {
            // do some cleanup
            document.body.removeChild( editorScriptElement );
            editorScriptElement = null;
        }

        editorScriptElement = document.createElement( "script" );
        editorScriptElement.src = possibleEditorLocations.shift();

        document.body.appendChild( editorScriptElement );

        setTimeout( initializeEditor, insertTimeout );
    };

    /**
     * @param {CKEDITOR} CKEDITOR
     * @param {CKEditor/SkinTuner/modules/skintuner} skintuner
     * @return {void}
     */
    onEditorInitialized = function ( CKEDITOR, skintuner ) {
        console.log( CKEDITOR );
        console.log( skintuner );

        skintuner.presentEditorElements( CKEDITOR, document.body );
    };

    setTimeout( initializeEditor, 0 );

    require(["modules/ckeditor-skintuner"], function (skintuner) {

        var arbitraryIntervalThatAwaitsForCKEditorToBeReadyId,
            arbitraryIntervalThatAwaitsForCKEditorToBeReadyTimeout = 10,

        arbitraryIntervalThatAwaitsForCKEditorToBeReadyId = setInterval( function () {
            if ( !window.CKEDITOR ) {
                return;
            }

            clearInterval( arbitraryIntervalThatAwaitsForCKEditorToBeReadyId );

            onEditorInitialized( window.CKEDITOR, skintuner );
        }, arbitraryIntervalThatAwaitsForCKEditorToBeReadyTimeout );

    } );

}() );
