/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* jshint browser: true */
/* global define: false */

define( [
	"data-container/Repository",
	"dependency-manager/DependencyGraph",
	"dependency-manager/Scheduler",
	"-/Presentation",
	"-/PresentationConfiguration",
	"-/PresentationRepository",
	"-/PresenterRepository"
], function( Repository, DependencyGraph, Scheduler, Presentation, PresentationConfiguration, PresentationRepository, PresenterRepository ) {

	var SkinTuner; // constructor, function

	/**
	 * @constructor
	 */
	SkinTuner = function() {
		this.editorsRepository = new Repository();
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
		var editorContainer,
			editorsRepository = this.editorsRepository,
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

		presentation.task.addListenerDone( function() {
			editorsRepository.add( presentation.getEditor() );
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
		var that = this;

		configurations = configurations.map( function( configuration ) {
			return that.encapsulatePresentationConfiguration( configuration );
		} );

		this.executePresentations( CKEDITOR, container, configurations );
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {array} configurations
	 * @return {void}
	 */
	SkinTuner.prototype.executePresentations = function( CKEDITOR, container, configurations ) {
		var after,
			configurationsMap = {},
			dependencies = new DependencyGraph(),
			i,
			presentation,
			scheduler = new Scheduler();

		for ( i = 0; i < configurations.length; i += 1 ) {
			presentation = this.presentEditorElement( CKEDITOR, container, configurations, configurations[ i ] );
			configurationsMap[ configurations[ i ].id ] = {
				configuration: configurations[ i ],
				presentation: presentation
			};
			dependencies.add( presentation );
		}

		for ( presentation in configurationsMap ) {
			if ( configurationsMap.hasOwnProperty( presentation ) ) {
				after = configurationsMap[ presentation ].configuration.after;
				for ( i = 0; i < after.length; i += 1 ) {
					dependencies.get( configurationsMap[ after[ i ] ].presentation ).next.add( configurationsMap[ presentation ].presentation );
				}
			}
		}

		return scheduler.execute( dependencies );
	};

	return SkinTuner;

} );
