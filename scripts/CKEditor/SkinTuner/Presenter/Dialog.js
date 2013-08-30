/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [
	"CKEditor/SkinTuner/Presentation",
	"CKEditor/SkinTuner/Presenter"
], function( Presentation, Presenter ) {

	var DialogPresenter, // constructor, function

		execEditorCommand, // private, function
		ongoingPresentation;

	/**
	 * @param {CKEditor/SkinTuner/Presentation} presentation
	 * @param {Editor} editor
	 * @param {string} dialogName
	 * @return {void}
	 * @throws {Error} if race condition occurred
	 */
	execEditorCommand = function( presentation, editor, dialogName ) {
		if ( !ongoingPresentation ) {
			ongoingPresentation = presentation;
			ongoingPresentation.addListener( Presentation.EVENT_PRESENTATION_DONE, function() {
				ongoingPresentation = null;
			} );
			editor.execCommand( dialogName );

			return;
		}

		ongoingPresentation.addListener( Presentation.EVENT_PRESENTATION_DONE, function() {
			execEditorCommand( presentation, editor, dialogName );
		} );
	};

	/**
	 * @auguments CKEditor/SkinTuner/Presenter
	 * @constructor
	 */
	DialogPresenter = function() {
		Presenter.call( this );
	};
	DialogPresenter.prototype = Object.create( Presenter.prototype );

	/**
	 * @return {array}
	 */
	DialogPresenter.prototype.getSupportedTypes = function() {
		return [ 'dialog' ];
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {CKEditor/SkinTuner/Presentation} presentation
	 * @param {Editor} editor
	 * @param {string} tabName
	 * @param {CKEDITOR.dialog} dialog
	 * @return {void}
	 */
	DialogPresenter.prototype.onDialogHide = function( CKEDITOR, container, presentation, editor, tabName, dialog ) {
		this.destroyEditor( CKEDITOR, editor, presentation );
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {CKEditor/SkinTuner/Presentation} presentation
	 * @param {Editor} editor
	 * @param {string} tabName
	 * @param {CKEDITOR.dialog} dialog
	 * @return {void}
	 */
	DialogPresenter.prototype.onDialogShow = function( CKEDITOR, container, presentation, editor, tabName, dialog ) {
		var clone,
			that = this;

		if ( tabName ) {
			dialog.selectPage( tabName );
		}

		container = CKEDITOR.dom.element.get( container );

		clone = dialog._.element.clone( true );
		clone.getFirst().setStyles( {
			left: 0,
			top: 0,
			right: 0,
			'z-index': 1,
			position: 'relative'
		} );

		dialog.destroy();

		setTimeout( function() {
			// dialog.on( 'hide', ... ); seems not to work
			container.append( clone );
			that.onDialogHide( CKEDITOR, container.$, presentation, editor, tabName, dialog );
		}, 100 );
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {CKEditor/SkinTuner/Presentation} presentation
	 * @param {object} presentationConfiguration
	 * @param {Editor} editor
	 * @param {object} editorConfiguration
	 * @return {void}
	 */
	DialogPresenter.prototype.presentEditor = function( CKEDITOR, container, presentation, presentationConfiguration, editor, editorConfiguration ) {
		var dialogName = presentationConfiguration.name,
			tabName = presentationConfiguration.tab,
			that = this;

		editor.once( 'dialogShow', function( evt ) {
			that.onDialogShow( CKEDITOR, container, presentation, editor, tabName, evt.data );
		} );

		execEditorCommand( presentation, editor, dialogName );
	};

	return DialogPresenter;

} );
