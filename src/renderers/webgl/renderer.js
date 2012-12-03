
/*global THREE:false */

THREE.WebGLRenderer2.LowLevelRenderer = function(parameters){
	
	

	parameters = parameters || {};

	var _canvas = parameters.canvas !== undefined ? parameters.canvas : document.createElement( 'canvas' ),

	_precision = parameters.precision !== undefined ? parameters.precision : 'highp',

	_alpha = parameters.alpha !== undefined ? parameters.alpha : true,
	_premultipliedAlpha = parameters.premultipliedAlpha !== undefined ? parameters.premultipliedAlpha : true,
	_antialias = parameters.antialias !== undefined ? parameters.antialias : false,
	_stencil = parameters.stencil !== undefined ? parameters.stencil : true,
	_preserveDrawingBuffer = parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false,

	_clearColor = parameters.clearColor !== undefined ? new THREE.Color( parameters.clearColor ) : new THREE.Color( 0x000000 ),
	_clearAlpha = parameters.clearAlpha !== undefined ? parameters.clearAlpha : 0;
	
	initGL();

	setDefaultGLState();

	this.context = _gl;
	
	
	var _gl;

	var _glExtensionTextureFloat;
	var _glExtensionStandardDerivatives;
	var _glExtensionTextureFilterAnisotropic;
	var _glExtensionCompressedTextureS3TC;
	
	
	
	var _maxTextures = _gl.getParameter( _gl.MAX_TEXTURE_IMAGE_UNITS );
	var _maxVertexTextures = _gl.getParameter( _gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS );
	var _maxTextureSize = _gl.getParameter( _gl.MAX_TEXTURE_SIZE );
	var _maxCubemapSize = _gl.getParameter( _gl.MAX_CUBE_MAP_TEXTURE_SIZE );

	var _maxAnisotropy = _glExtensionTextureFilterAnisotropic ? _gl.getParameter( _glExtensionTextureFilterAnisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT ) : 0;

	var _supportsVertexTextures = ( _maxVertexTextures > 0 );
	var _supportsBoneTextures = _supportsVertexTextures && _glExtensionTextureFloat;

	var _compressedTextureFormats = _glExtensionCompressedTextureS3TC ? _gl.getParameter( _gl.COMPRESSED_TEXTURE_FORMATS ) : [];
	
	var _enabledAttributes = {}, 
		_oldBlending, 
		_oldBlendEquation,
		_oldBlendSrc,
		_oldBlendDst,
		
		_oldDoubleSided = -1,
		_oldFlipSided = -1,

		_oldDepthTest = -1,
		_oldDepthWrite = -1,
		
		_oldLineWidth = -1,
		
		_viewportX = 0,
		_viewportY = 0,
		_viewportWidth = 0,
		_viewportHeight = 0,
			// GL state cache

		_oldPolygonOffset = null,
		_oldPolygonOffsetFactor = null,
		_oldPolygonOffsetUnits = null,
		_currentFramebuffer = null;
		
	this.autoScaleCubemaps = true;
	this.supportsBoneTextures = _supportsBoneTextures;
	this.precision = _precision;
	this.maxVertexUniformVectors = _gl.getParameter( _gl.MAX_VERTEX_UNIFORM_VECTORS );
	
	this.currentWidth = 0;
	this.currentHeight = 0;
	
	function initGL () {

		try {

			if ( ! ( _gl = _canvas.getContext( 'experimental-webgl', { alpha: _alpha, premultipliedAlpha: _premultipliedAlpha, antialias: _antialias, stencil: _stencil, preserveDrawingBuffer: _preserveDrawingBuffer } ) ) ) {

				throw 'Error creating WebGL context.';

			}

		} catch ( error ) {

			console.error( error );

		}

		_glExtensionTextureFloat = _gl.getExtension( 'OES_texture_float' );
		_glExtensionStandardDerivatives = _gl.getExtension( 'OES_standard_derivatives' );

		_glExtensionTextureFilterAnisotropic =	_gl.getExtension( 'EXT_texture_filter_anisotropic' ) ||
												_gl.getExtension( 'MOZ_EXT_texture_filter_anisotropic' ) ||
												_gl.getExtension( 'WEBKIT_EXT_texture_filter_anisotropic' );


		_glExtensionCompressedTextureS3TC = _gl.getExtension( 'WEBGL_compressed_texture_s3tc' ) ||
											_gl.getExtension( 'MOZ_WEBGL_compressed_texture_s3tc' ) ||
											_gl.getExtension( 'WEBKIT_WEBGL_compressed_texture_s3tc' );

		if ( ! _glExtensionTextureFloat ) {

			console.log( 'THREE.WebGLRenderer: Float textures not supported.' );

		}

		if ( ! _glExtensionStandardDerivatives ) {

			console.log( 'THREE.WebGLRenderer: Standard derivatives not supported.' );

		}

		if ( ! _glExtensionTextureFilterAnisotropic ) {

			console.log( 'THREE.WebGLRenderer: Anisotropic texture filtering not supported.' );

		}

		if ( ! _glExtensionCompressedTextureS3TC ) {

			console.log( 'THREE.WebGLRenderer: S3TC compressed textures not supported.' );

		}

	};
	
	
	function setDefaultGLState () {

		_gl.clearColor( 0, 0, 0, 1 );
		_gl.clearDepth( 1 );
		_gl.clearStencil( 0 );

		_gl.enable( _gl.DEPTH_TEST );
		_gl.depthFunc( _gl.LEQUAL );

		_gl.frontFace( _gl.CCW );
		_gl.cullFace( _gl.BACK );
		_gl.enable( _gl.CULL_FACE );

		_gl.enable( _gl.BLEND );
		_gl.blendEquation( _gl.FUNC_ADD );
		_gl.blendFunc( _gl.SRC_ALPHA, _gl.ONE_MINUS_SRC_ALPHA );

		_gl.clearColor( _clearColor.r, _clearColor.g, _clearColor.b, _clearAlpha );

	};
	
	// Fallback filters for non-power-of-2 textures

	function filterFallback ( f ) {

		if ( f === THREE.NearestFilter || f === THREE.NearestMipMapNearestFilter || f === THREE.NearestMipMapLinearFilter ) {

			return _gl.NEAREST;

		}

		return _gl.LINEAR;

	};
	
	this.getContext = function () {

		return _gl;

	};
	this.getDomElement = function(){
		
		return _canvas;
		
	}

	this.supportsVertexTextures = function () {

		return _supportsVertexTextures;

	};

	this.getMaxAnisotropy  = function () {

		return _maxAnisotropy;

	};

	this.setSize = function ( width, height ) {

		_canvas.width = width;
		_canvas.height = height;

		this.setViewport( 0, 0, _canvas.width, _canvas.height );

	};

	this.setViewport = function ( x, y, width, height ) {

		_viewportX = x !== undefined ? x : 0;
		_viewportY = y !== undefined ? y : 0;

		_viewportWidth = width !== undefined ? width : _canvas.width;
		_viewportHeight = height !== undefined ? height : _canvas.height;

		_gl.viewport( _viewportX, _viewportY, _viewportWidth, _viewportHeight );

	};

	this.setScissor = function ( x, y, width, height ) {

		_gl.scissor( x, y, width, height );

	};

	this.enableScissorTest = function ( enable ) {

		enable ? _gl.enable( _gl.SCISSOR_TEST ) : _gl.disable( _gl.SCISSOR_TEST );

	};

	// Clearing

	this.setClearColorHex = function ( hex, alpha ) {

		_clearColor.setHex( hex );
		_clearAlpha = alpha;

		_gl.clearColor( _clearColor.r, _clearColor.g, _clearColor.b, _clearAlpha );

	};

	this.setClearColor = function ( color, alpha ) {

		_clearColor.copy( color );
		_clearAlpha = alpha;

		_gl.clearColor( _clearColor.r, _clearColor.g, _clearColor.b, _clearAlpha );

	};

	this.getClearColor = function () {

		return _clearColor;

	};

	this.getClearAlpha = function () {

		return _clearAlpha;

	};

	this.clear = function ( color, depth, stencil ) {

		var bits = 0;

		if ( color === undefined || color ) bits |= _gl.COLOR_BUFFER_BIT;
		if ( depth === undefined || depth ) bits |= _gl.DEPTH_BUFFER_BIT;
		if ( stencil === undefined || stencil ) bits |= _gl.STENCIL_BUFFER_BIT;

		_gl.clear( bits );

	};

	this.clearTarget = function ( renderTarget, color, depth, stencil ) {

		this.setRenderTarget( renderTarget );
		this.clear( color, depth, stencil );

	};
	
	this.deleteBuffer = function(buffer){
		_gl.deleteBuffer(buffer);
	};
	
	this.deleteTexture = function(texture){
		_gl.deleteTexture( texture );
	};
	
	this.deleteFramebuffer = function(Framebuffer){
		_gl.deleteFramebuffer(Framebuffer);
	};
	
	this.deleteRenderbuffer = function(RenderBuffer){
		_gl.deleteRenderbuffer(RenderBuffer);
	};
	
	this.deleteProgram = function(RenderBuffer){
		_gl.deleteProgram(RenderBuffer);
	};
	
	this.createBuffer = function(){
		return _gl.createBuffer();
	};
	
	this.setStaticArrayBuffer = function(buffer,data){
		
		this.bindArrayBuffer( buffer );
		_gl.bufferData( _gl.ARRAY_BUFFER, data, _gl.STATIC_DRAW );
		
	};
	
	this.setStaticIndexBuffer = function(buffer,data){
		
		this.bindElementArrayBuffer( buffer );
		_gl.bufferData( _gl.ELEMENT_ARRAY_BUFFER, data, _gl.STATIC_DRAW );
		
	};
	
	this.setDynamicArrayBuffer = function(buffer,data){
		
		this.bindArrayBuffer( buffer );
		_gl.bufferData( _gl.ARRAY_BUFFER, data, _gl.DYNAMIC_DRAW );
		
	};
	
	this.setDynamicIndexBuffer = function(buffer,data){
		
		this.bindElementArrayBuffer( buffer );
		_gl.bufferData( _gl.ELEMENT_ARRAY_BUFFER, data, _gl.DYNAMIC_DRAW );
		
	};
	
	this.drawTriangles = function(count){
		_gl.drawArrays( _gl.TRIANGLES, 0, count );
	};
	
	this.drawLines = function(count){
		_gl.drawArrays( _gl.LINES, 0, count );
	};
	
	this.drawLineStrip = function(count){
		_gl.drawArrays( _gl.LINE_STRIP, 0, count );
	};
	
	this.drawPoints = function(count){
		_gl.drawArrays( _gl.POINTS, 0, count );
	};
	
	this.drawTriangleElements = function(buffer,count,offset){
		this.bindElementArrayBuffer( buffer );
		_gl.drawElements( _gl.TRIANGLES, count, _gl.UNSIGNED_SHORT, offset ); // 2 bytes per Uint16
	};
	
	this.drawLineElements = function(buffer,count,offset){
		this.bindElementArrayBuffer(  buffer );
		_gl.drawElements( _gl.LINES, count, _gl.UNSIGNED_SHORT, offset ); // 2 bytes per Uint16
	};
	
	
	var _boundBuffer =undefined;
	this.bindArrayBuffer = function(buffer){
		if (_boundBuffer != buffer){
			_gl.bindBuffer( _gl.ARRAY_BUFFER, buffer );
			_boundBuffer = buffer;
		}
		
	};
	
	this.bindElementArrayBuffer = function(buffer){
		
		if (_boundBuffer != buffer){
			_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, buffer );
			_boundBuffer = buffer;
		}
		
	};
	
	
	this.enableAttribute = function enableAttribute( attribute ) {

		if ( ! _enabledAttributes[ attribute ] ) {

			_gl.enableVertexAttribArray( attribute );
			_enabledAttributes[ attribute ] = true;

		}

	};
	
	

	this.disableAttributes = function disableAttributes() {

		for ( var attribute in _enabledAttributes ) {

			if ( _enabledAttributes[ attribute ] ) {

				_gl.disableVertexAttribArray( attribute );
				_enabledAttributes[ attribute ] = false;

			}

		}

	};
	
	this.getAttribLocation = function( program, id ){
		return _gl.getAttribLocation( program, id );
	}
	
	this.setFloatAttribute = function(index,buffer,size,offset){
		
		this.bindArrayBuffer( buffer );
		this.enableAttribute( index );
		_gl.vertexAttribPointer( index, size, _gl.FLOAT, false, 0, offset );
		
	};
	
	this.getUniformLocation= function( program, id ){
		
		return _gl.getUniformLocation( program, id );
		
	}
	
	this.uniform1i = function(uniform,value){
		
		_gl.uniform1i( uniform, value );
		
	};	
	
	this.uniform1f = function(uniform,value){
		
		_gl.uniform1f( uniform, value );
		
	};
	
	this.uniform2f = function(uniform,value1, value2){
		
		_gl.uniform2f( location, value1, value2 );
		
	};
	
	this.uniform3f = function(uniform, value1, value2, value3){
		
		_gl.uniform3f( uniform, value1, value2, value3 );
		
	};
	
	this.uniform4f = function(uniform, value1, value2, value3, value4){
		
		_gl.uniform4f( uniform, value1, value2, value3, value4);
		
	};
	
	this.uniform1iv = function(uniform,value){
		
		_gl.uniform1iv( uniform, value );
		
	};
	
	this.uniform2iv = function(uniform,value){
		
		_gl.uniform2iv( uniform, value );
		
	};
	
	this.uniform3iv = function(uniform,value){
		
		_gl.uniform3iv( uniform, value );
		
	};
	
	this.uniform1fv = function(uniform,value){
		
		_gl.uniform1fv( uniform, value );
		
	};
	
	this.uniform2fv = function(uniform,value){
		
		_gl.uniform2fv( uniform, value );
		
	};
	
	this.uniform3fv = function(uniform,value){
		
		_gl.uniform3fv( uniform, value );
		
	};
	
	this.uniform4fv = function(uniform,value){
		
		_gl.uniform3fv( uniform, value );
		
	};
	
	this.uniformMatrix3fv = function(location,value){
		
		_gl.uniformMatrix3fv( location, false, value );
		
	};
	
	this.uniformMatrix4fv = function(location,value){
		
		_gl.uniformMatrix4fv( location, false, value );
		
	};
	
	this.useProgram = function(program){
	
		_gl.useProgram( program );
	
	};
	
	this.setFaceCulling = function ( cullFace, frontFace ) {
			
		if ( cullFace ) {

			if ( !frontFace || frontFace === "ccw" ) {

				_gl.frontFace( _gl.CCW );

			} else {

				_gl.frontFace( _gl.CW );

			}

			if( cullFace === "back" ) {

				_gl.cullFace( _gl.BACK );

			} else if( cullFace === "front" ) {

				_gl.cullFace( _gl.FRONT );

			} else {

				_gl.cullFace( _gl.FRONT_AND_BACK );

			}

			_gl.enable( _gl.CULL_FACE );

		} else {

			_gl.disable( _gl.CULL_FACE );

		}

	};
	
	this.setMaterialFaces = function ( material ) {

		var doubleSided = material.side === THREE.DoubleSide;
		var flipSided = material.side === THREE.BackSide;

		if ( _oldDoubleSided !== doubleSided ) {

			if ( doubleSided ) {

				_gl.disable( _gl.CULL_FACE );

			} else {

				_gl.enable( _gl.CULL_FACE );

			}

			_oldDoubleSided = doubleSided;

		}

		if ( _oldFlipSided !== flipSided ) {

			if ( flipSided ) {

				_gl.frontFace( _gl.CW );

			} else {

				_gl.frontFace( _gl.CCW );

			}

			_oldFlipSided = flipSided;

		}

	};
	
	this.setPolygonOffset = function setPolygonOffset ( polygonoffset, factor, units ) {

		if ( _oldPolygonOffset !== polygonoffset ) {

			if ( polygonoffset ) {

				_gl.enable( _gl.POLYGON_OFFSET_FILL );

			} else {

				_gl.disable( _gl.POLYGON_OFFSET_FILL );

			}

			_oldPolygonOffset = polygonoffset;

		}

		if ( polygonoffset && ( _oldPolygonOffsetFactor !== factor || _oldPolygonOffsetUnits !== units ) ) {

			_gl.polygonOffset( factor, units );

			_oldPolygonOffsetFactor = factor;
			_oldPolygonOffsetUnits = units;

		}

	};
	
	
	
	
	this.setBlending = function ( blending, blendEquation, blendSrc, blendDst ) {

		if ( blending !== _oldBlending ) {

			if ( blending === THREE.NoBlending ) {

				_gl.disable( _gl.BLEND );

			} else if ( blending === THREE.AdditiveBlending ) {

				_gl.enable( _gl.BLEND );
				_gl.blendEquation( _gl.FUNC_ADD );
				_gl.blendFunc( _gl.SRC_ALPHA, _gl.ONE );

			} else if ( blending === THREE.SubtractiveBlending ) {

				// TODO: Find blendFuncSeparate() combination
				_gl.enable( _gl.BLEND );
				_gl.blendEquation( _gl.FUNC_ADD );
				_gl.blendFunc( _gl.ZERO, _gl.ONE_MINUS_SRC_COLOR );

			} else if ( blending === THREE.MultiplyBlending ) {

				// TODO: Find blendFuncSeparate() combination
				_gl.enable( _gl.BLEND );
				_gl.blendEquation( _gl.FUNC_ADD );
				_gl.blendFunc( _gl.ZERO, _gl.SRC_COLOR );

			} else if ( blending === THREE.CustomBlending ) {

				_gl.enable( _gl.BLEND );

			} else {

				_gl.enable( _gl.BLEND );
				_gl.blendEquationSeparate( _gl.FUNC_ADD, _gl.FUNC_ADD );
				_gl.blendFuncSeparate( _gl.SRC_ALPHA, _gl.ONE_MINUS_SRC_ALPHA, _gl.ONE, _gl.ONE_MINUS_SRC_ALPHA );

			}

			_oldBlending = blending;

		}

		if ( blending === THREE.CustomBlending ) {

			if ( blendEquation !== _oldBlendEquation ) {

				_gl.blendEquation( paramThreeToGL( blendEquation ) );

				_oldBlendEquation = blendEquation;

			}

			if ( blendSrc !== _oldBlendSrc || blendDst !== _oldBlendDst ) {

				_gl.blendFunc( paramThreeToGL( blendSrc ), paramThreeToGL( blendDst ) );

				_oldBlendSrc = blendSrc;
				_oldBlendDst = blendDst;

			}

		} else {

			_oldBlendEquation = null;
			_oldBlendSrc = null;
			_oldBlendDst = null;

		}

	};
	
	

	this.setDepthTest = function ( depthTest ) {

		if ( _oldDepthTest !== depthTest ) {

			if ( depthTest ) {

				_gl.enable( _gl.DEPTH_TEST );

			} else {

				_gl.disable( _gl.DEPTH_TEST );

			}

			_oldDepthTest = depthTest;

		}

	};

	this.setDepthWrite = function ( depthWrite ) {

		if ( _oldDepthWrite !== depthWrite ) {

			_gl.depthMask( depthWrite );
			_oldDepthWrite = depthWrite;

		}

	};
	
	
	this.setTexture = function ( texture, slot ) {

		if ( texture.needsUpdate ) {

			if ( ! texture.__webglInit ) {

				texture.__webglInit = true;
				texture.__webglTexture = _gl.createTexture();

			}

			_gl.activeTexture( _gl.TEXTURE0 + slot );
			_gl.bindTexture( _gl.TEXTURE_2D, texture.__webglTexture );

			_gl.pixelStorei( _gl.UNPACK_FLIP_Y_WEBGL, texture.flipY );
			_gl.pixelStorei( _gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultiplyAlpha );

			var image = texture.image,
			isImagePowerOfTwo = isPowerOfTwo( image.width ) && isPowerOfTwo( image.height ),
			glFormat = paramThreeToGL( texture.format ),
			glType = paramThreeToGL( texture.type );

			setTextureParameters( _gl.TEXTURE_2D, texture, isImagePowerOfTwo );

			if ( texture instanceof THREE.CompressedTexture ) {

				var mipmap, mipmaps = texture.mipmaps;

				for( var i = 0, il = mipmaps.length; i < il; i ++ ) {

					mipmap = mipmaps[ i ];
					_gl.compressedTexImage2D( _gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, mipmap.data );

				}

			} else if ( texture instanceof THREE.DataTexture ) {

				_gl.texImage2D( _gl.TEXTURE_2D, 0, glFormat, image.width, image.height, 0, glFormat, glType, image.data );

			} else {

				_gl.texImage2D( _gl.TEXTURE_2D, 0, glFormat, glFormat, glType, texture.image );

			}

			if ( texture.generateMipmaps && isImagePowerOfTwo ) _gl.generateMipmap( _gl.TEXTURE_2D );

			texture.needsUpdate = false;

			if ( texture.onUpdate ) texture.onUpdate();

		} else {

			_gl.activeTexture( _gl.TEXTURE0 + slot );
			_gl.bindTexture( _gl.TEXTURE_2D, texture.__webglTexture );

		}

	};
	
	this.setCubeTexture = function( texture, slot ,autoScaleCubemaps) {

		if ( texture.image.length === 6 ) {

			if ( texture.needsUpdate ) {

				if ( ! texture.image.__webglTextureCube ) {

					texture.image.__webglTextureCube = _gl.createTexture();

				}

				_gl.activeTexture( _gl.TEXTURE0 + slot );
				_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, texture.image.__webglTextureCube );

				_gl.pixelStorei( _gl.UNPACK_FLIP_Y_WEBGL, texture.flipY );

				var isCompressed = texture instanceof THREE.CompressedTexture;

				var cubeImage = [];

				for ( var i = 0; i < 6; i ++ ) {

					if ( autoScaleCubemaps && ! isCompressed ) {

						cubeImage[ i ] = clampToMaxSize( texture.image[ i ], _maxCubemapSize );

					} else {

						cubeImage[ i ] = texture.image[ i ];

					}

				}

				var image = cubeImage[ 0 ],
				isImagePowerOfTwo = isPowerOfTwo( image.width ) && isPowerOfTwo( image.height ),
				glFormat = paramThreeToGL( texture.format ),
				glType = paramThreeToGL( texture.type );

				setTextureParameters( _gl.TEXTURE_CUBE_MAP, texture, isImagePowerOfTwo );

				for ( var i = 0; i < 6; i ++ ) {

					if ( isCompressed ) {

						var mipmap, mipmaps = cubeImage[ i ].mipmaps;

						for( var j = 0, jl = mipmaps.length; j < jl; j ++ ) {

							mipmap = mipmaps[ j ];
							_gl.compressedTexImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, glFormat, mipmap.width, mipmap.height, 0, mipmap.data );

						}

					} else {

						_gl.texImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, glFormat, glType, cubeImage[ i ] );

					}

				}

				if ( texture.generateMipmaps && isImagePowerOfTwo ) {

					_gl.generateMipmap( _gl.TEXTURE_CUBE_MAP );

				}

				texture.needsUpdate = false;

				if ( texture.onUpdate ) texture.onUpdate();

			} else {

				_gl.activeTexture( _gl.TEXTURE0 + slot );
				_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, texture.image.__webglTextureCube );

			}

		}

	};
	
	// Textures


	function isPowerOfTwo ( value ) {

		return ( value & ( value - 1 ) ) === 0;

	};
	
	
	function setTextureParameters ( textureType, texture, isImagePowerOfTwo ) {

		if ( isImagePowerOfTwo ) {

			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_S, paramThreeToGL( texture.wrapS ) );
			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_T, paramThreeToGL( texture.wrapT ) );

			_gl.texParameteri( textureType, _gl.TEXTURE_MAG_FILTER, paramThreeToGL( texture.magFilter ) );
			_gl.texParameteri( textureType, _gl.TEXTURE_MIN_FILTER, paramThreeToGL( texture.minFilter ) );

		} else {

			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_S, _gl.CLAMP_TO_EDGE );
			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_T, _gl.CLAMP_TO_EDGE );

			_gl.texParameteri( textureType, _gl.TEXTURE_MAG_FILTER, filterFallback( texture.magFilter ) );
			_gl.texParameteri( textureType, _gl.TEXTURE_MIN_FILTER, filterFallback( texture.minFilter ) );

		}

		if ( _glExtensionTextureFilterAnisotropic && texture.type !== THREE.FloatType ) {

			if ( texture.anisotropy > 1 || texture.__oldAnisotropy ) {

				_gl.texParameterf( textureType, _glExtensionTextureFilterAnisotropic.TEXTURE_MAX_ANISOTROPY_EXT, Math.min( texture.anisotropy, _maxAnisotropy ) );
				texture.__oldAnisotropy = texture.anisotropy;

			}

		}

	};
	
	
	function setupFrameBuffer ( framebuffer, renderTarget, textureTarget ) {

		_gl.bindFramebuffer( _gl.FRAMEBUFFER, framebuffer );
		_gl.framebufferTexture2D( _gl.FRAMEBUFFER, _gl.COLOR_ATTACHMENT0, textureTarget, renderTarget.__webglTexture, 0 );

	};
	
	
	function setupRenderBuffer ( renderbuffer, renderTarget  ) {

		_gl.bindRenderbuffer( _gl.RENDERBUFFER, renderbuffer );

		if ( renderTarget.depthBuffer && ! renderTarget.stencilBuffer ) {

			_gl.renderbufferStorage( _gl.RENDERBUFFER, _gl.DEPTH_COMPONENT16, renderTarget.width, renderTarget.height );
			_gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer );

		/* For some reason this is not working. Defaulting to RGBA4.
		} else if( ! renderTarget.depthBuffer && renderTarget.stencilBuffer ) {

			_gl.renderbufferStorage( _gl.RENDERBUFFER, _gl.STENCIL_INDEX8, renderTarget.width, renderTarget.height );
			_gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.STENCIL_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer );
		*/
		} else if( renderTarget.depthBuffer && renderTarget.stencilBuffer ) {

			_gl.renderbufferStorage( _gl.RENDERBUFFER, _gl.DEPTH_STENCIL, renderTarget.width, renderTarget.height );
			_gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.DEPTH_STENCIL_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer );

		} else {

			_gl.renderbufferStorage( _gl.RENDERBUFFER, _gl.RGBA4, renderTarget.width, renderTarget.height );

		}

	};

	
	this.setRenderTarget = function ( renderTarget ) {

		var isCube = ( renderTarget instanceof THREE.WebGLRenderTargetCube );

		if ( renderTarget && ! renderTarget.__webglFramebuffer ) {

			if ( renderTarget.depthBuffer === undefined ) renderTarget.depthBuffer = true;
			if ( renderTarget.stencilBuffer === undefined ) renderTarget.stencilBuffer = true;

			renderTarget.__webglTexture = _gl.createTexture();

			// Setup texture, create render and frame buffers

			var isTargetPowerOfTwo = isPowerOfTwo( renderTarget.width ) && isPowerOfTwo( renderTarget.height ),
				glFormat = paramThreeToGL( renderTarget.format ),
				glType = paramThreeToGL( renderTarget.type );

			if ( isCube ) {

				renderTarget.__webglFramebuffer = [];
				renderTarget.__webglRenderbuffer = [];

				_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, renderTarget.__webglTexture );
				setTextureParameters( _gl.TEXTURE_CUBE_MAP, renderTarget, isTargetPowerOfTwo );

				for ( var i = 0; i < 6; i ++ ) {

					renderTarget.__webglFramebuffer[ i ] = _gl.createFramebuffer();
					renderTarget.__webglRenderbuffer[ i ] = _gl.createRenderbuffer();

					_gl.texImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, renderTarget.width, renderTarget.height, 0, glFormat, glType, null );

					setupFrameBuffer( renderTarget.__webglFramebuffer[ i ], renderTarget, _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i );
					setupRenderBuffer( renderTarget.__webglRenderbuffer[ i ], renderTarget );

				}

				if ( isTargetPowerOfTwo ) _gl.generateMipmap( _gl.TEXTURE_CUBE_MAP );

			} else {

				renderTarget.__webglFramebuffer = _gl.createFramebuffer();
				renderTarget.__webglRenderbuffer = _gl.createRenderbuffer();

				_gl.bindTexture( _gl.TEXTURE_2D, renderTarget.__webglTexture );
				setTextureParameters( _gl.TEXTURE_2D, renderTarget, isTargetPowerOfTwo );

				_gl.texImage2D( _gl.TEXTURE_2D, 0, glFormat, renderTarget.width, renderTarget.height, 0, glFormat, glType, null );

				setupFrameBuffer( renderTarget.__webglFramebuffer, renderTarget, _gl.TEXTURE_2D );
				setupRenderBuffer( renderTarget.__webglRenderbuffer, renderTarget );

				if ( isTargetPowerOfTwo ) _gl.generateMipmap( _gl.TEXTURE_2D );

			}

			// Release everything

			if ( isCube ) {

				_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, null );

			} else {

				_gl.bindTexture( _gl.TEXTURE_2D, null );

			}

			_gl.bindRenderbuffer( _gl.RENDERBUFFER, null );
			_gl.bindFramebuffer( _gl.FRAMEBUFFER, null);

		}

		var framebuffer, width, height, vx, vy;

		if ( renderTarget ) {

			if ( isCube ) {

				framebuffer = renderTarget.__webglFramebuffer[ renderTarget.activeCubeFace ];

			} else {

				framebuffer = renderTarget.__webglFramebuffer;

			}

			width = renderTarget.width;
			height = renderTarget.height;

			vx = 0;
			vy = 0;

		} else {

			framebuffer = null;

			width = _viewportWidth;
			height = _viewportHeight;

			vx = _viewportX;
			vy = _viewportY;

		}

		if ( framebuffer !== _currentFramebuffer ) {

			_gl.bindFramebuffer( _gl.FRAMEBUFFER, framebuffer );
			_gl.viewport( vx, vy, width, height );

			_currentFramebuffer = framebuffer;

		}

		this.currentWidth = width;
		this.currentHeight = height;

	};
	
	
	

	function clampToMaxSize ( image, maxSize ) {

		if ( image.width <= maxSize && image.height <= maxSize ) {

			return image;

		}

		// Warning: Scaling through the canvas will only work with images that use
		// premultiplied alpha.

		var maxDimension = Math.max( image.width, image.height );
		var newWidth = Math.floor( image.width * maxSize / maxDimension );
		var newHeight = Math.floor( image.height * maxSize / maxDimension );

		var canvas = document.createElement( 'canvas' );
		canvas.width = newWidth;
		canvas.height = newHeight;

		var ctx = canvas.getContext( "2d" );
		ctx.drawImage( image, 0, 0, image.width, image.height, 0, 0, newWidth, newHeight );

		return canvas;

	};
	
	this.updateRenderTargetMipmap = function updateRenderTargetMipmap ( renderTarget ) {

		if ( renderTarget instanceof THREE.WebGLRenderTargetCube ) {

			_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, renderTarget.__webglTexture );
			_gl.generateMipmap( _gl.TEXTURE_CUBE_MAP );
			_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, null );

		} else {

			_gl.bindTexture( _gl.TEXTURE_2D, renderTarget.__webglTexture );
			_gl.generateMipmap( _gl.TEXTURE_2D );
			_gl.bindTexture( _gl.TEXTURE_2D, null );

		}

	};
	
	this.setCubeTextureDynamic = function setCubeTextureDynamic ( texture, slot ) {

		_gl.activeTexture( _gl.TEXTURE0 + slot );
		_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, texture.__webglTexture );

	}; 


	
	
	
	// Map three.js constants to WebGL constants
	this.paramThreeToGL = function paramThreeToGL ( p ) {

		if ( p === THREE.RepeatWrapping ) return _gl.REPEAT;
		if ( p === THREE.ClampToEdgeWrapping ) return _gl.CLAMP_TO_EDGE;
		if ( p === THREE.MirroredRepeatWrapping ) return _gl.MIRRORED_REPEAT;

		if ( p === THREE.NearestFilter ) return _gl.NEAREST;
		if ( p === THREE.NearestMipMapNearestFilter ) return _gl.NEAREST_MIPMAP_NEAREST;
		if ( p === THREE.NearestMipMapLinearFilter ) return _gl.NEAREST_MIPMAP_LINEAR;

		if ( p === THREE.LinearFilter ) return _gl.LINEAR;
		if ( p === THREE.LinearMipMapNearestFilter ) return _gl.LINEAR_MIPMAP_NEAREST;
		if ( p === THREE.LinearMipMapLinearFilter ) return _gl.LINEAR_MIPMAP_LINEAR;

		if ( p === THREE.UnsignedByteType ) return _gl.UNSIGNED_BYTE;
		if ( p === THREE.UnsignedShort4444Type ) return _gl.UNSIGNED_SHORT_4_4_4_4;
		if ( p === THREE.UnsignedShort5551Type ) return _gl.UNSIGNED_SHORT_5_5_5_1;
		if ( p === THREE.UnsignedShort565Type ) return _gl.UNSIGNED_SHORT_5_6_5;

		if ( p === THREE.ByteType ) return _gl.BYTE;
		if ( p === THREE.ShortType ) return _gl.SHORT;
		if ( p === THREE.UnsignedShortType ) return _gl.UNSIGNED_SHORT;
		if ( p === THREE.IntType ) return _gl.INT;
		if ( p === THREE.UnsignedIntType ) return _gl.UNSIGNED_INT;
		if ( p === THREE.FloatType ) return _gl.FLOAT;

		if ( p === THREE.AlphaFormat ) return _gl.ALPHA;
		if ( p === THREE.RGBFormat ) return _gl.RGB;
		if ( p === THREE.RGBAFormat ) return _gl.RGBA;
		if ( p === THREE.LuminanceFormat ) return _gl.LUMINANCE;
		if ( p === THREE.LuminanceAlphaFormat ) return _gl.LUMINANCE_ALPHA;

		if ( p === THREE.AddEquation ) return _gl.FUNC_ADD;
		if ( p === THREE.SubtractEquation ) return _gl.FUNC_SUBTRACT;
		if ( p === THREE.ReverseSubtractEquation ) return _gl.FUNC_REVERSE_SUBTRACT;

		if ( p === THREE.ZeroFactor ) return _gl.ZERO;
		if ( p === THREE.OneFactor ) return _gl.ONE;
		if ( p === THREE.SrcColorFactor ) return _gl.SRC_COLOR;
		if ( p === THREE.OneMinusSrcColorFactor ) return _gl.ONE_MINUS_SRC_COLOR;
		if ( p === THREE.SrcAlphaFactor ) return _gl.SRC_ALPHA;
		if ( p === THREE.OneMinusSrcAlphaFactor ) return _gl.ONE_MINUS_SRC_ALPHA;
		if ( p === THREE.DstAlphaFactor ) return _gl.DST_ALPHA;
		if ( p === THREE.OneMinusDstAlphaFactor ) return _gl.ONE_MINUS_DST_ALPHA;

		if ( p === THREE.DstColorFactor ) return _gl.DST_COLOR;
		if ( p === THREE.OneMinusDstColorFactor ) return _gl.ONE_MINUS_DST_COLOR;
		if ( p === THREE.SrcAlphaSaturateFactor ) return _gl.SRC_ALPHA_SATURATE;

		if ( _glExtensionCompressedTextureS3TC !== undefined ) {

			if ( p === THREE.RGB_S3TC_DXT1_Format ) return _glExtensionCompressedTextureS3TC.COMPRESSED_RGB_S3TC_DXT1_EXT;
			if ( p === THREE.RGBA_S3TC_DXT1_Format ) return _glExtensionCompressedTextureS3TC.COMPRESSED_RGBA_S3TC_DXT1_EXT;
			if ( p === THREE.RGBA_S3TC_DXT3_Format ) return _glExtensionCompressedTextureS3TC.COMPRESSED_RGBA_S3TC_DXT3_EXT;
			if ( p === THREE.RGBA_S3TC_DXT5_Format ) return _glExtensionCompressedTextureS3TC.COMPRESSED_RGBA_S3TC_DXT5_EXT;

		}

		return 0;

	};
	
	
	this.compileShader = function(vertexShader, fragmentShader){
		
		var program = _gl.createProgram();

		var glFragmentShader = getShader( "fragment", fragmentShader );
		var glVertexShader = getShader( "vertex", vertexShader );

		_gl.attachShader( program, glVertexShader );
		_gl.attachShader( program, glFragmentShader );

		_gl.linkProgram( program );

		if ( !_gl.getProgramParameter( program, _gl.LINK_STATUS ) ) {

			console.error( "Could not initialise shader\n" + "VALIDATE_STATUS: " + _gl.getProgramParameter( program, _gl.VALIDATE_STATUS ) + ", gl error [" + _gl.getError() + "]" );

		}

		// clean up

		_gl.deleteShader( glFragmentShader );
		_gl.deleteShader( glVertexShader );

		return program;
		
	};
	
	function getShader ( type, string ) {

		var shader;

		if ( type === "fragment" ) {

			shader = _gl.createShader( _gl.FRAGMENT_SHADER );

		} else if ( type === "vertex" ) {

			shader = _gl.createShader( _gl.VERTEX_SHADER );

		}

		_gl.shaderSource( shader, string );
		_gl.compileShader( shader );

		if ( !_gl.getShaderParameter( shader, _gl.COMPILE_STATUS ) ) {

			console.error( _gl.getShaderInfoLog( shader ) );
			console.error( addLineNumbers( string ) );
			return null;

		}

		return shader;

	};
	

	function addLineNumbers ( string ) {

		var chunks = string.split( "\n" );

		for ( var i = 0, il = chunks.length; i < il; i ++ ) {

			// Chrome reports shader errors on lines
			// starting counting from 1

			chunks[ i ] = ( i + 1 ) + ": " + chunks[ i ];

		}

		return chunks.join( "\n" );

	};
	
	
	
	function setLineWidth ( width ) {

		if ( width !== _oldLineWidth ) {

			_gl.lineWidth( width );

			_oldLineWidth = width;

		}

	};
};


