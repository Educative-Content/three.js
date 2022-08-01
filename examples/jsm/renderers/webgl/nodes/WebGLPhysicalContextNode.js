import { ConstNode, ContextNode, NormalNode, ExpressionNode } from 'three/nodes';

class WebGLPhysicalContextNode extends ContextNode {

	static RADIANCE = 'radiance';
	static IRRADIANCE = 'irradiance';

	constructor( scope, node ) {

		super( node, 'vec3' );

		this.scope = scope;

	}

	generate( builder, output ) {

		const scope = this.scope;

		let roughness = null;

		if ( scope === WebGLPhysicalContextNode.RADIANCE ) {

			roughness = new ExpressionNode( 'roughnessFactor', 'float' );

		} else if ( scope === WebGLPhysicalContextNode.IRRADIANCE ) {

			roughness = new ConstNode( 1 );

			this.context.uv = new NormalNode( NormalNode.WORLD );

		}

		this.context.roughness = roughness;

		return super.generate( builder, output );

	}

}

export default WebGLPhysicalContextNode;
