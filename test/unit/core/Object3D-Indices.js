/**
 * @author MasterJames / https://github.com/MasterJames
 */

module( "Object3D-Indices" );
let prevOrder = QUnit.config.reorder;
QUnit.config.reorder = false;

let pMat = new THREE.MeshPhongMaterial( { color: 0x666666, specular: 0x884488, shininess: 10, shading: THREE.FlatShading } );
let aMat = new THREE.MeshPhongMaterial( { color: 0xdd0066, specular: 0x009966, shininess: 30, shading: THREE.FlatShading } );
let bMat = new THREE.MeshPhongMaterial( { color: 0x0066dd, specular: 0x996600, shininess: 30, shading: THREE.FlatShading } );
let cMat = new THREE.MeshPhongMaterial( { color: 0x66dd00, specular: 0x660099, shininess: 30, shading: THREE.FlatShading } );

let testWorld = {
	scn: new THREE.Scene(),
	pBox: new THREE.Mesh(new THREE.BoxGeometry(1, 2, 3), pMat),
	cBox0: new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), aMat),
	cBox1: new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1), aMat),
	cBox2: new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), bMat),
	cBox3: new THREE.Mesh(new THREE.BoxGeometry(2, 2, 1), cMat),
	cBox4: new THREE.Mesh(new THREE.BoxGeometry(2, 1, 2), aMat),
	cBox5: new THREE.Mesh(new THREE.BoxGeometry(1, 2, 2), bMat),
	cBox6: new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), cMat),
	cBox7: new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.45, 0.35), aMat),
	cBox8: new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.25, 0.35), bMat),
	cBox9: new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 0.25), cMat)
};

testWorld.pBox.name = "pBox";
testWorld.cBox0.name = "cBox0";
testWorld.cBox1.name = "cBox1";
testWorld.cBox2.name = "cBox2";
testWorld.cBox3.name = "cBox3";
testWorld.cBox4.name = "cBox4";
testWorld.cBox5.name = "cBox5";
testWorld.cBox6.name = "cBox6";
testWorld.cBox7.name = "cBox7";
testWorld.cBox8.name = "cBox8";
testWorld.cBox9.name = "cBox9";

test( "add", function() {
	let pBox = testWorld.pBox;
	testWorld.scn.add(pBox);
	pBox.add(testWorld.cBox0);
	pBox.add(testWorld.cBox1);
	pBox.add(testWorld.cBox2);
	pBox.add(testWorld.cBox3);
	pBox.add(testWorld.cBox4);

	ok( pBox.lookUp(0) === testWorld.cBox0, "cBox0 at index 0" );
	ok( pBox.lookUp(1) === testWorld.cBox1, "cBox1 at index 1" );
	ok( pBox.lookUp(2) === testWorld.cBox2, "cBox2 at index 2" );
	ok( pBox.lookUp(3) === testWorld.cBox3, "cBox3 at index 3" );
	ok( pBox.lookUp(4) === testWorld.cBox4, "cBox4 at index 4" );

	ok( pBox.lookUp(1) !== testWorld.cBox0, "cBox0 NOT at index 1" );
	ok( pBox.lookUp(2) !== testWorld.cBox0, "cBox0 NOT at index 2" );
	ok( pBox.lookUp(3) !== testWorld.cBox0, "cBox0 NOT at index 3" );
	ok( pBox.lookUp(4) !== testWorld.cBox0, "cBox0 NOT at index 4" );

	ok( pBox.lookUp(0) !== testWorld.cBox1, "cBox1 NOT at index 0" );
	ok( pBox.lookUp(2) !== testWorld.cBox1, "cBox1 NOT at index 2" );
	ok( pBox.lookUp(3) !== testWorld.cBox1, "cBox1 NOT at index 3" );
	ok( pBox.lookUp(4) !== testWorld.cBox1, "cBox1 NOT at index 4" );

	ok( pBox.lookUp(0) !== testWorld.cBox2, "cBox2 NOT at index 0" );
	ok( pBox.lookUp(1) !== testWorld.cBox2, "cBox2 NOT at index 1" );
	ok( pBox.lookUp(3) !== testWorld.cBox2, "cBox2 NOT at index 3" );
	ok( pBox.lookUp(4) !== testWorld.cBox2, "cBox2 NOT at index 4" );

	ok( pBox.lookUp(0) !== testWorld.cBox3, "cBox3 NOT at index 0" );
	ok( pBox.lookUp(1) !== testWorld.cBox3, "cBox3 NOT at index 1" );
	ok( pBox.lookUp(2) !== testWorld.cBox3, "cBox3 NOT at index 2" );
	ok( pBox.lookUp(4) !== testWorld.cBox3, "cBox3 NOT at index 4" );

	ok( pBox.lookUp(0) !== testWorld.cBox4, "cBox4 NOT at index 0" );
	ok( pBox.lookUp(1) !== testWorld.cBox4, "cBox4 NOT at index 1" );
	ok( pBox.lookUp(2) !== testWorld.cBox4, "cBox4 NOT at index 2" );
	ok( pBox.lookUp(3) !== testWorld.cBox4, "cBox4 NOT at index 3" );

});

