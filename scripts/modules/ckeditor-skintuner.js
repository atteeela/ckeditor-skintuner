/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [
	"Bender/EventDispatcher/EventDispatcher/Repository",
	"CKEditor/SkinTuner/IdlenessMonitor",
	"CKEditor/SkinTuner/Presentation",
	"CKEditor/SkinTuner/Presenter",
	"CKEditor/SkinTuner/Presenter/Dialog",
	"CKEditor/SkinTuner/Presenter/InlineEditor",
	"CKEditor/SkinTuner/Presenter/Menu",
	"CKEditor/SkinTuner/Presenter/RichCombo",
	"CKEditor/SkinTuner/Presenter/ThemedEditor",
	"CKEditor/SkinTuner/SkinTuner",
	"CKEditor/SkinTuner/SplashScreen"
], function( Repository, IdlenessMonitor, Presentation, Presenter, DialogPresenter, InlineEditorPresenter, MenuPresenter, RichComboPresenter, ThemedEditorPresenter, SkinTuner, SplashScreen ) {

	var createTotalPercentageMessage, // private, function
		dialogPresenter = new DialogPresenter(),
		handleProcessedActions, // private, function
		inlineEditorPresenter = new InlineEditorPresenter(),
		menuPresenter = new MenuPresenter(),
		presentEditorElements, // function
		richComboPresenter = new RichComboPresenter(),
		themedEditorPresenter = new ThemedEditorPresenter();

	/**
	 * @param {int} processed
	 * @param {int} total
	 * @return {string}
	 */
	createTotalPercentageMessage = function( processed, total ) {
		return Math.round( ( processed / total ) * 100 ) + "%";
	};

	/**
	 * @param {CKSource/SkinTuner/SplashScreen} splashScreen
	 * @param {int} processed
	 * @param {int} total
	 * @return {string}
	 */
	handleProcessedActions = function( splashScreen, processed, total ) {
		if ( splashScreen.isActive() ) {
			splashScreen.setMessage( createTotalPercentageMessage( processed, total ) );
		}
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {array} configurations
	 * @return {void}
	 */
	presentEditorElements = function( CKEDITOR, container, configurations ) {
		var processedActions = 0,
			i,
			idlenessMonitor,
			onActionProcessed,
			partiallyCreatedEditorsRepository,
			presenterRepository,
			skinTuner = new SkinTuner(),
			splashScreen = new SplashScreen( CKEDITOR, container ),
			totalActions = 0;

		onActionProcessed = function() {
			processedActions += 1;
			handleProcessedActions( splashScreen, processedActions, totalActions );
		};

		idlenessMonitor = new IdlenessMonitor( skinTuner );

		idlenessMonitor.addListener( IdlenessMonitor.EVENT_SKINTUNER_BUSY, function() {
			splashScreen.show();
		} );

		idlenessMonitor.addListener( IdlenessMonitor.EVENT_SKINTUNER_IDLE, function() {
			splashScreen.hide();
		} );

		presenterRepository = skinTuner.presenterRepository;
		presenterRepository.add( dialogPresenter );
		presenterRepository.add( inlineEditorPresenter );
		presenterRepository.add( menuPresenter );
		presenterRepository.add( richComboPresenter );
		presenterRepository.add( themedEditorPresenter );

		partiallyCreatedEditorsRepository = skinTuner.partiallyCreatedEditorsRepository;
		partiallyCreatedEditorsRepository.addListener( Repository.EVENT_ITEM_REMOVED, onActionProcessed );

		skinTuner.presentationRepository.addListener( Presentation.EVENT_PRESENTATION_DONE, onActionProcessed );

		for ( i = 0; i < configurations.length; i += 1 ) {
			totalActions += ( 2 * configurations[ i ].length );
			skinTuner.presentEditorElements( CKEDITOR, container, configurations[ i ] );
		}
	};

	return {

		presentEditorElements: presentEditorElements

	};

} );
