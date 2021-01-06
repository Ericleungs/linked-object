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

# link-object
---
日常使用中，一般我们是没有办法访问到浅拷贝一个对象的子项的父对象的。
  
> var obj = { a: 1, b: 2 }  
> var smallObj = obj.a;
>   
> // 不合法的访问  
> console.log(smallObj.parent)    

该包的目的，就是使得访问父对象成为可能。  

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
>  // 返回一个Proxy对象 { \_value: 7, \_parent: Proxy\[ Object Object \], etc.}  
>  console.log(temp.a.x.z.\_parent.\_parent.\_parent.b.w);  
>  // 7  
>  console.log(temp.a.x.z.\_parent.\_parent.\_parent.b.w.\_value);  
  
这个包使用了ES6中的Proxy和Reflect去重写方法，这就意味着不直接支持ES6以前的浏览器或者node服务器使用。