test( "addAt with Index", function() {
	let pBox = testWorld.pBox;
	pBox.addAt(2, testWorld.cBox5);
	pBox.addAt(4, testWorld.cBox6);

	ok( pBox.lookUp(0) === testWorld.cBox0, "cBox0 at index 0" );
	ok( pBox.lookUp(1) === testWorld.cBox1, "cBox1 at index 1" );
	ok( pBox.lookUp(2) === testWorld.cBox5, "cBox5 at index 2" );
	ok( pBox.lookUp(3) === testWorld.cBox2, "cBox2 at index 3" );
	ok( pBox.lookUp(4) === testWorld.cBox6, "cBox6 at index 4" );
	ok( pBox.lookUp(5) === testWorld.cBox3, "cBox3 at index 5" );
	ok( pBox.lookUp(6) === testWorld.cBox4, "cBox4 at index 6" );

});

test( "addAt with Object", function() {
	let pBox = testWorld.pBox;
	pBox.addAt(testWorld.cBox2, testWorld.cBox7);

	ok( pBox.lookUp(0) === testWorld.cBox0, "cBox0 at index 0" );
	ok( pBox.lookUp(1) === testWorld.cBox1, "cBox1 at index 1" );
	ok( pBox.lookUp(2) === testWorld.cBox5, "cBox5 at index 2" );
	ok( pBox.lookUp(3) === testWorld.cBox7, "cBox7 at index 3" );
	ok( pBox.lookUp(4) === testWorld.cBox2, "cBox2 at index 4" );
	ok( pBox.lookUp(5) === testWorld.cBox6, "cBox6 at index 5" );
	ok( pBox.lookUp(6) === testWorld.cBox3, "cBox3 at index 6" );
	ok( pBox.lookUp(7) === testWorld.cBox4, "cBox4 at index 7" );

});

test( "remove single Object", function() {
	let pBox = testWorld.pBox;
	pBox.remove(testWorld.cBox3);

	ok( pBox.lookUp(0) === testWorld.cBox0, "cBox0 at index 0" );
	ok( pBox.lookUp(1) === testWorld.cBox1, "cBox1 at index 1" );
	ok( pBox.lookUp(2) === testWorld.cBox5, "cBox5 at index 2" );
	ok( pBox.lookUp(3) === testWorld.cBox7, "cBox7 at index 3" );
	ok( pBox.lookUp(4) === testWorld.cBox2, "cBox2 at index 4" );
	ok( pBox.lookUp(5) === testWorld.cBox6, "cBox6 at index 5" );
	ok( pBox.lookUp(6) === testWorld.cBox4, "cBox4 at index 6" );

});

test( "remove multiple Objects exist", function() {
	let pBox = testWorld.pBox;
	pBox.remove(testWorld.cBox7, testWorld.cBox4, testWorld.cBox0);

	ok( pBox.lookUp(0) === testWorld.cBox1, "cBox1 at index 0" );
	ok( pBox.lookUp(1) === testWorld.cBox5, "cBox5 at index 1" );
	ok( pBox.lookUp(2) === testWorld.cBox2, "cBox2 at index 2" );
	ok( pBox.lookUp(3) === testWorld.cBox6, "cBox6 at index 3" );

});

test( "remove single Index exist", function() {
	let pBox = testWorld.pBox;
	pBox.remove(1);

	ok( pBox.lookUp(0) === testWorld.cBox1, "cBox1 at index 0" );
	ok( pBox.lookUp(1) === testWorld.cBox2, "cBox2 at index 1" );
	ok( pBox.lookUp(2) === testWorld.cBox6, "cBox6 at index 2" );

});

