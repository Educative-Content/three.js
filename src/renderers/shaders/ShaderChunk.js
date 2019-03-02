/// START: Remove Deprecated Stuff On Next Release
import alphamap_fragment from './ShaderChunk/alphamap_fragment.glsl.js';
import alphamap_pars_fragment from './ShaderChunk/alphamap_pars_fragment.glsl.js';
import alphatest_fragment from './ShaderChunk/alphatest_fragment.glsl.js';
import aomap_fragment from './ShaderChunk/aomap_fragment.glsl.js';
import aomap_pars_fragment from './ShaderChunk/aomap_pars_fragment.glsl.js';
import begin_vertex from './ShaderChunk/begin_vertex.glsl.js';
import beginnormal_vertex from './ShaderChunk/beginnormal_vertex.glsl.js';
import bsdfs from './ShaderChunk/bsdfs.glsl.js';
import bumpmap_pars_fragment from './ShaderChunk/bumpmap_pars_fragment.glsl.js';
import clipping_planes_fragment from './ShaderChunk/clipping_planes_fragment.glsl.js';
import clipping_planes_pars_fragment from './ShaderChunk/clipping_planes_pars_fragment.glsl.js';
import clipping_planes_pars_vertex from './ShaderChunk/clipping_planes_pars_vertex.glsl.js';
import clipping_planes_vertex from './ShaderChunk/clipping_planes_vertex.glsl.js';
import color_fragment from './ShaderChunk/color_fragment.glsl.js';
import color_pars_fragment from './ShaderChunk/color_pars_fragment.glsl.js';
import color_pars_vertex from './ShaderChunk/color_pars_vertex.glsl.js';
import color_vertex from './ShaderChunk/color_vertex.glsl.js';
import common from './ShaderChunk/common.glsl.js';
import cube_uv_reflection_fragment from './ShaderChunk/cube_uv_reflection_fragment.glsl.js';
import default_fragment from './ShaderChunk/default_fragment.glsl.js';
import default_vertex from './ShaderChunk/default_vertex.glsl.js';
import defaultnormal_vertex from './ShaderChunk/defaultnormal_vertex.glsl.js';
import displacementmap_pars_vertex from './ShaderChunk/displacementmap_pars_vertex.glsl.js';
import displacementmap_vertex from './ShaderChunk/displacementmap_vertex.glsl.js';
import dithering_fragment from './ShaderChunk/dithering_fragment.glsl.js';
import dithering_pars_fragment from './ShaderChunk/dithering_pars_fragment.glsl.js';
import emissivemap_fragment from './ShaderChunk/emissivemap_fragment.glsl.js';
import emissivemap_pars_fragment from './ShaderChunk/emissivemap_pars_fragment.glsl.js';
import encodings_fragment from './ShaderChunk/encodings_fragment.glsl.js';
import encodings_pars_fragment from './ShaderChunk/encodings_pars_fragment.glsl.js';
import envmap_fragment from './ShaderChunk/envmap_fragment.glsl.js';
import envmap_pars_fragment from './ShaderChunk/envmap_pars_fragment.glsl.js';
import envmap_pars_vertex from './ShaderChunk/envmap_pars_vertex.glsl.js';
import envmap_physical_pars_fragment from './ShaderChunk/envmap_physical_pars_fragment.glsl.js';
import envmap_vertex from './ShaderChunk/envmap_vertex.glsl.js';
import fog_fragment from './ShaderChunk/fog_fragment.glsl.js';
import fog_pars_fragment from './ShaderChunk/fog_pars_fragment.glsl.js';
import fog_pars_vertex from './ShaderChunk/fog_pars_vertex.glsl.js';
import fog_vertex from './ShaderChunk/fog_vertex.glsl.js';
import gradientmap_pars_fragment from './ShaderChunk/gradientmap_pars_fragment.glsl.js';
import lightmap_fragment from './ShaderChunk/lightmap_fragment.glsl.js';
import lightmap_pars_fragment from './ShaderChunk/lightmap_pars_fragment.glsl.js';
import lights_fragment_begin from './ShaderChunk/lights_fragment_begin.glsl.js';
import lights_fragment_end from './ShaderChunk/lights_fragment_end.glsl.js';
import lights_fragment_maps from './ShaderChunk/lights_fragment_maps.glsl.js';
import lights_lambert_vertex from './ShaderChunk/lights_lambert_vertex.glsl.js';
import lights_pars_begin from './ShaderChunk/lights_pars_begin.glsl.js';
import lights_phong_fragment from './ShaderChunk/lights_phong_fragment.glsl.js';
import lights_phong_pars_fragment from './ShaderChunk/lights_phong_pars_fragment.glsl.js';
import lights_physical_fragment from './ShaderChunk/lights_physical_fragment.glsl.js';
import lights_physical_pars_fragment from './ShaderChunk/lights_physical_pars_fragment.glsl.js';
import logdepthbuf_fragment from './ShaderChunk/logdepthbuf_fragment.glsl.js';
import logdepthbuf_pars_fragment from './ShaderChunk/logdepthbuf_pars_fragment.glsl.js';
import logdepthbuf_pars_vertex from './ShaderChunk/logdepthbuf_pars_vertex.glsl.js';
import logdepthbuf_vertex from './ShaderChunk/logdepthbuf_vertex.glsl.js';
import map_fragment from './ShaderChunk/map_fragment.glsl.js';
import map_pars_fragment from './ShaderChunk/map_pars_fragment.glsl.js';
import map_particle_fragment from './ShaderChunk/map_particle_fragment.glsl.js';
import map_particle_pars_fragment from './ShaderChunk/map_particle_pars_fragment.glsl.js';
import metalnessmap_fragment from './ShaderChunk/metalnessmap_fragment.glsl.js';
import metalnessmap_pars_fragment from './ShaderChunk/metalnessmap_pars_fragment.glsl.js';
import morphnormal_vertex from './ShaderChunk/morphnormal_vertex.glsl.js';
import morphtarget_pars_vertex from './ShaderChunk/morphtarget_pars_vertex.glsl.js';
import morphtarget_vertex from './ShaderChunk/morphtarget_vertex.glsl.js';
import normal_fragment_begin from './ShaderChunk/normal_fragment_begin.glsl.js';
import normal_fragment_maps from './ShaderChunk/normal_fragment_maps.glsl.js';
import normalmap_pars_fragment from './ShaderChunk/normalmap_pars_fragment.glsl.js';
import packing from './ShaderChunk/packing.glsl.js';
import premultiplied_alpha_fragment from './ShaderChunk/premultiplied_alpha_fragment.glsl.js';
import project_vertex from './ShaderChunk/project_vertex.glsl.js';
import roughnessmap_fragment from './ShaderChunk/roughnessmap_fragment.glsl.js';
import roughnessmap_pars_fragment from './ShaderChunk/roughnessmap_pars_fragment.glsl.js';
import shadowmap_pars_fragment from './ShaderChunk/shadowmap_pars_fragment.glsl.js';
import shadowmap_pars_vertex from './ShaderChunk/shadowmap_pars_vertex.glsl.js';
import shadowmap_vertex from './ShaderChunk/shadowmap_vertex.glsl.js';
import shadowmask_pars_fragment from './ShaderChunk/shadowmask_pars_fragment.glsl.js';
import skinbase_vertex from './ShaderChunk/skinbase_vertex.glsl.js';
import skinning_pars_vertex from './ShaderChunk/skinning_pars_vertex.glsl.js';
import skinning_vertex from './ShaderChunk/skinning_vertex.glsl.js';
import skinnormal_vertex from './ShaderChunk/skinnormal_vertex.glsl.js';
import specularmap_fragment from './ShaderChunk/specularmap_fragment.glsl.js';
import specularmap_pars_fragment from './ShaderChunk/specularmap_pars_fragment.glsl.js';
import tonemapping_fragment from './ShaderChunk/tonemapping_fragment.glsl.js';
import tonemapping_pars_fragment from './ShaderChunk/tonemapping_pars_fragment.glsl.js';
import uv2_pars_fragment from './ShaderChunk/uv2_pars_fragment.glsl.js';
import uv2_pars_vertex from './ShaderChunk/uv2_pars_vertex.glsl.js';
import uv2_vertex from './ShaderChunk/uv2_vertex.glsl.js';
import uv_pars_fragment from './ShaderChunk/uv_pars_fragment.glsl.js';
import uv_pars_vertex from './ShaderChunk/uv_pars_vertex.glsl.js';
import uv_vertex from './ShaderChunk/uv_vertex.glsl.js';
import worldpos_vertex from './ShaderChunk/worldpos_vertex.glsl.js';

