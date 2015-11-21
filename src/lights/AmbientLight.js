/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.AmbientLight = function ( color, intensity ) {

	THREE.Light.call( this, color, intensity );

	this.type = 'AmbientLight';

	this.castShadow = undefined;

	this.intensity = ( intensity !== undefined ) ? intensity : 1;

};

THREE.AmbientLight.prototype = Object.create( THREE.Light.prototype );
THREE.AmbientLight.prototype.constructor = THREE.AmbientLight;

THREE.AmbientLight.prototype.copy = function ( source ) {

	THREE.Light.prototype.copy.call( this, source );

	this.intensity = source.intensity;

	return this;

};
