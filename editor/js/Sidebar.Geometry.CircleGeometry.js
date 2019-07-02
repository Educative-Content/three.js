/**
 * @author mrdoob / http://mrdoob.com/
 */

import {
	CircleBufferGeometry,
	Math as _Math
} from '../../build/three.module.js';

import { Row, UIText, Integer, UINumber } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';

var SidebarGeometryCircleGeometry = function ( editor, object ) {

	var strings = editor.strings;

	var container = new Row();

	var geometry = object.geometry;
	var parameters = geometry.parameters;

	// radius

	var radiusRow = new Row();
	var radius = new UINumber( parameters.radius ).onChange( update );

	radiusRow.add( new UIText( strings.getKey( 'sidebar/geometry/circle_geometry/radius' ) ).setWidth( '90px' ) );
	radiusRow.add( radius );

	container.add( radiusRow );

	// segments

	var segmentsRow = new Row();
	var segments = new Integer( parameters.segments ).setRange( 3, Infinity ).onChange( update );

	segmentsRow.add( new UIText( strings.getKey( 'sidebar/geometry/circle_geometry/segments' ) ).setWidth( '90px' ) );
	segmentsRow.add( segments );

	container.add( segmentsRow );

	// thetaStart

	var thetaStartRow = new Row();
	var thetaStart = new UINumber( parameters.thetaStart * _Math.RAD2DEG ).setStep( 10 ).onChange( update );

	thetaStartRow.add( new UIText( strings.getKey( 'sidebar/geometry/circle_geometry/thetastart' ) ).setWidth( '90px' ) );
	thetaStartRow.add( thetaStart );

	container.add( thetaStartRow );

	// thetaLength

	var thetaLengthRow = new Row();
	var thetaLength = new UINumber( parameters.thetaLength * _Math.RAD2DEG ).setStep( 10 ).onChange( update );

	thetaLengthRow.add( new UIText( strings.getKey( 'sidebar/geometry/circle_geometry/thetalength' ) ).setWidth( '90px' ) );
	thetaLengthRow.add( thetaLength );

	container.add( thetaLengthRow );

	//

	function update() {

		editor.execute( new SetGeometryCommand( editor, object, new CircleBufferGeometry(
			radius.getValue(),
			segments.getValue(),
			thetaStart.getValue() * _Math.DEG2RAD,
			thetaLength.getValue() * _Math.DEG2RAD
		) ) );

	}

	return container;

};

export { SidebarGeometryCircleGeometry };
