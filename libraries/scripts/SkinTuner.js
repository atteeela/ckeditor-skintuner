/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [
	"data-container/Repository",
	"-/ConfigurationNormalizer",
	"-/Presentation",
	"-/PresentationRepository",
	"-/PresenterRepository"
], function( Repository, ConfigurationNormalizer, Presentation, PresentationRepository, PresenterRepository ) {

	var SkinTuner; // constructor, function

	/**
	 * @constructor
	 */
	SkinTuner = function() {
		this.configurationNormalizer = new ConfigurationNormalizer();
		this.editorsRepository = new Repository();
		this.partiallyCreatedEditorsRepository = new Repository();
		this.presentationRepository = new PresentationRepository();
		this.presenterRepository = new PresenterRepository();
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {array} configurations
	 * @param {object} editorConfiguration
	 * @param {string} presentationType
	 * @param {int} presentationPriority
	 * @param {object} presentationConfiguration
	 * @return {void}
	 */
	SkinTuner.prototype.onPresentationDone = function( CKEDITOR, container, configurations, editorConfiguration, presentationType, presentationPriority, presentationConfiguration ) {
		console.log( presentationType );
		console.log( presentationPriority );
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {array} configurations
	 * @param {object} configuration
	 * @return {ckeditor-skintuner/Presentation}
	 * @throws {Error} if there is no presenter registered
	 */
	SkinTuner.prototype.presentEditorElement = function( CKEDITOR, container, configurations, configuration ) {
		var editor,
			editorsRepository = this.editorsRepository,
			partiallyCreatedEditorsRepository = this.partiallyCreatedEditorsRepository,
			presentationRepository = this.presentationRepository,
			presentation,
			presentationConfiguration = {},
			presenter,
			that = this;

		presenter = this.presenterRepository.findOneByType( configuration.type );
		if ( !presenter ) {
			throw new Error( "There is no presenter registered for type: " + configuration.type );
		}

		if ( configuration.hasOwnProperty( configuration.type ) ) {
			presentationConfiguration = configuration[ configuration.type ];
		}

		presentation = presenter.present( CKEDITOR, configuration.element, configuration.type, configuration.priority, presentationConfiguration, configuration.config );

		editor = presentation.getEditor();

		partiallyCreatedEditorsRepository.add( editor );
		presentation.addListener( Presentation.EVENT_EDITOR_READY, function() {
			partiallyCreatedEditorsRepository.remove( editor );
			editorsRepository.add( editor );
		} );

		presentationRepository.add( presentation );
		presentation.addListener( Presentation.EVENT_PRESENTATION_DONE, function( evt ) {
			that.onPresentationDone( CKEDITOR, container, configurations, evt.editorConfiguration, evt.presentationType, evt.presentationPriority, evt.presentationConfiguration );
		} );

		return presentation;
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {array} configurations
	 * @return {void}
	 */
	SkinTuner.prototype.presentEditorElements = function( CKEDITOR, container, configurations ) {
		var i,
			presentation,
			that = this;

		configurations = configurations.map( function( configuration ) {
			return that.configurationNormalizer.normalizeConfiguration( configuration, container );
		} );

		configurations = this.sortConfigurations( CKEDITOR, container, configurations );

		for ( i = 0; i < configurations.length; i += 1 ) {
			presentation = this.presentEditorElement( CKEDITOR, container, configurations, configurations[ i ] );
		}
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {array} configurations
	 * @return {void}
	 */
	SkinTuner.prototype.sortConfigurations = function( CKEDITOR, container, configurations ) {
		return configurations.sort( function( a, b ) {
			return b.priority - a.priority;
		} );
	};

	return SkinTuner;

} );
