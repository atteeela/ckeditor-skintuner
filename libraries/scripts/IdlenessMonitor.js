/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [
	"event-dispatcher/Event",
	"event-dispatcher/EventDispatcher",
	"data-container/Repository",
	"-/Presentation",
	"-/SkinTuner"
], function( Event, EventDispatcher, Repository, Presentation, SkinTuner ) {

	var IdlenessMonitor, // constructor, function
		createIdlenessEvent; // private, function

	/**
	 * @param {ckeditor-skintuner/IdlenessMonitor} idlenessMonitor
	 * @param {ckeditor-skintuner/SkinTuner} skinTuner
	 * @return {event-dispatcher/Event}
	 */
	createIdlenessEvent = function( idlenessMonitor, skinTuner ) {
		return new Event( {
			idlenessMonitor: idlenessMonitor,
			skinTuner: skinTuner
		} );
	};

	/**
	 * @auguments event-dispatcher/EventDispatcher
	 * @constructor
	 * @param {ckeditor-skintuner/SkinTuner} skinTuner
	 */
	IdlenessMonitor = function( skinTuner ) {
		EventDispatcher.call( this );

		var onBusynessDecrease,
			onBusynessIncrease,
			that = this;

		if ( !( skinTuner instanceof SkinTuner ) ) {
			throw new Error( "Expected SkinTuner as an argument." );
		}

		this.busyness = 0;

		/**
		 * @return {void}
		 */
		onBusynessDecrease = function() {
			that.onBusynessDecrease( skinTuner );
		};

		/**
		 * @return {void}
		 */
		onBusynessIncrease = function() {
			that.onBusynessIncrease( skinTuner );
		};

		skinTuner.partiallyCreatedEditorsRepository.addListener( Repository.EVENT_REPOSITORY_EMPTY, onBusynessDecrease );
		skinTuner.partiallyCreatedEditorsRepository.addListener( Repository.EVENT_REPOSITORY_NOT_EMPTY, onBusynessIncrease );
		skinTuner.presentationRepository.addListener( Presentation.EVENT_PRESENTATION_DONE, onBusynessDecrease );
		skinTuner.presentationRepository.addListener( Presentation.EVENT_PRESENTATION_START, onBusynessIncrease );
	};
	IdlenessMonitor.prototype = Object.create( EventDispatcher.prototype );

	IdlenessMonitor.EVENT_BUSY = "busy";
	IdlenessMonitor.EVENT_IDLE = "idle";

	/**
	 * @return {array}
	 */
	IdlenessMonitor.prototype.getSupportedEvents = function() {
		return [
			IdlenessMonitor.EVENT_BUSY,
			IdlenessMonitor.EVENT_IDLE
		];
	};

	/**
	 * @return {bool}
	 */
	IdlenessMonitor.prototype.isIdle = function() {
		return 0 === this.busyness;
	};

	/**
	 * @fires ckeditor-skintuner/EditorRepository#EVENT_BUSY
	 * @param {ckeditor-skintuner/SkinTuner} skinTuner
	 * @return {void}
	 */
	IdlenessMonitor.prototype.notifyBusy = function( skinTuner ) {
		this.dispatch( IdlenessMonitor.EVENT_BUSY, createIdlenessEvent( this, skinTuner ) );
	};

	/**
	 * @fires ckeditor-skintuner/EditorRepository#EVENT_IDLE
	 * @param {ckeditor-skintuner/SkinTuner} skinTuner
	 * @return {void}
	 */
	IdlenessMonitor.prototype.notifyIdle = function( skinTuner ) {
		this.dispatch( IdlenessMonitor.EVENT_IDLE, createIdlenessEvent( this, skinTuner ) );
	};

	/**
	 * @param {ckeditor-skintuner/SkinTuner} skinTuner
	 * @return {void}
	 */
	IdlenessMonitor.prototype.onBusynessDecrease = function( skinTuner ) {
		this.busyness -= 1;

		if ( 0 === this.busyness ) {
			this.notifyIdle( skinTuner );
		}
	};

	/**
	 * @param {ckeditor-skintuner/SkinTuner} skinTuner
	 * @return {void}
	 */
	IdlenessMonitor.prototype.onBusynessIncrease = function( skinTuner ) {
		this.busyness += 1;

		if ( 1 === this.busyness ) {
			this.notifyBusy( skinTuner );
		}
	};

	return IdlenessMonitor;

} );
