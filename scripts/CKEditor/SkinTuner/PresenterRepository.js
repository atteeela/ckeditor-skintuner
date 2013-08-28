/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [
	"Bender/EventDispatcher/EventAggregator",
	"CKEditor/SkinTuner/Presenter"
], function( EventAggregator, Presenter ) {

	var PresenterRepository; // constructor, function

	/**
	 * @auguments Bender/EventDispatcher/EventAggregator
	 * @constructor
	 */
	PresenterRepository = function() {
		EventAggregator.call( this );
	};
	PresenterRepository.prototype = Object.create( EventAggregator.prototype );

	/**
	 * @param {string} type
	 * @return {Presenter|null}
	 */
	PresenterRepository.prototype.findOneByType = function( type ) {
		var i,
			items = this.items;

		for ( i = 0; i < items.length; i += 1 ) {
			if ( items[ i ].isTypeSupported( type ) ) {
				return items[ i ];
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
