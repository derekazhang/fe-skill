---
title: 微信小程序最新大招--- XR-Frame
date: 2022-09-09 09:36:05
permalink: /xr-frame/
article: ture
sidebar: auto
---

微信小程序官方最近新推出了一套 AR/VR/3D 框架——xr-frame，他相比于传统的 3D 开发，`性能更高、效果更好并且开发更加便捷（开发体验和效率都提升了非常多）`。

不过官方文档并不详细，并且没有对 web3D 基础知识做讲解，导致无基础的同学很容易不知所云。这里`我会在官方 demo 的基础上结合 threejs 的一些基础概念来做讲解，帮助有兴趣的同学快速上手`。

首先来看下官方给的 demo（要求微信版本 8.0.28+）:
![微信小程序]("./xr-frame-mini-program.webp")

PS:安卓最好升级到 8.0.30+，否则只能一次性打开一个 xr-frame，打开第二个会 crash

什么是 xr-frame？一句话：他和 A-Frame 非常相似，可以理解为 3D 版的 svg，用标签来达到 js 代码的效果

所有的代码官方都开源了[源码地址](https://github.com/dtysky/xr-frame-demo)，这里我会跟大家一起把所有源码都过一遍，`只说明有技术难度的部分`

## 基础案例/基础图形

本文讲解 demo：[基础案例/基础图形](https://github.com/dtysky/xr-frame-demo/tree/master/miniprogram/pages/scene-basic)，对应官方小程序（名字：小程序示例）的交互动画/xrframe/基础案例/基础图形

wxml 的完整代码如下

```xml
<xr-scene id="xr-scene" bind:ready="handleReady">
  <xr-assets bind:progress="handleAssetsProgress" bind:loaded="handleAssetsLoaded">
    <xr-asset-material asset-id="standard-mat" effect="standard" />
  </xr-assets>
  <xr-node>
    <xr-mesh node-id="mesh-plane" position="0 -0.02 -4" rotation="0 0 0" scale="5 1 5" geometry="plane" material="standard-mat" uniforms="u_baseColorFactor:0.48 0.78 0.64 1" receive-shadow></xr-mesh>
    <xr-mesh id="cube" node-id="mesh-cube" position="-1 0.5 -3.5" scale="1 1 1" rotation="0 45 0" geometry="cube" material="standard-mat" uniforms="u_baseColorFactor:0.298 0.764 0.85 1" cast-shadow></xr-mesh>
    <xr-mesh node-id="mesh-cylinder" position="1 0.7 -3.5" scale="1 0.7 1" geometry="cylinder" material="standard-mat" uniforms="u_baseColorFactor:1 0.776 0.364 1" cast-shadow></xr-mesh>
    <xr-mesh node-id="mesh-sphere" position="0 1.25 -5" scale="1.25 1.25 1.25" geometry="sphere" material="standard-mat" uniforms="u_baseColorFactor:0.937 0.176 0.368 1" cast-shadow></xr-mesh>
    <xr-camera
      id="camera" node-id="camera" position="0 1.6 0" clear-color="0.925 0.925 0.925 1"
      target="mesh-sphere"
      camera-orbit-control=""
    ></xr-camera>
  </xr-node>
  <xr-node node-id="lights">
    <xr-light type="ambient" color="1 1 1" intensity="1" />
    <xr-light type="directional" rotation="40 170 0" color="1 1 1" intensity="3" cast-shadow/>
  </xr-node>
</xr-scene>
```

### 1.xr-scene 场景

对应了 threejs 中一个很重要的概念：scene，他包含了需要参与渲染的所有物体、灯光、照相机等，相当于根节点

### 2.xr-assets 资源

```xml
<xr-assets bind:progress="handleAssetsProgress" bind:loaded="handleAssetsLoaded">
  <xr-asset-material asset-id="standard-mat" effect="standard" />
</xr-assets>
```

程序会自动开始加载列举的资源，可以设置加载过程中的各项事件。

### 3.xr-asset-material 材质

```xml
<xr-asset-material asset-id="standard-mat" effect="standard" />
```

代表了如何渲染物体外观，是光滑（镜面反射）还是粗糙（漫反射）程度如何等，他的效果很大程度上由 effect 属性指定的效果决定，材质的编程属于非常高级的部分，我们一般选择 standard 即可

### 4.xr-mesh 网格

```xml
<xr-mesh node-id="mesh-plane" position="0 -0.02 -4" rotation="0 0 0" scale="5 1 5" geometry="plane" material="standard-mat" uniforms="u_baseColorFactor:0.48 0.78 0.64 1" receive-shadow></xr-mesh>
<xr-mesh id="cube" node-id="mesh-cube" position="-1 0.5 -3.5" scale="1 1 1" rotation="0 45 0" geometry="cube" material="standard-mat" uniforms="u_baseColorFactor:0.298 0.764 0.85 1" cast-shadow></xr-mesh>
<xr-mesh node-id="mesh-cylinder" position="1 0.7 -3.5" scale="1 0.7 1" geometry="cylinder" material="standard-mat" uniforms="u_baseColorFactor:1 0.776 0.364 1" cast-shadow></xr-mesh>
<xr-mesh node-id="mesh-sphere" position="0 1.25 -5" scale="1.25 1.25 1.25" geometry="sphere" material="standard-mat" uniforms="u_baseColorFactor:0.937 0.176 0.368 1" cast-shadow></xr-mesh>

```

他实际上代表了物体的形状，xr-scene 和 threejs 都是基于 webgl 或者说 opengl 的，在 opengl 中只能用点、直线段来构建形状，比如立方体由八个点和 12 条线组成，球体则用若干个点线拟合，点线越多拟合越精确。

其中 geometry 元素就代表了几何数据即顶点和其索引，我们也可以直接用内置的： cube（正方体）、 sphere（球体）、 plane（平面）、 cylinder（圆柱）。其他属性 node-id、position、rotation、scale 很好理解。material 属性代表该物体绑定的材质，这里是以 id 关联之前引入的 asset。

除此之外，uniforms 也是渲染相关的属性之一，我们先不展开说明，可以直接使用内置或示例上的，可以自己调参看看效果，帮助理解，这是内置的参数：https://developers.weixin.qq.com/miniprogram/dev/component/xr-frame/builtin/effect.html

### 5.xr-camera 相机

```xml
<xr-camera
  id="camera" node-id="camera" position="0 1.6 0" clear-color="0.925 0.925 0.925 1"
  target="mesh-sphere"
  camera-orbit-control=""
></xr-camera>
```

对应了 threejs 中另一个很重要的概念：照相机，他标识从何视角去观察 scene。position 表示照相机所在的位置，clear-color 表示底色，target 是相机的朝向，这里传入的是一个 node，相机就会跟随这个 node 改变朝向，也可以传入一个坐标。camera-orbit-control 是相机的轨迹控制，可以编程控制相机，包括朝向、位置、缩放等。

相机这里扩展一下：相机是做什么用的？实际上他是将三维场景的物体投影到二维平面也就是我们的屏幕上，相机支持两种投影方式：透视投影和正交投影。前者是默认选择的，他符合真实的视觉，即近大远小（同样大小的物体，离屏幕越远，投影到屏幕上的图像越小）。后者不管位置如何，相同大小的物体的投影始终是相同的，比较适合于 CAD 建模之类对长度比较敏感的场景。

### 6.xr-light 光照

```xml
<xr-light type="ambient" color="1 1 1" intensity="1" />
<xr-light type="directional" rotation="40 170 0" color="1 1 1" intensity="3" cast-shadow/>
```

type 支持 4 种：环境光（360 度无死角的光照，不会产生阴影）、平行光、点光影（从一点向 360 度发光）、聚光灯（向一个区域发射光）。color 代表颜色、intensity 代表亮度，还可以设置 cast-shadow 表示是否产生阴影。

以上就是 wxml 的大致内容，其他的 wxss 和 js 基本没有内容，可见 xr-frame 就是用标签的形式来达到 js 编程的效果的。

## 光源讲解

本文讲解 demo：[基础案例/多光源](https://github.com/dtysky/xr-frame-demo/tree/master/miniprogram/pages/scene-basic-light)，对应官方小程序（名字：小程序示例）的交互动画/xrframe/基础案例/多光源

```xml
<xr-light type="ambient" color="1 1 1" intensity="0.1" />
<xr-light type="directional" rotation="40 170 0" color="1 1 1" intensity="0.2" />
<xr-light type="point" position="0 0 0" color="1 0 0" range="3" intensity="3" />
<xr-light type="point" position="2 0 1" color="0 1 0" range="3" intensity="3" />
<xr-light type="spot" position="0 0 0" color="0 0 1" range="12" intensity="12" rotation="0 120 0" inner-cone-angle="30" outer-cone-angle="35" />
```

主要介绍了 4 种光源的效果和参数，比较容易理解大家可以自己调参试试效果

他们共同的参数为：color、intensity 亮度

1. 环境光：360 度无死角的光照，不会产生阴影，类似于自然环境中无数物体反射太阳光的效果，一般作为打底的弱亮度光源，保证整个场景不会漆黑一片
2. 平行光：类似于太阳光的平行光照效果，只有平行光能产生阴影，可以设置 rotation 角度
3. 点光源：类似于发光点，从一点向所有方向发射光线，可以设置 position 和 range 光照范围
4. 聚光灯：不同于点光源，他只会向某个范围发射光线，可以设置 position、rotation 和 range 还有 inner-cone-angle 和 outer-cone-angle 决定锥形角度

有光就会产生阴影，由于阴影计算比较耗性能，所以需要手动开启，需要三步：

1. 给光源加上 cast - shadow，目前只有平行光支持
2. 给产生阴影的 mesh 加上 cast - shadow
3. 给接收阴影的 mesh 加上 receive - shadow

代码如下：省去了其他非关键属性

```xml
<xr-node>
  <!-- 平面，接收阴影 -->
  <xr-mesh geometry="plane" receive-shadow></xr-mesh>
  <!--立方体，产生阴影-->
  <xr-mesh geometry="cube" cast-shadow></xr-mesh>
</xr-node>
<xr-node node-id="lights">
  <!-- 平行光，产生阴影 -->
  <xr-light type="directional" color="1 1 1" cast-shadow />
</xr-node>
```

## 动画讲解

本文讲解 demo：[基础案例/动画](https://github.com/dtysky/xr-frame-demo/tree/master/miniprogram/pages/scene-basic-animation)，对应官方小程序（名字：小程序示例）的交互动画/xrframe/基础案例/动画

本节主要说明动画的一种实现方法：

首先将动画配置作为资源引入：

```xml
<xr-asset-load asset-id="basic-anim" type="keyframe" src="/assets/animation/basic-animation.json"/>
```

可以看下这个 json，其实和 css 大同小异

```json
{
  "keyframe": {
    "cube": {
      "0": {
        "position": [-3, 0, 2]
      },
      "50": {
        "rotation": [0, 0, 0],
        "scale": [1, 1, 1]
      },
      "100": {
        "position": [3, 0, 2],
        "rotation": [0, 3.14, 0],
        "scale": [1.4, 1.4, 1.4]
      }
    },
    ...
  },
  "animation": {
    "default": {
      "keyframe": "cube",
      "duration": 1,
      "ease": "ease-in-out",
      "loop": 400000,
      "delay": 1,
      "direction": "both"
    },
    ...
  }
}
```

先定义关键帧，再定义动画参数，之后在节点上关联就可以了

```xml
<xr-mesh
  node-id="mesh-cube" position="-3 0 2" scale="1 1 1" rotation="0 0 0" geometry="cube" material="standard-mat" uniforms="u_baseColorFactor:0.298 0.764 0.85 1"
  anim-keyframe="basic-anim" anim-autoplay="clip:cube, speed:2"
  cast-shadow
></xr-mesh>
```

anim-keyframe 对应 asset-id，anim-autoplay 对应 json 中的动画名，还可以指定速度

可以参与动画的属性：

属性的值为 number、number-array 和 color 类型的数据都可以进行动画，程序会自动计算关键帧之间每一帧每个属性的值应该是多少。

除了 position、rotation、scale 之外，像 material.u_baseColorFactor 这样的属性也可以，如下，可以改变物体的颜色：

```json
"0": {
    "material.u_baseColorFactor": [0.48, 0.78, 0.64, 1]
},
"100": {
    "material.u_baseColorFactor": [0.176, 0.368, 0.937, 1]
}
```

### 视频讲解

本文讲解 demo：基础案例/视频纹理 （https://github.com/dtysky/xr-frame-demo/tree/master/miniprogram/pages/scene-basic-video），对应官方小程序（名字：小程序示例）的交互动画/xrframe/基础案例/视频纹理

1. 加载视频，type 需要为 video-texture，可以设置很多 option，如：自动播放、循环、静音（abortAudio）、封面图

```xml
<xr-assets bind:progress="handleAssetsProgress" bind:loaded="handleAssetsLoaded">
  <xr-asset-load
    type="video-texture" asset-id="cat"
    src="https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/videos/cat.mp4" options="autoPlay:true,loop:true,placeHolder:https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/videos/cat.jpg"
  />
</xr-assets>
```

2. 之后视频有两种应用

- 作为普通纹理：

对 mesh 的 uniforms 设置为对应的视频即可，比如这里是立方体，就会在 6 个面上都渲染这个视频

```
<xr-mesh
  node-id="mesh-cube" scale="1.6 0.9 0.9"
  geometry="cube" material="standard-mat"
  uniforms="u_baseColorMap:video-cat"
/>
```

- 作为天空盒
  这时需要视频为全景视频（使用 360° 相机拍摄的），如官方给的：

https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/videos/office-skybox.mp4

引入后设置到 sky-map 环境变量，再在相机的 background 属性声明：

```xml
<xr-env sky-map="video-skybox" />
<xr-node>
  <xr-camera id="camera" node-id="camera" background="skybox">
  </xr-camera>
</xr-node>
```

3. 通过代码创建

```js
const vt = await createVideo({ src, autoPlay, loop, placeHolder });
```

在有 placeHolder 时会在图片加载完毕时返回，否则将在视频准备好时返回。

之后就可以对视频进行控制了：

```js
// 开始播放，异步方法
await vt.play();

// 从`pos`秒开始播放，异步方法
await vt.seek(pos);

// 停止播放
vt.stop();

// 释放视频
vt.release();

// 在播放结束并且非 loop 的情况下，会执行
vt.onEnd = () => {};
```

注意，务必`自己调用release方法释放！！！`

使用前需要注册：

```js
xrFrameSystem.registerVideoTexture("test", vt);
```

之后就可以使用 uniforms="u_baseColorMap:video-test"

## 交互讲解

本文讲解 demo：[基础案例/交互](https://github.com/dtysky/xr-frame-demo/tree/master/miniprogram/pages/scene-basic-touch)，对应官方小程序（名字：小程序示例）的交互动画/xrframe/基础案例/交互

效果如下，有两个 mesh：地球和月球，拖动地球可以旋转，拖动月球可以自由定位，地月在拖动时都会有轮廓
![]("./xr-frame-moon.webp")

简化代码如下，我们以地球为例做讲解，月球也是类似的：

1. 首先定义了一些 asset:

```xml
<xr-asset-load type="texture" asset-id="earth-texture" src="***.jpg" />
<xr-asset-material asset-id="earth-mat" uniforms="u_baseColorMap: earth-texture"/>
<xr-asset-material asset-id="earth-silhouette" uniforms="u_baseColorFactor: 1.0 0.5 0 1.0"/>
```

其中 `earth-mat` 表示地月材质，可以看到是直接使用了 `earth-texture` 的纹理图片，`earth-silhouette` 是地球轮廓，为纯色，`u_baseColorFactor: 1.0 0.5 0 1.0` 相当于 `rgba(255, 128, 0, 1)`。

从代码里我们可以看出，关于材质的一些概念的关系：`material`（材质）代表了物体表面各项指标，`texture`（材质）是他的一个属性，表示表面的样子是图片、纯色还是我们上节说的视频等。

2. 定义 mesh

```xml
<xr-mesh
  node-id="mesh-earth" geometry="sphere" material="earth-mat"
  bind:touch-shape="handleTouchEarth" bind:untouch-shape="handleUntouchEarth"
  bind:drag-shape="handleEarthRotation">
</xr-mesh>
<xr-mesh node-id="earth-silhouette" geometry="sphere"
  material="earth-silhouette" visible="{{touchingEarth}}">
</xr-mesh>
```

可以看到两个 `mesh` 分别关联了之前定义的 `material`，`mesh-earth` 还定义了三个事件，`earth-silhouette` 绑定了 `visible `到 `touchingEarth` 变量上。

我们通过定义各事件函数就可以处理用户交互了

3. 定义各事件函数

`touch-shape`、`untouch-shape`相当于`touchstart`和`touchend`，在对应的处理函数里只是将`touchingEarth`置为`true/false`，`earth-silhouette`通过他来显示/隐藏

我们重点看下`drag-shape`的处理函数

```js
handleEarthRotation: function({detail}) {
  const { target, deltaX } = detail.value;
  target._components.transform.rotation.y += deltaX / 100;
}
```

其实也就两行，函数接收一个 event 参数包含 detail 属性，其中有 target 表示拖动的 mesh，deltaX 表示拖动的距离（指用户手指在屏幕上划过的距离）

之后将 rotation.y 改一下就行了，这里 deltaX / 100 也是一个很随意的计算，真实的效果滚动是不跟随手指的，只是拖动的距离跟滚动的角度正相关罢了

detial 的详细属性：https://developers.weixin.qq.com/miniprogram/dev/api/xr-frame/interfaces/IShapeDragEvent.html

4. 事件原理
   看到这里不由得产生一个问题：用户的操作是在手机屏幕上，而又如何将屏幕平面上的操作映射到手机内的三维空间呢？

这就需要理解一下事件的实现原理了：我们在屏幕上的点击可以认为是从照相机出发射向三维内某点的射线，这个点是屏幕平面上的点到三维空间的映射，而射线经过的 mesh 可以认为是被我们点中的。

在 threejs 官方的 demo（https://github.com/mrdoob/three.js/blob/dev/examples/webgl_interactive_cubes.html）里可以看到实现代码：

首先创建一条射线

```js
raycaster = new THREE.Raycaster();
```

之后绑定鼠标事件

```js
document.addEventListener( 'mousemove', onPointerMove );
...
function onPointerMove( event ) {
  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}
```

这里可以看到手机屏幕上的点是怎么映射到三维空间的：

首先将记原点(0, 0)为屏幕正中间点，0.5 屏幕宽度为 x 轴的 1 单位长度，则点击位置的 x 坐标为：

x 真实坐标 clientX 向左偏移（也就是减少）0.5innerWidth，即 clientX-0.5innerWidth，再除以单位长度 0.5innerWidth 即 clientX/(0.5innerWidth)-1=2\*clientX/innerWidth-1

也就是代码的`( event.clientX / window.innerWidth ) * 2 - 1`，`y`坐标同理，只不过换了个方向，相当于数值取反

之后向这个点发射射线，可以得到射线穿过的物体 intersects：

```js
raycaster.setFromCamera(pointer, camera);
const intersects = raycaster.intersectObjects(scene.children, false);
```

如果以上的部分你看懂了，可以继续看下月球的处理，需要一定的数学知识

5. 月球的处理
   先看下需求：

1).月球的拖动不是旋转，而是在赤道平面上自由定位（y 不变）

2).不能移动到地球里，也不能移动出最大距离

3).月球会绕着地球公转，但在拖动时不公转

那么在拖动过程中如何计算月球的位置？

先看下官方给出的代码：

拖动的处理函数：

```js
handleDragMoon: function({detail}) {
  const { dir, target, camera } = detail.value;
  const cameraPos = camera.el._components.transform.worldPosition;
  const k = -cameraPos.y / dir[1];
  const x = cameraPos.x + k * dir[0];
  const z = cameraPos.z + k * dir[2];
  const len = Math.sqrt(x * x + z * z);
  if (len > this.data.innerRing) {
    const transform = target._components.transform;
    const scale = len > this.data.outerRing ? this.data.outerRing / len : 1.0;
    transform.position.x = x * scale;
    transform.position.z = z * scale;
  }
}
```

`dir`是指从`camera`投射出的射线的单位向量，即我们刚才所说射线的单位向量，这个向量可以直接在 raycaster 中拿到，xrframe 也直接提供给了我们

有了直线向量(记为`(a, b, c)`)，又已知射线经过照相机（即知直线上一点记为(cX, cY, cZ)），可以确定直线方程：

`(x - cX) / a = (y - cY) / b = (z - cZ) / c`

由需求知，月球 y 固定（为 0），则求月球坐标（记为(mX, 0, mZ)）即为求该射线与平面 y=0 的交点，则有：

`(mX - cX) / a = - cY / b`

即 `mX = (- cY / b) * a + cX`

其中 `- cY / b`为代码的 `k = -cameraPos.y / dir[1];`

`mX`为代码的 `x = cameraPos.x + k * dir[0];`

求`mZ`同理

但还有需求 2 不能移动到地球里，也不能移动出最大距离，因此在交点距离原点距离大/小于一定值时需要修正：

交点距离原点距离为：`len = Math.sqrt(x * x + z * z)`;

则 `len` 比如大于最小值`（len > this.data.innerRing）`才处理，否则不改变月球位置

如果 `len` 大于最大值（`len > this.data.outerRing）`，会等比例缩放（`this.data.outerRing / len）`保证月球不会超过出这个最大半径范围

否则为交点原坐标`（scale = 1.0）`

最后改变月球坐标 `transform.position.x = x * scale`

需求 3 就比较简单了代码如下：

```js
handleTick: function({detail}) {
  if (this.data.touchingMoon || !this.scene) return;
  const deltaTime = detail.value;
  const moon = this.scene.getNodeById("mesh-moon");
  const transform = moon.el._components.transform;
  const x = Math.cos(this.data.θ) * this.data.r;
  const z = Math.sin(this.data.θ) * this.data.r;
  transform.position.x = x;
  transform.position.z = z;
  transform.rotation.y -= this.data.ω * deltaTime;
  this.setData({
    θ: this.data.θ + this.data.ω * deltaTime
  });
}
```

只说一个点：`handleTick`是`scene`提供的`bind:tick`的事件回调

```xml
<xr-scene id="xr-scene" bind:tick="handleTick" bind:ready="handleReady"></scene>
```

他会每帧执行一次，相当于浏览器的 requestAnimationFrame

## 显示和图层

本文讲解 demo：[基础案例/显示和图层](https://github.com/dtysky/xr-frame-demo/tree/master/miniprogram/pages/scene-basic-visible-layer)，对应官方小程序（名字：小程序示例）的交互动画/xrframe/基础案例/显示和图层

控制节点是否展示有两种办法：

1. `visible`属性

这种方法简单粗暴，传入 true/false 即可控制显隐

```xml
<xr-node visible="{{visibleIndex === 2}}">
  <xr-mesh node-id="mesh-cube" geometry="cube"></xr-mesh>
</xr-node>
```

注意：

1). visible=false 时 node 内的子节点也会被隐藏，即使其 visible=true

2). 此属性可以在 xr-node、xr-mesh、xr-light 上使用，light 隐藏效果为不发光

2. layer 属性

xrframe 中可以设置 32 个 layer，每个 node 都可以关联到一个 layer 上，通过控制 camera 的 cull-mask 属性，来决定某个 layer 显不显示

demo 中效果如下：

球体和圆柱体是用过 layer 来控制显隐的，代码如下：

```xml
<xr-node layer="1">
  <xr-mesh geometry="sphere" ></xr-mesh>
  <xr-node layer="2">
    <xr-mesh geometry="cylinder"></xr-mesh>
  </xr-node>
</xr-node>
```

layer 的值只能为 2^n，0<=n<=31，n 为几就说明这个元素与第几个 layer 关联。如 layer=1 表示第 0 个 layer，layer=2 表示第 1 个 layer，layer=4 表示第 2 个 layer......

之后控制 camera 的`cull-mask`：

```xml
<xr-camera
  target="camera-target" cull-mask="{{cullMask}}"
></xr-camera>
```

`cull-mask`可以接受 32 位无符号整数，其中每一位表示一个`layer`是否展示。
某个 node 是否展示，要看他和他所有父组件的`layer`是否在`cull-mask`中的对应位是 1。
如代码中的圆柱（cylinder）要展示，需要`cullMask & 2 === 1 && cullMask & 1 === 1`，即`cullMask`的第 1 位和第 2 位都是 1。

此属性可以在`xr-node`、`xr-mesh`、`xr-light`上使用

## 动态节点

本文讲解 demo：[基础案例/动态节点](https://github.com/dtysky/xr-frame-demo/tree/master/miniprogram/pages/scene-basic-shadow)，对应官方小程序（名字：小程序示例）的交互动画/xrframe/基础案例/动态节点

本案例主要展示了如何通过 js 代码来控制增加和删除节点，效果如下：

点击增加按钮会在随机位置新增一个头盔，减少按钮则删除上一个增加的头盔

wxml 的代码非常少，只定义了`xr-shadow`节点

```xml
<xr-scene>
  <xr-shadow id="shadow-root"></xr-shadow>
</xr-scene>
```

`xr-shadow`专门为了解决动态创建/删除节点，类似 html 的`shadowroot`，节点的增加删除都必须在`xr-shadow`节点内完成，只有`xr-shadow`才有`addChild`和`removeChild`方法。

js 代码主要分为三个部分

1. 初始化场景，这里主要初始化了天空盒和相机，并加载了头盔的 gltf

```js
const xrFrameSystem = wx.getXrFrameSystem();
this.shadowRoot = scene.getElementById("shadow-root");
const { value: envData } = await scene.assets.loadAsset({
  type: "env-data",
  assetId: "env1",
  src: "***/env-test.bin",
});
const envElement = scene.createElement(xrFrameSystem.XREnv);
this.shadowRoot.addChild(envElement);
const envComp = envElement.getComponent(xrFrameSystem.Env);
envComp.setData({ envData: envData });
```

这里首先加载了天空盒的 envData，之后通过 createElement 创建了 XREnv（即 xr-env），在把他 addChild 到 shadowRoot 里，最后修改节点的 envData 属性，赋值为加载的天空盒数据

这里可以看到动态添加节点的几个步骤：

1). scene.createElement 创建节点 el
2). shadowRoot.addChild 加入到 shadowRoot 中
3). el.getComponent 对新节点的属性进行修改

