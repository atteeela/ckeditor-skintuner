/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [
	"Bender/EventDispatcher/Event",
	"Bender/EventDispatcher/EventDispatcher"
], function( Event, EventDispatcher ) {

	var UserInterfaceElement;

	/**
	 * @abstract
	 * @auguments Bender/EventDispatcher/EventDispatcher
	 * @constructor
	 */
	UserInterfaceElement = function() {
		EventDispatcher.call( this );
	};
	UserInterfaceElement.prototype = Object.create( EventDispatcher.prototype );

	/**
	 * @constant {string}
	 */
	UserInterfaceElement.EVENT_READY = "event.ready";

	/**
	 * @abstract
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @return {void}
	 */
	UserInterfaceElement.prototype.appendTo = function( CKEDITOR, container ) {
		throw new Error( "This method must be overridden in child object." );
	};

	/**
	 * @return {array}
	 */
	UserInterfaceElement.prototype.getSupportedEvents = function() {
		return [
			UserInterfaceElement.EVENT_READY
		];
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @return {Bender/EventDispatcher/Event} dispatched event
	 */
	UserInterfaceElement.prototype.notifyUserInterfaceElementReady = function( CKEDITOR, container ) {
		return this.dispatch( UserInterfaceElement.EVENT_READY, new Event( {
			container: container,
			userInterfaceElement: this
		} ) );
	};

	return UserInterfaceElement;

} );
