# link-object:  
---
Normally, we use Object without link, which means we use shallow copy to copy an new object but we can't access its parent object.  

> var obj = { a: 1, b: 2 }  
> var smallObj = obj.a;
>   
> // illegal  
> console.log(smallObj.parent)    

It makes access parent object possible.

> const linkObject = require('linkObject');  
> var temp = linkObject.newObject();  
> temp.a = 1;  
> temp.b = 2;  
> temp.c = 3;  
> temp.a.x = 4;  
> temp.a.y = 5;  
> temp.a.x.z = 6;  
> temp.b.w = 7;  
>
>  // a Proxy Object with { _value: 7, _parent: Proxy[ Object Object ], etc.}  
>  console.log(temp.a.x.z.\_parent.\_parent.\_parent.b.w);  
>  // 7  
>  console.log(temp.a.x.z.\_parent.\_parent.\_parent.b.w.\_value);  

The target is to use JS to rebuild a new Object using Proxy & Reflect (Supported by ES6). 