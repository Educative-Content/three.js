/**
 * @author bhouston / http://clara.io/
 *
 * Scalable Ambient Occlusion
 *
 */

THREE.SAOShader = {

	defines: {
		'NUM_SAMPLES': 7,
		'NUM_RINGS': 4,
		"MODE": 0,
		"NORMAL_TEXTURE": 0,
		"DIFFUSE_TEXTURE": 1,
		"DEPTH_PACKING": 1,
		"PERSPECTIVE_CAMERA": 1
	},

	uniforms: {

		"tDepth":       { type: "t", value: null },
		"tDiffuse":     { type: "t", value: null },
		"tNormal":      { type: "t", value: null },
		"size":         { type: "v2", value: new THREE.Vector2( 512, 512 ) },

		"cameraNear":   { type: "f", value: 1 },
		"cameraFar":    { type: "f", value: 100 },
		"cameraProjectionMatrix": { type: "m4", value: new THREE.Matrix4() },
		"cameraInverseProjectionMatrix": { type: "m4", value: new THREE.Matrix4() },

		"scale":        { type: "f", value: 1.0 },
		"intensity":    { type: "f", value: 0.1 },
		"bias":         { type: "f", value: 0.5 },

		"minResolution": { type: "f", value: 0.0 },
		"kernelRadius": { type: "f", value: 100.0 },
		"randomSeed":   { type: "f", value: 0.0 }
	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		// total number of samples at each fragment",
		"#extension GL_OES_standard_derivatives : enable",

		"#include <common>",

		"varying vec2 vUv;",

		"#if DIFFUSE_TEXTURE == 1",
			"uniform sampler2D tDiffuse;",
		"#endif",

		"uniform sampler2D tDepth;",

		"#if NORMAL_TEXTURE == 1",
			"uniform sampler2D tNormal;",
		"#endif",

		"uniform float cameraNear;",
		"uniform float cameraFar;",
		"uniform mat4 cameraProjectionMatrix;",
		"uniform mat4 cameraInverseProjectionMatrix;",

		"uniform float scale;",
		"uniform float intensity;",
		"uniform float bias;",
		"uniform float kernelRadius;",
		"uniform float minResolution;",
		"uniform vec2 size;",
		"uniform float randomSeed;",

		// RGBA depth

		"#include <packing>",

		"vec4 getDefaultColor( const in vec2 screenPosition ) {",

			"#if DIFFUSE_TEXTURE == 1",
				"return texture2D( tDiffuse, vUv );",
			"#else",
				"return vec4( 1.0 );",
			"#endif",

		"}",

		"float getDepth( const in vec2 screenPosition ) {",

			"#if DEPTH_PACKING == 1",
				"return unpackRGBAToDepth( texture2D( tDepth, screenPosition ) );",
			"#else",
				"return texture2D( tDepth, screenPosition ).x;",
			"#endif",

		"}",

		"float getViewZ( const in float depth ) {",

			"#if PERSPECTIVE_CAMERA == 1",
				"float viewZ = perspectiveDepthToViewZ( depth, cameraNear, cameraFar );",
			"#else",
				"float viewZ = orthoDepthToViewZ( depth, cameraNear, cameraFar );",
			"#endif",

			"return viewZ;",

		"}",

		"vec3 getViewPosition( const in vec2 screenPosition, const in float depth, const in float viewZ ) {",

			"float clipW = cameraProjectionMatrix[2][3] * viewZ + cameraProjectionMatrix[3][3];",
			"vec4 clipPosition = vec4( ( vec3( screenPosition, depth ) - 0.5 ) * 2.0, clipW );",
			"clipPosition.xyz *= clipW;", // unproject to homogeneous coordinates
			"return ( cameraInverseProjectionMatrix * clipPosition ).xyz;",

		"}",

		"vec3 getViewNormal( const in vec3 viewPosition, const in vec2 screenPosition ) {",

			"#if NORMAL_TEXTURE == 1",
				"return -unpackRGBToNormal( texture2D( tNormal, screenPosition ).xyz );",
			"#else",
				"return normalize( cross( dFdx( viewPosition ), dFdy( viewPosition ) ) );",
			"#endif",

		"}",

		"float getOcclusion( const in vec3 centerViewPosition, const in vec3 centerViewNormal, const in vec3 sampleViewPosition ) {",
			// these two are constants based on uniforms
			"float scaleDividedByCameraFar = scale / cameraFar;",
			"float minResolutionMultipliedByCameraFar = minResolution * cameraFar;",

			"vec3 viewDelta = sampleViewPosition - centerViewPosition;",
			"float viewDistance = length( viewDelta );",
			"float scaledScreenDistance = scaleDividedByCameraFar * viewDistance;",
			"return max(0.0, (dot(centerViewNormal, viewDelta) - minResolutionMultipliedByCameraFar) / scaledScreenDistance - bias) / (1.0 + pow2( scaledScreenDistance ) );",

		"}",

		// moving costly divides into consts
		"const float ANGLE_STEP = PI2 * float( NUM_RINGS ) / float( NUM_SAMPLES );",
		"const float INV_NUM_SAMPLES = 1.0 / float( NUM_SAMPLES );",

		"float getAmbientOcclusion( const in vec3 centerViewPosition ) {",

			"vec3 centerViewNormal = getViewNormal( centerViewPosition, vUv );",

			"float random = rand( vUv + randomSeed );",

			// jsfiddle that shows sample pattern: https://jsfiddle.net/a16ff1p7/
			"vec2 scaledKernelRadius = vec2( kernelRadius ) / size;",
			"vec2 radius = scaledKernelRadius * 0.02;",
			"vec2 radiusStep = scaledKernelRadius * 0.98 * INV_NUM_SAMPLES;",

			"float angle = random * PI2;",

			"float occlusionSum = 0.0;",
			"float weightSum = 0.0;",

			"for( int i = 0; i < NUM_SAMPLES; i ++ ) {",
				"vec2 sampleUv = vUv + vec2( cos(angle), sin(angle) ) * radius;",
				"radius += radiusStep;",
				"angle += ANGLE_STEP;",

				"float sampleDepth = getDepth( sampleUv );",
				"if( sampleDepth >= 1.0 ) {",
					"continue;",
				"}",

				"float sampleViewZ = getViewZ( sampleDepth );",
				"vec3 sampleViewPosition = getViewPosition( sampleUv, sampleDepth, sampleViewZ );",
				"occlusionSum += getOcclusion( centerViewPosition, centerViewNormal, sampleViewPosition );",
				"weightSum += 1.0;",

			"}",

			"return ( weightSum == 0.0 ) ? occlusionSum : ( occlusionSum * ( intensity / weightSum ) );",

		"}",


		"void main() {",

			"float centerDepth = getDepth( vUv );",
			"if( centerDepth >= 1.0 ) {",
				"discard;",
			"}",

			"float centerViewZ = getViewZ( centerDepth );",
			"vec3 viewPosition = getViewPosition( vUv, centerDepth, centerViewZ );",

			"gl_FragColor = getDefaultColor( vUv );",
			"gl_FragColor.xyz *= 1.0 - getAmbientOcclusion( viewPosition );",

		"}"

	].join( "\n" )

};
