/**
 * @author TristanVALCKE / https://github.com/Itee
 * @author Anonymous
 */
/* global QUnit */

import {
	IcosahedronGeometry,
	IcosahedronBufferGeometry
} from '../../../../src/geometries/IcosahedronGeometry';

export default QUnit.module( 'Geometries', () => {

	QUnit.module( 'IcosahedronGeometry', ( hooks ) => {

		hooks.beforeEach( function () {

			const parameters = {
				radius: 10,
				detail: undefined
			};

			this.geometries = [
				new IcosahedronGeometry(),
				new IcosahedronGeometry( parameters.radius ),
				new IcosahedronGeometry( parameters.radius, parameters.detail ),
			];

		} );

		QUnit.test( 'Standard geometry tests', ( assert ) => {

			runStdGeometryTests( assert, this.geometries );

		} );

	} );

	QUnit.module( 'IcosahedronBufferGeometry', ( hooks ) => {

		hooks.beforeEach( function () {

			const parameters = {
				radius: 10,
				detail: undefined
			};

			this.geometries = [
				new IcosahedronBufferGeometry(),
				new IcosahedronBufferGeometry( parameters.radius ),
				new IcosahedronBufferGeometry( parameters.radius, parameters.detail ),
			];

		} );

		QUnit.test( 'Standard geometry tests', ( assert ) => {

			runStdGeometryTests( assert, this.geometries );

		} );

	} );

} );
