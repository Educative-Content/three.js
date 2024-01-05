import Node, { addNodeClass } from '../core/Node.js';
import { NodeUpdateType } from '../core/constants.js';
import { nodeProxy } from '../shadernode/ShaderNode.js';
import { uniform } from '../core/UniformNode.js';
import { reference } from './ReferenceNode.js';
import { bufferAttribute } from './BufferAttributeNode.js';
import { position } from '../core/PropertyNode.js';

class MorphNode extends Node {

	constructor( mesh ) {

		super( 'void' );

		this.mesh = mesh;
		this.morphBaseInfluence = uniform( 1 );

		this.updateType = NodeUpdateType.OBJECT;

	}

	setupAttribute( name, assignNode = position ) {

		const mesh = this.mesh;
		const attributes = mesh.geometry.morphAttributes[ name ];

		assignNode.mulAssign( this.morphBaseInfluence );

		for ( let i = 0; i < attributes.length; i ++ ) {

			const attribute = attributes[ i ];

			const bufferAttrib = bufferAttribute( attribute.array, 'vec3' );
			const influence = reference( i, 'float', mesh.morphTargetInfluences );

			assignNode.addAssign( bufferAttrib.mul( influence ) );

		}

	}

	setup( /*builder*/ ) {

		this.setupAttribute( 'position' );

	}

	update() {

		const morphBaseInfluence = this.morphBaseInfluence;

		if ( this.mesh.geometry.morphTargetsRelative ) {

			morphBaseInfluence.value = 1;

		} else {

			morphBaseInfluence.value = 1 - this.mesh.morphTargetInfluences.reduce( ( a, b ) => a + b, 0 );

		}

	}

}

export default MorphNode;

export const morph = nodeProxy( MorphNode );

addNodeClass( 'MorphNode', MorphNode );
