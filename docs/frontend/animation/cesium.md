# Cesium.js 动画开发

## 基础概念

### 1. Cesium 简介

- **什么是 Cesium.js**
  - 功能：基于 WebGL 的 3D 地图引擎
  - 特点：开源、跨平台、支持多种数据源
  - 官网：[https://cesium.com/](https://cesium.com/)
  - 适用场景：地理信息可视化、3D 地图应用

- **核心特性**
  - 3D 地球渲染
  - 地形和影像支持
  - 空间数据分析
  - 动画和交互
  - 时间动态可视化

### 2. 环境搭建

```javascript
// 安装
npm install cesium

// 基础使用
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

// 初始化 Viewer
const viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: Cesium.createWorldTerrain(),
    animation: true,
    baseLayerPicker: true,
    fullscreenButton: true,
    vrButton: false,
    geocoder: true,
    homeButton: true,
    infoBox: true,
    sceneModePicker: true,
    selectionIndicator: true,
    timeline: true,
    navigationHelpButton: true,
    navigationInstructionsInitiallyVisible: false
});
```

## 动画实现

### 1. 相机动画

```javascript
class CameraAnimation {
    constructor(viewer) {
        this.viewer = viewer;
        this.camera = viewer.camera;
    }

    // 飞向指定位置
    flyTo(longitude, latitude, height, duration = 2) {
        this.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
            duration: duration,
            complete: () => {
                console.log('飞行完成');
            }
        });
    }

    // 环绕目标点
    orbitTarget(longitude, latitude, height, radius, duration = 10) {
        const center = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
        const heading = Cesium.Math.toRadians(0);
        
        this.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(
                longitude + radius * Math.cos(heading),
                latitude + radius * Math.sin(heading),
                height
            ),
            orientation: {
                heading: heading,
                pitch: Cesium.Math.toRadians(-30),
                roll: 0
            },
            duration: duration,
            complete: () => {
                // 开始环绕动画
                this.startOrbit(center, radius);
            }
        });
    }

    // 开始环绕动画
    startOrbit(center, radius) {
        let heading = 0;
        const orbitDuration = 10; // 环绕一周的时间（秒）
        
        this.viewer.clock.onTick.addEventListener(() => {
            heading += (2 * Math.PI) / (orbitDuration * 60);
            const position = Cesium.Cartesian3.fromDegrees(
                Cesium.Math.toDegrees(center.x) + radius * Math.cos(heading),
                Cesium.Math.toDegrees(center.y) + radius * Math.sin(heading),
                center.z
            );
            
            this.camera.setView({
                destination: position,
                orientation: {
                    heading: heading,
                    pitch: Cesium.Math.toRadians(-30),
                    roll: 0
                }
            });
        });
    }
}
```

### 2. 实体动画

```javascript
class EntityAnimation {
    constructor(viewer) {
        this.viewer = viewer;
        this.entities = viewer.entities;
    }

    // 创建移动的实体
    createMovingEntity(position, path) {
        const entity = this.entities.add({
            position: new Cesium.SampledPositionProperty(),
            path: {
                resolution: 1,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.2,
                    color: Cesium.Color.YELLOW
                }),
                width: 10
            },
            model: {
                uri: 'path/to/model.glb',
                minimumPixelSize: 128,
                maximumScale: 20000
            }
        });

        // 添加位置采样
        for (let i = 0; i < path.length; i++) {
            const time = Cesium.JulianDate.addSeconds(
                this.viewer.clock.startTime,
                i * 2,
                new Cesium.JulianDate()
            );
            const position = Cesium.Cartesian3.fromDegrees(
                path[i].longitude,
                path[i].latitude,
                path[i].height
            );
            entity.position.addSample(time, position);
        }

        return entity;
    }

    // 创建动态变化的实体
    createDynamicEntity(position) {
        const entity = this.entities.add({
            position: Cesium.Cartesian3.fromDegrees(
                position.longitude,
                position.latitude,
                position.height
            ),
            ellipsoid: {
                radii: new Cesium.CallbackProperty((time) => {
                    const radius = 1000 + 500 * Math.sin(Cesium.JulianDate.secondsDifference(
                        time,
                        this.viewer.clock.startTime
                    ));
                    return new Cesium.Cartesian3(radius, radius, radius);
                }, false),
                material: Cesium.Color.RED.withAlpha(0.5)
            }
        });

        return entity;
    }
}
```

### 3. 粒子效果

```javascript
class ParticleEffect {
    constructor(viewer) {
        this.viewer = viewer;
        this.particleSystem = null;
    }

    // 创建爆炸效果
    createExplosion(position, duration = 1.0) {
        const particleSystem = this.viewer.scene.primitives.add(
            new Cesium.ParticleSystem({
                modelMatrix: new Cesium.Matrix4.fromTranslation(
                    Cesium.Cartesian3.fromDegrees(
                        position.longitude,
                        position.latitude,
                        position.height
                    )
                ),
                speed: 5.0,
                lifetime: duration,
                emitter: new Cesium.SphereEmitter(2.0),
                image: 'path/to/particle.png',
                startScale: 1.0,
                endScale: 4.0,
                minimumImageSize: new Cesium.Cartesian2(1, 1),
                maximumImageSize: new Cesium.Cartesian2(3, 3),
                startColor: Cesium.Color.WHITE.withAlpha(0.7),
                endColor: Cesium.Color.WHITE.withAlpha(0.0),
                emissionRate: 30.0,
                gravity: 0.0
            })
        );

        // 设置粒子系统生命周期
        setTimeout(() => {
            this.viewer.scene.primitives.remove(particleSystem);
        }, duration * 1000);

        return particleSystem;
    }

    // 创建尾迹效果
    createTrail(position, direction) {
        const particleSystem = this.viewer.scene.primitives.add(
            new Cesium.ParticleSystem({
                modelMatrix: new Cesium.Matrix4.fromTranslation(
                    Cesium.Cartesian3.fromDegrees(
                        position.longitude,
                        position.latitude,
                        position.height
                    )
                ),
                speed: 1.0,
                lifetime: 1.0,
                emitter: new Cesium.ConeEmitter(Cesium.Math.toRadians(30.0)),
                image: 'path/to/trail.png',
                startScale: 1.0,
                endScale: 0.0,
                minimumImageSize: new Cesium.Cartesian2(1, 1),
                maximumImageSize: new Cesium.Cartesian2(3, 3),
                startColor: Cesium.Color.WHITE.withAlpha(0.7),
                endColor: Cesium.Color.WHITE.withAlpha(0.0),
                emissionRate: 5.0,
                gravity: 0.0
            })
        );

        return particleSystem;
    }
}
```

## 性能优化

### 1. 渲染优化

```javascript
class CesiumOptimizer {
    constructor(viewer) {
        this.viewer = viewer;
    }

    // 优化场景设置
    optimizeScene() {
        // 设置最大缓存大小
        this.viewer.scene.globe.maximumScreenSpaceError = 2;
        
        // 启用深度检测
        this.viewer.scene.globe.enableLighting = true;
        
        // 设置地形细节
        this.viewer.scene.globe.detailScalar = 0.5;
        
        // 优化内存使用
        this.viewer.scene.globe.maximumCacheSize = 1000;
    }

    // 优化实体渲染
    optimizeEntities() {
        // 使用 Billboard 替代 Model
        this.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
            billboard: {
                image: 'path/to/image.png',
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                scale: 0.5
            }
        });
    }
}
```

### 2. 数据管理

```javascript
class DataManager {
    constructor(viewer) {
        this.viewer = viewer;
        this.dataSource = new Cesium.CustomDataSource('myDataSource');
    }

    // 添加数据源
    async addDataSource(url) {
        try {
            const dataSource = await Cesium.CzmlDataSource.load(url);
            this.viewer.dataSources.add(dataSource);
            return dataSource;
        } catch (error) {
            console.error('加载数据源失败:', error);
        }
    }

    // 管理实体集合
    manageEntities() {
        // 使用 EntityCollection 管理实体
        const entityCollection = new Cesium.EntityCollection();
        
        // 添加实体
        entityCollection.add({
            position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
            point: {
                pixelSize: 10,
                color: Cesium.Color.RED
            }
        });

        // 批量更新
        entityCollection.values.forEach(entity => {
            if (entity.point) {
                entity.point.color = Cesium.Color.BLUE;
            }
        });
    }
}
```

## 最佳实践

1. 性能优化
   - 合理设置缓存大小
   - 使用适当的细节级别
   - 优化实体渲染
   - 管理内存使用

2. 动画实现
   - 使用 `requestAnimationFrame` 进行动画更新
   - 合理设置动画时长
   - 注意动画的平滑性
   - 提供动画控制接口

3. 数据管理
   - 使用数据源管理数据
   - 实现数据缓存机制
   - 优化数据加载策略
   - 及时清理无用数据

4. 交互设计
   - 提供清晰的用户反馈
   - 实现平滑的相机控制
   - 优化触摸设备支持
   - 添加适当的动画过渡

## 相关资源

- [Cesium 官方文档](https://cesium.com/docs/)
- [Cesium 示例](https://sandcastle.cesium.com/)
- [Cesium 论坛](https://community.cesium.com/)
- [Cesium 性能优化指南](https://cesium.com/docs/tutorials/performance-tips/) 