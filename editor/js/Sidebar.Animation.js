/**
 * @author mrdoob / http://mrdoob.com/
 */

import { Panel, Div, Break, Select, Button, UIText } from './libs/ui.js';

var SidebarAnimation = function ( editor ) {

	var signals = editor.signals;
	var mixer = editor.mixer;

	var actions = {};

	signals.objectSelected.add( function ( object ) {

		var animations = editor.animations[ object !== null ? object.uuid : '' ];

		if ( animations !== undefined ) {

			container.setDisplay( '' );

			var options = {};
			var firstAnimation;

			for ( var animation of animations ) {

				if ( firstAnimation === undefined ) firstAnimation = animation.name;

				actions[ animation.name ] = mixer.clipAction( animation, object );
				options[ animation.name ] = animation.name;

			}

			animationsSelect.setOptions( options );
			animationsSelect.setValue( firstAnimation );

		} else {

			container.setDisplay( 'none' );

		}

	} );

	signals.objectRemoved.add( function ( object ) {

		var animations = editor.animations[ object !== null ? object.uuid : '' ];

		if ( animations !== undefined ) {

			mixer.uncacheRoot( object );

		}

	} );

	function playAction() {

		actions[ animationsSelect.getValue() ].play();

	}

	function stopAction() {

		actions[ animationsSelect.getValue() ].stop();

	}

	var container = new Panel();
	container.setDisplay( 'none' );

	container.add( new UIText( 'Animations' ).setTextTransform( 'uppercase' ) );
	container.add( new Break() );
	container.add( new Break() );

	var div = new Div();
	container.add( div );

	var animationsSelect = new Select().setFontSize( '12px' );
	div.add( animationsSelect );
	div.add( new Button( 'Play' ).setMarginLeft( '4px' ).onClick( playAction ) );
	div.add( new Button( 'Stop' ).setMarginLeft( '4px' ).onClick( stopAction ) );

	return container;

};

export { SidebarAnimation };
