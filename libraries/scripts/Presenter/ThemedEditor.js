/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [ "-/Presenter" ], function( Presenter ) {

	var ThemedEditorPresenter; // constructor, function

	/**
	 * @auguments ckeditor-skintuner/Presenter
	 * @constructor
	 */
	ThemedEditorPresenter = function() {
		Presenter.call( this );
	};
	ThemedEditorPresenter.prototype = Object.create( Presenter.prototype );

	/**
	 * @return {array}
	 */
	ThemedEditorPresenter.prototype.getSupportedTypes = function() {
		return [ 'themed' ];
	};

	return ThemedEditorPresenter;

} );