test( "add 2 existing 1 does not", function() {
	let pBox = testWorld.pBox;
	pBox.add(testWorld.cBox1, testWorld.cBox2, testWorld.cBox7);

	ok( pBox.lookUp(0) === testWorld.cBox1, "cBox1 at index 0" );
	ok( pBox.lookUp(1) === testWorld.cBox2, "cBox2 at index 1" );
	ok( pBox.lookUp(2) === testWorld.cBox6, "cBox6 at index 2" );
	ok( pBox.lookUp(3) === testWorld.cBox7, "cBox7 at index 3" );

});

test( "addAt object exists, new doesn't (move = default:true, shift = default:true)", function() {
	let pBox = testWorld.pBox;
	pBox.addAt(testWorld.cBox7, testWorld.cBox3);

	ok( pBox.lookUp(0) === testWorld.cBox1, "cBox1 at index 0" );
	ok( pBox.lookUp(1) === testWorld.cBox2, "cBox2 at index 1" );
	ok( pBox.lookUp(2) === testWorld.cBox6, "cBox6 at index 2" );
	ok( pBox.lookUp(3) === testWorld.cBox3, "cBox3 at index 3" );
	ok( pBox.lookUp(4) === testWorld.cBox7, "cBox7 at index 4" );

});

test( "addAt index exists, new doesn't (move = default:true, shift = default:true)", function() {
	let pBox = testWorld.pBox;
	pBox.addAt(2, testWorld.cBox4);

	ok( pBox.lookUp(0) === testWorld.cBox1, "cBox1 at index 0" );
	ok( pBox.lookUp(1) === testWorld.cBox2, "cBox2 at index 1" );
	ok( pBox.lookUp(2) === testWorld.cBox4, "cBox4 at index 2" );
	ok( pBox.lookUp(3) === testWorld.cBox6, "cBox6 at index 3" );
	ok( pBox.lookUp(4) === testWorld.cBox3, "cBox3 at index 4" );
	ok( pBox.lookUp(5) === testWorld.cBox7, "cBox7 at index 5" );

});

test( "addAt index exists, new exists (move = default:true, shift = default:true)", function() {
	let pBox = testWorld.pBox;
	pBox.addAt(4, testWorld.cBox4);

	ok( pBox.lookUp(0) === testWorld.cBox1, "cBox1 at index 0" );
	ok( pBox.lookUp(1) === testWorld.cBox2, "cBox2 at index 1" );
	ok( pBox.lookUp(2) === testWorld.cBox6, "cBox6 at index 2" );
	ok( pBox.lookUp(3) === testWorld.cBox4, "cBox4 at index 3" );
	ok( pBox.lookUp(4) === testWorld.cBox3, "cBox3 at index 4" );
	ok( pBox.lookUp(5) === testWorld.cBox7, "cBox7 at index 5" );

});

test( "addAt index exists, new doesn't (move = false)", function() {
	let pBox = testWorld.pBox;
	pBox.addAt(2, testWorld.cBox5, false);

	ok( pBox.lookUp(0) === testWorld.cBox1, "cBox1 at index 0" );
	ok( pBox.lookUp(1) === testWorld.cBox2, "cBox2 at index 1" );
	ok( pBox.lookUp(2) === testWorld.cBox5, "cBox5 at index 2" );
	ok( pBox.lookUp(3) === testWorld.cBox6, "cBox6 at index 3" );
	ok( pBox.lookUp(4) === testWorld.cBox4, "cBox4 at index 4" );
	ok( pBox.lookUp(5) === testWorld.cBox3, "cBox3 at index 5" );
	ok( pBox.lookUp(6) === testWorld.cBox7, "cBox7 at index 6" );

});

