/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [
	"CKEditor/SkinTuner/ConfigurationNormalizer"
], function( ConfigurationNormalizer ) {

	var SkinTuner, // constructor, function
		configurationNormalizer = new ConfigurationNormalizer();

	/**
	 * @constructor
	 */
	SkinTuner = function() {};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {object} configuration
	 * @param {array} configurations
	 * @return {void}
	 */
	SkinTuner.prototype.presentEditorElement = function( CKEDITOR, container, configurations, configuration ) {
		configuration = configurationNormalizer.normalizeConfiguration( configuration, container );
		console.log( configuration );
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