import background_frag from './ShaderLib/background_frag.glsl.js';
import background_vert from './ShaderLib/background_vert.glsl.js';
import cube_frag from './ShaderLib/cube_frag.glsl.js';
import cube_vert from './ShaderLib/cube_vert.glsl.js';
import depth_frag from './ShaderLib/depth_frag.glsl.js';
import depth_vert from './ShaderLib/depth_vert.glsl.js';
import distanceRGBA_frag from './ShaderLib/distanceRGBA_frag.glsl.js';
import distanceRGBA_vert from './ShaderLib/distanceRGBA_vert.glsl.js';
import equirect_frag from './ShaderLib/equirect_frag.glsl.js';
import equirect_vert from './ShaderLib/equirect_vert.glsl.js';
import linedashed_frag from './ShaderLib/linedashed_frag.glsl.js';
import linedashed_vert from './ShaderLib/linedashed_vert.glsl.js';
import meshbasic_frag from './ShaderLib/meshbasic_frag.glsl.js';
import meshbasic_vert from './ShaderLib/meshbasic_vert.glsl.js';
import meshlambert_frag from './ShaderLib/meshlambert_frag.glsl.js';
import meshlambert_vert from './ShaderLib/meshlambert_vert.glsl.js';
import meshmatcap_frag from './ShaderLib/meshmatcap_frag.glsl.js';
import meshmatcap_vert from './ShaderLib/meshmatcap_vert.glsl.js';
import meshphong_frag from './ShaderLib/meshphong_frag.glsl.js';
import meshphong_vert from './ShaderLib/meshphong_vert.glsl.js';
import meshphysical_frag from './ShaderLib/meshphysical_frag.glsl.js';
import meshphysical_vert from './ShaderLib/meshphysical_vert.glsl.js';
import normal_frag from './ShaderLib/normal_frag.glsl.js';
import normal_vert from './ShaderLib/normal_vert.glsl.js';
import points_frag from './ShaderLib/points_frag.glsl.js';
import points_vert from './ShaderLib/points_vert.glsl.js';
import shadow_frag from './ShaderLib/shadow_frag.glsl.js';
import shadow_vert from './ShaderLib/shadow_vert.glsl.js';
import sprite_frag from './ShaderLib/sprite_frag.glsl.js';
import sprite_vert from './ShaderLib/sprite_vert.glsl.js';