相机和头盔的动态添加也是类似的，只不过设置的属性不一样：

// 头盔

```js
const { value: model } = await scene.assets.loadAsset({
  type: "gltf",
  assetId: "damage-helmet",
  src: "***/index.glb",
});
const gltfComp = gltfElement.getComponent(xrFrameSystem.GLTF);
gltfComp.setData({ model: model });
```

// 相机

```js
cameraElement.getComponent(xrFrameSystem.Transform).position.setValue(0, 0, 9);
cameraElement.getComponent(xrFrameSystem.Camera).setData({
  target: gltfElement.getComponent(xrFrameSystem.Transform),
  background: "skybox",
});
cameraElement.addComponent(xrFrameSystem.CameraOrbitControl, {});
```

2. 增加一个头盔

与上面说的三步一样，只不过头盔的 gltf 已经加载过了，可以直接使用缓存

```js
const gltfElement = this.scene.createElement(xrFrameSystem.XRGLTF);
this.shadowRoot.addChild(gltfElement);
gltfElement.getComponent(xrFrameSystem.Transform).position.setArray(pos); // 随机的位置
gltfElement.getComponent(xrFrameSystem.GLTF).setData({ model: this.gltfModle }); // 缓存到this上的asset
```

3. 删除一个头盔

删除只需要调用`shadowRoot`的`removeChild`方法，传入其子节点

