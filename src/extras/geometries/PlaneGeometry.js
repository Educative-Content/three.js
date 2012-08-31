/**
 * @author mrdoob / http://mrdoob.com/
 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Plane.as
 */

//START_VEROLD_MOD
THREE.PlaneGeometry = function ( width, height, segmentsWidth, segmentsheight, uvMult ) {
//END_VEROLD_MOD

	THREE.Geometry.call( this );

	var ix, iz,
	width_half = width / 2,
	height_half = height / 2,
	gridX = segmentsWidth || 1,
	gridZ = segmentsheight || 1,
	gridX1 = gridX + 1,
	gridZ1 = gridZ + 1,
	segment_width = width / gridX,
	segment_height = height / gridZ,
	normal = new THREE.Vector3( 0, 0, 1 );

	//START_VEROLD_MOD
	uvMult = uvMult || 1.0;
	//END_VEROLD_MOD

	for ( iz = 0; iz < gridZ1; iz ++ ) {

		for ( ix = 0; ix < gridX1; ix ++ ) {

			var x = ix * segment_width - width_half;
			var y = iz * segment_height - height_half;

			this.vertices.push( new THREE.Vector3( x, - y, 0 ) );

		}

	}

	for ( iz = 0; iz < gridZ; iz ++ ) {

		for ( ix = 0; ix < gridX; ix ++ ) {

			var a = ix + gridX1 * iz;
			var b = ix + gridX1 * ( iz + 1 );
			var c = ( ix + 1 ) + gridX1 * ( iz + 1 );
			var d = ( ix + 1 ) + gridX1 * iz;

			var face = new THREE.Face4( a, b, c, d );
			face.normal.copy( normal );
			face.vertexNormals.push( normal.clone(), normal.clone(), normal.clone(), normal.clone() );
			this.faces.push( face );

			//START_VEROLD_MOD
			this.faceVertexUvs[ 0 ].push( [
				new THREE.UV( ix / gridX * uvMult, 1 - iz  * uvMult / gridZ ),
				new THREE.UV( ix / gridX * uvMult, 1 - ( iz + 1 )  * uvMult / gridZ ),
				new THREE.UV( ( ix + 1 )  * uvMult / gridX, 1 - ( iz + 1 ) * uvMult/ gridZ ),
				new THREE.UV( ( ix + 1 )  * uvMult / gridX, 1 - iz  * uvMult / gridZ )
			] );
			//END_VEROLD_MOD

		}

	}

	this.computeCentroids();

};

THREE.PlaneGeometry.prototype = Object.create( THREE.Geometry.prototype );
