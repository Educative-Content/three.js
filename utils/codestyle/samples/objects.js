
// GOOD

var obj = {};
var obj = { A: 1, b: 2, C: 3 };

var obj = {
    A: 1,
    b: 2,
    C: 3
};

// by-hand aligning of object keys
var objs = [
	{ a: 12341234, b: 1234, c: 123412341234 },
	{ a: 1,        b: 123,  c: 12 },
	{ a: 123412,   b: 12,   c: 12341234 }
];

// BAD

var obj = { };
var obj = {A:1,b:2,C:3};

var obj = {A:1, b:2, C:3};

var obj = {A : 1, b : 2, C : 3};

var obj = { "A" : 1, "b" : 2, "C" : 3 };

var obj = { A : 1, b : 2, C : 3 };

var obj = { A :1, b :2, C :3 };

var obj = { A : 1 , b : 2 , C : 3 };

var obj = {
    A : 1,
    b : 2,
    C : 3,
};


var obj = {
    A : 1
  , b : 2
  , C : 3
};