```js
const element = this.meshList.pop();
if (element) {
  this.shadowRoot.removeChild(element);
}
```

注意：`shadowRoot`的`removeChild`只是将其从`shadowRoot`中移除，并没有将其卸载，我们可以将此节点重新加入`shadowRoot`，或者手动 release，避免内存泄露问题

## 渲染目标

本文讲解 demo：[基础案例/渲染目标](https://github.com/dtysky/xr-frame-demo/tree/master/miniprogram/pages/scene-basic-render-texture)，对应官方小程序（名字：小程序示例）的交互动画/xrframe/基础案例/渲染目标

先看下 demo 效果

前面的三个物体是场景中真实的 mesh，在后面有一个平面，绘制了从某个角度去看三个物体的样子

这种效果相当于在某个 mesh 上绘制场景中真实的视觉效果，如实现一个镜子或者在一个电视机上播放当前场景内的真实物体，都可以用这个 RenderTexture 来实现

demo 的实现代码如下：

1. 定义一个资源：`xr-asset-render-texture`，属性需要 id 和高宽

```xml
<xr-asset-render-texture asset-id="rt" width="2048" height="1024" />
```

2. 定义三个物体，注意需要定义 layer 属性，简化代码如下

```xml
<xr-node layer="1">
  <xr-mesh geometry="cube"/>
  <xr-mesh geometry="sphere" />
  <xr-mesh geometry="cylinder"/>
</xr-node>
```

3. 定义平面，注意需要定义 layer 属性，uniforms 属性需为 u_baseColorMap:render-rt，其中 rt 是上面 xr-asset-render-texture 的 id，简化代码如下

```xml
<xr-node layer="2">
  <xr-mesh geometry="plane" uniforms="u_baseColorMap:render-rt"/>
</xr-node>
```

4. 定义相机 1，需要设置 render-target 属性为 rt，也就是 xr-asset-render-texture 的 id，cull-mask 需要设置为只绘制 layer1

```xml
<xr-camera render-target="rt" cull-mask="0b001"/>
```

此时，屏幕就会渲染相机 1 所看到的内容

5. 定义相机 2，绘制用户真实看到的效果

```xml
<xr-camera cull-mask="0b111" camera-orbit-control=""/>
```

如果想让 RenderTexture 绘制的视觉角度变化，只需要改变相机 1 的位置和朝向即可

如要实现真实的镜子效果，相机 1 需要始终以平面为轴，出现在相机 2 轴对称的位置，角度始终朝向镜子平面 mesh 的位置

除了用`xr-asset-render-texture`标签，也可以用 js 创建：

```js
const rt = scene.createRenderTexture({ width: 2048, height: 2048 });
scene.assets.addAsset("render-texture", "rt", rt);
```

## 粒子系统

本文讲解 demo：[基础案例/渲染目标](xr-frame-demo/miniprogram/pages/scene-basic-particle at master · dtysky/xr-frame-demo)，对应官方小程序（名字：小程序示例）的交互动画/xrframe/基础案例/粒子系统

粒子系统是一套标准化的实现粒子效果的系统，他可以通过定义参数的形式，来描述粒子的各种效果。他具有：

通用性：粒子系统在很多引擎、框架内都有支持，同一套参数在不同框架内的效果应该是相同的。
多样性：粒子系统支持的参数非常多，能做出非常多不同的效果，下雪、火焰、烟花都是常见的粒子效果。
可以看下官方 demo 给出的效果，这几种都是粒子系统能实现的效果，只是参数不同：

要实现粒子系统分以下几步：

1. 引入 asset

这里主要关注引入的两个图片资源：

```xml
<xr-asset-load type="texture" asset-id="particle-texture" src="https://.../point.png" />
<xr-asset-load type="texture" asset-id="lightray" src="https://.../lightray.png" />
```

是用做粒子系统的圆点和光线的贴图，图片如下：

2. 使用 xr-particle 标签

支持非常多的属性，比较常用的有 start/end-color 初始/结束颜色、capacity 最大粒子数、speed 粒子速度、size 大小、texture 贴图等，这里列举 demo 中的一个示例：

```xml
<xr-particle
  position="2 1 2"
  start-color="0 1 0 1"
  end-color="1 1 0 1"
  capacity="1000"
  speed="-5"
  size="0.1 0.2"
  emit-rate="80"
  life-time="0.2 0.4"
  angle="0 360"
  angular-speed="-300"
  emitter-type="SphereShape"
  emitter-props="radius:1.5"
  texture="particle-texture">
</xr-particle>
```

详细的属性可以参考：https://developers.weixin.qq.com/miniprogram/dev/component/xr-frame/particles/

3. 发射器

发射器决定了粒子随机生成的范围和分布

发射器由属性 emitter-type 指定，目前支持：

- PointShape 点状发射器：粒子从一个点生成
- SphereShape 球形发射器：粒子在一个球体内生成
- BoxShape 箱形发射器：粒子在一个长方体内生成
- ConeShape 锥形发射器：粒子在一个锥体内生成
- CircleShape 圆形发射器：粒子在一个圆形内生成

每个发射器有不同的属性，由 emitter-props 指定，具体参考：https://developers.weixin.qq.com/miniprogram/dev/component/xr-frame/particles/emiter.html

4. 自定义发射器

发射器主要是用于定义每一个粒子的各项属性，比如位置、颜色、大小等

首先获取粒子节点，并创建发射器，这里 demo 以 BoxShape 为例：

```js
const particle = xrScene.getElementById("human-face");
// 设置箱型发射器的发射方向，与粒子初始位置范围
particle
  .getComponent(xrFrameSystem.Particle)
  .createBoxEmitter(/**参数为四个三维向量**/);
```

之后要实现 particleEmitte 的 processInstance 方法，对每一个粒子实例 instance 的属性进行修改

```js
particle.getComponent(xrFrameSystem.Particle).particleEmitter.processInstance = (instance, deltaTime)=> {
    // instance：粒子实例，deltaTime与上一次调用的时间差
    instance.position.x = ...
    instance.color.w = ...
};
```

processInstance 会由系统不断的间隔一定时间调用（类似于 requestAnimationFrame），当设置 instance.age = instance.lifeTime 时停止调用

我们需要在每次调用中计算 instance 的各项属性，比如 instance.position.x += 0.1 表示粒子每次移动 0.1

一般而言，position 需要增加一些随机数，让粒子随机的在区域内生成，分布可以由我们自己控制

5. 内置动画

除了自己编程实现发射器外，xrframe 内置了一些动画效果，可以方便快速的开发一些动画：

例如：particleComponent 的 addRampGradient 方法支持粒子变色：

```js
particleComponent.useRampGradient = true;
particleComponent.addRampGradient(0.0, Vector3.createFromNumber(1, 1, 1));
particleComponent.addRampGradient(
  0.5,
  Vector3.createFromNumber(0.8, 0.8, 0.05)
);
particleComponent.addRampGradient(
  1.0,
  Vector3.createFromNumber(0.86, 0.5, 0.05)
);
```

首先设置 useRampGradient 为 true，之后定义颜色变化，类似于 css 的 keyframe，以上代码定义了 0、0.5、1s 时的颜色

类似的方法还有：

addColorRemapGradient 设置透明度、addSizeGradient 设置大小、addColorGradient 设置带透明度颜色的变化、addAlphaGradient 透明度变化、addSpeedScaleGradient 速度变化

6. 渲染模式 RenderMode

xr-particle 的 render-mode 属性决定粒子的朝向，默认是粒子（z 轴）永远对着屏幕，可以设置的值还有：

- y: Y 轴渲染模式，粒子 Y 轴将锁定, 其它轴的显示正对屏幕
- stretched: 拉伸渲染模式，将附带一些旋转，使粒子朝向其运动方向
- mesh: 粒子将以指定网格渲染，与粒子系统中的 mesh 字段搭配

7. 动画粒子

除了单张图片，粒子还支持帧动画（图集 atlas）

```xml
<xr-asset-load
  type="atlas"
  asset-id="atlas"
  src="/path/to/atlas.json"
/>
<xr-particle
  atlas="particle-atlas"
  atlas-frames="frame-name"
  atlas-speed="4"
  atlas-random="true"
  atlas-loop="true">
</xr-particle>
```

首先引入 type 为 atlas 的 asset，之后在 xr-particle 上指定 atlas 属性及图集的其他各项属性

8. 子发射器

子发射器可以实现烟花的效果，即一个粒子灭亡时，使用子发射器产生新粒子

子发射器的构建与发射器构建基本一致，可以设置上述发射器的各种属性，代码如下：

```js
const subEmitter = this.createSubEmitter(option); // option为发射器属性json
subEmitter.state = SubEmitterState.ATTACH;
//可以规定多个子发射器的阵列
particleComponent.subEmitters = [subEmitter];
```

subEmitter.state 可以设置两种：

- SubEmitterState.ATTACH：在父粒子产生时产生子粒子
- SubEmitterState.END：在父粒子灭亡时产生子粒子

## 后处理

本文讲解 demo：[基础案例/后处理](https://github.com/dtysky/xr-frame-demo/tree/master/miniprogram/pages/scene-basic-postprocessing)，对应官方小程序（名字：小程序示例）的交互动画/xrframe/基础案例/后处理

对于一些直接作用于相机的效果，比如水滴落到镜头上、被闪光弹闪白、眩晕/模糊的镜头效果，都可以用后处理实现，下面是 demo 给出的一些后处理效果：

模糊 blur：

渐晕 vignette:

泛光 bloom：

抗锯齿 fxaa:

1. 后处理可以用两种方式实现：

1). xr-asset-post-process 标签，后处理的参数在 data 属性传入：

```xml
<xr-asset-post-process asset-id="blur" type="blur" is-hdr data="radius:10" />
```

2). 代码创建，后处理的参数在 data 中传入：

