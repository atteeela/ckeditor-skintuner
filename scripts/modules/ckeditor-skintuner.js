/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [
	"Bender/EventDispatcher/EventDispatcher/Repository",
	"CKEditor/SkinTuner/IdlenessMonitor",
	"CKEditor/SkinTuner/SkinTuner",
	"CKEditor/SkinTuner/SplashScreen"
], function( Repository, IdlenessMonitor, SkinTuner, SplashScreen ) {

	var createTotalPercentageMessage, // private, function
		presentEditorElements; // function

	/**
	 * @param {int} processed
	 * @param {int} total
	 * @return {string}
	 */
	createTotalPercentageMessage = function( processed, total ) {
		return Math.round( ( processed / total ) * 100 ) + "%";
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {array} configurations
	 * @return {void}
	 */
	presentEditorElements = function( CKEDITOR, container, configurations ) {
		var createdEditors = 0,
			i,
			idlenessMonitor,
			partiallyCreatedEditorsRepository,
			skinTuner = new SkinTuner(),
			splashScreen = new SplashScreen( CKEDITOR, container ),
			totalEditors = 0;

		idlenessMonitor = new IdlenessMonitor( skinTuner );

		idlenessMonitor.addListener( IdlenessMonitor.EVENT_BUSY, function() {
			splashScreen.show();
		} );

		idlenessMonitor.addListener( IdlenessMonitor.EVENT_IDLE, function() {
			splashScreen.hide();
		} );

		partiallyCreatedEditorsRepository = skinTuner.partiallyCreatedEditorsRepository;
		partiallyCreatedEditorsRepository.addListener( Repository.EVENT_ITEM_REMOVED, function() {
			createdEditors += 1;
			if ( splashScreen.isActive() ) {
				splashScreen.setMessage( createTotalPercentageMessage( createdEditors, totalEditors ) );
			}
		} );

		for ( i = 0; i < configurations.length; i += 1 ) {
			totalEditors += configurations[ i ].length;
			skinTuner.presentEditorElements( CKEDITOR, container, configurations[ i ] );
		}
	};

	return {

		presentEditorElements: presentEditorElements

	};

} );
