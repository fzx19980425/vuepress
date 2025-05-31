# Three.js 基础

## 基本概念

Three.js 是一个基于 WebGL 的 3D 图形库，它封装了 WebGL 的底层细节，提供了更简单易用的 API 来创建和显示 3D 图形。

## 基础设置

### 1. 安装和引入

```html
<!-- 通过 CDN 引入 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

<!-- 或者通过 npm 安装 -->
<!-- npm install three -->
```

### 2. 创建基本场景

```javascript
// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(
    75,                                     // 视角
    window.innerWidth / window.innerHeight, // 宽高比
    0.1,                                    // 近平面
    1000                                    // 远平面
);

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 添加光源
const light = new THREE.AmbientLight(0x404040); // 环境光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // 平行光
scene.add(light);
scene.add(directionalLight);

// 设置相机位置
camera.position.z = 5;

// 渲染循环
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
```

## 基本图形

### 1. 几何体

```javascript
// 创建立方体
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 创建球体
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// 创建圆柱体
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
const cylinderMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
scene.add(cylinder);
```

### 2. 材质

```javascript
// 基础材质
const basicMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true
});

// 标准材质
const standardMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    metalness: 0.5,
    roughness: 0.5
});

// 物理材质
const physicalMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x00ff00,
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
});

// 自定义着色器材质
const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        void main() {
            gl_FragColor = vec4(vUv.x, vUv.y, sin(time), 1.0);
        }
    `
});
```

## 动画实现

### 1. 基本动画

```javascript
class BasicAnimation {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.cube = null;
        this.init();
    }
    
    init() {
        // 设置渲染器
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        
        // 创建立方体
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
        
        // 设置相机位置
        this.camera.position.z = 5;
        
        // 添加光源
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1);
        this.scene.add(light);
        
        // 开始动画
        this.animate();
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // 旋转立方体
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
        
        this.renderer.render(this.scene, this.camera);
    }
}
```

### 2. 相机动画

```javascript
class CameraAnimation {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.controls = null;
        this.init();
    }
    
    init() {
        // 设置渲染器
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        
        // 创建轨道控制器
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        
        // 设置相机位置
        this.camera.position.set(0, 0, 5);
        
        // 添加场景内容
        this.addSceneContent();
        
        // 开始动画
        this.animate();
    }
    
    addSceneContent() {
        // 添加网格
        const gridHelper = new THREE.GridHelper(10, 10);
        this.scene.add(gridHelper);
        
        // 添加物体
        const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
        const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        const torusKnot = new THREE.Mesh(geometry, material);
        this.scene.add(torusKnot);
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // 更新控制器
        this.controls.update();
        
        this.renderer.render(this.scene, this.camera);
    }
}
```

### 3. 粒子系统

```javascript
class ParticleSystem {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.particles = null;
        this.init();
    }
    
    init() {
        // 设置渲染器
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        
        // 创建粒子系统
        const particleCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 10;
            positions[i + 1] = (Math.random() - 0.5) * 10;
            positions[i + 2] = (Math.random() - 0.5) * 10;
            
            colors[i] = Math.random();
            colors[i + 1] = Math.random();
            colors[i + 2] = Math.random();
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
        
        // 设置相机位置
        this.camera.position.z = 5;
        
        // 开始动画
        this.animate();
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // 旋转粒子系统
        this.particles.rotation.x += 0.001;
        this.particles.rotation.y += 0.001;
        
        this.renderer.render(this.scene, this.camera);
    }
}
```

## 性能优化

### 1. 使用 BufferGeometry

```javascript
class OptimizedGeometry {
    constructor() {
        // 创建优化的几何体
        const geometry = new THREE.BufferGeometry();
        
        // 使用 TypedArray 存储顶点数据
        const vertices = new Float32Array([
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0
        ]);
        
        // 设置属性
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        
        // 使用索引
        const indices = new Uint16Array([
            0, 1, 2,
            0, 2, 3
        ]);
        geometry.setIndex(new THREE.BufferAttribute(indices, 1));
        
        // 计算法线
        geometry.computeVertexNormals();
    }
}
```

### 2. 使用对象池

```javascript
class ObjectPool {
    constructor(size) {
        this.pool = [];
        this.size = size;
        this.init();
    }
    
    init() {
        // 预创建对象
        for (let i = 0; i < this.size; i++) {
            const geometry = new THREE.BoxGeometry();
            const material = new THREE.MeshPhongMaterial();
            const mesh = new THREE.Mesh(geometry, material);
            mesh.visible = false;
            this.pool.push(mesh);
        }
    }
    
    get() {
        // 获取可用对象
        for (let i = 0; i < this.size; i++) {
            if (!this.pool[i].visible) {
                this.pool[i].visible = true;
                return this.pool[i];
            }
        }
        return null;
    }
    
    release(mesh) {
        // 释放对象
        mesh.visible = false;
    }
}
```

## 最佳实践

1. 使用适当的几何体类型
2. 优化材质和纹理
3. 使用对象池管理对象
4. 实现适当的 LOD（细节层次）
5. 使用 WebGLRenderer 的优化选项
6. 注意内存管理
7. 使用性能监控工具
8. 提供降级方案

## 相关资源

- [Three.js 官方文档](https://threejs.org/docs/)
- [Three.js 示例](https://threejs.org/examples/)
- [Three.js 性能优化指南](https://discoverthreejs.com/tips-and-tricks/)
- [Three.js 学习资源](https://threejsfundamentals.org/) 