/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [
	"CKEditor/SkinTuner/Presenter"
], function( Presenter ) {

	var ContextMenuPresenter, // constructor, function
		REGEXP_ITEM_STATE = ( /\(([^\)]+)\)/ ),
		getMenuItemsFromPresentationConfiguration; // private, function

	/**
	 * @param {object} presentationConfiguration
	 * @return {array}
	 */
	getMenuItemsFromPresentationConfiguration = function( presentationConfiguration ) {
		return presentationConfiguration.items.split( "," );
	};

	/**
	 * @auguments CKEditor/SkinTuner/Presenter
	 * @constructor
	 */
	ContextMenuPresenter = function() {
		Presenter.call( this );
	};
	ContextMenuPresenter.prototype = Object.create( Presenter.prototype );

	/**
	 * @return {array}
	 */
	ContextMenuPresenter.prototype.getSupportedTypes = function() {
		return [ 'contextmenu' ];
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {CKEDITOR.dom.element} container
	 * @param {CKEditor/SkinTuner/Presentation} presentation
	 * @param {Editor} editor
	 * @param {CKEDITOR.ui.floatpanel} panel
	 * @return {void}
	 * @see CKEditor/SkinTuner/Presenter/RichCombo#onRichComboPanelReady
	 */
	ContextMenuPresenter.prototype.onMenuPanelReady = function( CKEDITOR, container, presentation, editor, panel ) {
		this.createEditorPanelSnapshot( CKEDITOR, container.$, editor, panel );
		this.destroyEditor( CKEDITOR, editor, presentation );
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {CKEDITOR.dom.element} container
	 * @param {CKEditor/SkinTuner/Presentation} presentation
	 * @param {Editor} editor
	 * @param {CKEDITOR.plugins.contextMenu} menu
	 * @param {array} menuItems
	 * @return {void}
	 */
	ContextMenuPresenter.prototype.onMenuShow = function( CKEDITOR, container, presentation, editor, menu, menuItems ) {
		var i,
			item,
			resolveItemState,
			state;

		resolveItemState = function( match, state ) {
			if ( "disabled" === state ) {
				return CKEDITOR.TRISTATE_DISABLED;
			}

			if ( "on" === state ) {
				return CKEDITOR.TRISTATE_ON;
			}

			return CKEDITOR.TRISTATE_OFF;
		};

		menu.removeAll();
		menu._.listeners = [];

		for ( i = 0; i < menuItems.length; i += 1 ) {
			item = menuItems[ i ];
			state = item.replace( REGEXP_ITEM_STATE, resolveItemState );

			item = item.replace( REGEXP_ITEM_STATE, '' );
			item = editor.getMenuItem( item );
			item.state = state;

			menu.add( item );
		}
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
	ContextMenuPresenter.prototype.presentEditor = function( CKEDITOR, container, presentation, presentationConfiguration, editor, editorConfiguration ) {
		var menu = editor.contextMenu,
			menuItems = getMenuItemsFromPresentationConfiguration( presentationConfiguration ),
			that = this;

		container = CKEDITOR.dom.element.get( container );

		editor.once( 'panelShow', function( evt ) {
			that.onMenuPanelReady( CKEDITOR, container, presentation, editor, evt.data );
		} );

		menu._.onShow = function() {
			that.onMenuShow( CKEDITOR, container, presentation, editor, menu, menuItems );
		};

		menu.open( container, null, 0, 0 );
	};

	return ContextMenuPresenter;

} );
