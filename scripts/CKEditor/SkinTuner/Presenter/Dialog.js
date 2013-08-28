/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [ "CKEditor/SkinTuner/Presenter" ], function( Presenter ) {

	var DialogPresenter; // constructor, function

	/**
	 * @auguments CKEditor/SkinTuner/Presenter
	 * @constructor
	 */
	DialogPresenter = function() {
		Presenter.call( this );
	};
	DialogPresenter.prototype = Object.create( Presenter.prototype );

	/**
	 * @return {array}
	 */
	DialogPresenter.prototype.getSupportedTypes = function() {
		return [ 'dialog' ];
	};

	return DialogPresenter;

} );
