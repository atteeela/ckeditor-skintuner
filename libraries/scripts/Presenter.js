/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

/* global define: false */

define( [
	"-/EditorPresentation",
	"-/Presentation"
], function( EditorPresentation, Presentation ) {

	var Presenter, // constructor, function
		REGEXP_TAG_HEAD = ( /(?=<\/head>)/ ),
		REGEXP_TAG_SCRIPT = ( /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi ),
		clonePanel, // private, function
		dumpElementToString, // private, function
		stripScripts; // private, function

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {CKEDITOR.ui.floatpanel} panel
	 * @return {CKEDITOR.dom.element}
	 */
	clonePanel = function( CKEDITOR, panel ) {
		var doc,
			el,
			panelFrame,
			panelHtml,
			wrapper;

		doc = panel.element.getFirst().getFrameDocument();
		// element::clone doesn't handle iframe content,
		// extract the iframe content manually.
		panelHtml = dumpElementToString( CKEDITOR, doc );

		el = panel.element.clone( 1 );
		el.setStyles( {
			position: 'static',
			display: 'block',
			opacity: 1
		} );

		// Emulate the structure by compensating the <body> element.
		wrapper = doc.createElement( 'div' );
		doc.getBody().copyAttributes( wrapper );
		panelFrame = el.getFirst();
		panelFrame.remove();
		wrapper.setHtml( panelHtml );
		wrapper.appendTo( el );

		return el;
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {CKEDITOR.dom.element} doc
	 * @return {string}
	 */
	dumpElementToString = function( CKEDITOR, doc ) {
		var html;

		if ( doc.equals( CKEDITOR.document ) ) {
			html = doc.getDocumentElement().getOuterHtml();
		} else {
			html = doc.getBody().getHtml();
		}
		html = doc.getDocumentElement().getOuterHtml();

		if ( CKEDITOR.env.gecko ) {
			return stripScripts( html );
		}

		html = html.replace( REGEXP_TAG_HEAD, function() {
			var css,
				extra = doc.getById( 'cke_ui_color' ),
				i,
				rules;

			if ( extra ) {
				css = '';
				if ( CKEDITOR.env.ie ) {
					css = extra.$.styleSheet.cssText;
				} else {
					rules = extra.$.sheet.cssRules;
					for ( i = 0; i < rules.length; i++ ) {
						css += rules[ i ].cssText;
					}
				}
			}

			return css ? '<style>' + css + '</style>' : '';
		} );

		return stripScripts( html );
	};

	/**
	 * @param {string} html
	 * @return {string}
	 */
	stripScripts = function( html ) {
		return html.replace( REGEXP_TAG_SCRIPT, '' );
	};

	/**
	 * @abstract
	 * @constructor
	 */
	Presenter = function() {};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {Editor} editor
	 * @param {CKEDITOR.ui.floatpanel} panel
	 * @return {void}
	 */
	Presenter.prototype.createEditorPanelSnapshot = function( CKEDITOR, container, editor, panel ) {
		container = CKEDITOR.dom.element.get( container );
		container.append( clonePanel( CKEDITOR, panel ) );
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {Editor} editor
	 * @param {ckeditor-skintuner/Presentation} presentation (optional)
	 * @return {void}
	 */
	Presenter.prototype.destroyEditor = function( CKEDITOR, editor, presentation ) {
		if ( presentation ) {
			CKEDITOR.on( 'instanceDestroyed', function( evt ) {
				if ( editor === evt.editor ) {
					presentation.done();
				}
			} );
		}

		editor.destroy();
	};

	/**
	 * @return {array}
	 */
	Presenter.prototype.getSupportedTypes = function() {
		throw new Error( "This method must be overriden in child object." );
	};

	/**
	 * @param {string} type
	 * @return {bool}
	 */
	Presenter.prototype.isTypeSupported = function( type ) {
		/* jshint bitwise: false */
		return ( ~this.getSupportedTypes().indexOf( type ) );
	};

	/**
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {string} presentationType
	 * @param {int} presentationPriority
	 * @param {object} presentationConfiguration
	 * @param {object} editorConfiguration
	 * @return {ckeditor-skintuner/Presentation}
	 */
	Presenter.prototype.present = function( CKEDITOR, container, presentationType, presentationPriority, presentationConfiguration, editorConfiguration ) {
		var editorPresentation = new EditorPresentation( CKEDITOR, container, editorConfiguration ),
			presentation = new Presentation( editorPresentation, presentationType, presentationPriority, presentationConfiguration ),
			that = this;

		editorPresentation.start();
		presentation.addListenerStart( function() {
			console.log( "PRESENTATION START" );
			that.presentEditor( CKEDITOR, container, presentation, presentationConfiguration, presentation.getEditor(), editorConfiguration );
		} );

		return presentation;
	};

	/**
	 * This method should be overridden in child object.
	 *
	 * @param {CKEDITOR} CKEDITOR
	 * @param {HTMLElement} container
	 * @param {ckeditor-skintuner/Presentation} presentation
	 * @param {object} presentationConfiguration
	 * @param {Editor} editor
	 * @param {object} editorConfiguration
	 * @return {void}
	 */
	Presenter.prototype.presentEditor = function( CKEDITOR, container, presentation, presentationConfiguration, editor, editorConfiguration ) {
		presentation.done();
	};

	return Presenter;

} );
