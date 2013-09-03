/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */
/* jshint browser: true */

define( function() {

	var SplashScreen, // constructor, function

		createDocumentMask, // private, function
		defaultMessage = "Building skin parts...",
		documentMaskTemplate;

	/* jshint multistr: true */
	documentMaskTemplate = '<div id="mask"><div id="loading">{message}</div></div>';
	/* jshint multistr: false */

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {CKEDITOR.template} template
	 * @param {string} message
	 * @return {CKEDITOR.dom.element}
	 */
	createDocumentMask = function( CKEDITOR, template, message ) {
		return CKEDITOR.dom.element.createFromHtml( template.output( {
			message: message
		} ) );
	};

	/**
	 * @constructor
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 */
	SplashScreen = function( CKEDITOR, container ) {
		var template;

		if ( !( container instanceof HTMLElement ) ) {
			throw new Error( "Expected container to be an instance of HTMLElement" );
		}

		template = new CKEDITOR.template( documentMaskTemplate );

		this.container = new CKEDITOR.dom.element( container );

		/**
		 * @param {string} message (optional)
		 * @return {CKEDITOR.dom.element}
		 */
		this.createDocumentMask = function( message ) {
			return createDocumentMask( CKEDITOR, template, ( message || defaultMessage ) );
		};
	};

	/**
	 * @return {void}
	 * @throws {Error} if splash screen is not active
	 */
	SplashScreen.prototype.hide = function() {
		if ( !this.isActive() ) {
			throw new Error( "Splash screen is not active." );
		}

		this.container.setStyle( "overflow", "scroll" );
		this.mask.remove();

		delete this.mask;
	};

	/**
	 * @return {bool}
	 */
	SplashScreen.prototype.isActive = function() {
		return !!this.mask;
	};

	/**
	 * @param {string} message
	 * @return {void}
	 * @throws {Error} if splash screen is not active
	 */
	SplashScreen.prototype.setMessage = function( message ) {
		if ( !this.isActive() ) {
			throw new Error( "Splash screen is not active." );
		}

		this.mask.getChild( 0 ).setText( message );
	};

	/**
	 * @param {string} message
	 * @return {void}
	 * @throws {Error} if splash screen is already active
	 */
	SplashScreen.prototype.show = function( message ) {
		if ( this.isActive() ) {
			throw new Error( "Splash screen is already active." );
		}

		this.mask = this.createDocumentMask( message );

		this.container.show();
		this.container.setStyle( "overflow", "hidden" );
		this.container.setStyle( "visibility", "visible" );
		this.container.append( this.mask );
		this.mask.setStyle( "display", "none" );
	};

	return SplashScreen;

} );
