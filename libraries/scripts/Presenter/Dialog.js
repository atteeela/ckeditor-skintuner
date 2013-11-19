/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [
	"-/Presentation",
	"-/Presenter"
], function( Presentation, Presenter ) {

	var DialogPresenter; // constructor, function

	/**
	 * @auguments ckeditor-skintuner/Presenter
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
	 * @param {ckeditor-skintuner/Presentation} presentation
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
	 * @param {ckeditor-skintuner/Presentation} presentation
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
	 * @param {ckeditor-skintuner/Presentation} presentation
	 * @param {object} presentationConfiguration
	 * @param {Editor} editor
	 * @param {object} editorConfiguration
	 * @return {void}
	 */
	DialogPresenter.prototype.presentEditor = function( CKEDITOR, container, presentation, presentationConfiguration, editor, editorConfiguration ) {
		var dialogName = presentationConfiguration.name,
			tabName = presentationConfiguration.tab,
			that = this;

		CKEDITOR.ui.dialog.file.prototype.getInputElement = function() {
			// this one causes security exceptions in IE
			return false;
		};

		editor.once( 'dialogShow', function( evt ) {
			that.onDialogShow( CKEDITOR, container, presentation, editor, tabName, evt.data );
		} );

		editor.execCommand( dialogName );
	};

	return DialogPresenter;

} );