test( "addAt object exists, exists (move = false)", function() {
	let pBox = testWorld.pBox;
	pBox.addAt(testWorld.cBox5, testWorld.cBox1, false);

	ok( pBox.lookUp(0) === testWorld.cBox1, "cBox1 at index 0" );
	ok( pBox.lookUp(1) === testWorld.cBox2, "cBox2 at index 1" );
	ok( pBox.lookUp(2) === testWorld.cBox5, "cBox5 at index 2" );
	ok( pBox.lookUp(3) === testWorld.cBox6, "cBox6 at index 3" );
	ok( pBox.lookUp(4) === testWorld.cBox4, "cBox4 at index 4" );
	ok( pBox.lookUp(5) === testWorld.cBox3, "cBox3 at index 5" );
	ok( pBox.lookUp(6) === testWorld.cBox7, "cBox7 at index 6" );

});

test( "addAt object not found, exists (move = false)", function() {
	let pBox = testWorld.pBox;
	pBox.addAt(testWorld.cBox8, testWorld.cBox1, false);

	ok( pBox.lookUp(0) === testWorld.cBox1, "cBox1 at index 0" );
	ok( pBox.lookUp(1) === testWorld.cBox2, "cBox2 at index 1" );
	ok( pBox.lookUp(2) === testWorld.cBox5, "cBox5 at index 2" );
	ok( pBox.lookUp(3) === testWorld.cBox6, "cBox6 at index 3" );
	ok( pBox.lookUp(4) === testWorld.cBox4, "cBox4 at index 4" );
	ok( pBox.lookUp(5) === testWorld.cBox3, "cBox3 at index 5" );
	ok( pBox.lookUp(6) === testWorld.cBox7, "cBox7 at index 6" );

});

test( "addAt index not found, exists (move = default:true) ", function() {
	let pBox = testWorld.pBox;
	pBox.addAt(683, testWorld.cBox8);

	ok( pBox.lookUp(0) === testWorld.cBox1, "cBox1 at index 0" );
	ok( pBox.lookUp(1) === testWorld.cBox2, "cBox2 at index 1" );
	ok( pBox.lookUp(2) === testWorld.cBox5, "cBox5 at index 2" );
	ok( pBox.lookUp(3) === testWorld.cBox6, "cBox6 at index 3" );
	ok( pBox.lookUp(4) === testWorld.cBox4, "cBox4 at index 4" );
	ok( pBox.lookUp(5) === testWorld.cBox3, "cBox3 at index 5" );
	ok( pBox.lookUp(6) === testWorld.cBox7, "cBox7 at index 6" );
	ok( pBox.lookUp(7) === testWorld.cBox8, "cBox8 at index 7" );

});

test( "replace at index with new object ", function() {
	let pBox = testWorld.pBox;
	let out = pBox.replace(3, testWorld.cBox9);

	ok( out === testWorld.cBox6, "cBox6 returned" );

	ok( pBox.lookUp(0) === testWorld.cBox1, "cBox1 at index 0" );
	ok( pBox.lookUp(1) === testWorld.cBox2, "cBox2 at index 1" );
	ok( pBox.lookUp(2) === testWorld.cBox5, "cBox5 at index 2" );
	ok( pBox.lookUp(3) === testWorld.cBox9, "cBox9 at index 3" );
	ok( pBox.lookUp(4) === testWorld.cBox4, "cBox4 at index 4" );
	ok( pBox.lookUp(5) === testWorld.cBox3, "cBox3 at index 5" );
	ok( pBox.lookUp(6) === testWorld.cBox7, "cBox7 at index 6" );
	ok( pBox.lookUp(7) === testWorld.cBox8, "cBox8 at index 7" );

});

test( "replace index existing with existing [same spot] ", function() {
	let pBox = testWorld.pBox;

	let out = pBox.replace(3, testWorld.cBox9);
	ok( out === undefined, "nothing returned [same spot]" );

	out = pBox.replace(2, testWorld.cBox3);
	ok( out === undefined, "nothing returned [same spot]" );

	ok( pBox.lookUp(0) === testWorld.cBox1, "cBox1 at index 0" );
	ok( pBox.lookUp(1) === testWorld.cBox2, "cBox2 at index 1" );
	ok( pBox.lookUp(2) === testWorld.cBox5, "cBox5 at index 2" );
	ok( pBox.lookUp(3) === testWorld.cBox9, "cBox9 at index 3" );
	ok( pBox.lookUp(4) === testWorld.cBox4, "cBox4 at index 4" );
	ok( pBox.lookUp(5) === testWorld.cBox3, "cBox3 at index 5" );
	ok( pBox.lookUp(6) === testWorld.cBox7, "cBox7 at index 6" );
	ok( pBox.lookUp(7) === testWorld.cBox8, "cBox8 at index 7" );

});