```js
scene.assets.addAsset('post-process', 'vignette', scene.createPostProcess({
  type: 'vignette',
  isHDR: false,
  data: {
    intensity: 0,
    smoothness: 2,
    color: [0 0 0 1]
  }
}));
```

2. 在相机的 post-process 属性中关联 id：

```xml
<xr-camera
  ......
  post-process="blur vignette"
/>
```

可以传入多个后处理

3. 后处理目前只开放了内置的几种效果，具体参数可以参考官方文档：

模糊 blur/fastblur：blur 效果好但性能低，fastblur 性能高适用于模糊半径经常变化的场景

泛光 bloom：发光体会有一个外发光效果

色调映射 tone：是在使用 hdr 时的一种辅助渲染效果，当图片中明暗跨度很大时，过暗或过亮地方的细节会丢失，使用 hdr 的色调映射可以尽可能的保留这些细节，可以简单理解为我们从一个很亮的地方突然进入一个很暗的地方，一开始是看不清暗处的细节的，经过眼睛慢慢调整，能看到暗处的细节

渐晕 vignette：边缘有蒙层，中间蒙层渐渐变透明

抗锯齿 fxaa

4. 修改参数，不同的后处理接受不同的参数，可以用代码改变：

```js
const blur = scene.assets.getAssets("post-process", "blur");
blur.data.radius = 20;
```

