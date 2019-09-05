/**
 * @author sunag / http://www.sunag.com.br/
 */

import {
	Color,
	Vector2
} from '../../../../../build/three.module.js';

import { StandardNode } from './StandardNode.js';
import { PropertyNode } from '../../inputs/PropertyNode.js';
import { MulNode } from '../../math/OperatorNode.js';
import { SwitchNode } from '../../utils/SwitchNode.js';
import { NormalMapNode } from '../../misc/NormalMapNode.js';

export class MeshStandardNode extends StandardNode {

	constructor() {

		super();

		this.properties = {
			color: new Color( 0xffffff ),
			roughness: 0.5,
			metalness: 0.5,
			normalScale: new Vector2( 1, 1 )
		};

		this.inputs = {
			color: new PropertyNode( this.properties, 'color', 'c' ),
			roughness: new PropertyNode( this.properties, 'roughness', 'f' ),
			metalness: new PropertyNode( this.properties, 'metalness', 'f' ),
			normalScale: new PropertyNode( this.properties, 'normalScale', 'v2' )
		};

		this.nodeType = "MeshStandard";

	}

	build( builder ) {

		var props = this.properties,
			inputs = this.inputs;

		if ( builder.isShader( 'fragment' ) ) {

			// slots
			// * color
			// * map

			var color = builder.findNode( props.color, inputs.color ),
				map = builder.resolve( props.map );

			this.color = map ? new MulNode( color, map ) : color;

			// slots
			// * roughness
			// * roughnessMap

			var roughness = builder.findNode( props.roughness, inputs.roughness ),
				roughnessMap = builder.resolve( props.roughnessMap );

			this.roughness = roughnessMap ? new MulNode( roughness, new SwitchNode( roughnessMap, "g" ) ) : roughness;

			// slots
			// * metalness
			// * metalnessMap

			var metalness = builder.findNode( props.metalness, inputs.metalness ),
				metalnessMap = builder.resolve( props.metalnessMap );

			this.metalness = metalnessMap ? new MulNode( metalness, new SwitchNode( metalnessMap, "b" ) ) : metalness;

			// slots
			// * normalMap
			// * normalScale

			if ( props.normalMap ) {

				this.normal = new NormalMapNode( builder.resolve( props.normalMap ) );
				this.normal.scale = builder.findNode( props.normalScale, inputs.normalScale );

			} else {

				this.normal = undefined;

			}

			// slots
			// * envMap

			this.environment = builder.resolve( props.envMap );

		}

		// build code

		return super.build( builder );

	}

	toJSON( meta ) {

		var data = this.getJSONNode( meta );

		if ( ! data ) {

			data = this.createJSONNode( meta );

			console.warn( ".toJSON not implemented in", this );

		}

		return data;

	}

}
