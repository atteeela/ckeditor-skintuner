/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [
	"Bender/EventDispatcher/EventDispatcher",
	"CKEditor/SkinTuner/SkinTuner"
], function( EventDispatcher, SkinTuner ) {

	var skinTuner = new SkinTuner();

	return skinTuner;

} );
