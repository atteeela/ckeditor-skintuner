/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [
	"Bender/EventDispatcher/Event",
	"Bender/EventDispatcher/EventDispatcher",
	"Bender/EventDispatcher/EventDispatcher/Repository",
	"CKEditor/SkinTuner/SkinTuner"
], function( Event, EventDispatcher, Repository, SkinTuner ) {

	var IdlenessMonitor, // constructor, function

		createIdlenessEvent; // private, function

	/**
	 * @param {CKEditor/SkinTuner/IdlenessMonitor} idlenessMonitor
	 * @param {CKEditor/SkinTuner/SkinTuner} skinTuner
	 * @return {Bender/EventDispatcher/Event}
	 */
	createIdlenessEvent = function( idlenessMonitor, skinTuner ) {
		return new Event( {
			idlenessMonitor: idlenessMonitor,
			skinTuner: skinTuner
		} );
	};

	/**
	 * @auguments Bender/EventDispatcher/EventDispatcher
	 * @constructor
	 * @param {CKEditor/SkinTuner/SkinTuner} skinTuner
	 */
	IdlenessMonitor = function( skinTuner ) {
		EventDispatcher.call( this );

		var that = this;

		if ( !( skinTuner instanceof SkinTuner ) ) {
			throw new Error( "Expected SkinTuner as an argument." );
		}

		this.busyness = 0;

		skinTuner.partiallyCreatedEditorsRepository.addListener( Repository.EVENT_REPOSITORY_EMPTY, function() {
			that.onEditorsBuildingStop( skinTuner );
		} );

		skinTuner.partiallyCreatedEditorsRepository.addListener( Repository.EVENT_REPOSITORY_NOT_EMPTY, function() {
			that.onEditorsBuildingStart( skinTuner );
		} );
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
	 * @fires CKEditor/SkinTuner/EditorRepository#EVENT_BUSY
	 * @param {CKEditor/SkinTuner/SkinTuner} skinTuner
	 * @return {void}
	 */
	IdlenessMonitor.prototype.notifyBusy = function( skinTuner ) {
		this.dispatch( IdlenessMonitor.EVENT_BUSY, createIdlenessEvent( this, skinTuner ) );
	};

	/**
	 * @fires CKEditor/SkinTuner/EditorRepository#EVENT_IDLE
	 * @param {CKEditor/SkinTuner/SkinTuner} skinTuner
	 * @return {void}
	 */
	IdlenessMonitor.prototype.notifyIdle = function( skinTuner ) {
		this.dispatch( IdlenessMonitor.EVENT_IDLE, createIdlenessEvent( this, skinTuner ) );
	};

	/**
	 * @param {CKEditor/SkinTuner/SkinTuner} skinTuner
	 * @return {void}
	 */
	IdlenessMonitor.prototype.onEditorsBuildingStart = function( skinTuner ) {
		this.busyness += 1;

		if ( 1 === this.busyness ) {
			this.notifyBusy( skinTuner );
		}
	};

	/**
	 * @param {CKEditor/SkinTuner/SkinTuner} skinTuner
	 * @return {void}
	 */
	IdlenessMonitor.prototype.onEditorsBuildingStop = function( skinTuner ) {
		this.busyness -= 1;

		if ( 0 === this.busyness ) {
			this.notifyIdle( skinTuner );
		}
	};

	return IdlenessMonitor;

} );
