/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [
	"CKEditor/SkinTuner/Presenter"
], function( Presenter ) {

	var RichComboPresenter, // constructor, function
		REGEXP_CALLBACK_ONCLICK = ( /onclick="([^\(]*)\(([0-9]+),/ ),
		REGEXP_CALLBACK_ONMOUSEUP = ( /onmouseup="([^\(]*)\(([0-9]+),/ );

	/**
	 * @auguments CKEditor/SkinTuner/Presenter
	 * @constructor
	 */
	RichComboPresenter = function() {
		Presenter.call( this );
	};
	RichComboPresenter.prototype = Object.create( Presenter.prototype );

	/**
	 * @return {array}
	 */
	RichComboPresenter.prototype.getSupportedTypes = function() {
		return [ 'richcombo' ];
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {CKEditor/SkinTuner/Presentation} presentation
	 * @param {Editor} editor
	 * @param {CKEDITOR.ui.floatpanel} combo
	 * @param {string} itemToBeMarked
	 * @param {CKEDITOR.ui.floatpanel} panel
	 * @return {void}
	 */
	RichComboPresenter.prototype.onRichComboPanelReady = function( CKEDITOR, container, presentation, editor, combo, itemToBeMarked, panel ) {
		if ( itemToBeMarked ) {
			combo.mark( itemToBeMarked );
		}

		this.createEditorPanelSnapshot( CKEDITOR, container.$, editor, panel );
		this.destroyEditor( CKEDITOR, editor, presentation );
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
	RichComboPresenter.prototype.presentEditor = function( CKEDITOR, container, presentation, presentationConfiguration, editor, editorConfiguration ) {
		var callbackId,
			callbackRegexp,
			combo,
			comboName = presentationConfiguration.name,
			element,
			elementInnerHTML,
			selected = presentationConfiguration.selected,
			that = this;

		container = CKEDITOR.dom.element.get( container );

		combo = editor.ui.get( comboName );
		element = CKEDITOR.document.getById( "cke_" + combo.id );
		elementInnerHTML = element.getHtml();

		editor.once( 'panelShow', function( evt ) {
			that.onRichComboPanelReady( CKEDITOR, container, presentation, editor, combo, selected, evt.data );
		} );

		// these ones emulate combo.open() from CKEditor 3.*
		if ( CKEDITOR.env.ie ) {
			callbackRegexp = REGEXP_CALLBACK_ONMOUSEUP;
		} else {
			callbackRegexp = REGEXP_CALLBACK_ONCLICK;
		}

		callbackId = parseInt( elementInnerHTML.match( callbackRegexp )[ 2 ], 10 );
		CKEDITOR.tools.callFunction( callbackId, element.$ );
	};

	return RichComboPresenter;

} );
