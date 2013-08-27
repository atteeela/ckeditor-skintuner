/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( function() {

	var ConfigurationNormalizer; // constructor, function

	/**
	 * @constructor
	 */
	ConfigurationNormalizer = function() {};

	/**
	 * @param {object} configuration
	 * @return {object}
	 */
	ConfigurationNormalizer.prototype.normalizeConfiguration = function( configuration ) {
		return configuration;
	};

	return ConfigurationNormalizer;

} );
