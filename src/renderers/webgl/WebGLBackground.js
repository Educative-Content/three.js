/**
 * @author mrdoob / http://mrdoob.com/
 */

import { BackSide } from '../../constants';
import { OrthographicCamera } from '../../cameras/OrthographicCamera';
import { PerspectiveCamera } from '../../cameras/PerspectiveCamera';
import { BoxBufferGeometry } from '../../geometries/BoxGeometry';
import { PlaneBufferGeometry } from '../../geometries/PlaneGeometry';
import { MeshBasicMaterial } from '../../materials/MeshBasicMaterial';
import { ShaderMaterial } from '../../materials/ShaderMaterial';
import { Color } from '../../math/Color';
import { Mesh } from '../../objects/Mesh';
import { ShaderLib } from '../shaders/ShaderLib';

function WebGLBackground( renderer, state, geometries, premultipliedAlpha ) {

	var clearColor = new Color( 0x000000 );
	var clearAlpha = 0;

	var planeCamera, planeMesh;
	var boxMesh;

	function initPlaneMesh () {
		if ( planeCamera !== undefined ) return;

		planeCamera = new OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );

		planeMesh = new Mesh(
			new PlaneBufferGeometry( 2, 2 ),
			new MeshBasicMaterial( { fog: false } )
		);

		planeMesh.position.z = -1;
		planeMesh.updateMatrixWorld();
		planeMesh.modelViewMatrix.multiplyMatrices( planeCamera.matrixWorldInverse, planeMesh.matrixWorld );

		geometries.update( planeMesh.geometry );
	}

	function render( renderData, renderList, scene, camera, forceClear, clearRegion ) {

		var background = scene.background;

		if ( background === null ) {

			setClear( clearColor, clearAlpha );

		} else if ( background && background.isColor ) {

			setClear( background, 1 );
			forceClear = true;

		}

		if ( renderer.autoClear || forceClear ) {

			if ( clearRegion ) {

				initPlaneMesh();

				planeMesh.material.map = null;
				planeMesh.material.color = background === null ? clearColor : background;
				planeMesh.material.color = new THREE.Color(0,0,0);
				planeMesh.material.depthTest = true;
				planeMesh.material.depthFunc = THREE.AlwaysDepth;
				planeMesh.material.depthWrite = true;

				renderer.renderBufferDirect( renderData, planeCamera, null, planeMesh.geometry, planeMesh.material, planeMesh, null );

			} else {

				renderer.clear( renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil );

			}

		}

		if ( background && background.isCubeTexture ) {

			if ( boxMesh === undefined ) {

				boxMesh = new Mesh(
					new BoxBufferGeometry( 1, 1, 1 ),
					new ShaderMaterial( {
						uniforms: ShaderLib.cube.uniforms,
						vertexShader: ShaderLib.cube.vertexShader,
						fragmentShader: ShaderLib.cube.fragmentShader,
						side: BackSide,
						depthTest: true,
						depthWrite: false,
						polygonOffset: true,
						fog: false
					} )
				);

				boxMesh.geometry.removeAttribute( 'normal' );
				boxMesh.geometry.removeAttribute( 'uv' );

				boxMesh.onBeforeRender = function ( renderer, scene, camera ) {

					var scale = camera.far;

					this.matrixWorld.makeScale( scale, scale, scale );
					this.matrixWorld.copyPosition( camera.matrixWorld );

					this.material.polygonOffsetUnits = scale * 10;

				};

				geometries.update( boxMesh.geometry );

			}

			boxMesh.material.uniforms.tCube.value = background;

			renderList.push( boxMesh, boxMesh.geometry, boxMesh.material, 0, null, null );

		} else if ( background && background.isTexture ) {

			initPlaneMesh();

			planeMesh.material.map = background;

			if ( clearRegion ) {

				planeMesh.material.depthTest = true;
				planeMesh.material.depthFunc = THREE.AlwaysDepth;
				planeMesh.material.depthWrite = true;

			} else {

				planeMesh.material.depthTest = false;

			}

			// TODO Push this to renderList

			renderer.renderBufferDirect( renderData, planeCamera, null, planeMesh.geometry, planeMesh.material, planeMesh, null );

		}

	}

	function setClear( color, alpha ) {

		state.buffers.color.setClear( color.r, color.g, color.b, alpha, premultipliedAlpha );

	}

	return {

		getClearColor: function () {

			return clearColor;

		},
		setClearColor: function ( color, alpha ) {

			clearColor.set( color );
			clearAlpha = alpha !== undefined ? alpha : 1;
			setClear( clearColor, clearAlpha );

		},
		getClearAlpha: function () {

			return clearAlpha;

		},
		setClearAlpha: function ( alpha ) {

			clearAlpha = alpha;
			setClear( clearColor, clearAlpha );

		},
		render: render

	};

}


export { WebGLBackground };
