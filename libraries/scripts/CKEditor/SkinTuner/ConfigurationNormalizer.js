/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */
/* jshint browser: true */

define( function() {

	var ConfigurationNormalizer; // constructor, function

	/**
	 * @constructor
	 */
	ConfigurationNormalizer = function() {};

	/**
	 * @param {object} configuration
	 * @param {HTMLElement} container
	 * @return {object}
	 */
	ConfigurationNormalizer.prototype.normalizeConfiguration = function( configuration, container ) {
		configuration = this.normalizeConfigurationElement( configuration, container );
		configuration = this.normalizeConfigurationPriority( configuration, container );
		configuration = this.normalizeConfigurationType( configuration, container );

		return configuration;
	};

	/**
	 * @param {object} configuration
	 * @param {HTMLElement} container
	 * @return {object}
	 * @throws {Error} if cannot find element
	 */
	ConfigurationNormalizer.prototype.normalizeConfigurationElement = function( configuration, container ) {
		var elementId;

		/* jshint sub: true */
		if ( configuration[ "element_id" ] ) {
			elementId = configuration[ "element_id" ];
			try {
				configuration.element = document.getElementById( elementId );
			} catch ( e ) {
				throw new Error( "Unable to find element identified by id: #" + elementId );
			}
			delete configuration[ "element_id" ];
		}

		return configuration;
	};

	/**
	 * @param {object} configuration
	 * @param {HTMLElement} container
	 * @return {object}
	 * @throws {Error} if cannot find element
	 */
	ConfigurationNormalizer.prototype.normalizeConfigurationPriority = function( configuration, container ) {
		if ( !configuration.hasOwnProperty( "priority" ) ) {
			configuration.priority = 0;
		} else {
			configuration.priority = parseInt( configuration.priority, 10 );
		}

		return configuration;
	};

	/**
	 * @param {object} configuration
	 * @param {HTMLElement} container
	 * @return {object}
	 * @throws {Error} if option is missing
	 */
	ConfigurationNormalizer.prototype.normalizeConfigurationType = function( configuration, container ) {
		if ( !configuration.type ) {
			throw new Error( "'type' option must be configured at: " + JSON.stringify( configuration ) );
		}

		configuration.type = configuration.type.toLowerCase();

		return configuration;
	};

	return ConfigurationNormalizer;

} );
