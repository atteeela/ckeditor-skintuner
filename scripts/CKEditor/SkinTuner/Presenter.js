/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [
	"Bender/EventDispatcher/EventDispatcher",
	"CKEditor/SkinTuner/Presentation"
], function( EventDispatcher, Presentation ) {

	var Presenter; // constructor, function

	/**
	 * @abstract
	 * @auguments Bender/EventDispatcher/EventDispatcher
	 * @constructor
	 */
	Presenter = function() {
		EventDispatcher.call( this );
	};
	Presenter.prototype = Object.create( EventDispatcher.prototype );

	Object.defineProperty( Presenter, "EVENT_PRESENTATION_START", {
		value: "presentation.start"
	} );

	Object.defineProperty( Presenter, "EVENT_PRESENTATION_STOP", {
		value: "presentation.stop"
	} );

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {object} editorConfiguration
	 * @return {Editor}
	 */
	Presenter.prototype.createEditor = function( CKEDITOR, container, editorConfiguration ) {
		return CKEDITOR.appendTo( container, editorConfiguration );
	};

	/**
	 * @return {array}
	 */
	Presenter.prototype.getSupportedEvents = function() {
		return [
			Presenter.EVENT_PRESENTATION_START,
			Presenter.EVENT_PRESENTATION_STOP
		];
	};

	/**
	 * @return {array}
	 */
	Presenter.prototype.getSupportedTypes = function() {
		throw new Error( "This method must be overriden in child object." );
	};

	/**
	 * @param {string} type
	 * @return {bool}
	 */
	Presenter.prototype.isTypeSupported = function( type ) {
		/* jshint bitwise: false */
		return ( ~this.getSupportedTypes().indexOf( type ) );
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {object} editorConfiguration
	 * @return {CKEditor/SkinTuner/Presentation}
	 */
	Presenter.prototype.present = function( CKEDITOR, container, editorConfiguration ) {
		var presentation = new Presentation( this.createEditor( CKEDITOR, container, editorConfiguration ) ),
			that = this;

		setTimeout( function() {
			presentation.process( that );
		}, 0 );

		return presentation;
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {object} editorConfiguration
	 * @return {void}
	 */
	Presenter.prototype.processEditor = function( presentation, editor ) {
		presentation.done();
	};

	return Presenter;

} );
