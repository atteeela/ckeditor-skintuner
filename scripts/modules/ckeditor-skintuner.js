/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [
	"Bender/EventDispatcher/EventDispatcher",
	"CKEditor/SkinTuner/ConfigurationNormalizer"
], function( EventDispatcher, ConfigurationNormalizer ) {

	var configurationNormalizer = new ConfigurationNormalizer();

	return {

		/**
		 * @param {CKEDITOR} CKEDITOR
		 * @param {HTMLElement} container
		 * @param {object} configuration
		 * @param {array} configurations
		 * @return {void}
		 */
		presentEditorElement: function( CKEDITOR, container, configurations, configuration ) {
			configuration = configurationNormalizer.normalizeConfiguration( configuration );
			console.log( configuration );
		},

		/**
		 * @param {CKEDITOR} CKEDITOR
		 * @param {HTMLElement} container
		 * @param {array} configurations
		 * @return {void}
		 */
		presentEditorElements: function( CKEDITOR, container, configurations ) {
			var i;

			for ( i = 0; i < configurations.length; i += 1 ) {
				this.presentEditorElement( CKEDITOR, container, configurations, configurations[ i ] );
			}
		}

	};

} );
