/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */
/* jshint browser: true */

define( function() {

	var oReq = new XMLHttpRequest();

	oReq.open( "HEAD", "index.html", true );
	oReq.callback = function( evt ) {
		console.log( arguments );
	};
	oReq.filepath = "foo.js";
	oReq.onload = function( evt ) {
		console.log( oReq.status );
	};
	oReq.send();

} );
