/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */
/* jshint browser: true */

define( [
	"data-container/Repository",
	"-/IdlenessMonitor",
	"-/Presentation",
	"-/Presenter",
	"-/Presenter/ContextMenu",
	"-/Presenter/Dialog",
	"-/Presenter/InlineEditor",
	"-/Presenter/RichCombo",
	"-/Presenter/ThemedEditor",
	"-/SkinTuner",
	"-/SplashScreen",
	"-/UserInterfaceElement",
	"-/UserInterfaceElement/ColorPicker",
	"-/UserInterfaceElement/Toolbar"
], function( Repository, IdlenessMonitor, Presentation, Presenter, DialogPresenter, InlineEditorPresenter, ContextMenuPresenter, RichComboPresenter, ThemedEditorPresenter, SkinTuner, SplashScreen, UserInterfaceElement, ColorPicker, Toolbar ) {

	var colorPicker = new ColorPicker(),
		contextMenuPresenter = new ContextMenuPresenter(),
		createTotalPercentageMessage, // private, function
		dialogPresenter = new DialogPresenter(),
		handleProcessedActions, // private, function
		inlineEditorPresenter = new InlineEditorPresenter(),
		onColorPicked, // private, function
		presentEditorElements, // function
		richComboPresenter = new RichComboPresenter(),
		themedEditorPresenter = new ThemedEditorPresenter(),
		toolbar = new Toolbar();

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
	 * @param {ckeditor-skintuner/SkinTuner} skinTuner
	 * @param {string} color hex RGB with preceding hash
	 * @return {void}
	 */
	onColorPicked = function( CKEDITOR, skinTuner, color ) {
		skinTuner.editorsRepository.forEach( function( editor ) {
			editor.setUiColor( color );
		} );
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {array} configurations
	 * @return {ckeditor-skintuner/SkinTuner}
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

		idlenessMonitor.addListener( IdlenessMonitor.EVENT_BUSY, function() {
			splashScreen.show();
		} );

		idlenessMonitor.addListener( IdlenessMonitor.EVENT_IDLE, function() {
			splashScreen.hide();
		} );

		presenterRepository = skinTuner.presenterRepository;
		presenterRepository.add( contextMenuPresenter );
		presenterRepository.add( dialogPresenter );
		presenterRepository.add( inlineEditorPresenter );
		presenterRepository.add( richComboPresenter );
		presenterRepository.add( themedEditorPresenter );

		partiallyCreatedEditorsRepository = skinTuner.partiallyCreatedEditorsRepository;
		partiallyCreatedEditorsRepository.addListener( Repository.EVENT_ITEM_REMOVED, onActionProcessed );

		skinTuner.presentationRepository.addListener( Presentation.EVENT_PRESENTATION_DONE, onActionProcessed );

		for ( i = 0; i < configurations.length; i += 1 ) {
			totalActions += ( 2 * configurations[ i ].length );
			skinTuner.presentEditorElements( CKEDITOR, container, configurations[ i ] );
		}

		return skinTuner;
	};

	return {

		/**
		 * @param {CKEDITOR} CKEDITOR
		 * @param {ckeditor-skintuner/SkinTuner} skinTuner
		 * @param {HTMLElement} container
		 * @return {void}
		 */
		appendToolbar: function( CKEDITOR, skinTuner, container ) {
			toolbar.addListener( UserInterfaceElement.EVENT_READY, function( evt ) {
				var colorPickerContainer = document.getElementById( "colorpicker" );

				colorPicker.addListener( ColorPicker.EVENT_COLOR_PICKED, function( evt ) {
					onColorPicked( CKEDITOR, skinTuner, evt.color );
				} );
				colorPicker.appendTo( CKEDITOR, colorPickerContainer );
			} );
			toolbar.appendTo( CKEDITOR, container );
		},

		presentEditorElements: presentEditorElements

	};

} );
