/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global CKEDITOR: false, HTMLElement: false, define: false */

define( [
	"configuration-processor/configuration-processor",
	"flow-inspector/Task"
], function( configurationProcessor, Task ) {

	var config = configurationProcessor.configurationProcessor,
		EditorPresentation; // constructor, function

	/**
	 * @auguments flow-inspector/Task
	 * @constructor
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {object} editorConfiguration
	 */
	EditorPresentation = function( CKEDITOR, container, editorConfiguration ) {
		Task.call( this );

		this.container = config.assertInstanceOf( HTMLElement, container );
		this.editorConfiguration = editorConfiguration;
	};
	EditorPresentation.prototype = Object.create( Task.prototype );

	/**
	 * @param {mixed} data
	 * @return {void}
	 */
	EditorPresentation.prototype.start = function( data ) {
		var editor,
			that = this;

		this.starting( data );

		editor = CKEDITOR.appendTo( this.container, this.editorConfiguration );
		editor.on( "instanceReady", function() {
			that.editor = editor;
			that.doStart( data );
		} );
	};

	return EditorPresentation;

} );
