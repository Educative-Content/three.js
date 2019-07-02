/**
 * @author mrdoob / http://mrdoob.com/
 */

import {
	REVISION
} from '../../build/three.module.js';

import { Panel, UIText } from './libs/ui.js';
import { Boolean } from './libs/ui.three.js';

var MenubarStatus = function ( editor ) {

	var strings = editor.strings;

	var container = new Panel();
	container.setClass( 'menu right' );

	var autosave = new Boolean( editor.config.getKey( 'autosave' ), strings.getKey( 'menubar/status/autosave' ) );
	autosave.text.setColor( '#888' );
	autosave.onChange( function () {

		var value = this.getValue();

		editor.config.setKey( 'autosave', value );

		if ( value === true ) {

			editor.signals.sceneGraphChanged.dispatch();

		}

	} );
	container.add( autosave );

	editor.signals.savingStarted.add( function () {

		autosave.text.setTextDecoration( 'underline' );

	} );

	editor.signals.savingFinished.add( function () {

		autosave.text.setTextDecoration( 'none' );

	} );

	var version = new UIText( 'r' + REVISION );
	version.setClass( 'title' );
	version.setOpacity( 0.5 );
	container.add( version );

	return container;

};

export { MenubarStatus };
