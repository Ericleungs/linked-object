const linkObject = require('../linkObject');

var temp = linkObject.newObject();

temp.a = 1;
temp.b = 2;
temp.c = 3;
temp.a.x = 4;
temp.a.y = 5;
temp.a.x.z = 6;
temp.b.w = 7;

console.log(temp.a.x.z._parent._parent._parent.b.w);
// an Proxy Object with { _value: 7, _parent:Proxy[ Object Object], etc. }
console.log(temp.a.x.z._parent._parent._parent.b.w._value);
// 7