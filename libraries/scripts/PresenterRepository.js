/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [
	"data-container/Repository",
	"-/Presenter"
], function( Repository, Presenter ) {

	var PresenterRepository; // constructor, function

	/**
	 * @auguments data-container/Repository
	 * @constructor
	 */
	PresenterRepository = function() {
		Repository.call( this );
	};
	PresenterRepository.prototype = Object.create( Repository.prototype );

	/**
	 * @param {string} type
	 * @return {Presenter|null}
	 */
	PresenterRepository.prototype.findOneByType = function( type ) {
		var i,
			list = this.list;

		for ( i = 0; i < list.length; i += 1 ) {
			if ( list[ i ].isTypeSupported( type ) ) {
				return list[ i ];
			}
		}
	};

	/**
	 * @param {mixed} item
	 * @return {void}
	 */
	PresenterRepository.prototype.isItemAllowed = function( item ) {
		return item instanceof Presenter;
	};

	return PresenterRepository;

} );