也可以使用我们之前介绍过的帧动画来实现：

```json
"keyframe": {
  "blur": {
    "0": {
      "asset-post-process.assetData.radius": 10
    },
    "100": {
      "asset-post-process.assetData.radius": 64
    }
  }
},
```

即后处理的属性也可以在帧动画中逐帧改变

5. hdr

泛光 bloom 和色调映射 tone 需要配合 hdr 来使用，这里简单介绍一下什么是 hdr

图像的质量由以下五项决定：

分别是：

1. 分辨率
2. 位深
3. 帧率
4. 色域
5. 亮度

其中亮度就分为：sdr（Standard Dynamic Range Imaging）和 hdr（High Dynamic Range Imaging），表示图像显示的照明强度的范围。sdr 的设备显示的亮度范围较低，因此过亮和过暗（超过显示范围）处只能显示为纯白或纯黑，细节会丢失，hdr 的设备能支持更大范围的亮度，因此也就能保留更多的图像细节

## gltf

本文讲解 demo：gltf 案例：

官方给出的代码示例大同小异，这里统一讲解，对应官方小程序（名字：小程序示例）的交互动画/xrframe/gltf 案例，代码为：

https://github.com/dtysky/xr-frame-demo/tree/master/miniprogram/pages/scene-gltf-damageHelmet
https://github.com/dtysky/xr-frame-demo/tree/master/miniprogram/pages/scene-gltf-unlit
https://github.com/dtysky/xr-frame-demo/tree/master/miniprogram/pages/scene-gltf-light-loading
https://github.com/dtysky/xr-frame-demo/tree/master/miniprogram/pages/scene-gltf-animation
https://github.com/dtysky/xr-frame-demo/tree/master/miniprogram/pages/scene-gltf-morph

