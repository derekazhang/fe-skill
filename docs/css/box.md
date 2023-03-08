# 盒模型

- 有两种， IE 盒子模型、W3C 盒子模型；
- 盒模型： 内容(content)、填充(padding)、边框(border)、边界(margin)；
- 区 别： IE 的 content 部分把 border 和 padding 计算了进去;

从上图可以看到：

- 盒子总宽度 = width + padding + border + margin;
- 盒子总高度 = height + padding + border + margin

也就是，width/height 只是内容高度，不包含 padding 和 border 值

页面渲染时，dom 元素所采用的 布局模型。可通过 box-sizing 进行设置

### 通过 box-sizing 来改变元素的盒模型

CSS 中的 box-sizing 属性定义了引擎应该如何计算一个元素的总宽度和总高度

- box-sizing: content-box; 默认的标准(W3C)盒模型元素效果，元素的 width/height 不包含 padding，border，与标准盒子模型表现一致
- box-sizing: border-box; 触发怪异(IE)盒模型元素的效果，元素的 width/height 包含 padding，border，与怪异盒子模型表现一致
- box-sizing: inherit; 继承父元素 box-sizing 属性的值

小结

- 盒子模型构成：内容(content)、内填充(padding)、 边框(border)、外边距(margin)
- IE8 及其以下版本浏览器，未声明 DOCTYPE，内容宽高会包含内填充和边框，称为怪异盒模型(IE 盒模型)
- 标准(W3C)盒模型：元素宽度 = width + padding + border + margin
- 怪异(IE)盒模型：元素宽度 = width + margin
- 标准浏览器通过设置 css3 的 box-sizing: border-box 属性，触发“怪异模式”解析计算宽高
