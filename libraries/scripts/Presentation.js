/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [
	"event-dispatcher/Event",
	"event-dispatcher/EventDispatcher"
], function( Event, EventDispatcher ) {

	var Presentation, // constructor, function
		createPresentationEvent; // private, function

	/**
	 * @Param {ckeditor-skintuner/Presentation} presentation
	 * @return {event-dispatcher/Event}
	 */
	createPresentationEvent = function( presentation ) {
		return new Event( {
			editor: presentation.editor,
			editorConfiguration: presentation.editorConfiguration,
			presentation: presentation,
			presentationConfiguration: presentation.presentationConfiguration,
			presentationPriority: presentation.presentationPriority,
			presentationType: presentation.presentationType
		} );
	};

	/**
	 * @auguments event-dispatcher/EventDispatcher
	 * @constructor
	 * @param {Editor} editor instance of CKEditor
	 * @param {object} editorConfiguration
	 * @param {string} presentationType
	 * @param {int} presentationPriority
	 * @param {object} presentationConfiguration
	 */
	Presentation = function( editor, editorConfiguration, presentationType, presentationPriority, presentationConfiguration ) {
		EventDispatcher.call( this );

		var that = this;

		this.editor = editor;
		this.editorConfiguration = editorConfiguration;
		this.isDone = false;
		this.presentationType = presentationType;
		this.presentationPriority = presentationPriority;
		this.presentationConfiguration = presentationConfiguration;

		editor.on( 'instanceReady', function() {
			that.notifyEditorReady();
		} );
	};
	Presentation.prototype = Object.create( EventDispatcher.prototype );

	/**
	 * @constant {string}
	 */
	Presentation.EVENT_EDITOR_READY = "editor.ready";

	/**
	 * @constant {string}
	 */
	Presentation.EVENT_PRESENTATION_DONE = "presentation.done";

	/**
	 * @constant {string}
	 */
	Presentation.EVENT_PRESENTATION_START = "presentation.start";

	/**
	 * @return {void}
	 */
	Presentation.prototype.done = function() {
		this.isDone = true;
		this.notifyPresentationDone();
	};

	/**
	 * @return {Editor}
	 */
	Presentation.prototype.getEditor = function() {
		return this.editor;
	};

	/**
	 * @return {array}
	 */
	Presentation.prototype.getSupportedEvents = function() {
		return [
			Presentation.EVENT_EDITOR_READY,
			Presentation.EVENT_PRESENTATION_DONE,
			Presentation.EVENT_PRESENTATION_START
		];
	};

	/**
	 * @fires ckeditor-skintuner/Presentation#EVENT_EDITOR_READY
	 * @return {void}
	 */
	Presentation.prototype.notifyEditorReady = function() {
		this.dispatch( Presentation.EVENT_EDITOR_READY, createPresentationEvent( this ) );
	};

	/**
	 * @fires ckeditor-skintuner/Presentation#EVENT_PRESENTATION_DONE
	 * @return {void}
	 */
	Presentation.prototype.notifyPresentationDone = function() {
		this.dispatch( Presentation.EVENT_PRESENTATION_DONE, createPresentationEvent( this ) );
	};

	/**
	 * @fires ckeditor-skintuner/Presentation#EVENT_PRESENTATION_START
	 * @return {void}
	 */
	Presentation.prototype.notifyPresentationStart = function() {
		this.dispatch( Presentation.EVENT_PRESENTATION_START, createPresentationEvent( this ) );
	};

	/**
	 * @return {void}
	 */
	Presentation.prototype.start = function() {
		this.notifyPresentationStart();
	};

	return Presentation;

} );