test( "replace index existing with new ", function() {
	let pBox = testWorld.pBox;

	let out = pBox.replace(4, testWorld.cBox6);
	ok( out === testWorld.cBox4, "returned cBox4" );

	ok( pBox.lookUp(0) === testWorld.cBox1, "cBox1 at index 0" );
	ok( pBox.lookUp(1) === testWorld.cBox2, "cBox2 at index 1" );
	ok( pBox.lookUp(2) === testWorld.cBox5, "cBox5 at index 2" );
	ok( pBox.lookUp(3) === testWorld.cBox9, "cBox9 at index 3" );
	ok( pBox.lookUp(4) === testWorld.cBox6, "cBox6 at index 6" );
	ok( pBox.lookUp(5) === testWorld.cBox3, "cBox3 at index 5" );
	ok( pBox.lookUp(6) === testWorld.cBox7, "cBox7 at index 6" );
	ok( pBox.lookUp(7) === testWorld.cBox8, "cBox8 at index 7" );

});

test( "replace object existing with new ", function() {
	let pBox = testWorld.pBox;

	let out = pBox.replace(testWorld.cBox9, testWorld.cBox4);
	ok( out === testWorld.cBox9, "returned cBox9" );

	ok( pBox.lookUp(0) === testWorld.cBox1, "cBox1 at index 0" );
	ok( pBox.lookUp(1) === testWorld.cBox2, "cBox2 at index 1" );
	ok( pBox.lookUp(2) === testWorld.cBox5, "cBox5 at index 2" );
	ok( pBox.lookUp(3) === testWorld.cBox4, "cBox4 at index 3" );
	ok( pBox.lookUp(4) === testWorld.cBox6, "cBox6 at index 4" );
	ok( pBox.lookUp(5) === testWorld.cBox3, "cBox3 at index 5" );
	ok( pBox.lookUp(6) === testWorld.cBox7, "cBox7 at index 6" );
	ok( pBox.lookUp(7) === testWorld.cBox8, "cBox8 at index 7" );

});

test( "sorting with addAt ", function() {
	let pBox = testWorld.pBox;

	let out = pBox.addAt(testWorld.cBox5, testWorld.cBox3, true);
	ok( out === testWorld.cBox3, "returned cBox3" );

	out = pBox.addAt(0, testWorld.cBox0, false);
	ok( out === testWorld.cBox0, "returned cBox0" );

	out = pBox.addAt(testWorld.cBox4, testWorld.cBox5);
	ok( out === testWorld.cBox5, "returned cBox5", true);

	out = pBox.add(testWorld.cBox9);
	ok( out === pBox, "returned this");

	ok( pBox.lookUp(0) === testWorld.cBox0, "cBox0 at index 0" );
	ok( pBox.lookUp(1) === testWorld.cBox1, "cBox1 at index 1" );
	ok( pBox.lookUp(2) === testWorld.cBox2, "cBox2 at index 2" );
	ok( pBox.lookUp(3) === testWorld.cBox3, "cBox3 at index 3" );
	ok( pBox.lookUp(4) === testWorld.cBox4, "cBox4 at index 4" );
	ok( pBox.lookUp(5) === testWorld.cBox5, "cBox5 at index 5" );
	ok( pBox.lookUp(6) === testWorld.cBox6, "cBox6 at index 6" );
	ok( pBox.lookUp(7) === testWorld.cBox7, "cBox7 at index 7" );
	ok( pBox.lookUp(8) === testWorld.cBox8, "cBox8 at index 8" );
	ok( pBox.lookUp(9) === testWorld.cBox9, "cBox8 at index 9" );

});

test( "remove All", function() {
	let pBox = testWorld.pBox;

	let out = pBox.remove(testWorld.cBox0, testWorld.cBox1, testWorld.cBox2,
		testWorld.cBox3, testWorld.cBox4, testWorld.cBox5, testWorld.cBox6,
		testWorld.cBox7, testWorld.cBox8, testWorld.cBox9);
	ok( pBox.children.length === 0, "children empty" );


	testWorld = undefined;
	pMat = undefined;
	aMat = undefined;
	bMat = undefined;
	cMat = undefined;
});


QUnit.config.reorder = prevOrder;
