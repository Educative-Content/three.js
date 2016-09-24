/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.GLTFLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

	THREE.GLTFShaders.removeAll();

};

THREE.GLTFLoader.prototype = {

	constructor: THREE.GLTFLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var baseUrl = this.baseUrl && ( typeof this.baseUrl === "string" ) ? this.baseUrl : THREE.Loader.prototype.extractUrlBase( url );

		var loader = new THREE.XHRLoader( scope.manager );
		loader.load( url, function ( text ) {

			scope.parse( JSON.parse( text ), onLoad, baseUrl );

		}, onProgress, onError );

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	},

	setBaseUrl: function ( value ) {

		this.baseUrl = value;

	},

	parse: function ( json, callback, baseUrl ) {

		baseUrl = baseUrl || this.baseUrl || "";

		var resolveURL = function ( url ) {

			// Invalid URL
			if ( typeof url !== 'string' || url === '' )
				return '';

			// Absolute URL
			if ( /^https?:\/\//i.test( url ) ) {
				return url;
			}

			// Data URI
			if ( /^data:.*,.*$/i.test( url ) ) {
				return url;
			}

			// Relative URL
			return baseUrl + url;
		};

		function waitForPromises() {

			var promisedProperties = [];

			for (var i = 0; i < arguments.length; i++) {

				var objectKeys = Object.keys( arguments[ i ] );
				for (var j = 0; j < objectKeys.length; j++) {

					promisedProperties.push( arguments[ i ][ objectKeys[ j ] ] );

				}

			}

			return Promise.all( promisedProperties );

		}

		console.time( 'GLTFLoader' );

		var library = {
			buffers: {},
			bufferViews: {},
			accessors: {},
			textures: {},
			materials: {},
			meshes: {},
			nodes: {},
			scenes: {},
			shaders: {}
		};

		var promises = ( function( libraryItems ) {

			var resolvers = {};

			for( var resolver in libraryItems ) {

				let resolve;

				resolvers[ resolver ] = new Promise( function( r ) {

					resolve = r;

				});

				resolvers[ resolver ].resolve = resolve;

			}

			return resolvers;

		})( library );

		var WEBGL_CONSTANTS = {
			FLOAT: 5126,
			//FLOAT_MAT2: 35674,
			FLOAT_MAT3: 35675,
			FLOAT_MAT4: 35676,
			FLOAT_VEC2: 35664,
			FLOAT_VEC3: 35665,
			FLOAT_VEC4: 35666,
			LINEAR: 9729,
			REPEAT: 10497,
			SAMPLER_2D: 35678,
			TRIANGLES: 4,
			UNSIGNED_BYTE: 5121,
			UNSIGNED_SHORT: 5123,

			VERTEX_SHADER: 35633,
			FRAGMENT_SHADER: 35632
		};

		var WEBGL_MAP = (function(webGLConstants) {

			var map = {};

			for ( var webGLConstant in webGLConstants ) {

				switch ( webGLConstants[ webGLConstant ] ) {

					case WEBGL_CONSTANTS.FLOAT:

						map[ WEBGL_CONSTANTS.FLOAT ] = {
							utype: 'f',
							class: Object // no special class
						};
						break;

					//WEBGL_CONSTANTS.FLOAT_MAT2 {},

					case WEBGL_CONSTANTS.FLOAT_MAT3:

						map[ WEBGL_CONSTANTS.FLOAT_MAT3 ] = {
							utype: 'm3',
							class: THREE.Matrix3
						};
						break;

					case WEBGL_CONSTANTS.FLOAT_MAT4:

						map[ WEBGL_CONSTANTS.FLOAT_MAT4 ] = {
							utype: 'm4',
							class: THREE.Matrix4
						};
						break;

					case WEBGL_CONSTANTS.FLOAT_VEC2:

						map[ WEBGL_CONSTANTS.FLOAT_VEC2 ] = {
							utype: 'v2',
							class: THREE.Vector2
						};
						break;

					case WEBGL_CONSTANTS.FLOAT_VEC3:

						map[ WEBGL_CONSTANTS.FLOAT_VEC3 ] = {
							utype: 'v3',
							class: THREE.Vector3
						};
						break;

					case WEBGL_CONSTANTS.FLOAT_VEC4:

						map[ WEBGL_CONSTANTS.FLOAT_VEC4 ] = {
							utype: 'v4',
							class: THREE.Vector4
						};
						break;

					case WEBGL_CONSTANTS.SAMPLER_2D:

						map[ WEBGL_CONSTANTS.SAMPLER_2D ] = {
							utype: 't',
							class: Object // no special class
						};
						break;

				}

			}

			return map;

		})(WEBGL_CONSTANTS);

		// shaders

		var shaders = json.shaders;

		for ( var shaderId in shaders ) {

			var shader = shaders[ shaderId ];

			library.shaders[ shaderId ] = new Promise( function( resolve ) {

				var loader = new THREE.XHRLoader();
				loader.responseType = 'text';
				loader.load( resolveURL( shader.uri ), function( shaderText ) {

					resolve( shaderText );

				});

			});

		}

		waitForPromises( library.shaders ).then( function(values) {

			var count = 0;
			for ( var shaderId in library.shaders ) {

				library.shaders[ shaderId ] = values[ count++ ];

			}

			promises.shaders.resolve();

		});

		// buffers

		var buffers = json.buffers;

		for ( var bufferId in buffers ) {

			var buffer = buffers[ bufferId ];

			if ( buffer.type === 'arraybuffer' ) {

				library.buffers[ bufferId ] = new Promise( function( resolve ) {

					var loader = new THREE.XHRLoader();
					loader.responseType = 'arraybuffer';
					loader.load( resolveURL( buffer.uri ), function( buffer ) {

						resolve( buffer );

					});

				});

			}

		}

		waitForPromises( library.buffers ).then( function(values) {

			var count = 0;
			for ( var bufferId in library.buffers ) {

				library.buffers[ bufferId ] = values[ count++ ];

			}

			promises.buffers.resolve();

		});

		// buffer views

		promises.buffers.then(function() {

			var bufferViews = json.bufferViews;

			for ( var bufferViewId in bufferViews ) {

				var bufferView = bufferViews[ bufferViewId ];
				var arraybuffer = library.buffers[ bufferView.buffer ];

				library.bufferViews[ bufferViewId ] = arraybuffer.slice( bufferView.byteOffset, bufferView.byteOffset + bufferView.byteLength );

			}

			promises.bufferViews.resolve();

		});

		// accessors

		promises.bufferViews.then( function() {

			var COMPONENT_TYPES = {
				5120: Int8Array,
				5121: Uint8Array,
				5122: Int16Array,
				5123: Uint16Array,
				5125: Uint32Array,
				5126: Float32Array,
			};

			var TYPE_SIZES = {
				'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4,
				'MAT2': 4, 'MAT3': 9, 'MAT4': 16
			};

			var accessors = json.accessors;

			for ( var accessorId in accessors ) {

				var accessor = accessors[ accessorId ];

				var arraybuffer = library.bufferViews[ accessor.bufferView ];
				var itemSize = TYPE_SIZES[ accessor.type ];
				var TypedArray = COMPONENT_TYPES[ accessor.componentType ];

				var array = new TypedArray( arraybuffer, accessor.byteOffset, accessor.count * itemSize );

				library.accessors[ accessorId ] = new THREE.BufferAttribute( array, itemSize );

			}

			promises.accessors.resolve();

		});

		// textures

		var FILTERS = {
			9728: THREE.NearestFilter,
			9729: THREE.LinearFilter,
			9984: THREE.NearestMipMapNearestFilter,
			9985: THREE.LinearMipMapNearestFilter,
			9986: THREE.NearestMipMapLinearFilter,
			9987: THREE.LinearMipMapLinearFilter
		};

		var WRAPPINGS = {
			33071: THREE.ClampToEdgeWrapping,
			33648: THREE.MirroredRepeatWrapping,
			10497: THREE.RepeatWrapping
		};

		var textures = json.textures;

		for ( var textureId in textures ) {

			var texture = textures[ textureId ];

			var _texture = new THREE.Texture();
			_texture.flipY = false;

			if ( texture.source ) {

				var source = json.images[ texture.source ];

				_texture.image = new Image();
				_texture.image.onload = function() {
					_texture.needsUpdate = true;
				};
				_texture.image.src = resolveURL( source.uri );

			}

			if ( texture.sampler ) {

				var sampler = json.samplers[ texture.sampler ];

				_texture.magFilter = FILTERS[ sampler.magFilter ];
				_texture.minFilter = FILTERS[ sampler.minFilter ];
				_texture.wrapS = WRAPPINGS[ sampler.wrapS ];
				_texture.wrapT = WRAPPINGS[ sampler.wrapT ];

			}

			library.textures[ textureId ] = _texture;

		}

		promises.textures.resolve();

		// materials

		// Delayed-loaded material
		var ShaderMaterial = function(params) {

			this.params = {
				fragmentShader: params.fragmentShader,
				vertexShader: params.vertexShader,
				uniforms: params.uniforms,
				transparent: params.transparent
			};

			this.technique = params.technique;

		};

		waitForPromises({
			textures: promises.textures,
			shaders: promises.shaders
		}).then( function() {

			var materials = json.materials;

			for ( var materialId in materials ) {

				var material = materials[ materialId ];

				var materialType;
				var materialValues = {};
				var materialParams = {};

				var khr_material;

				if ( material.extensions && material.extensions.KHR_materials_common ) {

					khr_material = material.extensions.KHR_materials_common;

				} else if ( json.extensions && json.extensions.KHR_materials_common ) {

					khr_material = json.extensions.KHR_materials_common;

				}

				if ( khr_material ) {

					switch (khr_material.technique)
					{
						case 'BLINN' :
						case 'PHONG' :
							materialType = THREE.MeshPhongMaterial;
							break;

						case 'LAMBERT' :
							materialType = THREE.MeshLambertMaterial;
							break;

						case 'CONSTANT' :
						default :
							materialType = THREE.MeshBasicMaterial;
							break;
					}

					if (khr_material.doubleSided)
					{
						materialParams.side = THREE.DoubleSide;
					}

					if (khr_material.transparent)
					{
						materialParams.transparent = true;
					}

					for (prop in khr_material.values) {
						materialValues[prop] = khr_material.values[prop];
					}

				} else if ( material.technique === undefined ) {

					materialType = THREE.MeshPhongMaterial;

					for (var prop in material.values) {
						materialValues[prop] = material.values[prop];
					}

				} else {

					for (var prop in material.values) {
						materialValues[prop] = material.values[prop];
					}

					materialType = THREE.RawShaderMaterial;

					materialParams.side = THREE.DoubleSide;

					var technique = json.techniques[ material.technique ];

					//materialParams.technique = technique;
					materialParams.uniforms = {};

					var program = json.programs[ technique.program ];

					if ( program ) {

						materialParams.fragmentShader = library.shaders[ program.fragmentShader ];

						if (!materialParams.fragmentShader) {
							console.warn("ERROR: Missing fragment shader definition:", materialParams.fragmentShader);
							materialType = THREE.MeshPhongMaterial;
						}

						materialParams.vertexShader = library.shaders[ program.vertexShader ];

						if (!materialParams.vertexShader) {
							console.warn("ERROR: Missing vertex shader definition:", materialParams.vertexShader);
							materialType = THREE.MeshPhongMaterial;
						}

						var uniforms = technique.uniforms;

						for ( var uniformId in uniforms ) {

							var pname = uniforms[ uniformId ];
							var shaderParam = technique.parameters[ pname ];

							var ptype = shaderParam.type;

							if ( WEBGL_MAP[ ptype ] ) {

								var pcount = shaderParam.count;
								var value = materialValues[ pname ];

								var utype = WEBGL_MAP[ ptype ].utype;
								var uvalue = new WEBGL_MAP[ ptype ].class();
								var ulength;
								var usemantic = shaderParam.semantic;

								switch (ptype) {

									case WEBGL_CONSTANTS.FLOAT_MAT4:

										if ( pcount ) {

											utype = "m4v"; // override utype

											uvalue = new Array( pcount );

											for ( var mi = 0; mi < pcount; mi++ ) {

												uvalue[mi] = new WEBGL_MAP[ ptype ].class();

											}

											ulength = pcount;

											if ( shaderParam && shaderParam.value ) {

												var m4v = shaderParam.value;
												uvalue.fromArray( m4v );

											}

											if ( value ) {

												uvalue.fromArray( value );

											}

										}	else {

											if ( shaderParam && shaderParam.value ) {

												var m4 = shaderParam.value;
												uvalue.fromArray( m4 );

											}

											if ( value ) {

												uvalue.fromArray( value );

											}

										}

										break;

									case WEBGL_CONSTANTS.SAMPLER_2D:

										uvalue = value ? library.textures[ value ] : null;

										break;

									case WEBGL_CONSTANTS.FLOAT:

										if ( shaderParam && shaderParam.value ) {

											uvalue = shaderParam.value;

										}

										if ( pname == "transparency" ) {

											uvalue = value;
											materialParams.transparent = true;

										}

										break;

									default: // everything else is a straight copy

										if ( shaderParam && shaderParam.value ) {

											uvalue.fromArray( shaderParam.value );

										}

										if ( value ) {

											uvalue.fromArray( value );

										}

										break;

								}

								materialParams.uniforms[ pname ] = {
									type: utype,
									value: uvalue,
									//length: ulength,
									semantic: usemantic
								};

							} else {

								throw new Error("Unknown shader uniform param type: " + ptype);

							}

						}

					}

				}

				if ( Array.isArray( materialValues.diffuse ) ) {

					materialParams.color = new THREE.Color().fromArray( materialValues.diffuse );

				} else if ( typeof( materialValues.diffuse ) === 'string' ) {

					materialParams.map = library.textures[ materialValues.diffuse ];

				}

				if ( typeof( materialValues.reflective ) == 'string') {

					materialParams.envMap = library.textures[ materialValues.reflective ];

				}

				if ( typeof( materialValues.bump ) === 'string' ) {

						materialParams.bumpMap = library.textures[ materialValues.bump ];

				}

				if ( Array.isArray( materialValues.emission ) ) materialParams.emissive = new THREE.Color().fromArray( materialValues.emission );
				if ( Array.isArray( materialValues.specular ) ) materialParams.specular = new THREE.Color().fromArray( materialValues.specular );

				if ( materialValues.shininess !== undefined ) materialParams.shininess = materialValues.shininess;

				var _material = new materialType( materialParams );
				_material.name = material.name;
				//_material.technique = materialParams.technique;

				// https://github.com/mrdoob/three.js/issues/4364
				if (_material.isRawShaderMaterial) {

					//_material.index0AttributeName = "position";

				}

				library.materials[ materialId ] = _material;

			}

			promises.materials.resolve();

		});

		// meshes

		waitForPromises({
			accessors: promises.accessors,
			materials: promises.materials
		}).then( function() {

			var meshes = json.meshes;

			for ( var meshId in meshes ) {

				var mesh = meshes[ meshId ];

				var group = new THREE.Group();
				group.name = mesh.name;

				var primitives = mesh.primitives;

				for ( var i = 0; i < primitives.length; i++ ) {

					var primitive = primitives[ i ];

					//if (primitive.mode === WEBGL_CONSTANTS.TRIANGLES) {

						var geometry = new THREE.BufferGeometry();

						if ( primitive.indices ) {

							var indexArray = library.accessors[ primitive.indices ];

							geometry.setIndex( indexArray );

							/*geometry.offsets = [{
								start: 0,
								index: 0,
								count: indexArray.count
							}];*/

							geometry.computeBoundingSphere();

						}

						var attributes = primitive.attributes;

						for ( var attributeId in attributes ) {

							var attributeEntry = attributes[ attributeId ];

							if (!attributeEntry) {
								continue;
							}

							var bufferAttribute = library.accessors[ attributeEntry ];

							switch ( attributeId ) {

								case 'POSITION':
									geometry.addAttribute( 'position', bufferAttribute );
									break;

								case 'NORMAL':
									geometry.addAttribute( 'normal', bufferAttribute );
									break;

								case 'TEXCOORD_0':
									geometry.addAttribute( 'uv', bufferAttribute );
									break;

								/*case 'WEIGHT':
									geometry.addAttribute( 'skinWeight', bufferAttribute );
									break;

								case 'JOINTS':
									geometry.addAttribute( 'skinIndex', bufferAttribute );
									break;*/

							}

						}

					//}

					var material = library.materials[ primitive.material ];

					var meshNode = new THREE.Mesh( geometry, material );
					meshNode.castShadow = true;

					group.add( meshNode );

					// Register raw material meshes with GLTFShaders
					if (material.isRawShaderMaterial) {

						var glTFShader = new THREE.GLTFShader(meshNode);
						THREE.GLTFShaders.add(glTFShader);

					}

				}

				library.meshes[ meshId ] = group;

			}

			promises.meshes.resolve();

		});

		// nodes

		promises.meshes.then( function() {

			var nodes = json.nodes;
			var matrix = new THREE.Matrix4();

			for ( var nodeId in nodes ) {

				var node = nodes[ nodeId ];

				var object = new THREE.Group();
				object.name = node.name;

				if ( node.translation !== undefined ) {

					object.position.fromArray( node.translation );

				}

				if ( node.rotation !== undefined ) {

					object.quaternion.fromArray( node.rotation );

				}

				if ( node.scale !== undefined ) {

					object.scale.fromArray( node.scale );

				}

				if ( node.matrix !== undefined ) {

					matrix.fromArray( node.matrix );
					matrix.decompose( object.position, object.quaternion, object.scale );

				}

				if ( node.meshes !== undefined ) {

					for ( var i = 0; i < node.meshes.length; i ++ ) {

						var meshId = node.meshes[ i ];
						var group = library.meshes[ meshId ];

						object.add( group.clone() );

					}

				}

				library.nodes[ nodeId ] = object;

			}

			for ( var nodeId in nodes ) {

				var node = nodes[ nodeId ];

				for ( var i = 0; i < node.children.length; i ++ ) {

					var child = node.children[ i ];

					library.nodes[ nodeId ].add( library.nodes[ child ] );

				}

			}

			promises.nodes.resolve();

		});

		// scenes

		promises.nodes.then( function() {

			var scenes = json.scenes;

			for ( var sceneId in scenes ) {

				var scene = scenes[ sceneId ];
				var container = new THREE.Scene();
				container.name = scene.name;

				for ( var i = 0; i < scene.nodes.length; i ++ ) {

					var node = scene.nodes[ i ];

					container.add( library.nodes[ node ] );

				}

				library.scenes[ sceneId ] = container;

			}

			promises.scenes.resolve();

		});

		// Wait for all library components to be run before invoking callback
		waitForPromises( promises )
			.then( function() {

				console.timeEnd( 'GLTFLoader' );

				var glTF = {

					scene: library.scenes[ json.scene ]

				};

				callback( glTF );

			});

		// Developers should use `callback` argument for async notification on
		// completion to prevent side effects.
		// Function return is kept only for backward-compatability purposes.
		return {
			get scene() {

				console.warn( "synchronous glTF object access is deprecated. " +
						"Instead use 'callback' argument in function call " +
						"to access asynchronous glTF object." );
				return library.scenes[ json.scene ];

			},
			set scene( value ) {

				library.scenes[ json.scene ] = value;

			}
		};
	}

};

