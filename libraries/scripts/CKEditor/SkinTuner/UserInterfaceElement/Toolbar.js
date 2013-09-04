/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */
/* jshint browser: true */

define( [
	"CKEditor/SkinTuner/UserInterfaceElement"
], function( UserInterfaceElement ) {

	var Toolbar, // constructor, function

		REGEXP_NEWLINE = ( /(\n|\r\n)/ ),
		REGEXP_TRIM = ( /^\s+|\s+$/g ),
		SCRIPT_TYPE_TEMPLATE = "text/html",
		TEMPLATE_NAME_TOOLBAR = "toolbar",
		UICOLOR_DEFAULT = "Default",

		findTemplate, // private, function
		normalizeTemplateString, // private, function
		onTemplateScriptFound; // private, function

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {string} templateName
	 * @param {function} callback
	 * @return {string}
	 */
	findTemplate = function( CKEDITOR, container, templateName, callback ) {
		var i,
			scripts = container.getElementsByTagName( "script" );

		for ( i = 0; i < scripts.length; i += 1 ) {
			if ( SCRIPT_TYPE_TEMPLATE === scripts[ i ].type ) {
				onTemplateScriptFound( CKEDITOR, container, templateName, callback, scripts[ i ] );
			}
		}
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {string} templateName
	 * @param {function} callback
	 * @param {HTMLScriptElement} script
	 * @return {string}
	 */
	onTemplateScriptFound = function( CKEDITOR, container, templateName, callback, script ) {
		var template;

		script = CKEDITOR.dom.element.get( script );
		if ( !script.hasAttribute( "data-template-id" ) ) {
			return;
		}

		if ( templateName === script.getAttribute( "data-template-id" ) ) {
			template = normalizeTemplateString( CKEDITOR, container, script.getHtml() );
			callback( new CKEDITOR.template( template ) );
		}
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {string} template
	 * @return {string}
	 */
	normalizeTemplateString = function( CKEDITOR, container, template ) {
		template = template.split( REGEXP_NEWLINE ).map( function( line ) {
			// no String.prototype.trim because of IE8 support
			return line.replace( REGEXP_TRIM, "" );
		} );

		return template.join( "" );
	};

	/**
	 * @auguments CKEditor/SkinTuner/UserInterfaceElement
	 * @constructor
	 */
	Toolbar = function() {
		UserInterfaceElement.call( this );
	};
	Toolbar.prototype = Object.create( UserInterfaceElement.prototype );

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @return {void}
	 */
	Toolbar.prototype.appendTo = function( CKEDITOR, container ) {
		var that = this;

		findTemplate( CKEDITOR, container, TEMPLATE_NAME_TOOLBAR, function( template ) {
			that.onTemplateReady( CKEDITOR, container, template );
		} );
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @return {string}
	 */
	Toolbar.prototype.getUiColor = function( CKEDITOR, container ) {
		return UICOLOR_DEFAULT;
	};

	/**
	 * @fires CKEditor/SkinTuner/UserInterfaceElement/Toolbar#EVENT_TOOLBAR_READY
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {CKEDITOR.template} template
	 * @return {void}
	 */
	Toolbar.prototype.onTemplateReady = function( CKEDITOR, container, template ) {
		var templateOutput,
			toolbar;

		templateOutput = template.output( {} );
		toolbar = CKEDITOR.dom.element.createFromHtml( templateOutput );

		container = CKEDITOR.dom.element.get( container );
		container.append( toolbar );

		this.notifyUserInterfaceElementReady( CKEDITOR, container.$ );
	};

	return Toolbar;

} );
