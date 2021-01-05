# Update Log （中文更新日志在下方）：

### 00006 (Jan 5, 2021):
> 1. In node.js REPL, its getter will mistaken in calling "target" itself, while works functionally in Chrome(87.0.4280.88) Browser. So getter will be restarted in use, and amend some codes for better using.
> 2. Complete deep object copy function by using recursion(It will be used in initialization of linkObject)

### 00005 (Jan 4, 2021):
> 1. I attempt to call attempt by using "_link" with global JS function "eval". Get ready for getter.
### 00004 (Dec 31, 2020):
> 1. I found that shallow copy will affect the another new object inherited the Proxy Object. So I thought I need to make an deep-copy-object function. (Using Object.assign temporarily)
> 2. Make a new initialization method to pass the name of target variable for better using "_link"

### 00003 (Dec 30, 2020):
> 1. I found when setter activated, defineProperty also would be activated. But defineProperty would not activated setter.
On the contrary, "setter" is temporarily commented.
> 2. fix link with caller node itself.

### 00002 (Dec 29, 2020):
> 1. make a new feature: link  
   After this feature added, we can find where we are just like a node in JS "DOM tree".
> 2. Because "defineProperty" makes conflicts with "setter", it will be better to keep only one part.  
Inner "defineProperty" & "getter" is temporarily commented.

### 00001(v0.1 -> 00001) (Dec 25, 2020): 
> 1. support setter ONLY

---
## 更新日志：

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
> 1. 实现了新特性：link
   _link的实现可以使得我们可以寻找到我们JS对象节点继承了谁，再JS的“DOM树”中的哪一个位置
> 2. 因为setter和defineProperty方法相互冲突，所以先暂时屏蔽掉setter方法

### 00003（2020/12/25）：
> 1. 初次支持setter方法
