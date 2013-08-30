/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */
/* jshint browser: true */

define( [
	"Bender/EventDispatcher/Event",
	"Bender/EventDispatcher/EventDispatcher"
], function( Event, EventDispatcher ) {

	var ColorPicker, // constructor, function

		ATTRIBUTE_COLORPICKER_COLOR = "data-colorpicker-color",
		SCRIPT_COLORPICKER_SRC = "components/jscolor/jscolor.js",

		arbitraryIntervalThatWaitsForJsColorToBeReadyId,
		arbitraryIntervalThatWaitsForJsColorToBeReadyTimeout = 10,
		colorPickerElement,
		createColorPickerEvent, // private, function
		initializeJsColor, // private, function
		isJsColorReady = false,
		jsColor,
		onJsColorReadyCallbacks = [],
		waitForJsColorToBeReady; // private, function

	colorPickerElement = document.createElement( "script" );
	colorPickerElement.src = SCRIPT_COLORPICKER_SRC;

	document.body.appendChild( colorPickerElement );

	arbitraryIntervalThatWaitsForJsColorToBeReadyId = setInterval( function() {
		var i;

		if ( !window.jscolor ) {
			return;
		}

		clearInterval( arbitraryIntervalThatWaitsForJsColorToBeReadyId );

		isJsColorReady = true;
		jsColor = window.jscolor;

		for ( i = 0; i < onJsColorReadyCallbacks.length; i += 1 ) {
			onJsColorReadyCallbacks[ i ]( jsColor );
		}
	}, arbitraryIntervalThatWaitsForJsColorToBeReadyTimeout );

	/**
	 * @access private
	 * @param {CKEditor/SkinTuner/ColorPicker} colorPicker
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLInputElement} container
	 * @return {Bender/EventDispatcher/Event}
	 */
	createColorPickerEvent = function( colorPicker, CKEDITOR, container ) {
		return new Event( {
			colorPicker: colorPicker,
			container: container
		} );
	};

	/**
	 * @access private
	 * @fires CKEditor/SkinTuner/ColorPicker#EVENT_COLOR_PICKER_READY
	 * @param {CKEditor/SkinTuner/ColorPicker} colorPicker
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLInputElement} container
	 * @param {jscolor} jscolor
	 * @return {void}
	 */
	initializeJsColor = function( colorPicker, CKEDITOR, container, jscolor ) {
		jscolor.color( container, {
			hash: true,
			caps: true,
			required: false
		} );

		colorPicker.dispatch( ColorPicker.EVENT_COLOR_PICKER_READY, createColorPickerEvent( colorPicker, CKEDITOR, container ) );
	};

	/**
	 * @access private
	 * @param {CKEditor/SkinTuner/ColorPicker} colorPicker
	 * @param {function} callback
	 * @return {void}
	 */
	waitForJsColorToBeReady = function( colorPicker, callback ) {
		if ( isJsColorReady ) {
			callback( jsColor );
		} else {
			onJsColorReadyCallbacks.push( callback );
		}
	};

	/**
	 * @auguments Bender/EventDispatcher/EventDispatcher
	 * @constructor
	 */
	ColorPicker = function() {
		EventDispatcher.call( this );
	};
	ColorPicker.prototype = Object.create( EventDispatcher.prototype );

	/**
	 * @constant {string}
	 */
	ColorPicker.EVENT_COLOR_PICKED = "event.color.picked";

	/**
	 * @constant {string}
	 */
	ColorPicker.EVENT_COLOR_PICKER_READY = "event.color.picker.ready";

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLInputElement} container
	 * @return {array}
	 */
	ColorPicker.prototype.appendTo = function( CKEDITOR, container ) {
		var that = this;

		waitForJsColorToBeReady( this, function( jscolor ) {
			initializeJsColor( that, CKEDITOR, container, jscolor );
			CKEDITOR.document.on( "click", function( evt ) {
				var color,
					target = CKEDITOR.dom.element.get( evt.data.$.target );

				if ( !target.hasAttribute( ATTRIBUTE_COLORPICKER_COLOR ) ) {
					return;
				}

				color = target.getAttribute( ATTRIBUTE_COLORPICKER_COLOR );

				container.setValue( color );
				jscolor.importColor();

				that.onColorPicked( CKEDITOR, container.$, color );
			} );
		} );

		container = CKEDITOR.dom.element.get( container );
		container.on( "change", function( evt ) {
			that.onColorPicked( CKEDITOR, container.$, container.getValue() );
		} );
	};

	/**
	 * @return {array}
	 */
	ColorPicker.prototype.getSupportedEvents = function() {
		return [
			ColorPicker.EVENT_COLOR_PICKED,
			ColorPicker.EVENT_COLOR_PICKER_READY
		];
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLInputElement} container
	 * @param {string} color hex rgb with preceding hash
	 * @return {array}
	 */
	ColorPicker.prototype.notifyColorPicked = function( CKEDITOR, container, color ) {
		var evt = createColorPickerEvent( CKEDITOR, container, color ),
			that = this;

		evt.data.color = color;

		setTimeout( function() {
			that.dispatch( ColorPicker.EVENT_COLOR_PICKED, evt );
		}, 0 );
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLInputElement} container
	 * @param {string} color hex rgb with preceding hash
	 * @return {array}
	 */
	ColorPicker.prototype.onColorPicked = function( CKEDITOR, container, color ) {
		this.notifyColorPicked( CKEDITOR, container, color );
	};

	return ColorPicker;

} );
