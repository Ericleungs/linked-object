# Update Log （中文更新日志在下方）：

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
### 00003（2020/12/30）：
> 1. 我发现当触发setter的时候，handler里头的defineProperty的预设方法也会被触发，而反过来不会。综合考虑，暂时注释掉setter方法。
> 2. 修复了link，link包括自身对象节点，而不仅仅是上一级索引

### 00002（2020/12/29）：
> 1. 实现了新特性：link
   _link的实现可以使得我们可以寻找到我们JS对象节点继承了谁，再JS的“DOM树”中的哪一个位置
> 2. 因为setter和defineProperty方法相互冲突，所以先暂时屏蔽掉setter方法

### 00003（2020/12/25）：
> 1. 初次支持setter方法