function deprecatedUsageOf( shader ) {

	console.warn( 'Deprecated: The usage of ShaderChunk members is now deprecated, use named exports from ShaderChunk file or import directly the targeted shader.' );
	return shader;

}

export var ShaderChunk = {
	alphamap_fragment: deprecatedUsageOf( alphamap_fragment ),
	alphamap_pars_fragment: deprecatedUsageOf( alphamap_pars_fragment ),
	alphatest_fragment: deprecatedUsageOf( alphatest_fragment ),
	aomap_fragment: deprecatedUsageOf( aomap_fragment ),
	aomap_pars_fragment: deprecatedUsageOf( aomap_pars_fragment ),
	begin_vertex: deprecatedUsageOf( begin_vertex ),
	beginnormal_vertex: deprecatedUsageOf( beginnormal_vertex ),
	bsdfs: deprecatedUsageOf( bsdfs ),
	bumpmap_pars_fragment: deprecatedUsageOf( bumpmap_pars_fragment ),
	clipping_planes_fragment: deprecatedUsageOf( clipping_planes_fragment ),
	clipping_planes_pars_fragment: deprecatedUsageOf( clipping_planes_pars_fragment ),
	clipping_planes_pars_vertex: deprecatedUsageOf( clipping_planes_pars_vertex ),
	clipping_planes_vertex: deprecatedUsageOf( clipping_planes_vertex ),
	color_fragment: deprecatedUsageOf( color_fragment ),
	color_pars_fragment: deprecatedUsageOf( color_pars_fragment ),
	color_pars_vertex: deprecatedUsageOf( color_pars_vertex ),
	color_vertex: deprecatedUsageOf( color_vertex ),
	common: deprecatedUsageOf( common ),
	cube_uv_reflection_fragment: deprecatedUsageOf( cube_uv_reflection_fragment ),
	default_fragment: deprecatedUsageOf( default_fragment ),
	default_vertex: deprecatedUsageOf( default_vertex ),
	defaultnormal_vertex: deprecatedUsageOf( defaultnormal_vertex ),
	displacementmap_pars_vertex: deprecatedUsageOf( displacementmap_pars_vertex ),
	displacementmap_vertex: deprecatedUsageOf( displacementmap_vertex ),
	dithering_fragment: deprecatedUsageOf( dithering_fragment ),
	dithering_pars_fragment: deprecatedUsageOf( dithering_pars_fragment ),
	emissivemap_fragment: deprecatedUsageOf( emissivemap_fragment ),
	emissivemap_pars_fragment: deprecatedUsageOf( emissivemap_pars_fragment ),
	encodings_fragment: deprecatedUsageOf( encodings_fragment ),
	encodings_pars_fragment: deprecatedUsageOf( encodings_pars_fragment ),
	envmap_fragment: deprecatedUsageOf( envmap_fragment ),
	envmap_pars_fragment: deprecatedUsageOf( envmap_pars_fragment ),
	envmap_pars_vertex: deprecatedUsageOf( envmap_pars_vertex ),
	envmap_physical_pars_fragment: deprecatedUsageOf( envmap_physical_pars_fragment ),
	envmap_vertex: deprecatedUsageOf( envmap_vertex ),
	fog_fragment: deprecatedUsageOf( fog_fragment ),
	fog_pars_fragment: deprecatedUsageOf( fog_pars_fragment ),
	fog_pars_vertex: deprecatedUsageOf( fog_pars_vertex ),
	fog_vertex: deprecatedUsageOf( fog_vertex ),
	gradientmap_pars_fragment: deprecatedUsageOf( gradientmap_pars_fragment ),
	lightmap_fragment: deprecatedUsageOf( lightmap_fragment ),
	lightmap_pars_fragment: deprecatedUsageOf( lightmap_pars_fragment ),
	lights_fragment_begin: deprecatedUsageOf( lights_fragment_begin ),
	lights_fragment_end: deprecatedUsageOf( lights_fragment_end ),
	lights_fragment_maps: deprecatedUsageOf( lights_fragment_maps ),
	lights_lambert_vertex: deprecatedUsageOf( lights_lambert_vertex ),
	lights_pars_begin: deprecatedUsageOf( lights_pars_begin ),
	lights_phong_fragment: deprecatedUsageOf( lights_phong_fragment ),
	lights_phong_pars_fragment: deprecatedUsageOf( lights_phong_pars_fragment ),
	lights_physical_fragment: deprecatedUsageOf( lights_physical_fragment ),
	lights_physical_pars_fragment: deprecatedUsageOf( lights_physical_pars_fragment ),
	logdepthbuf_fragment: deprecatedUsageOf( logdepthbuf_fragment ),
	logdepthbuf_pars_fragment: deprecatedUsageOf( logdepthbuf_pars_fragment ),
	logdepthbuf_pars_vertex: deprecatedUsageOf( logdepthbuf_pars_vertex ),
	logdepthbuf_vertex: deprecatedUsageOf( logdepthbuf_vertex ),
	map_fragment: deprecatedUsageOf( map_fragment ),
	map_pars_fragment: deprecatedUsageOf( map_pars_fragment ),
	map_particle_fragment: deprecatedUsageOf( map_particle_fragment ),
	map_particle_pars_fragment: deprecatedUsageOf( map_particle_pars_fragment ),
	metalnessmap_fragment: deprecatedUsageOf( metalnessmap_fragment ),
	metalnessmap_pars_fragment: deprecatedUsageOf( metalnessmap_pars_fragment ),
	morphnormal_vertex: deprecatedUsageOf( morphnormal_vertex ),
	morphtarget_pars_vertex: deprecatedUsageOf( morphtarget_pars_vertex ),
	morphtarget_vertex: deprecatedUsageOf( morphtarget_vertex ),
	normal_fragment_begin: deprecatedUsageOf( normal_fragment_begin ),
	normal_fragment_maps: deprecatedUsageOf( normal_fragment_maps ),
	normalmap_pars_fragment: deprecatedUsageOf( normalmap_pars_fragment ),
	packing: deprecatedUsageOf( packing ),
	premultiplied_alpha_fragment: deprecatedUsageOf( premultiplied_alpha_fragment ),
	project_vertex: deprecatedUsageOf( project_vertex ),
	roughnessmap_fragment: deprecatedUsageOf( roughnessmap_fragment ),
	roughnessmap_pars_fragment: deprecatedUsageOf( roughnessmap_pars_fragment ),
	shadowmap_pars_fragment: deprecatedUsageOf( shadowmap_pars_fragment ),
	shadowmap_pars_vertex: deprecatedUsageOf( shadowmap_pars_vertex ),
	shadowmap_vertex: deprecatedUsageOf( shadowmap_vertex ),
	shadowmask_pars_fragment: deprecatedUsageOf( shadowmask_pars_fragment ),
	skinbase_vertex: deprecatedUsageOf( skinbase_vertex ),
	skinning_pars_vertex: deprecatedUsageOf( skinning_pars_vertex ),
	skinning_vertex: deprecatedUsageOf( skinning_vertex ),
	skinnormal_vertex: deprecatedUsageOf( skinnormal_vertex ),
	specularmap_fragment: deprecatedUsageOf( specularmap_fragment ),
	specularmap_pars_fragment: deprecatedUsageOf( specularmap_pars_fragment ),
	tonemapping_fragment: deprecatedUsageOf( tonemapping_fragment ),
	tonemapping_pars_fragment: deprecatedUsageOf( tonemapping_pars_fragment ),
	uv2_pars_fragment: deprecatedUsageOf( uv2_pars_fragment ),
	uv2_pars_vertex: deprecatedUsageOf( uv2_pars_vertex ),
	uv2_vertex: deprecatedUsageOf( uv2_vertex ),
	uv_pars_fragment: deprecatedUsageOf( uv_pars_fragment ),
	uv_pars_vertex: deprecatedUsageOf( uv_pars_vertex ),
	uv_vertex: deprecatedUsageOf( uv_vertex ),
	worldpos_vertex: deprecatedUsageOf( worldpos_vertex ),

	background_frag: deprecatedUsageOf( background_frag ),
	background_vert: deprecatedUsageOf( background_vert ),
	cube_frag: deprecatedUsageOf( cube_frag ),
	cube_vert: deprecatedUsageOf( cube_vert ),
	depth_frag: deprecatedUsageOf( depth_frag ),
	depth_vert: deprecatedUsageOf( depth_vert ),
	distanceRGBA_frag: deprecatedUsageOf( distanceRGBA_frag ),
	distanceRGBA_vert: deprecatedUsageOf( distanceRGBA_vert ),
	equirect_frag: deprecatedUsageOf( equirect_frag ),
	equirect_vert: deprecatedUsageOf( equirect_vert ),
	linedashed_frag: deprecatedUsageOf( linedashed_frag ),
	linedashed_vert: deprecatedUsageOf( linedashed_vert ),
	meshbasic_frag: deprecatedUsageOf( meshbasic_frag ),
	meshbasic_vert: deprecatedUsageOf( meshbasic_vert ),
	meshlambert_frag: deprecatedUsageOf( meshlambert_frag ),
	meshlambert_vert: deprecatedUsageOf( meshlambert_vert ),
	meshmatcap_frag: deprecatedUsageOf( meshmatcap_frag ),
	meshmatcap_vert: deprecatedUsageOf( meshmatcap_vert ),
	meshphong_frag: deprecatedUsageOf( meshphong_frag ),
	meshphong_vert: deprecatedUsageOf( meshphong_vert ),
	meshphysical_frag: deprecatedUsageOf( meshphysical_frag ),
	meshphysical_vert: deprecatedUsageOf( meshphysical_vert ),
	normal_frag: deprecatedUsageOf( normal_frag ),
	normal_vert: deprecatedUsageOf( normal_vert ),
	points_frag: deprecatedUsageOf( points_frag ),
	points_vert: deprecatedUsageOf( points_vert ),
	shadow_frag: deprecatedUsageOf( shadow_frag ),
	shadow_vert: deprecatedUsageOf( shadow_vert ),
	sprite_frag: deprecatedUsageOf( sprite_frag ),
	sprite_vert: deprecatedUsageOf( sprite_vert ),
};
/// END: Remove Deprecated Stuff On Next Release

