import { Uint16BufferAttribute, Uint32BufferAttribute } from '../../core/BufferAttribute.js';
import { BufferGeometry } from '../../core/BufferGeometry.js';
import { arrayMax } from '../../utils.js';

function WebGLGeometries( gl, attributes, info, bindingStates ) {

	const geometries = new WeakMap();
	const wireframeAttributes = new WeakMap();
	const useWeakRef = typeof WeakRef !== 'undefined' && typeof FinalizationRegistry !== 'undefined';
	let finalizer = null;
	let weakRefGeometries = null;

	if ( useWeakRef ) {

		weakRefGeometries = new Set();
		finalizer = new FinalizationRegistry( handle => {

			weakRefGeometries.delete( handle );

		} );

	}

	function onGeometryDispose( event ) {

		const geometry = event.target;
		const buffergeometry = geometries.get( geometry );

		if ( buffergeometry.index !== null ) {

			attributes.remove( buffergeometry.index );

		}

		for ( const name in buffergeometry.attributes ) {

			attributes.remove( buffergeometry.attributes[ name ] );

		}

		geometry.removeEventListener( 'dispose', onGeometryDispose );

		geometries.delete( geometry );

		const attribute = wireframeAttributes.get( buffergeometry );

		if ( attribute ) {

			attributes.remove( attribute );
			wireframeAttributes.delete( buffergeometry );

		}

		bindingStates.releaseStatesOfGeometry( buffergeometry );

		if ( geometry.isInstancedBufferGeometry === true ) {

			delete geometry._maxInstanceCount;

		}

		//

		info.memory.geometries --;

	}

	function get( object, geometry ) {

		let buffergeometry = geometries.get( geometry );

		if ( buffergeometry ) return buffergeometry;

		geometry.addEventListener( 'dispose', onGeometryDispose );

		if ( geometry.isBufferGeometry ) {

			buffergeometry = geometry;

		} else if ( geometry.isGeometry ) {

			if ( geometry._bufferGeometry === undefined ) {

				geometry._bufferGeometry = new BufferGeometry().setFromObject( object );

			}

			buffergeometry = geometry._bufferGeometry;

		}

		geometries.set( geometry, buffergeometry );

		if ( useWeakRef ) {

			const handle = new WeakRef( geometry );
			weakRefGeometries.add( handle );
			finalizer.register( geometry, handle );

		}

		info.memory.geometries ++;

		return buffergeometry;

	}

	function update( geometry ) {

		const geometryAttributes = geometry.attributes;

		// Updating index buffer in VAO now. See WebGLBindingStates.

		for ( const name in geometryAttributes ) {

			attributes.update( geometryAttributes[ name ], gl.ARRAY_BUFFER );

		}

		// morph targets

		const morphAttributes = geometry.morphAttributes;

		for ( const name in morphAttributes ) {

			const array = morphAttributes[ name ];

			for ( let i = 0, l = array.length; i < l; i ++ ) {

				attributes.update( array[ i ], gl.ARRAY_BUFFER );

			}

		}

	}

	function updateWireframeAttribute( geometry ) {

		const indices = [];

		const geometryIndex = geometry.index;
		const geometryPosition = geometry.attributes.position;
		let version = 0;

		if ( geometryIndex !== null ) {

			const array = geometryIndex.array;
			version = geometryIndex.version;

			for ( let i = 0, l = array.length; i < l; i += 3 ) {

				const a = array[ i + 0 ];
				const b = array[ i + 1 ];
				const c = array[ i + 2 ];

				indices.push( a, b, b, c, c, a );

			}

		} else {

			const array = geometryPosition.array;
			version = geometryPosition.version;

			for ( let i = 0, l = ( array.length / 3 ) - 1; i < l; i += 3 ) {

				const a = i + 0;
				const b = i + 1;
				const c = i + 2;

				indices.push( a, b, b, c, c, a );

			}

		}

		const attribute = new ( arrayMax( indices ) > 65535 ? Uint32BufferAttribute : Uint16BufferAttribute )( indices, 1 );
		attribute.version = version;

		// Updating index buffer in VAO now. See WebGLBindingStates

		//

		const previousAttribute = wireframeAttributes.get( geometry );

		if ( previousAttribute ) attributes.remove( previousAttribute );

		//

		wireframeAttributes.set( geometry, attribute );

	}

	function getWireframeAttribute( geometry ) {

		const currentAttribute = wireframeAttributes.get( geometry );

		if ( currentAttribute ) {

			const geometryIndex = geometry.index;

			if ( geometryIndex !== null ) {

				// if the attribute is obsolete, create a new one

				if ( currentAttribute.version < geometryIndex.version ) {

					updateWireframeAttribute( geometry );

				}

			}

		} else {

			updateWireframeAttribute( geometry );

		}

		return wireframeAttributes.get( geometry );

	}

	function dispose() {

		weakRefGeometries.forEach( handle => {

			const geometry = handle.deref();
			if ( geometry ) {

				onGeometryDispose( { target: geometry } );

			}

		} );
		weakRefGeometries.clear();
		geometries.clear();


	}

	return {

		get: get,
		update: update,

		getWireframeAttribute: getWireframeAttribute,
		dispose: dispose

	};

}


export { WebGLGeometries };
