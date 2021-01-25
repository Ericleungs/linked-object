# Update Log （中文更新日志在下方）：


### 00012 (Jan 25, 2021):
> 1. edit the readme.md doc
> 2. add a es-lint syntax & format supervisor
> 3. simplify some code

### 00011 (Jan 22, 2021):
> 1. fix the when assigning \_link, it also create a redundant name
> 2. I think it maybe cannot access exactly by using \_link & \_name. It needs to create a new unique flag: ID after considering a while.
> 3. the method of "init" is commented and will be removed in future because it cannot construct the property "\_link".

### 00010 (Jan 17, 2021):
> 1. fix the bug when creating a linkObject object, will create impropriate target linkObject object.
> 2. make a new bug: \_link will make a name itself repetitively.

### 00009 (Jan 13, 2021):
> 1. Fix object creator working by IIFE function.
### 00008 (Jan 8, 2021):
> 1. make inner attributes(\_value, \_parent, \_value, \_function, \_link) non-enumerable

### 00007 (Jan 6, 2021):
> 1. Reconstruct the method of "initWithName"
> 2. new a inner method: \_copyLinkObject, it is for copying deeply with the format from linkObject.

### 00006 (Jan 5, 2021):
> 1. In node.js REPL, its getter will mistaken in calling "target" itself, while works functionally in Chrome(87.0.4280.88) Browser. So getter will be restarted in use, and amend some codes for better using.
> 2. Complete deep object copy function by using recursion(It will be used in initialization of linkObject)

### 00005 (Jan 4, 2021):
> 1. I attempt to call attempt by using "\_link" with global JS function "eval". Get ready for getter.
### 00004 (Dec 31, 2020):
> 1. I found that shallow copy will affect the another new object inherited the Proxy Object. So I thought I need to make an deep-copy-object function. (Using Object.assign temporarily)
> 2. Make a new initialization method to pass the name of target variable for better using "\_link"

### 00003 (Dec 30, 2020):
> 1. I found when setter activated, defineProperty also would be activated. But defineProperty would not activated setter.
On the contrary, "setter" is temporarily commented.
> 2. fix link with caller node itself.

### 00002 (Dec 29, 2020):
> 1. make a new feature: \_link  
   After this feature added, we can find where we are just like a node in JS "DOM tree".
> 2. Because "defineProperty" makes conflicts with "setter", it will be better to keep only one part.  
Inner "defineProperty" & "getter" is temporarily commented.

### 00001(v0.1 -> 00001) (Dec 25, 2020): 
> 1. support setter ONLY

---
## 更新日志：


### 00012（2020/1/25）：
> 1. 修改了readme文档的一些设置
> 2. 新增es-lint的语法检测，后续也会继续新增规则
> 3. 简化了一些代码

### 00011（2020/1/22）：
> 1. 修复了\_link属性在赋值的时候，会重复出现目标的name问题
> 2. 在思考了一段时间之后，觉得单单靠\_link和\_name，可能没法准确标志，所以未来可能会在后面的版本中，加入新的属性：id
> 3. 因为init方法没办法构建\_link属性，目前已经被屏蔽，可能会在未来删除

### 00010（2020/1/17）：
> 1. 修复了生成linkObject对象的时候，参数是个对象（就是想让一个对象通过initWithName转换成linkObject对象的时候），生成错误对象的问题。
> 2. 留下了bug：linkObject对象中的\_link属性会重复出现name

### 00009（2020/1/13）：
> 1. 修复已知问题： IIFE函数只会执行一次，如果直接使用，会导致所有的创建linkObject的对象，陷入无限死循环之中。
### 00008（2020/1/8）：
> 1. 让内部的属性(\_value, \_parent, \_value, \_function, \_link)不再被循环或者是被拷贝出来

### 00007（2021/1/6）：
> 1. 重构了带名字初始化一个linkObject的方法: initWithName
> 2. 新增了一个通过递归，以linkObject的格式，深拷贝对象的方法：_copyLinkObject

### 00006（2021/1/5）：
> 1. 在node.js的REPL交互环境中，linkObject的getter会出现反复调用的异常（但是在浏览器是正常使用），因此重新开放getter，并修正某些逻辑。
> 2. 用递归设置了一个深拷贝函数，为初始化一个对象，将它变成linkObject对象做准备

### 00005（2021/1/4）：
> 1. 现在的想法是通过_link来做到getter的目的，这就是为什么要重新实现init并且带有name作为参数。为getter做准备。
### 00004（2020/12/31）：
> 1. 因为浅拷贝了默认的模板对象，因此引用变量下的值变量是浅拷贝，这就导致新增一个linkObject的对象的时候，会共享上一个声明的linkObject的对象，目前暂时使用Object.assign做浅拷贝
> 2. 新增了一个新的初始化方法，这个方法必须带有命名的变量的名字，这是为了索引链中的初始节点不是'root'而设置的。
### 00003（2020/12/30）：
> 1. 我发现当触发setter的时候，handler里头的defineProperty的预设方法也会被触发，而反过来不会。综合考虑，暂时注释掉setter方法。
> 2. 修复了link，link包括自身对象节点，而不仅仅是上一级索引

### 00002（2020/12/29）：
> 1. 实现了新特性：\_link
   _link的实现可以使得我们可以寻找到我们JS对象节点继承了谁，再JS的“DOM树”中的哪一个位置
> 2. 因为setter和defineProperty方法相互冲突，所以先暂时屏蔽掉setter方法

### 00003（2020/12/25）：
> 1. 初次支持setter方法
