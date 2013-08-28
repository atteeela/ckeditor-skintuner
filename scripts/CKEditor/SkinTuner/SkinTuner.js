/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [
	"Bender/EventDispatcher/EventDispatcher/Repository",
	"CKEditor/SkinTuner/ConfigurationNormalizer"
], function( Repository, ConfigurationNormalizer ) {

	var SkinTuner, // constructor, function

		configurationNormalizer = new ConfigurationNormalizer();

	/**
	 * @constructor
	 */
	SkinTuner = function() {
		Object.defineProperty( this, "partiallyCreatedEditorsRepository", {
			value: new Repository()
		} );
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {array} configurations
	 * @param {object} configuration
	 * @param {Editor} editor
	 * @return {void}
	 */
	SkinTuner.prototype.onEditorReady = function( CKEDITOR, container, configurations, configuration, editor ) {
		console.log( configuration );
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {array} configurations
	 * @param {object} configuration
	 * @return {void}
	 */
	SkinTuner.prototype.presentEditorElement = function( CKEDITOR, container, configurations, configuration ) {
		var partiallyCreatedEditorsRepository = this.partiallyCreatedEditorsRepository,
			that = this;

		configuration = configurationNormalizer.normalizeConfiguration( configuration, container );

		setTimeout( function() {
			var editor = CKEDITOR.appendTo( configuration.element, configuration.config );

			partiallyCreatedEditorsRepository.add( editor );

			editor.on( 'instanceReady', function() {
				partiallyCreatedEditorsRepository.remove( editor );
				that.onEditorReady( CKEDITOR, container, configurations, configuration, editor );
			} );
		}, 0 );
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {array} configurations
	 * @return {void}
	 */
	SkinTuner.prototype.presentEditorElements = function( CKEDITOR, container, configurations ) {
		var i;

		for ( i = 0; i < configurations.length; i += 1 ) {
			this.presentEditorElement( CKEDITOR, container, configurations, configurations[ i ] );
		}
	};

	return SkinTuner;

} );
