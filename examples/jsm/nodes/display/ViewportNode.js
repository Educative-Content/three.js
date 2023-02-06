import Node from '../core/Node.js';
import { uniform, div, vec2, invert } from '../shadernode/ShaderNodeBaseElements.js';
import { Vector2 } from 'three';
import { NodeUpdateType } from '../core/constants.js';

let resolution;

class ViewportNode extends Node {

	constructor( scope ) {

		super();

		this.scope = scope;

		this.isViewportNode = true;

	}

	getNodeType() {

		return this.scope === ViewportNode.COORDINATE ? 'uvec4' : ( this.scope === ViewportNode.COORDINATE ? 'uvec2' : 'vec2' );

	}

	getUpdateType() {

		let updateType = NodeUpdateType.NONE;

		if ( this.scope === ViewportNode.RESOLUTION ) {

			updateType = NodeUpdateType.FRAME;

		}

		this.updateType = updateType;

		return updateType;

	}

	update( { renderer } ) {

		renderer.getSize( resolution || ( resolution = new Vector2() ) );

	}

	construct( builder ) {

		const scope = this.scope;

		if ( scope === ViewportNode.COORDINATE ) return;

		let output = null;

		if ( scope === ViewportNode.RESOLUTION ) {

			output = uniform( resolution || ( resolution = new Vector2() ), 'uvec2' );

		} else {

			const coordinateNode = vec2( new ViewportNode( ViewportNode.COORDINATE ) );
			const resolutionNode = new ViewportNode( ViewportNode.RESOLUTION );

			output = div( coordinateNode, resolutionNode );

			let outX = output.x;
			let outY = output.y;

			if ( /top/i.test( scope ) && builder.isFlipY() ) outY = invert( outY );
			else if ( /bottom/i.test( scope ) && builder.isFlipY() === false ) outY = invert( outY );

			if ( /right/i.test( scope ) ) outX = invert( outX );

			output = vec2( outX, outY );

		}

		return output;

	}

	generate( builder, output ) {

		if ( this.scope === ViewportNode.COORDINATE ) {

			return builder.format( builder.getFragCoord(), this.getNodeType(), output );

		}

		return super.generate( builder, output );

	}

}

ViewportNode.COORDINATE = 'coordinate';
ViewportNode.RESOLUTION = 'resolution';
ViewportNode.TOP_LEFT = 'topLeft';
ViewportNode.BOTTOM_LEFT = 'bottomLeft';
ViewportNode.TOP_RIGHT = 'topRight';
ViewportNode.BOTTOM_RIGHT = 'bottomRight';

export default ViewportNode;
