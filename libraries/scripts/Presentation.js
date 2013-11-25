/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [
	"flow-inspector/Task/Paired"
], function( PairedTask ) {

	var Presentation; // constructor, function

	/**
	 * @auguments flow-inspector/Task/Paired
	 * @constructor
	 * @param {Editor} editor instance of CKEditor
	 * @param {object} editorConfiguration
	 * @param {string} presentationType
	 * @param {object} presentationConfiguration
	 */
	Presentation = function( editorPresenter, presentationType, presentationConfiguration ) {
		PairedTask.call( this, editorPresenter );

		this.presentationType = presentationType;
		this.presentationConfiguration = presentationConfiguration;
	};
	Presentation.prototype = Object.create( PairedTask.prototype );

	/**
	 * @return {Editor}
	 * @throws {Error} if editor instance is not created yet
	 */
	Presentation.prototype.getEditor = function() {
		var editor = this.task.editor;

		if ( !editor ) {
			throw new Error( "Editor instance is not created." );
		}

		return editor;
	};

	return Presentation;

} );
