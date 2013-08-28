/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [ "CKEditor/SkinTuner/Presenter" ], function( Presenter ) {

	var InlineEditorPresenter; // constructor, function

	/**
	 * @auguments CKEditor/SkinTuner/Presenter
	 * @constructor
	 */
	InlineEditorPresenter = function() {
		Presenter.call( this );
	};
	InlineEditorPresenter.prototype = Object.create( Presenter.prototype );

	/**
	 * @return {array}
	 */
	InlineEditorPresenter.prototype.getSupportedTypes = function() {
		return [ 'inline' ];
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {object} editorConfiguration
	 * @return {Editor}
	 */
	InlineEditorPresenter.prototype.createEditor = function( CKEDITOR, container, editorConfiguration ) {
		return CKEDITOR.inline( container, editorConfiguration );
	};

	return InlineEditorPresenter;

} );
