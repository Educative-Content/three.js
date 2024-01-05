import LightingNode from './LightingNode.js';
import { NodeUpdateType } from '../core/constants.js';
import { uniform } from '../core/UniformNode.js';
import { addNodeClass } from '../core/Node.js';
import { /*vec2,*/ vec3 } from '../shadernode/ShaderNode.js';
import { reference } from '../accessors/ReferenceNode.js';
import { texture } from '../accessors/TextureNode.js';
import { positionWorld } from '../accessors/PositionNode.js';
import { normalWorld } from '../accessors/NormalNode.js';
import MeshBasicNodeMaterial from '../materials/MeshBasicNodeMaterial.js';

import { RenderTarget, Color, DepthTexture, NearestFilter, LessCompare } from 'three';

let depthMaterial = null;

class AnalyticLightNode extends LightingNode {

	constructor( light = null ) {

		super();

		this.updateType = NodeUpdateType.FRAME;

		this.light = light;

		this.rtt = null;
		this.shadowNode = null;

		this.color = new Color();
		this.colorNode = uniform( this.color );

	}

	getHash( /*builder*/ ) {

		return this.light.uuid;

	}

	setupShadow( builder ) {

		if ( this.shadowNode === null ) {

			const shadow = this.light.shadow;
			const rtt = new RenderTarget( shadow.mapSize.width, shadow.mapSize.height );

			const depthTexture = new DepthTexture();
			depthTexture.minFilter = NearestFilter;
			depthTexture.magFilter = NearestFilter;
			depthTexture.image.width = shadow.mapSize.width;
			depthTexture.image.height = shadow.mapSize.height;
			depthTexture.compareFunction = LessCompare;

			rtt.depthTexture = depthTexture;

			shadow.camera.updateProjectionMatrix();

			//

			const bias = reference( 'bias', 'float', shadow );
			const normalBias = reference( 'normalBias', 'float', shadow );

			let shadowCoord = uniform( shadow.matrix ).mul( positionWorld.add( normalWorld.mul( normalBias ) ) );
			shadowCoord = shadowCoord.xyz.div( shadowCoord.w );

			const frustumTest = shadowCoord.x.greaterThanEqual( 0 )
				.and( shadowCoord.x.lessThanEqual( 1 ) )
				.and( shadowCoord.y.greaterThanEqual( 0 ) )
				.and( shadowCoord.y.lessThanEqual( 1 ) )
				.and( shadowCoord.z.lessThanEqual( 1 ) );

			shadowCoord = vec3(
				shadowCoord.x,
				shadowCoord.y.oneMinus(), // WebGPU: Flip Y
				shadowCoord.z.add( bias ).mul( 2 ).sub( 1 ) // WebGPU: Convertion [ 0, 1 ] to [ - 1, 1 ]
			);

			const textureCompare = ( depthTexture, shadowCoord, compare ) => texture( depthTexture, shadowCoord ).compare( compare );
			//const textureCompare = ( depthTexture, shadowCoord, compare ) => compare.step( texture( depthTexture, shadowCoord ) );

			// BasicShadowMap

			const shadowNode = textureCompare( depthTexture, shadowCoord.xy, shadowCoord.z );

			// PCFShadowMap
			/*
			const mapSize = reference( 'mapSize', 'vec2', shadow );
			const radius = reference( 'radius', 'float', shadow );

			const dx1 = radius.div( mapSize.x );
			const dy1 = radius.div( mapSize.y );
			const dx0 = dx1.negate();
			const dy0 = dy1.negate();
			const dx3 = dx1.mul( 2 );
			const dy3 = dy1.mul( 2 );
			const dx2 = dx3.negate();
			const dy2 = dy3.negate();

			shadowNode = textureCompare( depthTexture, shadowCoord.xy.add( vec2( dx0, dy0 ) ), shadowCoord.z ).add(
				textureCompare( depthTexture, shadowCoord.xy.add( vec2( 0, dy0 ) ), shadowCoord.z ),
				textureCompare( depthTexture, shadowCoord.xy.add( vec2( dx1, dy0 ) ), shadowCoord.z ),
				textureCompare( depthTexture, shadowCoord.xy.add( vec2( dx2, dy2 ) ), shadowCoord.z ),
				textureCompare( depthTexture, shadowCoord.xy.add( vec2( 0, dy2 ) ), shadowCoord.z ),
				textureCompare( depthTexture, shadowCoord.xy.add( vec2( dx3, dy2 ) ), shadowCoord.z ),
				textureCompare( depthTexture, shadowCoord.xy.add( vec2( dx0, 0 ) ), shadowCoord.z ),
				textureCompare( depthTexture, shadowCoord.xy.add( vec2( dx2, 0 ) ), shadowCoord.z ),
				textureCompare( depthTexture, shadowCoord.xy, shadowCoord.z ),
				textureCompare( depthTexture, shadowCoord.xy.add( vec2( dx3, 0 ) ), shadowCoord.z ),
				textureCompare( depthTexture, shadowCoord.xy.add( vec2( dx1, 0 ) ), shadowCoord.z ),
				textureCompare( depthTexture, shadowCoord.xy.add( vec2( dx2, dy3 ) ), shadowCoord.z ),
				textureCompare( depthTexture, shadowCoord.xy.add( vec2( 0, dy3 ) ), shadowCoord.z ),
				textureCompare( depthTexture, shadowCoord.xy.add( vec2( dx3, dy3 ) ), shadowCoord.z ),
				textureCompare( depthTexture, shadowCoord.xy.add( vec2( dx0, dy1 ) ), shadowCoord.z ),
				textureCompare( depthTexture, shadowCoord.xy.add( vec2( 0, dy1 ) ), shadowCoord.z ),
				textureCompare( depthTexture, shadowCoord.xy.add( vec2( dx1, dy1 ) ), shadowCoord.z )
			).mul( 1 / 17 );
			*/
			//

			this.rtt = rtt;
			this.colorNode = frustumTest.mix( this.colorNode, this.colorNode.mul( shadowNode ) ); // @TODO: change to .cond() after making TempNodes work with non-uniform control flows

			this.shadowNode = shadowNode;

			//

			this.updateBeforeType = NodeUpdateType.RENDER;

		}

	}

	setup( builder ) {

		super.setup( builder );

		if ( this.light.castShadow ) this.setupShadow( builder );

	}

	updateShadow( frame ) {

		const { rtt, light } = this;
		const { renderer, scene } = frame;

		scene.overrideMaterial = depthMaterial || ( depthMaterial = new MeshBasicNodeMaterial() );

		rtt.setSize( light.shadow.mapSize.width, light.shadow.mapSize.height );

		light.shadow.updateMatrices( light );

		renderer.setRenderTarget( rtt );
		renderer.render( scene, light.shadow.camera );
		renderer.setRenderTarget( null );

		scene.overrideMaterial = null;

	}

	updateBefore( frame ) {

		const { light } = this;

		if ( light.castShadow ) this.updateShadow( frame );

	}

	update( /*frame*/ ) {

		const { light } = this;

		this.color.copy( light.color ).multiplyScalar( light.intensity );

	}

}

export default AnalyticLightNode;

addNodeClass( 'AnalyticLightNode', AnalyticLightNode );
