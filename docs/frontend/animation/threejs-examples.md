# Three.js 动画示例

> Three.js 是一个强大的 3D 图形库，本文档提供了常用的 Three.js 动画示例。更多基础概念请参考 [Three.js 动画基础](./threejs.md)。

## 目录

- [Three.js 动画示例](#threejs-动画示例)
  - [目录](#目录)
  - [基础动画](#基础动画)
    - [1. 旋转立方体](#1-旋转立方体)
    - [2. 轨道控制器](#2-轨道控制器)
  - [粒子动画](#粒子动画)
    - [1. 粒子系统](#1-粒子系统)
  - [物理动画](#物理动画)
    - [1. 物理引擎集成](#1-物理引擎集成)
  - [性能优化](#性能优化)
    - [1. 使用 InstancedMesh](#1-使用-instancedmesh)
  - [最佳实践](#最佳实践)
  - [个人实现](#个人实现)
  - [相关资源](#相关资源)

## 基础动画

### 1. 旋转立方体

::: tip 在线演示
- [CodePen 演示](https://codepen.io/fzx19980425/pen/azOOQax) - 点击查看完整示例
:::

::: details 代码实现
```javascript
// 注意：需要在 CodePen 的 JS 设置中添加依赖：
// https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js

class RotatingCube {
    constructor(container) {
        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        
        // 创建相机
        this.camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;
        
        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);
        
        // 创建立方体
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            shininess: 100
        });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
        
        // 添加光源
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1);
        this.scene.add(light);
        
        // 添加环境光
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);
        
        // 开始动画
        this.animate();
        
        // 处理窗口大小变化
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // 旋转立方体
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        const container = this.renderer.domElement.parentElement;
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }
}

// 初始化
const container = document.getElementById('container');
new RotatingCube(container);
```
:::

::: details 预览效果
<div class="codepen" 
  data-height="300" 
  data-theme-id="dark" 
  data-default-tab="result" 
  data-user="fzx19980425" 
  data-slug-hash="azOOQax" 
  style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>查看 <a href="https://codepen.io/fzx19980425/pen/azOOQax">CodePen 示例</a> 获取完整效果</span>
</div>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
:::

::: tip 使用说明
1. 这是一个基础的 Three.js 示例，展示了如何创建和渲染一个 3D 立方体
2. 立方体会自动旋转，展示 3D 效果
3. 场景包含环境光和方向光，使立方体具有立体感
4. 支持响应式布局，可以调整窗口大小查看效果
:::

### 2. 轨道控制器

::: tip 在线演示
- [CodePen 演示](https://codepen.io/fzx19980425/pen/JoddwYd) - 点击查看完整示例
:::

::: details 代码实现
```javascript
// 注意：需要在 CodePen 的 JS 设置中添加以下依赖：
// 1. https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js
// 2. https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js

class OrbitControlDemo {
    constructor(container) {
        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        
        // 创建相机
        this.camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;
        
        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);
        
        // 添加轨道控制器
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true; // 添加阻尼效果
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 10;
        this.controls.maxPolarAngle = Math.PI / 2;
        
        // 创建网格
        const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
        const material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh);
        
        // 添加环境光
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);
        
        // 添加平行光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        
        // 开始动画
        this.animate();
        
        // 处理窗口大小变化
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // 更新控制器
        this.controls.update();
        
        // 旋转网格
        this.mesh.rotation.x += 0.005;
        this.mesh.rotation.y += 0.01;
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        const container = this.renderer.domElement.parentElement;
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }
}

// 初始化
const container = document.getElementById('container');
new OrbitControlDemo(container);
```
:::

::: details 预览效果
<div class="codepen" 
  data-height="300" 
  data-theme-id="dark" 
  data-default-tab="result" 
  data-user="fzx19980425" 
  data-slug-hash="JoddwYd" 
  style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>查看 <a href="https://codepen.io/fzx19980425/pen/JoddwYd">CodePen 示例</a> 获取完整效果</span>
</div>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
:::

::: tip 使用说明
1. 使用鼠标拖动可以旋转场景
2. 使用鼠标滚轮可以缩放场景
3. 按住 Shift 键拖动可以平移场景
4. 场景中的物体会自动旋转，同时支持交互控制
:::

## 粒子动画

### 1. 粒子系统

::: tip 在线演示
- [CodePen 演示](https://codepen.io/fzx19980425/pen/raVVoWX) - 点击查看完整示例
:::

::: details 代码实现
```javascript
// 注意：需要在 CodePen 的 JS 设置中添加依赖：
// https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js

class ParticleSystem {
    constructor(container) {
        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        
        // 创建相机
        this.camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 30;
        
        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);
        
        // 创建粒子系统
        this.createParticles();
        
        // 开始动画
        this.animate();
        
        // 处理窗口大小变化
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }
    
    createParticles() {
        const particleCount = 2000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        const color = new THREE.Color();
        
        for (let i = 0; i < particleCount; i++) {
            // 位置 - 创建球形分布
            const radius = 15 * Math.cbrt(Math.random());
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
            
            // 颜色 - 基于位置设置渐变色
            color.setHSL(positions[i * 3 + 1] / 30 + 0.5, 0.8, 0.5);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
            
            // 大小
            sizes[i] = Math.random() * 2;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // 旋转粒子系统
        this.particles.rotation.x += 0.001;
        this.particles.rotation.y += 0.002;
        
        // 更新粒子大小
        const sizes = this.particles.geometry.attributes.size.array;
        for (let i = 0; i < sizes.length; i++) {
            sizes[i] = Math.sin(Date.now() * 0.001 + i) * 0.5 + 1;
        }
        this.particles.geometry.attributes.size.needsUpdate = true;
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        const container = this.renderer.domElement.parentElement;
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }
}

// 初始化
const container = document.getElementById('container');
new ParticleSystem(container);
```
:::

::: details 预览效果
<div class="codepen" 
  data-height="300" 
  data-theme-id="dark" 
  data-default-tab="result" 
  data-user="fzx19980425" 
  data-slug-hash="raVVoWX" 
  style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>查看 <a href="https://codepen.io/fzx19980425/pen/raVVoWX">CodePen 示例</a> 获取完整效果</span>
</div>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
:::

::: tip 使用说明
1. 粒子系统会随时间缓慢旋转
2. 粒子大小会随时间动态变化
3. 粒子颜色基于位置形成渐变效果
4. 支持响应式布局，可以调整窗口大小查看效果
:::

## 物理动画

### 1. 物理引擎集成

::: tip 在线演示
- [CodePen 演示](https://codepen.io/fzx19980425/pen/ByNNvWr) - 点击查看完整示例
:::

::: details 代码实现
```javascript
// 注意：需要在 CodePen 的 JS 设置中添加以下依赖：
// 1. https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js
// 2. https://cdnjs.cloudflare.com/ajax/libs/cannon.js/0.6.2/cannon.min.js

class PhysicsDemo {
    constructor(container) {
        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        
        // 创建相机
        this.camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);
        
        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        container.appendChild(this.renderer.domElement);
        
        // 创建物理世界
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 10;
        
        // 创建地面
        this.createGround();
        
        // 创建球体
        this.createSphere();
        
        // 添加光源
        this.addLights();
        
        // 开始动画
        this.animate();
        
        // 处理窗口大小变化
        window.addEventListener('resize', () => this.onWindowResize(), false);
        
        // 添加点击事件
        container.addEventListener('click', (event) => this.addSphere(event));
    }
    
    createGround() {
        // 创建地面网格
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x999999,
            side: THREE.DoubleSide
        });
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);
        
        // 创建地面物理体
        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({ mass: 0 });
        groundBody.addShape(groundShape);
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        this.world.addBody(groundBody);
    }
    
    createSphere() {
        // 创建球体网格
        const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
        const sphereMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff0000,
            shininess: 100
        });
        this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.sphere.position.y = 5;
        this.sphere.castShadow = true;
        this.scene.add(this.sphere);
        
        // 创建球体物理体
        const sphereShape = new CANNON.Sphere(1);
        const sphereBody = new CANNON.Body({ mass: 1 });
        sphereBody.addShape(sphereShape);
        sphereBody.position.set(0, 5, 0);
        this.world.addBody(sphereBody);
        
        this.sphereBody = sphereBody;
    }
    
    addLights() {
        // 添加环境光
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);
        
        // 添加平行光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
    }
    
    addSphere(event) {
        // 计算点击位置
        const rect = this.renderer.domElement.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // 创建射线
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera({ x, y }, this.camera);
        
        // 获取射线与地面的交点
        const intersects = raycaster.intersectObject(this.ground);
        if (intersects.length > 0) {
            const point = intersects[0].point;
            
            // 创建新球体
            const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
            const sphereMaterial = new THREE.MeshPhongMaterial({ 
                color: Math.random() * 0xffffff,
                shininess: 100
            });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.copy(point);
            sphere.position.y += 5;
            sphere.castShadow = true;
            this.scene.add(sphere);
            
            // 创建物理体
            const sphereShape = new CANNON.Sphere(0.5);
            const sphereBody = new CANNON.Body({ mass: 1 });
            sphereBody.addShape(sphereShape);
            sphereBody.position.copy(sphere.position);
            this.world.addBody(sphereBody);
            
            // 存储引用
            sphere.userData.physicsBody = sphereBody;
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // 更新物理世界
        this.world.step(1/60);
        
        // 更新所有球体位置
        this.scene.children.forEach(child => {
            if (child.userData.physicsBody) {
                child.position.copy(child.userData.physicsBody.position);
                child.quaternion.copy(child.userData.physicsBody.quaternion);
            }
        });
        
        // 更新主球体
        if (this.sphere && this.sphereBody) {
            this.sphere.position.copy(this.sphereBody.position);
            this.sphere.quaternion.copy(this.sphereBody.quaternion);
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        const container = this.renderer.domElement.parentElement;
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }
}

// 初始化
const container = document.getElementById('container');
new PhysicsDemo(container);
```
:::

::: details 预览效果
<div class="codepen" 
  data-height="300" 
  data-theme-id="dark" 
  data-default-tab="result" 
  data-user="fzx19980425" 
  data-slug-hash="ByNNvWr" 
  style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>查看 <a href="https://codepen.io/fzx19980425/pen/ByNNvWr">CodePen 示例</a> 获取完整效果</span>
</div>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
:::

::: tip 使用说明
1. 点击场景可以添加新的球体
2. 球体会受重力影响下落
3. 球体之间会发生物理碰撞
4. 支持响应式布局，可以调整窗口大小查看效果
:::

## 性能优化

### 1. 使用 InstancedMesh

::: tip 在线演示
- [CodePen 演示](https://codepen.io/fzx19980425/pen/ByNNvwx) - 点击查看完整示例
:::

::: details 代码实现
```javascript
// 注意：需要在 CodePen 的 JS 设置中添加依赖：
// https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js

class InstancedMeshDemo {
    constructor(container) {
        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        
        // 创建相机
        this.camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 30;
        
        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);
        
        // 创建实例化网格
        this.createInstancedMesh();
        
        // 添加光源
        this.addLights();
        
        // 开始动画
        this.animate();
        
        // 处理窗口大小变化
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }
    
    createInstancedMesh() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial();
        
        // 创建实例化网格
        this.instancedMesh = new THREE.InstancedMesh(
            geometry,
            material,
            1000
        );
        
        // 设置实例位置
        const matrix = new THREE.Matrix4();
        for (let i = 0; i < 1000; i++) {
            matrix.setPosition(
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50
            );
            this.instancedMesh.setMatrixAt(i, matrix);
        }
        
        this.scene.add(this.instancedMesh);
    }
    
    addLights() {
        // 添加环境光
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);
        
        // 添加平行光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // 旋转实例化网格
        this.instancedMesh.rotation.x += 0.01;
        this.instancedMesh.rotation.y += 0.01;
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        const container = this.renderer.domElement.parentElement;
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }
}

// 初始化
const container = document.getElementById('container');
new InstancedMeshDemo(container);
```
:::

::: details 预览效果
<div class="codepen" 
  data-height="300" 
  data-theme-id="dark" 
  data-default-tab="result" 
  data-user="fzx19980425" 
  data-slug-hash="ByNNvwx" 
  style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>查看 <a href="https://codepen.io/fzx19980425/pen/ByNNvwx">CodePen 示例</a> 获取完整效果</span>
</div>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
:::

::: tip 使用说明
1. 使用 InstancedMesh 可以高效渲染大量相同的几何体
2. 每个实例可以独立设置位置、旋转和缩放
3. 相比创建多个 Mesh 对象，性能提升显著
4. 支持响应式布局，可以调整窗口大小查看效果
:::

## 最佳实践

1. 使用适当的几何体
   - 选择合适的几何体类型
   - 控制几何体复杂度
   - 使用几何体缓存

2. 优化材质
   - 使用合适的材质类型
   - 控制纹理大小
   - 使用材质共享

3. 光照优化
   - 使用适当的光照类型
   - 控制光源数量
   - 使用阴影优化

4. 渲染优化
   - 使用适当的渲染器设置
   - 控制渲染分辨率
   - 使用后期处理效果

5. 内存管理
   - 及时释放资源
   - 使用对象池
   - 控制场景复杂度

## 个人实现
::: tip 实战项目
- [国创新能SMT车间看板](https://gitee.com/fzx0425/vue2-three-gcxn) - 点击查看完整代码
- [数据工厂](https://gitee.com/fzx0425/vue2-three-sjgc) - 点击查看完整代码
:::

## 相关资源

- [Three.js 官方文档](https://threejs.org/docs/)
- [Three.js 示例](https://threejs.org/examples/)
- [Three.js 性能优化指南](https://discoverthreejs.com/tips-and-tricks/)
- [Three.js 学习资源](https://threejsfundamentals.org/)
- [Three.js 动画基础](./threejs.md)
- [性能优化指南](./performance.md)
- [动画设计原则](./principles.md)
- [高级动画示例](./advanced-examples.md) 