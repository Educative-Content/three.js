#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_REFLECTIVITYMAP ) || defined( USE_METALNESSMAP )

	vUv = uv * offsetRepeat.zw + offsetRepeat.xy;

#endif