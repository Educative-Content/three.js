/**
 * @author sunag / http://www.sunag.com.br/
 */

import { TempNode } from '../core/TempNode.js';
import { FunctionNode } from '../core/FunctionNode.js';
import { FloatNode } from '../inputs/FloatNode.js';
import { PositionNode } from '../accessors/PositionNode.js';

export const DEPTH_COLOR = new FunctionNode( [
	"float depthColor( float mNear, float mFar ) {",

	"	#ifdef USE_LOGDEPTHBUF_EXT",

	"		float depth = gl_FragDepthEXT / gl_FragCoord.w;",

	"	#else",

	"		float depth = gl_FragCoord.z / gl_FragCoord.w;",

	"	#endif",

	"	return 1.0 - smoothstep( mNear, mFar, depth );",

	"}"
].join( "\n" ) );

export class CameraNode extends TempNode {

	constructor( scope, camera ) {

		super( 'v3' );

		this.setScope( scope || CameraNode.POSITION );
		this.setCamera( camera );

		this.nodeType = "Camera";

	}

	setCamera( camera ) {

		this.camera = camera;
		this.updateFrame = camera !== undefined ? this.onUpdateFrame : undefined;

	};

	setScope( scope ) {

		switch ( this.scope ) {

			case CameraNode.DEPTH:

				delete this.near;
				delete this.far;

				break;

		}

		this.scope = scope;

		switch ( scope ) {

			case CameraNode.DEPTH:

				var camera = this.camera;

				this.near = new FloatNode( camera ? camera.near : 1 );
				this.far = new FloatNode( camera ? camera.far : 1200 );

				break;

		}

	}

	getType() {

		switch ( this.scope ) {

			case CameraNode.DEPTH:

				return 'f';

		}

		return this.type;

	}

	getUnique() {

		switch ( this.scope ) {

			case CameraNode.DEPTH:
			case CameraNode.TO_VERTEX:

				return true;

		}

		return false;

	}

	getShared() {

		switch ( this.scope ) {

			case CameraNode.POSITION:

				return false;

		}

		return true;

	}

	generate( builder, output ) {

		var result;

		switch ( this.scope ) {

			case CameraNode.POSITION:

				result = 'cameraPosition';

				break;

			case CameraNode.DEPTH:

				var depthColor = builder.include( DEPTH_COLOR );

				result = depthColor + '( ' + this.near.build( builder, 'f' ) + ', ' + this.far.build( builder, 'f' ) + ' )';

				break;

			case CameraNode.TO_VERTEX:

				result = 'normalize( ' + new PositionNode( PositionNode.WORLD ).build( builder, 'v3' ) + ' - cameraPosition )';

				break;

		}

		return builder.format( result, this.getType( builder ), output );

	}

	onUpdateFrame() {

		switch ( this.scope ) {

			case CameraNode.DEPTH:

				var camera = this.camera;

				this.near.value = camera.near;
				this.far.value = camera.far;

				break;

		}

	}

	copy( source ) {

		super.copy( source );

		this.setScope( source.scope );

		if ( source.camera ) {

			this.setCamera( source.camera );

		}

		switch ( source.scope ) {

			case CameraNode.DEPTH:

				this.near.number = source.near;
				this.far.number = source.far;

				break;

		}

		return this;

	}

	toJSON( meta ) {

		var data = this.getJSONNode( meta );

		if ( ! data ) {

			data = this.createJSONNode( meta );

			data.scope = this.scope;

			if ( this.camera ) data.camera = this.camera.uuid;

			switch ( this.scope ) {

				case CameraNode.DEPTH:

					data.near = this.near.value;
					data.far = this.far.value;

					break;

			}

		}

		return data;

	}

}

CameraNode.POSITION = 'position';
CameraNode.DEPTH = 'depth';
CameraNode.TO_VERTEX = 'toVertex';
