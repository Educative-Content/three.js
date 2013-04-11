/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.TransformControls = function ( camera, domElement ) {

	this.camera = camera;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	this.active = false;

	this.snapDist = null;
  this.modifierAxis = new THREE.Vector3( 1, 1, 1 );
	
	var scope = this;

	var ray = new THREE.Raycaster();
	var projector = new THREE.Projector();
	var offset = new THREE.Vector3();
	var objPos = new THREE.Vector3();
	var camPos = new THREE.Vector3();

	// gizmo object

	var loader = new THREE.SceneLoader2();
	this.gizmo = new THREE.Object3D();

	this.axes = loader.parse( axesGeometry );
	this.gizmo.add(this.axes);

	// axis colors

	for (i in this.axes.children) {
		
		var r = ( this.axes.children[i].name.search("X") != -1 ) ? 1 : 0;
		var g = ( this.axes.children[i].name.search("Y") != -1 ) ? 1 : 0;
		var b = ( this.axes.children[i].name.search("Z") != -1 ) ? 1 : 0;

		this.axes.children[i].material = new THREE.MeshBasicMaterial( { transparent: true, depthTest: false } );

		if ( this.axes.children[i].name.length > 2 ) { this.axes.children[i].material.opacity = 0.2 };

		this.axes.children[i].material.color.setRGB(r,g,b);
		this.axes.children[i].material.side = THREE.DoubleSide;

	}

	// intersection planes

	var intersectionPlane;
	var intersectionPlaneXYZ = new THREE.Mesh( new THREE.PlaneGeometry( 5000, 5000 ), new THREE.MeshBasicMaterial( { wireframe: true } ) );
	intersectionPlaneXYZ.material.side = 2;
	intersectionPlaneXYZ.visible = false;
	var intersectionPlaneXY = intersectionPlaneXYZ.clone();
	var intersectionPlaneYZ = intersectionPlaneXYZ.clone();
	var intersectionPlaneXZ = intersectionPlaneXYZ.clone();
	intersectionPlaneYZ.rotation.set( 0, Math.PI/2, 0 );
	intersectionPlaneXZ.rotation.set( -Math.PI/2, 0, 0 );

	this.gizmo.add(intersectionPlaneXYZ);
	this.gizmo.add(intersectionPlaneXY);
	this.gizmo.add(intersectionPlaneYZ);
	this.gizmo.add(intersectionPlaneXZ);


  this.attatch = function ( object ) {

  	this.object = object;
	 	this.updateGizmo();
	 	
	 	for (i in this.axes.children) {

	 		if ( this.axes.children[i].name.search("T") != -1 ) {
	 		
	 			this.axes.children[i].visible = true;
	 		
	 		}

	 	}
		
		this.domElement.addEventListener( 'mousedown', onMouseDown, false );
  
  }

  this.detatch = function ( object ) {

  	for (i in this.axes.children) {

	 		this.axes.children[i].visible = false;
	 		
	 	}

		this.domElement.removeEventListener( 'mousedown', onMouseDown, false );
  
  }

  this.updateGizmo = function() {


		objPos = new THREE.Vector3(
			this.object.matrixWorld.elements[12],
			this.object.matrixWorld.elements[13],
			this.object.matrixWorld.elements[14]);

		camPos = new THREE.Vector3(
			this.camera.matrixWorld.elements[12],
			this.camera.matrixWorld.elements[13],
			this.camera.matrixWorld.elements[14]);


		var lookAtMat = new THREE.Matrix4().lookAt(camPos, objPos, new THREE.Vector3( 0, 1, 0 ).applyEuler(scope.camera.rotation) );
		var rotation = new THREE.Vector3().setEulerFromRotationMatrix(lookAtMat);
		var distance = objPos.distanceTo(camPos);

		//scope.gizmo.rotation = scope.object.rotation;
		this.gizmo.position = this.object.position;
		this.gizmo.updateMatrix();
		this.axes.scale.set(distance/8,distance/8,distance/8);
		this.axes.updateMatrix();

		intersectionPlaneXYZ.rotation = rotation;
		intersectionPlaneXYZ.updateMatrix();
 
  }

  this.setIntersectionPlane = function () {

  	if ( this.active.search("X") != -1 || this.active.search("Y") != -1 ) {

  		intersectionPlane = intersectionPlaneXY;

  	} 

  	if ( this.active.search("Z") != -1 ) {

  		intersectionPlane = intersectionPlaneYZ;

  	}

  	if ( this.active.search("XZ") != -1 ) {

  		intersectionPlane = intersectionPlaneXZ;

  	} 

  	if ( this.active.search("XYZ") != -1 ) {

  		intersectionPlane = intersectionPlaneXYZ;

  	}

  }

  function onMouseDown( event ) {

		event.preventDefault();

		scope.domElement.focus();

		scope.updateGizmo();

		if ( event.button === 0 ) {

			scope.updateGizmo();

			var vector = new THREE.Vector3(
				( event.layerX / scope.domElement.offsetWidth ) * 2 - 1,
				- ( event.layerY / scope.domElement.offsetHeight ) * 2 + 1,
				0.5
			);

			projector.unprojectVector( vector, scope.camera );

			ray.set( scope.camera.position, vector.sub( scope.camera.position ).normalize() );

			var intersects = ray.intersectObjects( scope.axes.children, true );

			if ( intersects.length > 0 ) {

				scope.active = intersects[ 0 ].object.name;

				scope.setIntersectionPlane();

				var planeIntersect = ray.intersectObject( intersectionPlane );

			  offset.copy( planeIntersect[ 0 ].point ).sub( objPos );

			} else {

		 		scope.active = false;

			}

		}

		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'mouseup', onMouseUp, false );

	};

	function onMouseMove( event ) {

		scope.updateGizmo();

		if ( scope.active ) {

			var vector = new THREE.Vector3(
				( event.layerX / scope.domElement.offsetWidth ) * 2 - 1,
				- ( event.layerY / scope.domElement.offsetHeight ) * 2 + 1,
				0.5
			);

			projector.unprojectVector( vector, scope.camera );

			ray.set( scope.camera.position, vector.sub( scope.camera.position ).normalize() );

			var intersects = ray.intersectObject( intersectionPlane );

			if ( intersects.length > 0 ) {

				var point = intersects[ 0 ].point.sub( offset );

				if (scope.snapDist) {
					point.x = Math.round( point.x / scope.snapDist ) * scope.snapDist;
	        point.y = Math.round( point.y / scope.snapDist ) * scope.snapDist;
	        point.z = Math.round( point.z / scope.snapDist ) * scope.snapDist;
				}

				if ( scope.active.search("T") != -1 ){

					if ( scope.active.search("X") != -1 && scope.modifierAxis.x === 1 ) scope.object.position.x = point.x;
					if ( scope.active.search("Y") != -1 && scope.modifierAxis.y === 1 ) scope.object.position.y = point.y;
					if ( scope.active.search("Z") != -1 && scope.modifierAxis.z === 1 ) scope.object.position.z = point.z;

				}

				

			}

		}

	}

	function onMouseUp( event ) {

		scope.active = false;

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );

	}

};

