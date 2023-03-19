(window.webpackJsonp=window.webpackJsonp||[]).push([[30],{305:function(i,n,t){"use strict";t.r(n);var r=t(14),d=Object(r.a)({},(function(){var i=this,n=i.$createElement,t=i._self._c||n;return t("ContentSlotsDistributor",{attrs:{"slot-key":i.$parent.slotKey}},[t("h1",{attrs:{id:"盒模型-1"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#盒模型-1"}},[i._v("#")]),i._v(" 盒模型 1")]),i._v(" "),t("ul",[t("li",[i._v("有两种， IE 盒子模型、W3C 盒子模型；")]),i._v(" "),t("li",[i._v("盒模型： 内容(content)、填充(padding)、边框(border)、边界(margin)；")]),i._v(" "),t("li",[i._v("区 别： IE 的 content 部分把 border 和 padding 计算了进去;")])]),i._v(" "),t("p",[i._v("从上图可以看到：")]),i._v(" "),t("ul",[t("li",[i._v("盒子总宽度 = width + padding + border + margin;")]),i._v(" "),t("li",[i._v("盒子总高度 = height + padding + border + margin")])]),i._v(" "),t("p",[i._v("也就是，width/height 只是内容高度，不包含 padding 和 border 值")]),i._v(" "),t("p",[i._v("页面渲染时，dom 元素所采用的 布局模型。可通过 box-sizing 进行设置")]),i._v(" "),t("h3",{attrs:{id:"通过-box-sizing-来改变元素的盒模型"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#通过-box-sizing-来改变元素的盒模型"}},[i._v("#")]),i._v(" 通过 box-sizing 来改变元素的盒模型")]),i._v(" "),t("p",[i._v("CSS 中的 box-sizing 属性定义了引擎应该如何计算一个元素的总宽度和总高度")]),i._v(" "),t("ul",[t("li",[i._v("box-sizing: content-box; 默认的标准(W3C)盒模型元素效果，元素的 width/height 不包含 padding，border，与标准盒子模型表现一致")]),i._v(" "),t("li",[i._v("box-sizing: border-box; 触发怪异(IE)盒模型元素的效果，元素的 width/height 包含 padding，border，与怪异盒子模型表现一致")]),i._v(" "),t("li",[i._v("box-sizing: inherit; 继承父元素 box-sizing 属性的值")])]),i._v(" "),t("p",[i._v("小结")]),i._v(" "),t("ul",[t("li",[i._v("盒子模型构成：内容(content)、内填充(padding)、 边框(border)、外边距(margin)")]),i._v(" "),t("li",[i._v("IE8 及其以下版本浏览器，未声明 DOCTYPE，内容宽高会包含内填充和边框，称为怪异盒模型(IE 盒模型)")]),i._v(" "),t("li",[i._v("标准(W3C)盒模型：元素宽度 = width + padding + border + margin")]),i._v(" "),t("li",[i._v("怪异(IE)盒模型：元素宽度 = width + margin")]),i._v(" "),t("li",[i._v("标准浏览器通过设置 css3 的 box-sizing: border-box 属性，触发“怪异模式”解析计算宽高")])])])}),[],!1,null,null,null);n.default=d.exports}}]);