1 .gltf 是目前使用广泛的一种 3d 模型文件类型，他能将节点、材质、相机、动画、纹理等一些列资源全部打包进一个文件，大大方便了使用，甚至可以在 3d 建模软件内将完整的场景全部创建好，直接在代码使用

2. 要使用 gltf 模型，首先需要用 asset 引入

```xml
<xr-asset-load type="gltf" asset-id="gltf-damageHelmet" src=".../index.glb" />
```

之后通过 xr-gltf 标签来使用

```xml
<xr-gltf node-id="gltf-damageHelmet" model="gltf-damageHelmet"></xr-gltf>
```

demo 效果如下：

3. xr-gltf 标签有三个属性和一个事件：

- model：对应 asset-id
- cast-shadow：是否产生阴影
- receive-shadow：是否接收阴影
- gltf-loaded：渲染完毕事件

4. 代码控制 gltf：

gltf 组件提供了两个方法，可以获取到模型内部的 mesh：

- getPrimitivesByNodeName：在模型内的目标 node 内，查找其内部的所有 mesh，接受一个参数，为目标 node 的 name 属性值
- getPrimitivesByMeshName：在模型内查找所有目标 mesh，接受一个参数，为目标 mesh 的 name 属性值

获取到 mesh 之后可以修改其属性：