THREE.TransformControls.prototype = Object.create( THREE.EventDispatcher.prototype );


var axesGeometry = {
	"metadata": {
		"version": 4,
		"type": "scene",
		"generator": "SceneExporter"
	},
	"geometries": [
		{
			"type": "Geometry",
			"data": {
				"vertices": [0,0,0,0.959999,0,0,0.01421,0.010657,0,0.720001,0.010657,0,0.720001,0.072679,0,0.01421,0,0.010658,0.719998,0,0.010658,0.720003,0,0.072679],
				"normals": [0,0,1,0,1,0],
				"uvs": [[]],
				"faces": [16,0,1,2,0,16,2,1,3,0,16,1,4,3,0,16,0,5,1,1,16,5,6,1,1,16,6,7,1,1]
			}
		},
		{
			"type": "Geometry",
			"data": {
				"vertices": [0,0,0,0,0.96,0,0,0.01421,0.010657,0,0.72,0.010657,0,0.72,0.072679,0.010657,0.01421,0,0.010657,0.72,0,0.072679,0.72,0],
				"normals": [1,0,0,0,0,1],
				"uvs": [[]],
				"faces": [16,0,1,2,0,16,2,1,3,0,16,1,4,3,0,16,0,5,1,1,16,5,6,1,1,16,6,7,1,1]
			}
		},
		{
			"type": "Geometry",
			"data": {
				"vertices": [0,0,0,0,0,0.959999,0.010658,0,0.01421,0.010658,0,0.719998,0.072679,0,0.720003,0,0.010657,0.01421,0,0.010657,0.720001,0,0.072679,0.720001],
				"normals": [0,1,0,1,0,0],
				"uvs": [[]],
				"faces": [16,0,1,2,0,16,2,1,3,0,16,1,4,3,0,16,0,5,1,1,16,5,6,1,1,16,6,7,1,1]
			}
		},
		{
			"type": "Geometry",
			"data": {
				"vertices": [0.004,0.096131,0.969091,0.004,0.189987,0.955135,-0.004,0.09613,0.969091,-0.004,0.189988,0.955135,0.004,0.282691,0.931913,-0.004,0.282693,0.931913,0.004,0.372676,0.899717,-0.004,0.372677,0.899717,0.004,0.459068,0.858856,-0.004,0.459069,0.858856,0.004,0.541038,0.809724,-0.004,0.541039,0.809724,0.004,0.617801,0.752794,-0.004,0.617802,0.752794,0.004,0.688617,0.688614,-0.004,0.688611,0.688614,0.004,0.752796,0.617802,-0.004,0.752789,0.617802,0.004,0.809726,0.54104,-0.004,0.80972,0.54104,0.004,0.858859,0.459068,-0.004,0.858853,0.459068,0.004,0.899722,0.372675,-0.004,0.899716,0.372675,0.004,0.931919,0.282693,-0.004,0.931912,0.282693,0.004,0.955135,0.189988,-0.004,0.955128,0.189988,0.004,0.969097,0.096131,-0.004,0.96909,0.096131,0.004,0.094097,0.955377,-0.004,0.094096,0.955377,0.004,0.187286,0.941554,-0.004,0.187287,0.941554,0.004,0.278673,0.918663,-0.004,0.278674,0.918663,0.004,0.367374,0.886924,-0.004,0.367375,0.886924,0.004,0.452541,0.846644,-0.004,0.452542,0.846644,0.004,0.533347,0.798211,-0.004,0.533349,0.798211,0.004,0.609016,0.74209,-0.004,0.609017,0.74209,0.004,0.678829,0.678822,-0.004,0.678822,0.678822,0.004,0.742092,0.609018,-0.004,0.742085,0.609018,0.004,0.798213,0.533347,-0.004,0.798207,0.533347,0.004,0.846645,0.452541,-0.004,0.846638,0.452541,0.004,0.886928,0.367376,-0.004,0.886922,0.367376,0.004,0.918666,0.278673,-0.004,0.91866,0.278673,0.004,0.941554,0.187287,-0.004,0.941548,0.187287,0.004,0.955379,0.094096,-0.004,0.955372,0.094096],
				"normals": [-0.00001838484680436632,0.14707877443532588,0.989124781699761,0.000018384463520000633,0.147075708159858,0.9891252376374227,0.000030373577026558763,0.24298861621229004,0.9700291394946249,0.00006074653738435724,0.24298614953718595,0.9700297559574915,0.00008421980126469236,0.3368792050571544,0.9415478713836511,0.000042110315604316324,0.3368825248435441,0.9415466864058099,0.00005344505686875583,0.4275604549613045,0.9039867557087926,0.00005344505687169989,0.4275604549613043,0.9039867557087927,0.00006426387517436846,0.5141110013799138,0.8577236583715623,0.00006426387517433718,0.5141110013799138,0.8577236583715623,0.00007446129827705246,0.5956903862006993,0.8032141422084007,0.00007446129826896178,0.5956903862006997,0.8032141422084003,0.00008394208214794306,0.6715366572349795,0.7409713293666608,-0.0005036797655173637,0.6715730206829333,0.7409382053838863,-0.0005557181618281136,0.74095754909556,0.6715516373411843,-0.0006483423751447332,0.7409627144533205,0.6715458550554323,-0.000702808953921665,0.8032102330564632,0.5956952472304577,-0.0006024039593670096,0.8032052791626406,0.5957020367891438,-0.000643293299887306,0.857724399856994,0.5141093658587538,-0.0006432932998993408,0.8577243998569943,0.5141093658587529,-0.0006779852800781151,0.903980373428405,0.4275734145058616,-0.0006779852800782544,0.903980373428405,0.4275734145058616,-0.0007061555687635516,0.9415407583411156,0.3368983551855809,-0.0008238509935736331,0.9415439926434391,0.33688904877806874,-0.0008487886790635863,0.9700442046311909,0.24292698618971603,-0.000848788679049775,0.9700442046311907,0.24292698618971714,-0.0008654760088738689,0.9891154387158577,0.14713904935541128,-0.0008654760088738094,0.9891154387158577,0.14713904935541128,0.000018340942745085597,-0.14672754196053803,-0.9891769447848188,-0.000018340557598651534,-0.14672446078857224,-0.9891774018192727,-0.00003037220806679617,-0.24297766453412636,-0.9700318827827623,-0.000030372208065666384,-0.24297766453412645,-0.9700318827827623,-0.000042112731020430115,-0.33690184817245494,-0.9415397723540425,-0.00004211273102245834,-0.3369018481724547,-0.9415397723540425,-0.000053443312033151884,-0.4275464962529207,-0.9039933576557208,-0.000053443312029815346,-0.4275464962529209,-0.9039933576557205,-0.00006426259640859343,-0.5141007712825024,-0.8577297901070331,-0.00012852402186958682,-0.5140960874886897,-0.8577325902111901,-0.00014892661317814228,-0.5957064527285075,-0.8032022161314561,-0.00007446394207096052,-0.5957115365496464,-0.8031984559726074,-0.00008393990503468872,-0.6715192402581998,-0.7409871138671322,0.0005876162065399556,-0.6715613789044661,-0.7409486953029378,0.0006483490033597588,-0.7409702895562069,-0.671537496822449,0.0006483490033604897,-0.740970289556207,-0.671537496822449,0.0007028083650498973,-0.803209560059407,-0.5956961546707985,0.0006024034004825604,-0.8032045339838482,-0.5957030415382587,0.0006433007212684957,-0.8577342950317388,-0.5140928566811525,0.0007505215476057541,-0.857738911551835,-0.5140850088528938,0.0007909797766208406,-0.9039768875693552,-0.42758059017150685,0.0006779796448973104,-0.9039728598539554,-0.4275892994347057,0.0007061589861683532,-0.941545314881485,-0.33688562059579175,0.0007061589861549602,-0.9415453148814845,-0.3368856205957928,0.0007275288787482944,-0.9700385050057304,-0.2429501379048342,0.0007275288787485345,-0.9700385050057304,-0.2429501379048342,0.0007418805363350658,-0.9891740484549167,-0.1467451923457115,0.0008655285545034612,-0.9891754908640142,-0.1467347918329461,1,0,0,-1,0,0,0.00012364742884149511,-0.9891794307309717,0.14671073079384497,0.00012364742884150447,-0.9891794307309717,0.14671073079384497,-0.00012839699979181482,0.14673942833393777,-0.9891751734078448,-0.00012839699979180246,0.14673942833393777,-0.9891751734078448],
				"uvs": [[]],
				"faces": [16,0,1,2,0,16,2,1,3,1,16,1,4,3,2,16,3,4,5,3,16,4,6,5,4,16,5,6,7,5,16,6,8,7,6,16,7,8,9,7,16,8,10,9,8,16,9,10,11,9,16,10,12,11,10,16,11,12,13,11,16,12,14,13,12,16,13,14,15,13,16,14,16,15,14,16,15,16,17,15,16,16,18,17,16,16,17,18,19,17,16,18,20,19,18,16,19,20,21,19,16,20,22,21,20,16,21,22,23,21,16,22,24,23,22,16,23,24,25,23,16,24,26,25,24,16,25,26,27,25,16,26,28,27,26,16,27,28,29,27,16,30,31,32,28,16,32,31,33,29,16,32,33,34,30,16,34,33,35,31,16,34,35,36,32,16,36,35,37,33,16,36,37,38,34,16,38,37,39,35,16,38,39,40,36,16,40,39,41,37,16,40,41,42,38,16,42,41,43,39,16,42,43,44,40,16,44,43,45,41,16,44,45,46,42,16,46,45,47,43,16,46,47,48,44,16,48,47,49,45,16,48,49,50,46,16,50,49,51,47,16,50,51,52,48,16,52,51,53,49,16,52,53,54,50,16,54,53,55,51,16,54,55,56,52,16,56,55,57,53,16,56,57,58,54,16,58,57,59,55,16,30,32,0,56,16,0,32,1,56,16,31,2,33,57,16,33,2,3,57,16,31,30,2,58,16,2,30,0,59,16,32,34,1,56,16,1,34,4,56,16,35,33,5,57,16,5,33,3,57,16,34,36,4,56,16,4,36,6,56,16,37,35,7,57,16,7,35,5,57,16,36,38,6,56,16,6,38,8,56,16,39,37,9,57,16,9,37,7,57,16,38,40,8,56,16,8,40,10,56,16,41,39,11,57,16,11,39,9,57,16,40,42,10,56,16,10,42,12,56,16,43,41,13,57,16,13,41,11,57,16,42,44,12,56,16,12,44,14,56,16,45,43,15,57,16,15,43,13,57,16,44,46,14,56,16,14,46,16,56,16,47,45,17,57,16,17,45,15,57,16,46,48,16,56,16,16,48,18,56,16,49,47,19,57,16,19,47,17,57,16,48,50,18,56,16,18,50,20,56,16,51,49,21,57,16,21,49,19,57,16,50,52,20,56,16,20,52,22,56,16,53,51,23,57,16,23,51,21,57,16,52,54,22,56,16,22,54,24,56,16,55,53,25,57,16,25,53,23,57,16,54,56,24,56,16,24,56,26,56,16,57,55,27,57,16,27,55,25,57,16,58,28,56,56,16,56,28,26,56,16,58,59,28,60,16,28,59,29,61,16,59,57,29,57,16,29,57,27,57]
			}
		},
		{
			"type": "Geometry",
			"data": {
				"vertices": [0.096131,-0.004,0.969091,0.189988,-0.004,0.955135,0.096131,0.004,0.969091,0.189988,0.004,0.955135,0.282693,-0.004,0.931913,0.282693,0.004,0.931913,0.372675,-0.004,0.899717,0.372675,0.004,0.899717,0.459068,-0.004,0.858856,0.459068,0.004,0.858856,0.54104,-0.004,0.809724,0.54104,0.004,0.809724,0.617802,-0.004,0.752794,0.617802,0.004,0.752794,0.688614,-0.004,0.688614,0.688614,0.004,0.688614,0.752794,-0.004,0.617802,0.752794,0.004,0.617802,0.809724,-0.004,0.54104,0.809724,0.004,0.54104,0.858856,-0.004,0.459068,0.858856,0.004,0.459068,0.899717,-0.004,0.372675,0.899717,0.004,0.372675,0.931913,-0.004,0.282693,0.931913,0.004,0.282693,0.955135,-0.004,0.189988,0.955135,0.004,0.189988,0.969091,-0.004,0.096131,0.969091,0.004,0.096131,0.094096,-0.004,0.955377,0.094096,0.004,0.955377,0.187287,-0.004,0.941554,0.187287,0.004,0.941554,0.278673,-0.004,0.918663,0.278673,0.004,0.918663,0.367376,-0.004,0.886924,0.367376,0.004,0.886924,0.452541,-0.004,0.846644,0.452541,0.004,0.846644,0.533347,-0.004,0.798211,0.533347,0.004,0.798211,0.609017,-0.004,0.74209,0.609017,0.004,0.74209,0.678822,-0.004,0.678822,0.678822,0.004,0.678822,0.74209,-0.004,0.609018,0.74209,0.004,0.609018,0.798211,-0.004,0.533347,0.798211,0.004,0.533347,0.846644,-0.004,0.452541,0.846644,0.004,0.452541,0.886924,-0.004,0.367376,0.886924,0.004,0.367376,0.918663,-0.004,0.278673,0.918663,0.004,0.278673,0.941554,-0.004,0.187287,0.941554,0.004,0.187287,0.955377,-0.004,0.094096,0.955377,0.004,0.094096],
				"normals": [0.14707724130664285,0,0.9891250098393162,0.24298614998551263,0,0.9700297577472652,0.3368891631065564,0,0.9415443121708952,0.4275564112614398,0,0.9039886698345496,0.5141017741704236,0,0.857729191408817,0.595695394349495,0,0.8032104314255385,0.6715574857547859,0,0.7409524568598922,0.7409524568598922,0,0.6715574857547859,0.8032104314255385,0,0.595695394349495,0.857729191408817,0,0.5141017741704236,0.9039886698345496,0,0.4275564112614398,0.9415443121708952,0,0.3368891631065564,0.9700297577472652,0,0.24298614998551263,0.9891250098393162,0,0.14707724130664285,-0.14672446081324952,0,-0.9891774019856405,-0.24298016647899742,0,-0.9700312565571475,-0.336895114456045,0,-0.9415421827277037,-0.4275547018879709,0,-0.903989478309061,-0.5141007723440386,0,-0.8577297918781084,-0.595701380530832,0,-0.8032059917814737,-0.6715614948471527,0,-0.7409488232250981,-0.7409440360602931,0,-0.6715667765953607,-0.8032097584279839,0,-0.5956963017898126,-0.8577297918781084,0,-0.5141007723440386,-0.903989478309061,0,-0.4275547018879709,-0.9415421827277037,0,-0.336895114456045,-0.9700312565571475,0,-0.24298016647899742,-0.9891774019856405,0,-0.14672446081324952,0,-1,0,0,1,0,-0.9891689682668569,0,0.14678130745391924,0.14678130745391924,0,-0.9891689682668569],
				"uvs": [[]],
				"faces": [16,0,1,2,0,16,2,1,3,0,16,1,4,3,1,16,3,4,5,1,16,4,6,5,2,16,5,6,7,2,16,6,8,7,3,16,7,8,9,3,16,8,10,9,4,16,9,10,11,4,16,10,12,11,5,16,11,12,13,5,16,12,14,13,6,16,13,14,15,6,16,14,16,15,7,16,15,16,17,7,16,16,18,17,8,16,17,18,19,8,16,18,20,19,9,16,19,20,21,9,16,20,22,21,10,16,21,22,23,10,16,22,24,23,11,16,23,24,25,11,16,24,26,25,12,16,25,26,27,12,16,26,28,27,13,16,27,28,29,13,16,30,31,32,14,16,32,31,33,14,16,32,33,34,15,16,34,33,35,15,16,34,35,36,16,16,36,35,37,16,16,36,37,38,17,16,38,37,39,17,16,38,39,40,18,16,40,39,41,18,16,40,41,42,19,16,42,41,43,19,16,42,43,44,20,16,44,43,45,20,16,44,45,46,21,16,46,45,47,21,16,46,47,48,22,16,48,47,49,22,16,48,49,50,23,16,50,49,51,23,16,50,51,52,24,16,52,51,53,24,16,52,53,54,25,16,54,53,55,25,16,54,55,56,26,16,56,55,57,26,16,56,57,58,27,16,58,57,59,27,16,30,32,0,28,16,0,32,1,28,16,31,2,33,29,16,33,2,3,29,16,31,30,2,30,16,2,30,0,30,16,32,34,1,28,16,1,34,4,28,16,35,33,5,29,16,5,33,3,29,16,34,36,4,28,16,4,36,6,28,16,37,35,7,29,16,7,35,5,29,16,36,38,6,28,16,6,38,8,28,16,39,37,9,29,16,9,37,7,29,16,38,40,8,28,16,8,40,10,28,16,41,39,11,29,16,11,39,9,29,16,40,42,10,28,16,10,42,12,28,16,43,41,13,29,16,13,41,11,29,16,42,44,12,28,16,12,44,14,28,16,45,43,15,29,16,15,43,13,29,16,44,46,14,28,16,14,46,16,28,16,47,45,17,29,16,17,45,15,29,16,46,48,16,28,16,16,48,18,28,16,49,47,19,29,16,19,47,17,29,16,48,50,18,28,16,18,50,20,28,16,51,49,21,29,16,21,49,19,29,16,50,52,20,28,16,20,52,22,28,16,53,51,23,29,16,23,51,21,29,16,52,54,22,28,16,22,54,24,28,16,55,53,25,29,16,25,53,23,29,16,54,56,24,28,16,24,56,26,28,16,57,55,27,29,16,27,55,25,29,16,58,28,56,28,16,56,28,26,28,16,58,59,28,31,16,28,59,29,31,16,59,57,29,29,16,29,57,27,29]
			}
		},
		{
			"type": "Geometry",
			"data": {
				"vertices": [0.969094,0.096131,-0.004,0.955132,0.189987,-0.004,0.969094,0.09613,0.004,0.955132,0.189988,0.004,0.931916,0.282691,-0.004,0.931916,0.282693,0.004,0.899721,0.372676,-0.004,0.899721,0.372677,0.004,0.858856,0.459068,-0.004,0.858856,0.459069,0.004,0.809725,0.541038,-0.004,0.809725,0.541039,0.004,0.752789,0.617801,-0.004,0.752789,0.617802,0.004,0.688614,0.688617,-0.004,0.688614,0.688611,0.004,0.617803,0.752796,-0.004,0.617803,0.752789,0.004,0.54104,0.809726,-0.004,0.54104,0.80972,0.004,0.459068,0.858859,-0.004,0.459068,0.858853,0.004,0.372679,0.899722,-0.004,0.372679,0.899716,0.004,0.282692,0.931919,-0.004,0.282692,0.931912,0.004,0.189988,0.955135,-0.004,0.189988,0.955128,0.004,0.09613,0.969097,-0.004,0.09613,0.96909,0.004,0.955379,0.094097,-0.004,0.955379,0.094096,0.004,0.941551,0.187286,-0.004,0.941551,0.187287,0.004,0.918665,0.278673,-0.004,0.918665,0.278674,0.004,0.886922,0.367374,-0.004,0.886922,0.367375,0.004,0.846645,0.452541,-0.004,0.846645,0.452542,0.004,0.798209,0.533347,-0.004,0.798209,0.533349,0.004,0.742089,0.609016,-0.004,0.742089,0.609017,0.004,0.678822,0.678829,-0.004,0.678822,0.678822,0.004,0.609018,0.742092,-0.004,0.609018,0.742085,0.004,0.533349,0.798213,-0.004,0.533349,0.798207,0.004,0.45254,0.846645,-0.004,0.45254,0.846638,0.004,0.367374,0.886928,-0.004,0.367374,0.886922,0.004,0.278673,0.918666,-0.004,0.278673,0.91866,0.004,0.187287,0.941554,-0.004,0.187287,0.941548,0.004,0.094096,0.955379,-0.004,0.094096,0.955372,0.004],
				"normals": [0.9891155808345032,0.14714063820758785,0.00001839257977586755,0.9891160371515509,0.1471375706994607,-0.000018392196337450986,0.9700439361003041,0.24292953939964473,-0.000030366192425009392,0.9700445522728497,0.2429270732491935,-0.000060731768312359106,0.9415511902095702,0.33686992908592645,-0.0000842174822718959,0.941550005292808,0.3368732488042534,-0.00004210915609940503,0.9039705779731592,0.4275946577098944,-0.000053449332212308684,0.9039705779731592,0.4275946577098942,-0.00005344933221527374,0.8577282725653741,0.5141033031524864,-0.00006426291289537805,0.8577282725653741,0.5141033031524864,-0.00006426291289590872,0.8031841035090648,0.5957308875029909,-0.00007446636093980756,0.8031841035090643,0.5957308875029913,-0.00007446636093174783,0.7409973619412071,0.6715079318597075,-0.00008393849147549262,0.7409642396283311,0.6715442963203578,0.0005036582222454318,0.671556844027747,0.7409528300915996,0.0005557146225740405,0.6715510617708152,0.7409579954977269,0.0006483382460585887,0.5956902407329363,0.8032139460632789,0.0007028122028031592,0.5956970302973328,0.8032089922311958,0.000602406744168426,0.5141093658587538,0.857724399856994,0.000643293299887306,0.5141093658587529,0.8577243998569943,0.0006432932998993408,0.4275895925110848,0.9039727212255614,0.0006779795409261082,0.4275895925110848,0.9039727212255614,0.0006779795409261217,0.33688176039699647,0.941546696053809,0.0007061600220479143,0.336872454330526,0.9415499300484855,0.0008238561888030486,0.24292945200339414,0.9700435871176234,0.0008487881387386844,0.24292945200339522,0.9700435871176231,0.0008487881387254036,0.14713751561770666,0.9891156668705544,0.0008654762085091916,0.14713751561770666,0.9891156668705544,0.000865476208509169,-0.9891692403916504,-0.1467794724284593,-0.000018347434053575762,-0.9891696977461109,-0.14677639021400318,0.000018347048776804,-0.9700443906979517,-0.24292772413487032,0.00003036596551688916,-0.9700443906979517,-0.24292772413487038,0.000030365965516361193,-0.941526303511913,-0.3369394871802869,0.00004211743589640899,-0.941526303511913,-0.3369394871802867,0.000042117435898416114,-0.9040056647758042,-0.42752047342486,0.00005344005917964421,-0.904005664775804,-0.4275204734248602,0.000053440059176323763,-0.8577157480840049,-0.5141241983787948,0.0000642655247956299,-0.85771854839752,-0.5141195145245131,0.00012852987862735986,-0.8032072949697218,-0.5956996047747525,0.00014892490118970355,-0.803203534873546,-0.5957046886015662,0.00007446308607688043,-0.7409923952139545,-0.671513412516311,0.00008393917656695261,-0.7409539770427105,-0.6715555514012052,-0.0005876111074740643,-0.671537496822449,-0.7409702895562069,-0.0006483490033597588,-0.671537496822449,-0.740970289556207,-0.0006483490033604897,-0.5957063122158719,-0.8032020266756262,-0.0007028017733390892,-0.5957131990715747,-0.8031970004730226,-0.000602397750350655,-0.51407881512382,-0.8577427108387167,-0.000643307033123729,-0.5140709673559175,-0.8577473271471643,-0.0007505289112509807,-0.4275764874870437,-0.9039788281240599,-0.0007909814746062072,-0.427585196704069,-0.9039748004790676,-0.0006779811003666883,-0.33689235446976984,-0.941542905470512,-0.0007061571791101234,-0.3368923544697709,-0.9415429054705116,-0.0007061571790967939,-0.2429501379048342,-0.9700385050057304,-0.0007275288787482944,-0.2429501379048342,-0.9700385050057304,-0.0007275288787485345,-0.1467451923457115,-0.9891740484549167,-0.0007418805363350658,-0.1467347918329461,-0.9891754908640142,-0.0008655285545034612,0,0,-1,0,0,1,0.14670026391369173,-0.9891809830758568,-0.00012364762288460577,0.14670026391369173,-0.9891809830758568,-0.00012364762288460937,-0.9891856375334571,0.14666887204716755,0.0001283352630408911,-0.9891856375334571,0.14666887204716755,0.00012833526304088642],
				"uvs": [[]],
				"faces": [16,0,1,2,0,16,2,1,3,1,16,1,4,3,2,16,3,4,5,3,16,4,6,5,4,16,5,6,7,5,16,6,8,7,6,16,7,8,9,7,16,8,10,9,8,16,9,10,11,9,16,10,12,11,10,16,11,12,13,11,16,12,14,13,12,16,13,14,15,13,16,14,16,15,14,16,15,16,17,15,16,16,18,17,16,16,17,18,19,17,16,18,20,19,18,16,19,20,21,19,16,20,22,21,20,16,21,22,23,21,16,22,24,23,22,16,23,24,25,23,16,24,26,25,24,16,25,26,27,25,16,26,28,27,26,16,27,28,29,27,16,30,31,32,28,16,32,31,33,29,16,32,33,34,30,16,34,33,35,31,16,34,35,36,32,16,36,35,37,33,16,36,37,38,34,16,38,37,39,35,16,38,39,40,36,16,40,39,41,37,16,40,41,42,38,16,42,41,43,39,16,42,43,44,40,16,44,43,45,41,16,44,45,46,42,16,46,45,47,43,16,46,47,48,44,16,48,47,49,45,16,48,49,50,46,16,50,49,51,47,16,50,51,52,48,16,52,51,53,49,16,52,53,54,50,16,54,53,55,51,16,54,55,56,52,16,56,55,57,53,16,56,57,58,54,16,58,57,59,55,16,30,32,0,56,16,0,32,1,56,16,31,2,33,57,16,33,2,3,57,16,31,30,2,58,16,2,30,0,59,16,32,34,1,56,16,1,34,4,56,16,35,33,5,57,16,5,33,3,57,16,34,36,4,56,16,4,36,6,56,16,37,35,7,57,16,7,35,5,57,16,36,38,6,56,16,6,38,8,56,16,39,37,9,57,16,9,37,7,57,16,38,40,8,56,16,8,40,10,56,16,41,39,11,57,16,11,39,9,57,16,40,42,10,56,16,10,42,12,56,16,43,41,13,57,16,13,41,11,57,16,42,44,12,56,16,12,44,14,56,16,45,43,15,57,16,15,43,13,57,16,44,46,14,56,16,14,46,16,56,16,47,45,17,57,16,17,45,15,57,16,46,48,16,56,16,16,48,18,56,16,49,47,19,57,16,19,47,17,57,16,48,50,18,56,16,18,50,20,56,16,51,49,21,57,16,21,49,19,57,16,50,52,20,56,16,20,52,22,56,16,53,51,23,57,16,23,51,21,57,16,52,54,22,56,16,22,54,24,56,16,55,53,25,57,16,25,53,23,57,16,54,56,24,56,16,24,56,26,56,16,57,55,27,57,16,27,55,25,57,16,58,28,56,56,16,56,28,26,56,16,58,59,28,60,16,28,59,29,61,16,59,57,29,57,16,29,57,27,57]
			}
		},
		{
			"type": "Geometry",
			"data": {
				"vertices": [0.96,-0.04,0.04,0.959998,-0.04,-0.04,1.040002,-0.04,0.04,1.04,-0.04,-0.04,1.040002,0.04,0.04,1.04,0.04,-0.04,0.96,0.04,0.04,0.959998,0.04,-0.04],
				"normals": [0,-1,0,0.9999999996875,0,-0.000024999999992906388,0,1,0,-0.9999999996875,0,0.000024999999991518613,0,0,-1,0,0,1],
				"uvs": [[]],
				"faces": [16,0,1,2,0,16,2,1,3,0,16,2,3,4,1,16,4,3,5,1,16,4,5,6,2,16,6,5,7,2,16,6,7,0,3,16,0,7,1,3,16,1,7,3,4,16,3,7,5,4,16,6,0,4,5,16,4,0,2,5]
			}
		},
		{
			"type": "Geometry",
			"data": {
				"vertices": [-0.04,0.96,0.04,0.04,0.96,0.04,-0.04,1.04,0.04,0.04,1.04,0.04,-0.04,1.04,-0.04,0.04,1.04,-0.04,-0.04,0.96,-0.04,0.04,0.96,-0.04],
				"normals": [0,0,1,0,1,0,0,0,-1,0,-1,0,1,0,0,-1,0,0],
				"uvs": [[]],
				"faces": [16,0,1,2,0,16,2,1,3,0,16,2,3,4,1,16,4,3,5,1,16,4,5,6,2,16,6,5,7,2,16,6,7,0,3,16,0,7,1,3,16,1,7,3,4,16,3,7,5,4,16,6,0,4,5,16,4,0,2,5]
			}
		},
		{
			"type": "Geometry",
			"data": {
				"vertices": [-0.04,-0.04,0.959998,0.04,-0.04,0.959998,-0.04,-0.04,1.04,0.04,-0.04,1.04,-0.04,0.04,1.040002,0.04,0.04,1.040002,-0.04,0.04,0.96,0.04,0.04,0.96],
				"normals": [0,-1,0,0,-0.000024999999992906388,0.9999999996875,0,1,0,0,0.000024999999991518613,-0.9999999996875,1,0,0,-1,0,0],
				"uvs": [[]],
				"faces": [16,0,1,2,0,16,2,1,3,0,16,2,3,4,1,16,4,3,5,1,16,4,5,6,2,16,6,5,7,2,16,6,7,0,3,16,0,7,1,3,16,1,7,3,4,16,3,7,5,4,16,6,0,4,5,16,4,0,2,5]
			}
		},
		{
			"type": "Geometry",
			"data": {
				"vertices": [0.1875,0.1875,0,0.010657,0.010657,0,0.1875,0.010657,0,0.010657,0.1875,0],
				"normals": [0,0,1],
				"uvs": [[]],
				"faces": [16,0,1,2,0,16,1,0,3,0]
			}
		},
		{
			"type": "Geometry",
			"data": {
				"vertices": [0,0.1875,0.1875,0,0.010657,0.010657,0,0.1875,0.010657,0,0.010657,0.1875],
				"normals": [1,0,0],
				"uvs": [[]],
				"faces": [16,0,1,2,0,16,1,0,3,0]
			}
		},
		{
			"type": "Geometry",
			"data": {
				"vertices": [0.1875,0,0.1875,0.010657,0,0.010658,0.010658,0,0.1875,0.1875,0,0.010658],
				"normals": [0,1,0],
				"uvs": [[]],
				"faces": [16,0,1,2,0,16,1,0,3,0]
			}
		},
		{
			"type": "Geometry",
			"data": {
				"vertices": [0.1,0,0,0,0,-0.1,0,0.1,0,-0.1,0,0,0,0,0.1,0,-0.1,0],
				"normals": [0.5773502691896257,0.5773502691896257,-0.5773502691896257,-0.5773502691896257,0.5773502691896257,-0.5773502691896257,-0.5773502691896257,0.5773502691896257,0.5773502691896257,0.5773502691896257,0.5773502691896257,0.5773502691896257,0.5773502691896257,-0.5773502691896257,-0.5773502691896257,-0.5773502691896257,-0.5773502691896257,-0.5773502691896257,-0.5773502691896257,-0.5773502691896257,0.5773502691896257,0.5773502691896257,-0.5773502691896257,0.5773502691896257],
				"uvs": [[]],
				"faces": [16,0,1,2,0,16,1,3,2,1,16,3,4,2,2,16,2,4,0,3,16,5,1,0,4,16,5,3,1,5,16,5,4,3,6,16,5,0,4,7]
			}
		}],
	"materials": [
		{
			"type": "MeshLambertMaterial",
			"color": 16777215,
			"ambient": 16777215,
			"emissive": 0,
			"opacity": 1,
			"transparent": false,
			"wireframe": false,
			"name": "initialShadingGroup"
		},
		{
			"type": "MeshLambertMaterial",
			"color": 16777215,
			"ambient": 16777215,
			"emissive": 0,
			"opacity": 1,
			"transparent": false,
			"wireframe": false,
			"name": "lambert4SG"
		},
		{
			"type": "MeshLambertMaterial",
			"color": 16777215,
			"ambient": 16777215,
			"emissive": 0,
			"opacity": 1,
			"transparent": false,
			"wireframe": false,
			"name": "initialShadingGroup"
		}],
	"scene": {
		"type": "Scene",
		"children": [
					{
						"name": "TX",
						"type": "Mesh",
						"position": [0,0,0],
						"rotation": [0,0,0],
						"scale": [1,1,1],
						"geometry": 0,
						"material": 0
					},
					{
						"name": "TY",
						"type": "Mesh",
						"position": [0,0,0],
						"rotation": [0,0,0],
						"scale": [1,1,1],
						"geometry": 1,
						"material": 0
					},
					{
						"name": "TZ",
						"type": "Mesh",
						"position": [0,0,0],
						"rotation": [0,0,0],
						"scale": [1,1,1],
						"geometry": 2,
						"material": 0
					},
					{
						"name": "RX",
						"type": "Mesh",
						"position": [0,0,0],
						"rotation": [0,0,0],
						"scale": [1,1,1],
						"geometry": 3,
						"material": 0
					},
					{
						"name": "RY",
						"type": "Mesh",
						"position": [0,0,0],
						"rotation": [0,0,0],
						"scale": [1,1,1],
						"geometry": 4,
						"material": 0
					},
					{
						"name": "RZ",
						"type": "Mesh",
						"position": [0,0,0],
						"rotation": [0,0,0],
						"scale": [1,1,1],
						"geometry": 5,
						"material": 0
					},
					{
						"name": "SX",
						"type": "Mesh",
						"position": [0,0,0],
						"rotation": [0,0,0],
						"scale": [1,1,1],
						"geometry": 6,
						"material": 0
					},
					{
						"name": "SY",
						"type": "Mesh",
						"position": [0,0,0],
						"rotation": [0,0,0],
						"scale": [1,1,1],
						"geometry": 7,
						"material": 0
					},
					{
						"name": "SZ",
						"type": "Mesh",
						"position": [0,0,0],
						"rotation": [0,0,0],
						"scale": [1,1,1],
						"geometry": 8,
						"material": 1
					},
					{
						"name": "TXY",
						"type": "Mesh",
						"position": [0,0,0],
						"rotation": [0,0,0],
						"scale": [1,1,1],
						"geometry": 9,
						"material": 2
					},
					{
						"name": "TYZ",
						"type": "Mesh",
						"position": [0,0,0],
						"rotation": [0,0,0],
						"scale": [1,1,1],
						"geometry": 10,
						"material": 2
					},
					{
						"name": "TXZ",
						"type": "Mesh",
						"position": [0,0,0],
						"rotation": [0,0,0],
						"scale": [1,1,1],
						"geometry": 11,
						"material": 2
					},
					{
						"name": "TXYZ",
						"type": "Mesh",
						"position": [0,0,0],
						"rotation": [0,0,0],
						"scale": [1,1,1],
						"geometry": 12,
						"material": 2
					}]
	}
}