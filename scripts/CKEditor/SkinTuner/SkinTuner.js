/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [
	"Bender/EventDispatcher/EventDispatcher/Repository",
	"CKEditor/SkinTuner/ConfigurationNormalizer",
	"CKEditor/SkinTuner/Presentation",
	"CKEditor/SkinTuner/PresenterRepository"
], function( Repository, ConfigurationNormalizer, Presentation, PresenterRepository ) {

	var SkinTuner, // constructor, function

		configurationNormalizer = new ConfigurationNormalizer();

	/**
	 * @constructor
	 */
	SkinTuner = function() {
		this.partiallyCreatedEditorsRepository = new Repository();
		this.presenterRepository = new PresenterRepository();
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {array} configurations
	 * @param {object} configuration
	 * @param {Editor} editor
	 * @return {void}
	 */
	SkinTuner.prototype.onEditorReady = function( CKEDITOR, container, configurations, configuration, editor ) {
		console.log( configuration );
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {array} configurations
	 * @param {object} configuration
	 * @return {void}
	 * @throws {Error} if there is no presenter registered
	 */
	SkinTuner.prototype.presentEditorElement = function( CKEDITOR, container, configurations, configuration ) {
		var editor,
			partiallyCreatedEditorsRepository = this.partiallyCreatedEditorsRepository,
			presentation,
			presenter,
			that = this;

		configuration = configurationNormalizer.normalizeConfiguration( configuration, container );
		presenter = this.presenterRepository.findOneByType( configuration.type );
		if ( !presenter ) {
			throw new Error( "There is no presenter registered for type: " + configuration.type );
		}

		presentation = presenter.present( CKEDITOR, configuration.element, configuration.config );

		editor = presentation.getEditor();
		partiallyCreatedEditorsRepository.add( editor );

		presentation.addListener( Presentation.EVENT_EDITOR_READY, function() {
			partiallyCreatedEditorsRepository.remove( editor );
			that.onEditorReady( CKEDITOR, container, configurations, configuration, editor );
		} );
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {array} configurations
	 * @return {void}
	 */
	SkinTuner.prototype.presentEditorElements = function( CKEDITOR, container, configurations ) {
		var i;

		for ( i = 0; i < configurations.length; i += 1 ) {
			this.presentEditorElement( CKEDITOR, container, configurations, configurations[ i ] );
		}
	};

	return SkinTuner;

} );
