# Cesium.js 动画示例

> Cesium.js 是一个强大的 3D 地球可视化库，本文档提供了常用的 Cesium.js 动画示例。更多基础概念请参考 [Cesium.js 动画基础](./cesium.md)。

## 目录

- [Cesium.js 动画示例](#cesiumjs-动画示例)
  - [目录](#目录)
  - [基础动画](#基础动画)
    - [1. 相机动画](#1-相机动画)
    - [2. 实体动画](#2-实体动画)
  - [高级动画](#高级动画)
    - [1. 路径动画](#1-路径动画)
    - [2. 粒子效果](#2-粒子效果)
  - [交互动画](#交互动画)
    - [1. 动态绘制](#1-动态绘制)

## 基础动画

### 1. 相机动画

::: tip 在线演示
- [CodePen 演示](https://codepen.io/fzx19980425/pen/vEOOvvp) - 点击查看完整示例
:::

::: details 代码实现
```html
<!-- 添加 Cesium 默认样式 -->
<link href="https://cesium.com/downloads/cesiumjs/releases/1.95/Build/Cesium/Widgets/widgets.css" rel="stylesheet">
```

```javascript
// 注意：需要在 CodePen 的 JS 设置中添加依赖：
// https://cesium.com/downloads/cesiumjs/releases/1.95/Build/Cesium/Cesium.js

// 设置 Cesium ion token
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiMzI4N2MwNC0zOTlmLTRlYzktODk1YS05NmY3ZDljZjM4ZDYiLCJpZCI6MjA0NTQyLCJpYXQiOjE3MTE0NDM2OTB9.Utv7Dq1s7-N7eH7sBaHmWArJuihYB8aJl9YPSndjdwY';

class CameraAnimation {
    constructor(container) {
        // 获取容器尺寸
        const width = container.clientWidth;
        const height = container.clientHeight;

        // 创建 Cesium Viewer
        this.viewer = new Cesium.Viewer(container, {
            terrainProvider: Cesium.createWorldTerrain(),
            animation: false,
            baseLayerPicker: false,
            fullscreenButton: false,
            geocoder: false,
            homeButton: false,
            infoBox: false,
            sceneModePicker: false,
            selectionIndicator: false,
            timeline: false,
            navigationHelpButton: false,
            imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
            }),
            skyBox: false,
            skyAtmosphere: false,
            contextOptions: {
                webgl: {
                    alpha: true
                }
            }
        });

        // 隐藏 logo
        this.viewer._cesiumWidget._creditContainer.style.display = "none";

        // 设置 canvas 大小
        const canvas = this.viewer.canvas;
        canvas.width = width;
        canvas.height = height;

        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            const newWidth = container.clientWidth;
            const newHeight = container.clientHeight;
            canvas.width = newWidth;
            canvas.height = newHeight;
            this.viewer.resize();
        });

        // 设置初始视角
        this.viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(116.3915, 39.9053, 15000000.0)
        });

        // 添加环绕状态控制
        this.isOrbiting = false;
        this.orbitHandler = null;

        // 添加动画控制按钮
        this.addAnimationControls();
    }

    addAnimationControls() {
        const toolbar = document.createElement('div');
        toolbar.className = 'toolbar';
        toolbar.style.position = 'absolute';
        toolbar.style.top = '10px';
        toolbar.style.left = '10px';
        toolbar.style.zIndex = '999';

        const flyToButton = document.createElement('button');
        flyToButton.textContent = '飞向北京';
        flyToButton.onclick = () => this.flyToBeijing();
        toolbar.appendChild(flyToButton);

        const orbitButton = document.createElement('button');
        orbitButton.textContent = '环绕飞行';
        orbitButton.onclick = () => this.toggleOrbit();
        toolbar.appendChild(orbitButton);

        this.viewer.container.appendChild(toolbar);
    }

    toggleOrbit() {
        if (this.isOrbiting) {
            // 如果正在环绕，则停止
            this.stopOrbit();
        } else {
            // 如果没有环绕，则开始
            this.orbitAnimation();
        }
    }

    stopOrbit() {
        if (this.orbitHandler) {
            // 移除事件监听器
            this.viewer.clock.onTick.removeEventListener(this.orbitHandler);
            this.orbitHandler = null;
        }
        this.isOrbiting = false;
    }

    flyToBeijing() {
        // 飞向北京的动画
        this.viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(116.3915, 39.9053, 1000.0),
            duration: 3,
            complete: () => {
                console.log('飞行完成');
            }
        });
    }

    orbitAnimation() {
        // 环绕飞行动画
        const center = Cesium.Cartesian3.fromDegrees(116.3915, 39.9053);
        const heading = Cesium.Math.toRadians(0);
        const pitch = Cesium.Math.toRadians(-45);
        const range = 5000.0;

        // 先飞到目标位置
        this.viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(116.3915, 39.9053, range),
            orientation: {
                heading: heading,
                pitch: pitch,
                roll: 0.0
            },
            duration: 2,
            complete: () => {
                // 开始环绕
                this.startOrbit(center, range);
            }
        });
    }

    startOrbit(center, range) {
        let heading = Cesium.Math.toRadians(0);
        
        // 创建环绕动画
        this.orbitHandler = () => {
            heading += Cesium.Math.toRadians(0.5);
            if (heading > Cesium.Math.TWO_PI) {
                heading = 0;
            }

            // 计算相机位置
            const position = Cesium.Cartesian3.fromDegrees(
                116.3915 + Math.cos(heading) * (range / 100000),
                39.9053 + Math.sin(heading) * (range / 100000),
                range
            );

            // 设置相机位置和朝向
            this.viewer.camera.setView({
                destination: position,
                orientation: {
                    heading: heading,
                    pitch: Cesium.Math.toRadians(-45),
                    roll: 0.0
                }
            });
        };

        // 添加事件监听器
        this.viewer.clock.onTick.addEventListener(this.orbitHandler);
        this.isOrbiting = true;
    }
}

// 初始化
const container = document.getElementById('cesiumContainer');
new CameraAnimation(container);
```
:::

::: details 预览效果
<div class="codepen" 
  data-height="300" 
  data-theme-id="dark" 
  data-default-tab="result" 
  data-user="fzx19980425" 
  data-slug-hash="vEOOvvp" 
  style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>查看 <a href="https://codepen.io/fzx19980425/pen/vEOOvvp">CodePen 示例</a> 获取完整效果</span>
</div>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
:::

::: tip 使用说明
1. 点击"飞向北京"按钮，相机会平滑飞行到北京上空
2. 点击"环绕飞行"按钮，相机会先飞到目标位置，然后开始环绕飞行
3. 支持鼠标交互：左键旋转、右键平移、滚轮缩放
4. 支持键盘控制：WASD 移动、QE 旋转
:::

### 2. 实体动画

::: tip 在线演示
- [CodePen 演示](https://codepen.io/fzx19980425/pen/gbppEpb) - 点击查看完整示例
:::

::: details 代码实现
```html
<!-- 添加 Cesium 默认样式 -->
<link href="https://cesium.com/downloads/cesiumjs/releases/1.95/Build/Cesium/Widgets/widgets.css" rel="stylesheet">
```

```javascript
// 注意：需要在 CodePen 的 JS 设置中添加依赖：
// https://cesium.com/downloads/cesiumjs/releases/1.95/Build/Cesium/Cesium.js

class EntityAnimation {
    constructor(container) {
        // 创建 Cesium Viewer
        this.viewer = new Cesium.Viewer(container, {
            terrainProvider: Cesium.createWorldTerrain(),
            animation: true,
            baseLayerPicker: false,
            fullscreenButton: false,
            geocoder: false,
            homeButton: false,
            infoBox: false,
            sceneModePicker: false,
            selectionIndicator: false,
            timeline: true,
            navigationHelpButton: false,
            shouldAnimate: true, // 添加这一行确保初始动画状态
            imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
            })
        });

        // 添加动画状态控制
        this.isAnimating = false;
        this.animationHandler = null;

        // 设置时钟
        this.setupClock();
        
        // 添加动画控制按钮
        this.addAnimationControls();

        // 设置初始视角
        this.viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(116.3915, 39.9053, 5000.0)
        });
    }

    setupClock() {
        const start = Cesium.JulianDate.fromDate(new Date());
        const stop = Cesium.JulianDate.addSeconds(start, 60, new Cesium.JulianDate()); // 缩短动画周期到60秒
        
        this.viewer.clock.startTime = start.clone();
        this.viewer.clock.stopTime = stop.clone();
        this.viewer.clock.currentTime = start.clone();
        this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
        this.viewer.clock.multiplier = 1; // 降低动画速度
        
        this.viewer.timeline.zoomTo(start, stop);
    }

    addAnimationControls() {
        const toolbar = document.createElement('div');
        toolbar.className = 'toolbar';
        toolbar.style.position = 'absolute';
        toolbar.style.top = '10px';
        toolbar.style.left = '10px';
        toolbar.style.zIndex = '999';

        // 添加动画按钮
        const startAnimationButton = document.createElement('button');
        startAnimationButton.textContent = '开始动画';
        startAnimationButton.id = 'startAnimationBtn';
        toolbar.appendChild(startAnimationButton);

        const stopAnimationButton = document.createElement('button');
        stopAnimationButton.textContent = '停止动画';
        stopAnimationButton.id = 'stopAnimationBtn';
        toolbar.appendChild(stopAnimationButton);

        this.viewer.container.appendChild(toolbar);

        // 使用 addEventListener 添加事件监听
        startAnimationButton.addEventListener('click', () => this.startAnimation());
        stopAnimationButton.addEventListener('click', () => this.stopAnimation());
    }

    addAnimatedEntities() {
        // 清除现有实体
        this.viewer.entities.removeAll();

        // 创建移动的点
        const movingPoint = this.viewer.entities.add({
            name: '移动的点',
            position: new Cesium.SampledPositionProperty(),
            point: {
                pixelSize: 15,
                color: Cesium.Color.YELLOW,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
        });

        // 创建移动的线 - 改为使用动态折线
        const movingLine = this.viewer.entities.add({
            name: '移动的线',
            polyline: {
                positions: new Cesium.CallbackProperty(() => {
                    // 获取当前时间
                    const currentTime = this.viewer.clock.currentTime;
                    const startTime = this.viewer.clock.startTime;
                    
                    // 计算当前时间与开始时间的秒数差
                    const seconds = Cesium.JulianDate.secondsDifference(currentTime, startTime);
                    
                    // 计算线的起点和终点
                    const startPos = Cesium.Cartesian3.fromDegrees(
                        116.3915 + Math.sin(seconds / 10) * 0.01,
                        39.9053 + Math.cos(seconds / 10) * 0.01,
                        1000
                    );
                    
                    const endPos = Cesium.Cartesian3.fromDegrees(
                        116.3915 + Math.sin((seconds + 1) / 10) * 0.01,
                        39.9053 + Math.cos((seconds + 1) / 10) * 0.01,
                        1000
                    );
                    
                    return [startPos, endPos];
                }, false), // false表示不经常更新
                width: 5,
                material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED),
                clampToGround: false
            }
        });

        // 添加位置采样
        const start = this.viewer.clock.startTime;
        const stop = this.viewer.clock.stopTime;
        
        // 设置点的位置
        for (let i = 0; i <= 60; i++) {
            const time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
            const position = Cesium.Cartesian3.fromDegrees(
                116.3915 + Math.sin(i / 10) * 0.01,
                39.9053 + Math.cos(i / 10) * 0.01,
                1000
            );
            movingPoint.position.addSample(time, position);
        }

        // 设置时钟范围
        this.viewer.clock.startTime = start.clone();
        this.viewer.clock.stopTime = stop.clone();
        this.viewer.clock.currentTime = start.clone();
        this.viewer.timeline.zoomTo(start, stop);

        // 开始播放动画
        this.viewer.clock.shouldAnimate = true;
    }

    startAnimation() {
        // 添加动画实体
        this.addAnimatedEntities();
        this.isAnimating = true;
        // 确保动画开始播放
        this.viewer.clock.shouldAnimate = true;
    }

    stopAnimation() {
        if (this.animationHandler) {
            this.viewer.clock.onTick.removeEventListener(this.animationHandler);
            this.animationHandler = null;
        }
        this.isAnimating = false;
        // 停止动画
        this.viewer.clock.shouldAnimate = false;
        // 清除所有实体
        this.viewer.entities.removeAll();
    }
}

// 初始化
const container = document.getElementById('cesiumContainer');
new EntityAnimation(container);

```
:::

::: details 预览效果
<div class="codepen" 
  data-height="300" 
  data-theme-id="dark" 
  data-default-tab="result" 
  data-user="fzx19980425" 
  data-slug-hash="gbppEpb" 
  style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>查看 <a href="https://codepen.io/fzx19980425/pen/gbppEpb">CodePen 示例</a> 获取完整效果</span>
</div>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
:::

::: tip 使用说明
1. 示例展示了两个动画实体：移动的点和移动的线
2. 使用时间轴控制动画播放
3. 可以调整动画速度
4. 支持暂停、继续、循环播放等控制
:::

## 高级动画

### 1. 路径动画

::: tip 在线演示
- [CodePen 演示](https://codepen.io/fzx19980425/pen/PwqqLQG) - 点击查看完整示例
:::

::: details 代码实现
```html
<!-- 添加 Cesium 默认样式 -->
<link href="https://cesium.com/downloads/cesiumjs/releases/1.95/Build/Cesium/Widgets/widgets.css" rel="stylesheet">
```

```javascript
// 注意：需要在 CodePen 的 JS 设置中添加依赖：
// https://cesium.com/downloads/cesiumjs/releases/1.95/Build/Cesium/Cesium.js

class PathAnimation {
    constructor(container) {
        // 创建 Cesium Viewer
        this.viewer = new Cesium.Viewer(container, {
            terrainProvider: Cesium.createWorldTerrain(),
            animation: true,
            baseLayerPicker: false,
            fullscreenButton: false,
            geocoder: false,
            homeButton: false,
            infoBox: false,
            sceneModePicker: false,
            selectionIndicator: false,
            timeline: true,
            navigationHelpButton: false
        });

        // 设置时钟
        this.setupClock();
        
        // 添加路径动画
        this.addPathAnimation();
    }

    setupClock() {
        const start = Cesium.JulianDate.fromDate(new Date());
        const stop = Cesium.JulianDate.addSeconds(start, 3600, new Cesium.JulianDate());
        
        this.viewer.clock.startTime = start.clone();
        this.viewer.clock.stopTime = stop.clone();
        this.viewer.clock.currentTime = start.clone();
        this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
        this.viewer.clock.multiplier = 60;
        
        this.viewer.timeline.zoomTo(start, stop);
    }

    addPathAnimation() {
        // 创建路径点
        const positions = [];
        for (let i = 0; i <= 360; i += 10) {
            positions.push(
                Cesium.Cartesian3.fromDegrees(
                    116.3915 + Math.sin(Cesium.Math.toRadians(i)) * 0.1,
                    39.9053 + Math.cos(Cesium.Math.toRadians(i)) * 0.1,
                    1000 + Math.sin(Cesium.Math.toRadians(i * 2)) * 500
                )
            );
        }

        // 创建路径线
        this.viewer.entities.add({
            name: '飞行路径',
            polyline: {
                positions: positions,
                width: 2,
                material: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.YELLOW
                })
            }
        });

        // 创建飞行器模型
        const aircraft = this.viewer.entities.add({
            name: '飞行器',
            position: new Cesium.SampledPositionProperty(),
            cylinder: {
                  length: 500.0,
                  topRadius: 0.0,
                  bottomRadius: 200.0,
                  material: Cesium.Color.RED,
                  outline: true,
                  outlineColor: Cesium.Color.WHITE
              },
            path: {
                resolution: 1,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.1,
                    color: Cesium.Color.YELLOW
                }),
                width: 10
            }
        });

        // 添加位置采样
        const start = this.viewer.clock.startTime;
        for (let i = 0; i < positions.length; i++) {
            const time = Cesium.JulianDate.addSeconds(
                start,
                i * 10,
                new Cesium.JulianDate()
            );
            aircraft.position.addSample(time, positions[i]);
        }

        // 设置相机跟随
        this.viewer.trackedEntity = aircraft;
    }
}

// 初始化
const container = document.getElementById('cesiumContainer');
new PathAnimation(container);
```
:::

::: details 预览效果
<div class="codepen" 
  data-height="300" 
  data-theme-id="dark" 
  data-default-tab="result" 
  data-user="fzx19980425" 
  data-slug-hash="PwqqLQG" 
  style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>查看 <a href="https://codepen.io/fzx19980425/pen/PwqqLQG">CodePen 示例</a> 获取完整效果</span>
</div>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
:::

::: tip 使用说明
1. 示例展示了一个沿路径飞行的 3D 模型
2. 使用时间轴控制动画播放
3. 相机自动跟随飞行器
4. 支持调整飞行速度
:::

### 2. 粒子效果

::: tip 在线演示
- [CodePen 演示](https://codepen.io/fzx19980425/pen/GgJJeXj) - 点击查看完整示例
:::

::: details 代码实现
```html
<!-- 添加 Cesium 默认样式 -->
<link href="https://cesium.com/downloads/cesiumjs/releases/1.95/Build/Cesium/Widgets/widgets.css" rel="stylesheet">
```

```javascript
// 注意：需要在 CodePen 的 JS 设置中添加依赖：
// https://cesium.com/downloads/cesiumjs/releases/1.95/Build/Cesium/Cesium.js

class ParticleEffect {
    constructor(container) {
        // 创建 Cesium Viewer
        this.viewer = new Cesium.Viewer(container, {
            terrainProvider: Cesium.createWorldTerrain(),
            animation: true,
            baseLayerPicker: false,
            fullscreenButton: false,
            geocoder: false,
            homeButton: false,
            infoBox: false,
            sceneModePicker: false,
            selectionIndicator: false,
            timeline: true,
            navigationHelpButton: false
        });

        // 设置时钟
        this.setupClock();
        
        // 添加粒子效果
        this.addParticleEffect();
    }

    setupClock() {
        const start = Cesium.JulianDate.fromDate(new Date());
        const stop = Cesium.JulianDate.addSeconds(start, 3600, new Cesium.JulianDate());
        
        this.viewer.clock.startTime = start.clone();
        this.viewer.clock.stopTime = stop.clone();
        this.viewer.clock.currentTime = start.clone();
        this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
        this.viewer.clock.multiplier = 60;
        
        this.viewer.timeline.zoomTo(start, stop);
    }

    addParticleEffect() {
        // 创建粒子贴图
        const particleCanvas = document.createElement('canvas');
        particleCanvas.width = 32;
        particleCanvas.height = 32;
        const context = particleCanvas.getContext('2d');
        
        // 绘制圆形渐变
        const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 32, 32);

        // 设置粒子系统位置（固定在北京上空）
        const position = Cesium.Cartesian3.fromDegrees(116.3915, 39.9053, 2000.0);
        const modelMatrix = Cesium.Matrix4.fromTranslation(position);

        // 创建粒子系统
        const particleSystem = this.viewer.scene.primitives.add(
            new Cesium.ParticleSystem({
                modelMatrix: modelMatrix,
                speed: 1.0,
                lifetime: 8.0,
                emitter: new Cesium.CircleEmitter(5.0),
                startScale: 5.0,
                endScale: 10.0,
                image: particleCanvas, // 使用 Canvas 作为粒子贴图
                emissionRate: 10.0,
                startColor: Cesium.Color.LIGHTSEAGREEN.withAlpha(0.8),
                endColor: Cesium.Color.WHITE.withAlpha(0.0),
                minimumImageSize: new Cesium.Cartesian2(50, 50),
                maximumImageSize: new Cesium.Cartesian2(100, 100),
                minimumParticleLife: 2.0,
                maximumParticleLife: 4.0,
                minimumSpeed: 2.0,
                maximumSpeed: 4.0,
                gravity: 0.0,
                updateCallback: (particle, dt) => {
                    // 添加上升运动
                    particle.velocity = Cesium.Cartesian3.add(
                        particle.velocity,
                        new Cesium.Cartesian3(0.0, 0.0, 2.0),
                        particle.velocity
                    );
                }
            })
        );

        // 设置相机视角
        this.viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(116.3915, 39.9053, 3000.0),
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-45.0),
                roll: 0.0
            }
        });

        // 添加动画控制按钮
        this.addParticleControls(particleSystem);
    }

    addParticleControls(particleSystem) {
        const toolbar = document.createElement('div');
        toolbar.className = 'toolbar';
        toolbar.style.position = 'absolute';
        toolbar.style.top = '10px';
        toolbar.style.left = '10px';
        toolbar.style.zIndex = '999';

        // 添加速度控制
        const speedButton = document.createElement('button');
        speedButton.textContent = '加速';
        speedButton.addEventListener('click', () => {
            particleSystem.speed = particleSystem.speed * 1.5;
        });
        toolbar.appendChild(speedButton);

        const slowButton = document.createElement('button');
        slowButton.textContent = '减速';
        slowButton.addEventListener('click', () => {
            particleSystem.speed = particleSystem.speed / 1.5;
        });
        toolbar.appendChild(slowButton);

        this.viewer.container.appendChild(toolbar);
    }
}

// 初始化
const container = document.getElementById('cesiumContainer');
new ParticleEffect(container);
```
:::

::: details 预览效果
<div class="codepen" 
  data-height="300" 
  data-theme-id="dark" 
  data-default-tab="result" 
  data-user="fzx19980425" 
  data-slug-hash="GgJJeXj" 
  style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>查看 <a href="https://codepen.io/fzx19980425/pen/GgJJeXj">CodePen 示例</a> 获取完整效果</span>
</div>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
:::

::: tip 使用说明
1. 示例展示了一个动态的粒子系统，位于北京上空
2. 粒子会随时间变化颜色和大小
3. 支持调整粒子系统的各种参数
4. 可以自定义粒子贴图
:::

## 交互动画

### 1. 动态绘制

::: tip 在线演示
- [CodePen 演示](https://codepen.io/fzx19980425/pen/jEPPRNK) - 点击查看完整示例
:::

::: details 代码实现
```html
<!-- 添加 Cesium 默认样式 -->
<link href="https://cesium.com/downloads/cesiumjs/releases/1.95/Build/Cesium/Widgets/widgets.css" rel="stylesheet">
```

```javascript
// 注意：需要在 CodePen 的 JS 设置中添加依赖：
// https://cesium.com/downloads/cesiumjs/releases/1.95/Build/Cesium/Cesium.js

class DrawingAnimation {
    constructor(container) {
        // 创建 Cesium Viewer
        this.viewer = new Cesium.Viewer(container, {
            terrainProvider: Cesium.createWorldTerrain(),
            animation: false,
            baseLayerPicker: false,
            fullscreenButton: false,
            geocoder: false,
            homeButton: false,
            infoBox: false,
            sceneModePicker: false,
            selectionIndicator: false,
            timeline: false,
            navigationHelpButton: false,
            imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
            })
        });

        // 设置初始视角
        this.viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(116.3915, 39.9053, 5000.0),
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-45.0),
                roll: 0.0
            }
        });

        // 添加绘制工具
        this.addDrawingTools();
    }

    addDrawingTools() {
        const toolbar = document.createElement('div');
        toolbar.className = 'toolbar';
        toolbar.style.position = 'absolute';
        toolbar.style.top = '10px';
        toolbar.style.left = '10px';
        toolbar.style.zIndex = '999';
        toolbar.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        toolbar.style.padding = '10px';
        toolbar.style.borderRadius = '5px';

        // 添加绘制按钮
        const drawPointButton = document.createElement('button');
        drawPointButton.textContent = '添加点';
        drawPointButton.style.margin = '0 5px';
        drawPointButton.style.padding = '5px 10px';
        drawPointButton.onclick = () => this.addPoint();
        toolbar.appendChild(drawPointButton);

        const drawLineButton = document.createElement('button');
        drawLineButton.textContent = '添加线';
        drawLineButton.style.margin = '0 5px';
        drawLineButton.style.padding = '5px 10px';
        drawLineButton.onclick = () => this.addLine();
        toolbar.appendChild(drawLineButton);

        const drawPolygonButton = document.createElement('button');
        drawPolygonButton.textContent = '添加面';
        drawPolygonButton.style.margin = '0 5px';
        drawPolygonButton.style.padding = '5px 10px';
        drawPolygonButton.onclick = () => this.addPolygon();
        toolbar.appendChild(drawPolygonButton);

        this.viewer.container.appendChild(toolbar);
    }

    addPoint() {
        // 在北京上空添加一个点
        const position = Cesium.Cartesian3.fromDegrees(116.3915, 39.9053, 1000.0);
        const point = this.viewer.entities.add({
            position: position,
            point: {
                pixelSize: 20,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
        });

        // 计算一个合适的视角距离
        const offset = Cesium.Cartesian3.multiplyByScalar(
            Cesium.Cartesian3.UNIT_Z,
            2000, // 2000米高度
            new Cesium.Cartesian3()
        );
        const cameraPosition = Cesium.Cartesian3.add(position, offset, new Cesium.Cartesian3());

        // 聚焦到点
        this.viewer.camera.flyTo({
            destination: cameraPosition,
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-45.0),
                roll: 0.0
            },
            duration: 1.0
        });
    }

    addLine() {
        // 在北京上空添加一条线
        const positions = [
            Cesium.Cartesian3.fromDegrees(116.3915, 39.9053, 1000.0),
            Cesium.Cartesian3.fromDegrees(116.4015, 39.9153, 1000.0),
            Cesium.Cartesian3.fromDegrees(116.4115, 39.9053, 1000.0)
        ];

        const line = this.viewer.entities.add({
            polyline: {
                positions: positions,
                width: 5,
                material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.BLUE),
                clampToGround: false
            }
        });

        // 计算线的边界球
        const boundingSphere = Cesium.BoundingSphere.fromPoints(positions);
        
        // 聚焦到线
        this.viewer.camera.flyTo({
            destination: boundingSphere.center,
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-45.0),
                roll: 0.0
            },
            duration: 1.0,
            offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-45), boundingSphere.radius * 2.0)
        });
    }

    addPolygon() {
        // 在北京上空添加一个面
        const positions = [
            Cesium.Cartesian3.fromDegrees(116.3915, 39.9053, 1000.0),
            Cesium.Cartesian3.fromDegrees(116.4015, 39.9153, 1000.0),
            Cesium.Cartesian3.fromDegrees(116.4115, 39.9053, 1000.0),
            Cesium.Cartesian3.fromDegrees(116.4015, 39.8953, 1000.0)
        ];

        const polygon = this.viewer.entities.add({
            polygon: {
                hierarchy: new Cesium.PolygonHierarchy(positions),
                material: Cesium.Color.GREEN.withAlpha(0.5),
                outline: true,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2
            }
        });

        // 计算面的边界球
        const boundingSphere = Cesium.BoundingSphere.fromPoints(positions);
        
        // 聚焦到面
        this.viewer.camera.flyTo({
            destination: boundingSphere.center,
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-45.0),
                roll: 0.0
            },
            duration: 1.0,
            offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-45), boundingSphere.radius * 2.0)
        });
    }
}

// 初始化
const container = document.getElementById('cesiumContainer');
new DrawingAnimation(container);

```
:::

::: details 预览效果
<div class="codepen" 
  data-height="300" 
  data-theme-id="dark" 
  data-default-tab="result" 
  data-user="fzx19980425" 
  data-slug-hash="jEPPRNK" 
  style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>查看 <a href="https://codepen.io/fzx19980425/pen/jEPPRNK">CodePen 示例</a> 获取完整效果</span>
</div>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
:::

::: tip 使用说明
1. 点击"添加点"按钮开始绘制点
2. 点击"添加线"按钮开始绘制线
3. 点击"添加面"按钮开始绘制面
4. 左键点击添加顶点，右键点击完成绘制
:::
