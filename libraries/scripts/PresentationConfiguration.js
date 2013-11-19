/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [
	"configuration-processor/Configuration"
], function( Configuration ) {

	var PresentationConfiguration;

	/**
	 * @auguments {configuration-processor/Configuration}
	 * @constructor
	 * @param {object} options
	 */
	PresentationConfiguration = function( options ) {
		Configuration.call( this, options );
	};
	PresentationConfiguration.prototype = Object.create( Configuration.prototype );

	/**
	 * @const {string}
	 */
	PresentationConfiguration.TYPE_CONTEXTMENU = "contextmenu";

	/**
	 * @const {string}
	 */
	PresentationConfiguration.TYPE_DIALOG = "dialog";

	/**
	 * @const {string}
	 */
	PresentationConfiguration.TYPE_INLINE = "inline";

	/**
	 * @const {string}
	 */
	PresentationConfiguration.TYPE_RICHCOMBO = "richcombo";

	/**
	 * @const {string}
	 */
	PresentationConfiguration.TYPE_THEMED = "themed";

	/**
	 * @return {function}
	 */
	PresentationConfiguration.prototype.expect = function() {
		return this.expectSchema( {
			after: this.expectDefault( this.expectArrayEach( this.expectString() ), [] ),
			config: this.expectDefault( this.expectObject(), this.getDefaultEditorConfiguration() ),
			id: this.expectString(),
			type: this.expectEnum( this.getSupportedPresentationTypes() )
		} );
	};

	/**
	 * @return {array}
	 */
	PresentationConfiguration.prototype.getDefaultEditorConfiguration = function() {
		return {};
	};

	/**
	 * @return {array}
	 */
	PresentationConfiguration.prototype.getSupportedPresentationTypes = function() {
		return [
			PresentationConfiguration.TYPE_CONTEXTMENU,
			PresentationConfiguration.TYPE_DIALOG,
			PresentationConfiguration.TYPE_INLINE,
			PresentationConfiguration.TYPE_RICHCOMBO,
			PresentationConfiguration.TYPE_THEMED
		];
	};

	return PresentationConfiguration;

} );