```js
const gltf = el.getComponent("gltf");
for (const mesh of gltf.getPrimitivesByNodeName("...")) {
  mesh.material.setTexture("u_baseColorMap", ...);
}
```

5. gltf 动画：

包含动画的模型，会自动在 xr-gltf 元素内创建一个 Animator 组件

可以使用代码来控制这个组件：

```js
const gltf = el.getComponent("gltf");
el.getComponent("animator").play("idle");
```

其中 idle 是动画名，对应 .gltf 文件中 animations 中的 name 属性

也可以 xr-gltf 标签上添加 anim-autoplay 属性，将自动播放模型内的所有动画

xr-gltf 也可以被嵌套在父元素中，在父元素上添加动画，模型也会跟着父元素一起运动：

```xml
<xr-asset-load asset-id="anim" type="keyframe" src=".../animation.json"/>
<xr-node anim-keyframe="anim" anim-autoplay="clip:parent">
  <xr-node anim-keyframe="anim" anim-autoplay="clip:child">
    <xr-gltf model="miku-kawaii" anim-keyframe="anim" anim-autoplay></xr-gltf>
  </xr-node>
</xr-node>
```

paren 和 child 定义在 animation.json 中，分别为上下运动和旋转，子元素 xr-gltf 也会跟着一起上下、旋转运动

6. .gltf 文件与.glb 文件

这两种都为 gltf 文件格式，glb 是二进制文件，是将所有数据都打包到一起的文件，可以完全独立使用

gltf 是 json 或 ascii 文件，有两种情况：

1. 将所有数据都打包为一个文件，则 gltf 将包含 glTF JSON 和 base64 之后的二进制资源文件（如图片）
2. 只包含 glTF JSON，其他二进制文件分开打包，则会有多个文件，这些文件需要保持相对路径不变一起使用

## AR

xrframe 对 ar 的使用进行了非常多的简化，只需要简单的几步就可以开发一个带有 ar 能力的小程序，并且还能支持图像、手势、平面识别等 ar 中常用的 AI 能力。
demo 效果如下：

本文讲解 demo：AR 案例：

官方给出的代码示例大同小异，这里统一讲解，对应官方小程序（名字：小程序示例）的交互动画/xrframe/gltf 案例，代码为：
https://github.com/dtysky/xr-frame-demo/tree/master/miniprogram/components/xr-ar-basic
https://github.com/dtysky/xr-frame-demo/tree/master/miniprogram/components/xr-ar-camera
https://github.com/dtysky/xr-frame-demo/tree/master/miniprogram/components/xr-ar-2dmarker
https://github.com/dtysky/xr-frame-demo/tree/master/miniprogram/components/xr-ar-osdmarker
https://github.com/dtysky/xr-frame-demo/tree/master/miniprogram/components/xr-ar-face
https://github.com/dtysky/xr-frame-demo/tree/master/miniprogram/components/xr-ar-hand
https://github.com/dtysky/xr-frame-demo/tree/master/miniprogram/components/xr-ar-body

