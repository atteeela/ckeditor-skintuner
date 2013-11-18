/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
( function() {

	/* jslint browser: true */

	"use strict";

	var LAST_EDITOR_LOCATION_HIT = "lastEditorLocationHit",
		editorScriptElement,
		emergencyTimeoutThatAwaitsForEditorToBeLoadedId,
		emergencyTimeoutThatAwaitsForEditorToBeLoadedTimeout = 1000,
		findPresentationConfigurations, // private, function
		initializeEditor, // private, function
		insertTimeout = 100,
		localStorage = window.localStorage,
		onEditorInitialized, // private, function
		overwriteKeyGenerator, // private, function
		parsePresentationConfigurationScript, // private, function
		possibleEditorLocations = [
			// skintuner is most probably placed inside /dev/skintuner
			// directory; no further search is needed
			"../../ckeditor.js",

			"./ckeditor.js",
			"../ckeditor.js",
			"./components/ckeditor/ckeditor.js",
			"../components/ckeditor/ckeditor.js",
			"../../components/ckeditor/ckeditor.js"
		];

	/* global alert: false */
	if ( !Array.forEach ) {
		Array.forEach = function() {
			alert( "FOREACH" );
		};
	}

	if ( !Array.isArray ) {
		Array.isArray = function( vArg ) {
			return Object.prototype.toString.call( vArg ) === "[object Array]";
		};
	}

	if ( !Object.create ) {
		Object.create = ( function() {
			var F = function() {};

			return function( o ) {
				if ( 1 !== arguments.length ) {
					throw new Error( 'Object.create implementation only accepts one parameter.' );
				}
				F.prototype = o;

				return new F();
			};
		} )();
	}

	if ( !Object.defineProperty ) {
		Object.defineProperty = function( o, name, options ) {
			o[ name ] = options.value;
		};
	}

	if ( localStorage ) {
		possibleEditorLocations.unshift( localStorage.getItem( LAST_EDITOR_LOCATION_HIT ) );
	}

	/**
	 * @param {HTMLElement} container
	 * @return {array}
	 */
	findPresentationConfigurations = function( container ) {
		var i,
			ret = [],
			scripts = container.getElementsByTagName( "script" );

		for ( i = 0; i < scripts.length; i += 1 ) {
			if ( "application/json" === scripts[ i ].type ) {
				ret.push( parsePresentationConfigurationScript( scripts[ i ] ) );
			}
		}

		return ret;
	};

	/**
	 * @return {void}
	 */
	initializeEditor = function() {
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
	 * @param {ckeditor-skintuner/modules/skintuner} skintuner
	 * @return {void}
	 */
	onEditorInitialized = function( CKEDITOR, skintuner ) {
		var configurations,
			container = document.body,
			skinTuner;

		overwriteKeyGenerator( CKEDITOR );

		configurations = findPresentationConfigurations( container );

		skinTuner = skintuner.presentEditorElements( CKEDITOR, container, configurations );
		skintuner.appendToolbar( CKEDITOR, skinTuner, container );
	};

	/**
	 * Overwriting this function prevents CKEDITOR from caching panels and
	 * dialogs UI elements.
	 *
	 * @param {CKEDITOR} CKEDITOR
	 * @return {void}
	 */
	overwriteKeyGenerator = function( CKEDITOR ) {
		var noCacheKey = 0,
			previousGenKey = CKEDITOR.tools.genKey;

		// this is an obsoluete function that ATM is called at two places in
		// code
		CKEDITOR.tools.genKey = function() {
			var args = Array.prototype.slice.call( arguments );

			// genkey is called at panel plugin - do not cache
			// see: #10773
			if ( args.length > 3 ) {
				noCacheKey += 1;

				return noCacheKey;
			}

			return previousGenKey.apply( this, args );
		};
	};

	/**
	 * @param {HTMLScriptElement} script
	 * @return {object}
	 */
	parsePresentationConfigurationScript = function( script ) {
		return JSON.parse( script.innerHTML );
	};

	emergencyTimeoutThatAwaitsForEditorToBeLoadedId = setTimeout( function() {
		// editor is not loaded for too long, probably there is some random
		// network error
		// window.location.reload();
		// window.location.href = window.location.href;
	}, emergencyTimeoutThatAwaitsForEditorToBeLoadedTimeout );

	setTimeout( initializeEditor, 0 );

	require.config( {
		paths: {
			"ckeditor-skintuner": "../modules/ckeditor-skintuner"
		}
	} );
	require( [ "ckeditor-skintuner" ], function( skintuner ) {

		var arbitraryIntervalThatAwaitsForCKEditorToBeReadyId = [],
			arbitraryIntervalThatAwaitsForCKEditorToBeReadyTimeout = 10;

		arbitraryIntervalThatAwaitsForCKEditorToBeReadyId = setInterval( function() {
			var CKEDITOR = window.CKEDITOR;

			if ( CKEDITOR ) {
				clearTimeout( emergencyTimeoutThatAwaitsForEditorToBeLoadedId );
			}

			if ( !CKEDITOR || !CKEDITOR.on ) {
				return;
			}

			if ( localStorage ) {
				localStorage.setItem( LAST_EDITOR_LOCATION_HIT, editorScriptElement.src );
			}

			clearInterval( arbitraryIntervalThatAwaitsForCKEditorToBeReadyId );

			if ( "loaded" === CKEDITOR.status ) {
				onEditorInitialized( CKEDITOR, skintuner );
			} else {
				CKEDITOR.on( "loaded", function() {
					onEditorInitialized( CKEDITOR, skintuner );
				} );
			}
		}, arbitraryIntervalThatAwaitsForCKEditorToBeReadyTimeout );

	} );

}() );
