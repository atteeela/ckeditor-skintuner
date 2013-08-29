/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [
	"Bender/EventDispatcher/EventAggregator",
	"CKEditor/SkinTuner/Presentation"
], function( EventAggregator, Presentation ) {

	var PresentationRepository; // constructor, function

	/**
	 * @auguments Bender/EventDispatcher/EventAggregator
	 * @borrows CKEditor/SkinTuner/Presentation#getSupportedEvents as PresentationRepository#getSupportedEvents
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