以下讲解实现方案：

1. 在真实世界上渲染：

1). 在 xr-scene 标签上增加 ar-system 属性，值为 camera:Back：

```xml
<xr-scene ar-system="camera:Back">
```

camera 表示使用手机的前置（Front）还是后置（Back，默认）摄像头

2). 在 xr-camera 标签增加 background 属性，值为 ar：

```xml
<xr-camera ... background="ar"/>
```

这样 camera 在渲染背景时就会使用手机摄像头拍摄到的图像：

demo 效果如下：中间的桌子是个 gltf 节点，场景背景是摄像头拍到的真实世界

2. 使用 AI 能力：

在真实世界上渲染只是 ar 的最基础一步，想要做出有趣的 ar 小程序，还需要借助 AI 的识别能力，识别真实世界中的物体并与之交互，目前 xr-frame 提供了一些直接可用的 AI 识别能力：

1). 平面识别：

可以根据摄像头拍摄到的真实世界，识别出桌面、地面等平面，并可以将一个元素放在这个平面上，元素会根据手机的移动在平面上移动，并保持近大远小的效果

demo 效果如下：

实现方法：

在 xr-scene 标签的 ar-system 属性中，增加 modes:Plane

```xml
<xr-scene ar-system="modes:Plane">
```

之后使用 xr-ar-tracker 标签，声明 mode 为 Plane，子节点为需要在平面上移动的元素

```xml
<xr-ar-tracker mode="Plane">
  <xr-gltf model="anchor"></xr-gltf>
</xr-ar-tracker>
```

最后在 xr-camera 上增加 is-ar-camera 属性，此时相机的各参数将由 AR 系统自动控制

```xml
<xr-camera ... background="ar" is-ar-camera>
```

注意：增加 is-ar-camera 后不能用 js 修改相机的属性，否则会和系统的控制冲突

xr-frame 还提供了两个方法，供开发更多交互能力：

```js
scene.ar.placeHere(nodeId | element, switchVisible);
scene.ar.resetPlane();
```

placeHere 将一个元素放到平面上，随着摄像头移动（如前进或后退），元素会相对固定在平面的放置位置

resetPlane 将放置的元素清除

2). 2D Marker、OSD Marker：

Marker 是事先给出的一个识别物（比如苹果），在识别到一个 marker 时，实时计算出这个 marker 的位置，这样就可以根据该位置来渲染元素，从而与真实世界同步，如：在苹果上渲染两个眼睛，摄像头移动时，眼睛始终在苹果上

2D Marker 与 OSD Marker 的区别在于二者使用的识别算法不一样，2D Marker 在 marker 旋转的时候，渲染的元素也会跟着旋转，但 OSD Marker 则不会旋转

demo 效果如下：我拍了一张我杯盖的照片，再去识别杯盖

实现方法：

在 xr-scene 的 ar-system 上设置 modes:Marker 或 OSD

```xml
<xr-scene ar-system="modes:Marker">
```

使用 xr-ar-tracker，声明 mode 为 Marker 或 OSD，并传入 marker 图片的地址

```xml
<xr-ar-tracker mode="Marker" src="***.png">
  <xr-gltf model="gltf" .../>
</xr-ar-tracker>
```

src 可以传入绝对路径，也可以传入临时文件路径（wx.chooseMedia 的回调）

子元素（就是 demo 上的三个蝴蝶）是以 marker 位置为基准来偏移的

注意，camera 元素依然要有 background="ar"和 is-ar-camera 属性

3). 人脸、手势、躯体识别

人脸、手势、躯体的识别方式都是根据特征点来识别的，下面以人脸为例说明

xr-frame 会识别出人脸的上百个特征点，通过这些特征点，可以判断人脸的位置、五官的位置甚至是表情等微观细节

以下是一个特征点的示例：

我们可以将元素绑定到某个特征点上，在特征点移动时元素将会跟着移动：

```xml
<xr-ar-tracker mode="Face" auto-sync="-1 105 104 45 98">
  <xr-node name="face"><xr-mesh .../></xr-node>
  <xr-node name="eyeL"><xr-mesh .../></xr-node>
  <xr-node name="eyeR"><xr-mesh .../></xr-node>
  <xr-node name="nose"><xr-mesh .../></xr-node>
  <xr-node name="mouth"><xr-mesh .../></xr-node>
</xr-ar-tracker>
```

xr-ar-tracker 的 mode 需要为 Face，auto-sync 代表了其子元素应该绑定到哪个特征点上，-1 表示不绑定，如第二个元素 eyeL 会被绑定在 105 特征点上，位置大致在左眼，效果如下：

3. 编程接口

除此之外，xrframe 还提供了接口来方便开发更多交互功能：

```js
const trackerEl = this.scene.getElementById("tracker");
const tracker = trackerEl.getComponent(xrSystem.ARTracker);

// 获取某特征点位置
// 第一个参数是特征点编好
// 第二个参数可选，传入一个Vector3，会将结果放入其中
// 第三个参数可选，返回的坐标否相对于`ARTracker`，false为返回绝对坐标
const position = tracker.getPosition(98, new xrSystem.Vector3(), true);

// 获取手势姿态，详见官网
const gesture = tracker.gesture;

// 获取总体置信度
const score = tracker.score;
```

4. tracker 的状态

由于识别需要一定的时间，因此在实时度要求高的场景下，需要判断 tracker 的状态（已识别/识别中/失败）来进行编程

xr-ar-tracker 标签支持两种事件：

1. ar-tracker-state： 状态改变时触发，事件回调的参数：ARTracker 实例，包括了识别状态、错误信息

2. ar-tracker-switch：简化的事件，只有识别到了和未识别到两种状态

绑定事件有两种方式，第一种是绑定到标签的属性

```xml
<xr-ar-tracker ... bind:ar-tracker-state="handleARTrackerState">
```

第二种是在代码里绑定，注意这里需要在 scene 的 ar-ready 触发事件后绑定

```xml
<xr-scene ... bind:ar-ready="handleARReady">
```

```js
handleARReady({detail}) {
  const tracker = this.scene.getElementById('ar-tracker').getComponent(xrFrameSystem.ARTracker);
  tracker.el.event.add('ar-tracker-state', tracker => {
    const {state, errorMessage} = tracker;
  });
}
```