export { default as alphamap_fragment } from './ShaderChunk/alphamap_fragment.glsl.js';
export { default as alphamap_pars_fragment } from './ShaderChunk/alphamap_pars_fragment.glsl.js';
export { default as alphatest_fragment } from './ShaderChunk/alphatest_fragment.glsl.js';
export { default as aomap_fragment } from './ShaderChunk/aomap_fragment.glsl.js';
export { default as aomap_pars_fragment } from './ShaderChunk/aomap_pars_fragment.glsl.js';
export { default as begin_vertex } from './ShaderChunk/begin_vertex.glsl.js';
export { default as beginnormal_vertex } from './ShaderChunk/beginnormal_vertex.glsl.js';
export { default as bsdfs } from './ShaderChunk/bsdfs.glsl.js';
export { default as bumpmap_pars_fragment } from './ShaderChunk/bumpmap_pars_fragment.glsl.js';
export { default as clipping_planes_fragment } from './ShaderChunk/clipping_planes_fragment.glsl.js';
export { default as clipping_planes_pars_fragment } from './ShaderChunk/clipping_planes_pars_fragment.glsl.js';
export { default as clipping_planes_pars_vertex } from './ShaderChunk/clipping_planes_pars_vertex.glsl.js';
export { default as clipping_planes_vertex } from './ShaderChunk/clipping_planes_vertex.glsl.js';
export { default as color_fragment } from './ShaderChunk/color_fragment.glsl.js';
export { default as color_pars_fragment } from './ShaderChunk/color_pars_fragment.glsl.js';
export { default as color_pars_vertex } from './ShaderChunk/color_pars_vertex.glsl.js';
export { default as color_vertex } from './ShaderChunk/color_vertex.glsl.js';
export { default as common } from './ShaderChunk/common.glsl.js';
export { default as cube_uv_reflection_fragment } from './ShaderChunk/cube_uv_reflection_fragment.glsl.js';
export { default as default_fragment } from './ShaderChunk/default_fragment.glsl.js';
export { default as default_vertex } from './ShaderChunk/default_vertex.glsl.js';
export { default as defaultnormal_vertex } from './ShaderChunk/defaultnormal_vertex.glsl.js';
export { default as displacementmap_pars_vertex } from './ShaderChunk/displacementmap_pars_vertex.glsl.js';
export { default as displacementmap_vertex } from './ShaderChunk/displacementmap_vertex.glsl.js';
export { default as dithering_fragment } from './ShaderChunk/dithering_fragment.glsl.js';
export { default as dithering_pars_fragment } from './ShaderChunk/dithering_pars_fragment.glsl.js';
export { default as emissivemap_fragment } from './ShaderChunk/emissivemap_fragment.glsl.js';
export { default as emissivemap_pars_fragment } from './ShaderChunk/emissivemap_pars_fragment.glsl.js';
export { default as encodings_fragment } from './ShaderChunk/encodings_fragment.glsl.js';
export { default as encodings_pars_fragment } from './ShaderChunk/encodings_pars_fragment.glsl.js';
export { default as envmap_fragment } from './ShaderChunk/envmap_fragment.glsl.js';
export { default as envmap_pars_fragment } from './ShaderChunk/envmap_pars_fragment.glsl.js';
export { default as envmap_pars_vertex } from './ShaderChunk/envmap_pars_vertex.glsl.js';
export { default as envmap_physical_pars_fragment } from './ShaderChunk/envmap_physical_pars_fragment.glsl.js';
export { default as envmap_vertex } from './ShaderChunk/envmap_vertex.glsl.js';
export { default as fog_fragment } from './ShaderChunk/fog_fragment.glsl.js';
export { default as fog_pars_fragment } from './ShaderChunk/fog_pars_fragment.glsl.js';
export { default as fog_pars_vertex } from './ShaderChunk/fog_pars_vertex.glsl.js';
export { default as fog_vertex } from './ShaderChunk/fog_vertex.glsl.js';
export { default as gradientmap_pars_fragment } from './ShaderChunk/gradientmap_pars_fragment.glsl.js';
export { default as lightmap_fragment } from './ShaderChunk/lightmap_fragment.glsl.js';
export { default as lightmap_pars_fragment } from './ShaderChunk/lightmap_pars_fragment.glsl.js';
export { default as lights_fragment_begin } from './ShaderChunk/lights_fragment_begin.glsl.js';
export { default as lights_fragment_end } from './ShaderChunk/lights_fragment_end.glsl.js';
export { default as lights_fragment_maps } from './ShaderChunk/lights_fragment_maps.glsl.js';
export { default as lights_lambert_vertex } from './ShaderChunk/lights_lambert_vertex.glsl.js';
export { default as lights_pars_begin } from './ShaderChunk/lights_pars_begin.glsl.js';
export { default as lights_phong_fragment } from './ShaderChunk/lights_phong_fragment.glsl.js';
export { default as lights_phong_pars_fragment } from './ShaderChunk/lights_phong_pars_fragment.glsl.js';
export { default as lights_physical_fragment } from './ShaderChunk/lights_physical_fragment.glsl.js';
export { default as lights_physical_pars_fragment } from './ShaderChunk/lights_physical_pars_fragment.glsl.js';
export { default as logdepthbuf_fragment } from './ShaderChunk/logdepthbuf_fragment.glsl.js';
export { default as logdepthbuf_pars_fragment } from './ShaderChunk/logdepthbuf_pars_fragment.glsl.js';
export { default as logdepthbuf_pars_vertex } from './ShaderChunk/logdepthbuf_pars_vertex.glsl.js';
export { default as logdepthbuf_vertex } from './ShaderChunk/logdepthbuf_vertex.glsl.js';
export { default as map_fragment } from './ShaderChunk/map_fragment.glsl.js';
export { default as map_pars_fragment } from './ShaderChunk/map_pars_fragment.glsl.js';
export { default as map_particle_fragment } from './ShaderChunk/map_particle_fragment.glsl.js';
export { default as map_particle_pars_fragment } from './ShaderChunk/map_particle_pars_fragment.glsl.js';
export { default as metalnessmap_fragment } from './ShaderChunk/metalnessmap_fragment.glsl.js';
export { default as metalnessmap_pars_fragment } from './ShaderChunk/metalnessmap_pars_fragment.glsl.js';
export { default as morphnormal_vertex } from './ShaderChunk/morphnormal_vertex.glsl.js';
export { default as morphtarget_pars_vertex } from './ShaderChunk/morphtarget_pars_vertex.glsl.js';
export { default as morphtarget_vertex } from './ShaderChunk/morphtarget_vertex.glsl.js';
export { default as normal_fragment_begin } from './ShaderChunk/normal_fragment_begin.glsl.js';
export { default as normal_fragment_maps } from './ShaderChunk/normal_fragment_maps.glsl.js';
export { default as normalmap_pars_fragment } from './ShaderChunk/normalmap_pars_fragment.glsl.js';
export { default as packing } from './ShaderChunk/packing.glsl.js';
export { default as premultiplied_alpha_fragment } from './ShaderChunk/premultiplied_alpha_fragment.glsl.js';
export { default as project_vertex } from './ShaderChunk/project_vertex.glsl.js';
export { default as roughnessmap_fragment } from './ShaderChunk/roughnessmap_fragment.glsl.js';
export { default as roughnessmap_pars_fragment } from './ShaderChunk/roughnessmap_pars_fragment.glsl.js';
export { default as shadowmap_pars_fragment } from './ShaderChunk/shadowmap_pars_fragment.glsl.js';
export { default as shadowmap_pars_vertex } from './ShaderChunk/shadowmap_pars_vertex.glsl.js';
export { default as shadowmap_vertex } from './ShaderChunk/shadowmap_vertex.glsl.js';
export { default as shadowmask_pars_fragment } from './ShaderChunk/shadowmask_pars_fragment.glsl.js';
export { default as skinbase_vertex } from './ShaderChunk/skinbase_vertex.glsl.js';
export { default as skinning_pars_vertex } from './ShaderChunk/skinning_pars_vertex.glsl.js';
export { default as skinning_vertex } from './ShaderChunk/skinning_vertex.glsl.js';
export { default as skinnormal_vertex } from './ShaderChunk/skinnormal_vertex.glsl.js';
export { default as specularmap_fragment } from './ShaderChunk/specularmap_fragment.glsl.js';
export { default as specularmap_pars_fragment } from './ShaderChunk/specularmap_pars_fragment.glsl.js';
export { default as tonemapping_fragment } from './ShaderChunk/tonemapping_fragment.glsl.js';
export { default as tonemapping_pars_fragment } from './ShaderChunk/tonemapping_pars_fragment.glsl.js';
export { default as uv2_pars_fragment } from './ShaderChunk/uv2_pars_fragment.glsl.js';
export { default as uv2_pars_vertex } from './ShaderChunk/uv2_pars_vertex.glsl.js';
export { default as uv2_vertex } from './ShaderChunk/uv2_vertex.glsl.js';
export { default as uv_pars_fragment } from './ShaderChunk/uv_pars_fragment.glsl.js';
export { default as uv_pars_vertex } from './ShaderChunk/uv_pars_vertex.glsl.js';
export { default as uv_vertex } from './ShaderChunk/uv_vertex.glsl.js';
export { default as worldpos_vertex } from './ShaderChunk/worldpos_vertex.glsl.js';

