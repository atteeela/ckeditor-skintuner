/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [ "CKEditor/SkinTuner/Presenter" ], function( Presenter ) {

	var MenuPresenter; // constructor, function

	/**
	 * @auguments CKEditor/SkinTuner/Presenter
	 * @constructor
	 */
	MenuPresenter = function() {
		Presenter.call( this );
	};
	MenuPresenter.prototype = Object.create( Presenter.prototype );

	/**
	 * @return {array}
	 */
	MenuPresenter.prototype.getSupportedTypes = function() {
		return [ 'menu' ];
	};

	return MenuPresenter;

} );
