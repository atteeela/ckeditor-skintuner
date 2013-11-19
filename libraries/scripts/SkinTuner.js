/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* jshint browser: true */
/* global define: false */

define( [
	"data-container/Repository",
	"-/Presentation",
	"-/PresentationConfiguration",
	"-/PresentationRepository",
	"-/PresenterRepository"
], function( Repository, Presentation, PresentationConfiguration, PresentationRepository, PresenterRepository ) {

	var SkinTuner; // constructor, function

	/**
	 * @constructor
	 */
	SkinTuner = function() {
		this.editorsRepository = new Repository();
		this.partiallyCreatedEditorsRepository = new Repository();
		this.presentationRepository = new PresentationRepository();
		this.presenterRepository = new PresenterRepository();
	};

	/**
	 * @param {mixed} configuration
	 * @return {CKSource/SkinTuner/PresentationConfiguration}
	 */
	SkinTuner.prototype.encapsulatePresentationConfiguration = function( configuration ) {
		return new PresentationConfiguration( configuration );
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
			editorContainer,
			editorsRepository = this.editorsRepository,
			partiallyCreatedEditorsRepository = this.partiallyCreatedEditorsRepository,
			presentationRepository = this.presentationRepository,
			presentation,
			presentationConfiguration = {},
			presenter;

		presenter = this.presenterRepository.findOneByType( configuration.type );
		if ( !presenter ) {
			throw new Error( "There is no presenter registered for type: " + configuration.type );
		}

		if ( configuration.hasOwnProperty( configuration.type ) ) {
			presentationConfiguration = configuration[ configuration.type ];
		}

		editorContainer = document.getElementById( configuration.id );
		presentation = presenter.present( CKEDITOR, editorContainer, configuration.type, configuration.priority, presentationConfiguration, configuration.config );

		editor = presentation.getEditor();

		partiallyCreatedEditorsRepository.add( editor );
		presentation.addListener( Presentation.EVENT_EDITOR_READY, function() {
			partiallyCreatedEditorsRepository.remove( editor );
			editorsRepository.add( editor );
		} );

		presentationRepository.add( presentation );

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
			// presentation,
			that = this;

		configurations = configurations.map( function( configuration ) {
			return that.encapsulatePresentationConfiguration( configuration );
		} );

		// schedule presentations..

		for ( i = 0; i < configurations.length; i += 1 ) {
			console.log( configurations[ i ].id );
			console.log( configurations[ i ].after );
			// presentation = this.presentEditorElement( CKEDITOR, container, configurations, configurations[ i ] );
		}
	};

	return SkinTuner;

} );
