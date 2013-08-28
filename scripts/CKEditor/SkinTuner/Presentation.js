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

	var Presentation; // constructor, function

	/**
	 * @auguments Bender/EventDispatcher/EventDispatcher
	 * @constructor
	 * @param {Editor} editor instance of CKEditor
	 */
	Presentation = function( editor ) {
		EventDispatcher.call( this );

		var that = this;

		this.editor = editor;

		if ( "ready" === editor.state ) {
			this.notifyEditorReady();
		} else {
			editor.on( 'instanceReady', function() {
				that.notifyEditorReady();
			} );
		}
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
	 * @return {void}
	 */
	Presentation.prototype.done = function() {
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
			Presentation.EVENT_PRESENTATION_DONE
		];
	};

	/**
	 * @fires CKEditor/SkinTuner/Presentation#EVENT_EDITOR_READY
	 * @return {void}
	 */
	Presentation.prototype.notifyEditorReady = function() {
		this.dispatch( Presentation.EVENT_EDITOR_READY, new Event( {
			editor: this.editor,
			presentation: this
		} ) );
	};

	/**
	 * @fires CKEditor/SkinTuner/Presentation#EVENT_EDITOR_READY
	 * @return {void}
	 */
	Presentation.prototype.notifyPresentationDone = function() {
		this.dispatch( Presentation.EVENT_PRESENTATION_DONE, new Event( {
			editor: this.editor,
			presentation: this
		} ) );
	};

	/**
	 * @param {CKEditor/SkinTuner/Presenter} presenter
	 * @return {void}
	 */
	Presentation.prototype.process = function( presenter ) {
		presenter.processEditor( this, this.editor );
	};

	return Presentation;

} );
