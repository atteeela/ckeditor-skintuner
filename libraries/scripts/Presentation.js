/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [
	"flow-inspector/Task"
], function( Task ) {

	var Presentation, // constructor, function
		createPresentationEvent; // private, function

	/**
	 * @Param {ckeditor-skintuner/Presentation} presentation
	 * @return {event-dispatcher/Event}
	 */
	createPresentationEvent = function( presentation ) {
		return {
			editor: presentation.editor,
			editorConfiguration: presentation.editorConfiguration,
			presentation: presentation,
			presentationConfiguration: presentation.presentationConfiguration,
			presentationPriority: presentation.presentationPriority,
			presentationType: presentation.presentationType
		};
	};

	/**
	 * @auguments flow-inspector/Task
	 * @constructor
	 * @param {Editor} editor instance of CKEditor
	 * @param {object} editorConfiguration
	 * @param {string} presentationType
	 * @param {int} presentationPriority
	 * @param {object} presentationConfiguration
	 */
	Presentation = function( editor, editorConfiguration, presentationType, presentationPriority, presentationConfiguration ) {
		Task.call( this );

		var that = this;

		this.editor = editor;
		this.editorConfiguration = editorConfiguration;
		this.presentationType = presentationType;
		this.presentationPriority = presentationPriority;
		this.presentationConfiguration = presentationConfiguration;

		editor.on( 'instanceReady', function() {
			that.notifyEditorReady();
		} );
	};
	Presentation.prototype = Object.create( Task.prototype );

	/**
	 * @constant {string}
	 */
	Presentation.EVENT_EDITOR_READY = "editor.ready";

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
		var taskEvents = Task.prototype.getSupportedEvents.call( this );

		return taskEvents.concat( [
			Presentation.EVENT_EDITOR_READY
		] );
	};

	/**
	 * @fires ckeditor-skintuner/Presentation#EVENT_EDITOR_READY
	 * @return {void}
	 */
	Presentation.prototype.notifyEditorReady = function() {
		this.dispatch( Presentation.EVENT_EDITOR_READY, createPresentationEvent( this ) );
	};

	return Presentation;

} );
