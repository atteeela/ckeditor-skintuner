/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [
	"CKEditor/SkinTuner/Presentation"
], function( Presentation ) {

	var Presenter; // constructor, function

	/**
	 * @abstract
	 * @constructor
	 */
	Presenter = function() {};

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
		var editor = this.createEditor( CKEDITOR, container, editorConfiguration ),
			presentation = new Presentation( editor ),
			that = this;

		presentation.addListener( Presentation.EVENT_EDITOR_READY, function() {
			presentation.start();
			that.processEditor( CKEDITOR, presentation, editor );
		} );

		return presentation;
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {CKEditor/SkinTuner/Presentation} presentation
	 * @param {Editor} editor
	 * @return {void}
	 */
	Presenter.prototype.processEditor = function( CKEDITOR, presentation, editor ) {
		setTimeout( function() {
			presentation.done();
		}, 1000 );
	};

	return Presenter;

} );