/* GLTFSHADERS */

THREE.GLTFShaders = ( function () {

	var shaders = [];

	return	{

		add : function( shader ) {

			shaders.push( shader );

		},

		remove: function( shader ) {

			var i = shaders.indexOf( shader );

			if ( i !== -1 ) shaders.splice( i, 1 );

		},

		removeAll: function( shader ) {

			// probably want to clean up the shaders, too, but not for now
			shaders = [];

		},

		update : function( scene, camera ) {

			for (i = 0; i < shaders.length; i++) {
				shaders[i].update(scene, camera);
			}

		}

	};

})();


/* GLTFSHADER */

THREE.GLTFShader = function(object3D) {
	this.object = object3D;

	this._m4 = new THREE.Matrix4();
}

// Update - update all the uniform values
THREE.GLTFShader.prototype.update = function(scene, camera) {

	// update scene graph

	scene.updateMatrixWorld();

	// update camera matrices and frustum

	camera.updateMatrixWorld();
	camera.matrixWorldInverse.getInverse( camera.matrixWorld );

	var uniforms = this.object && this.object.material && this.object.material.uniforms ? this.object.material.uniforms : {};

	for (var uniformId in uniforms ) {

		var uniform = uniforms[ uniformId ];

		if ( uniform.semantic ) {

			switch (uniform.semantic) {

				case "MODELVIEW":

					var m4 = uniform.value;
					m4.multiplyMatrices( camera.matrixWorldInverse,
					this.object.matrixWorld );

					break;

				case "MODELVIEWINVERSETRANSPOSE":

					var m3 = uniform.value;
					this._m4.multiplyMatrices( camera.matrixWorldInverse,
					this.object.matrixWorld );
					m3.getNormalMatrix( this._m4 );

					break;

				case "PROJECTION":

					var m4 = uniform.value;
					m4.copy( camera.projectionMatrix );

					break;

				case "JOINTMATRIX":

					/*var m4v = uniform.value;
					for ( var mi = 0; mi < m4v.length; mi++ ) {

						// So it goes like this:
						// SkinnedMesh world matrix is already baked into MODELVIEW;
						// ransform joints to local space,
						// then transform using joint's inverse
						m4v[ mi ]
							.getInverse( this.object.matrixWorld )
							.multiply( this.joints[ mi ].matrixWorld )
							.multiply( this.object.skeleton.boneInverses[ mi ] );

					}*/

					break;

				default:

					throw new Error("Unhandled shader semantic" + semantic);
					break;

			}

		}

	}

};
