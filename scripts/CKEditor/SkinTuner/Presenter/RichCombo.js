/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [ "CKEditor/SkinTuner/Presenter" ], function( Presenter ) {

	var RichComboPresenter; // constructor, function

	/**
	 * @auguments CKEditor/SkinTuner/Presenter
	 * @constructor
	 */
	RichComboPresenter = function() {
		Presenter.call( this );
	};
	RichComboPresenter.prototype = Object.create( Presenter.prototype );

	/**
	 * @return {array}
	 */
	RichComboPresenter.prototype.getSupportedTypes = function() {
		return [ 'richcombo' ];
	};

	return RichComboPresenter;

} );
