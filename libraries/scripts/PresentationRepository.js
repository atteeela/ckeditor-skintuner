/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [
	"event-dispatcher/EventDispatcherRepository/EventAggregator",
	"-/Presentation"
], function( EventAggregator, Presentation ) {

	var PresentationRepository; // constructor, function

	/**
	 * @auguments event-dispatcher/EventDispatcherRepository/EventAggregator
	 * @borrows ckeditor-skintuner/Presentation#getSupportedEvents as PresentationRepository#getSupportedEvents
	 * @constructor
	 */
	PresentationRepository = function() {
		EventAggregator.call( this );
	};
	PresentationRepository.prototype = Object.create( EventAggregator.prototype );

	/**
	 * @return {array}
	 */
	PresentationRepository.prototype.getSupportedEvents = Presentation.prototype.getSupportedEvents;

	/**
	 * @param {mixed} item
	 * @return {void}
	 */
	PresentationRepository.prototype.isItemAllowed = function( item ) {
		return item instanceof Presentation;
	};

	return PresentationRepository;

} );
