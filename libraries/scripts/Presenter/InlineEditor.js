/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [ "-/Presenter" ], function( Presenter ) {

	var InlineEditorPresenter; // constructor, function

	/**
	 * @auguments ckeditor-skintuner/Presenter
	 * @constructor
	 */
	InlineEditorPresenter = function() {
		Presenter.call( this );
	};
	InlineEditorPresenter.prototype = Object.create( Presenter.prototype );

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {object} editorConfiguration
	 * @return {Editor}
	 */
	InlineEditorPresenter.prototype.createEditor = function( CKEDITOR, container, editorConfiguration ) {
		var element = CKEDITOR.dom.element.createFromHtml( '<div contenteditable="true"></div>' );

		container = CKEDITOR.dom.element.get( container );
		container.append( element );

		return CKEDITOR.inline( element, editorConfiguration );
	};

	/**
	 * @return {array}
	 */
	InlineEditorPresenter.prototype.getSupportedTypes = function() {
		return [ 'inline' ];
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {ckeditor-skintuner/Presentation} presentation
	 * @param {object} presentationConfiguration
	 * @param {Editor} editor
	 * @param {object} editorConfiguration
	 * @return {void}
	 */
	InlineEditorPresenter.prototype.presentEditor = function( CKEDITOR, container, presentation, presentationConfiguration, editor, editorConfiguration ) {
		var clone;

		container = CKEDITOR.dom.element.get( container );

		// panels are hidden when inline editor is not focused
		editor.focus();

		clone = CKEDITOR.document.getById( 'cke_' + editor.name ).clone( true );
		clone.removeStyle( 'position' ); // Stop the space floating.

		container.append( clone );

		this.destroyEditor( CKEDITOR, editor, presentation );
	};

	return InlineEditorPresenter;

} );