export { default as background_frag } from './ShaderLib/background_frag.glsl.js';
export { default as background_vert } from './ShaderLib/background_vert.glsl.js';
export { default as cube_frag } from './ShaderLib/cube_frag.glsl.js';
export { default as cube_vert } from './ShaderLib/cube_vert.glsl.js';
export { default as depth_frag } from './ShaderLib/depth_frag.glsl.js';
export { default as depth_vert } from './ShaderLib/depth_vert.glsl.js';
export { default as distanceRGBA_frag } from './ShaderLib/distanceRGBA_frag.glsl.js';
export { default as distanceRGBA_vert } from './ShaderLib/distanceRGBA_vert.glsl.js';
export { default as equirect_frag } from './ShaderLib/equirect_frag.glsl.js';
export { default as equirect_vert } from './ShaderLib/equirect_vert.glsl.js';
export { default as linedashed_frag } from './ShaderLib/linedashed_frag.glsl.js';
export { default as linedashed_vert } from './ShaderLib/linedashed_vert.glsl.js';
export { default as meshbasic_frag } from './ShaderLib/meshbasic_frag.glsl.js';
export { default as meshbasic_vert } from './ShaderLib/meshbasic_vert.glsl.js';
export { default as meshlambert_frag } from './ShaderLib/meshlambert_frag.glsl.js';
export { default as meshlambert_vert } from './ShaderLib/meshlambert_vert.glsl.js';
export { default as meshmatcap_frag } from './ShaderLib/meshmatcap_frag.glsl.js';
export { default as meshmatcap_vert } from './ShaderLib/meshmatcap_vert.glsl.js';
export { default as meshphong_frag } from './ShaderLib/meshphong_frag.glsl.js';
export { default as meshphong_vert } from './ShaderLib/meshphong_vert.glsl.js';
export { default as meshphysical_frag } from './ShaderLib/meshphysical_frag.glsl.js';
export { default as meshphysical_vert } from './ShaderLib/meshphysical_vert.glsl.js';
export { default as normal_frag } from './ShaderLib/normal_frag.glsl.js';
export { default as normal_vert } from './ShaderLib/normal_vert.glsl.js';
export { default as points_frag } from './ShaderLib/points_frag.glsl.js';
export { default as points_vert } from './ShaderLib/points_vert.glsl.js';
export { default as shadow_frag } from './ShaderLib/shadow_frag.glsl.js';
export { default as shadow_vert } from './ShaderLib/shadow_vert.glsl.js';
export { default as sprite_frag } from './ShaderLib/sprite_frag.glsl.js';
export { default as sprite_vert } from './ShaderLib/sprite_vert.glsl.js';
