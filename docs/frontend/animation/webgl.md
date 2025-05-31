# WebGL 动画

## 基本概念

WebGL（Web Graphics Library）是一种 JavaScript API，用于在网页上渲染交互式 3D 和 2D 图形。它基于 OpenGL ES 2.0，允许在浏览器中使用 GPU 加速渲染。

## 基础设置

### 1. 创建 WebGL 上下文

```html
<!-- HTML 设置 -->
<canvas id="glCanvas" width="800" height="600"></canvas>

<script>
// 获取 WebGL 上下文
const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    alert('无法初始化 WebGL，您的浏览器或机器可能不支持它。');
    return;
}

// 设置清除颜色
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
</script>
```

### 2. 着色器基础

```javascript
// 顶点着色器
const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    varying lowp vec4 vColor;
    
    void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
    }
`;

// 片段着色器
const fsSource = `
    varying lowp vec4 vColor;
    
    void main(void) {
        gl_FragColor = vColor;
    }
`;

// 初始化着色器程序
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('无法初始化着色器程序: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    
    return shaderProgram;
}
```

## 动画实现

### 1. 基本动画循环

```javascript
class WebGLAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl');
        this.programInfo = null;
        this.buffers = null;
        this.rotation = 0.0;
        this.lastTime = 0;
        
        this.init();
    }
    
    init() {
        // 初始化着色器程序
        const shaderProgram = initShaderProgram(this.gl, vsSource, fsSource);
        
        this.programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
                vertexColor: this.gl.getAttribLocation(shaderProgram, 'aVertexColor'),
            },
            uniformLocations: {
                projectionMatrix: this.gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: this.gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            },
        };
        
        // 初始化缓冲区
        this.buffers = initBuffers(this.gl);
        
        // 开始动画循环
        this.render();
    }
    
    render(currentTime) {
        currentTime *= 0.001;  // 转换为秒
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // 更新旋转
        this.rotation += deltaTime;
        
        // 清除画布
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        
        // 绘制场景
        this.drawScene();
        
        // 请求下一帧
        requestAnimationFrame(this.render.bind(this));
    }
    
    drawScene() {
        // 创建透视矩阵
        const fieldOfView = 45 * Math.PI / 180;
        const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();
        
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
        
        // 设置绘图位置
        const modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, this.rotation, [0.5, 1, 0]);
        
        // 绘制对象
        this.drawObject(modelViewMatrix, projectionMatrix);
    }
}
```

### 2. 3D 对象动画

```javascript
class CubeAnimation extends WebGLAnimation {
    constructor(canvas) {
        super(canvas);
        this.cubeRotation = 0.0;
    }
    
    initBuffers() {
        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        
        const positions = [
            // 前面
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,
            
            // 后面
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0, -1.0, -1.0,
            
            // 顶面
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0, -1.0,
            
            // 底面
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,
            
            // 右面
             1.0, -1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0,  1.0,  1.0,
             1.0, -1.0,  1.0,
            
            // 左面
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0,
        ];
        
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
        
        // 设置颜色
        const faceColors = [
            [1.0, 0.0, 0.0, 1.0],    // 前面: 红色
            [0.0, 1.0, 0.0, 1.0],    // 后面: 绿色
            [0.0, 0.0, 1.0, 1.0],    // 顶面: 蓝色
            [1.0, 1.0, 0.0, 1.0],    // 底面: 黄色
            [1.0, 0.0, 1.0, 1.0],    // 右面: 紫色
            [0.0, 1.0, 1.0, 1.0],    // 左面: 青色
        ];
        
        let colors = [];
        for (let j = 0; j < faceColors.length; ++j) {
            const c = faceColors[j];
            colors = colors.concat(c, c, c, c);
        }
        
        const colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
        
        return {
            position: positionBuffer,
            color: colorBuffer,
        };
    }
    
    drawScene() {
        // 更新旋转
        this.cubeRotation += 0.01;
        
        // 创建透视矩阵
        const fieldOfView = 45 * Math.PI / 180;
        const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();
        
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
        
        // 设置绘图位置
        const modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, this.cubeRotation, [0.5, 1, 0]);
        
        // 绘制立方体
        this.drawCube(modelViewMatrix, projectionMatrix);
    }
}
```

### 3. 粒子系统

```javascript
class ParticleSystem {
    constructor(gl, count) {
        this.gl = gl;
        this.particleCount = count;
        this.particles = [];
        this.init();
    }
    
    init() {
        // 初始化粒子
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                position: [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1],
                velocity: [Math.random() * 0.02 - 0.01, Math.random() * 0.02 - 0.01, Math.random() * 0.02 - 0.01],
                color: [Math.random(), Math.random(), Math.random(), 1.0],
                size: Math.random() * 2 + 1
            });
        }
        
        // 创建缓冲区
        this.positionBuffer = this.gl.createBuffer();
        this.colorBuffer = this.gl.createBuffer();
        this.sizeBuffer = this.gl.createBuffer();
    }
    
    update() {
        // 更新粒子位置
        for (let i = 0; i < this.particleCount; i++) {
            const particle = this.particles[i];
            
            // 更新位置
            particle.position[0] += particle.velocity[0];
            particle.position[1] += particle.velocity[1];
            particle.position[2] += particle.velocity[2];
            
            // 边界检查
            for (let j = 0; j < 3; j++) {
                if (Math.abs(particle.position[j]) > 1.0) {
                    particle.velocity[j] *= -1;
                }
            }
        }
        
        // 更新缓冲区
        this.updateBuffers();
    }
    
    render(programInfo) {
        // 设置属性
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            3,
            this.gl.FLOAT,
            false,
            0,
            0
        );
        this.gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
        
        // 绘制粒子
        this.gl.drawArrays(this.gl.POINTS, 0, this.particleCount);
    }
}
```

## 性能优化

### 1. 使用顶点缓冲区对象（VBO）

```javascript
class OptimizedWebGLAnimation {
    constructor(gl) {
        this.gl = gl;
        this.vbo = null;
        this.initVBO();
    }
    
    initVBO() {
        // 创建顶点缓冲区对象
        this.vbo = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
        
        // 分配缓冲区
        const vertices = new Float32Array([
            // 顶点数据
        ]);
        
        // 使用 STATIC_DRAW 提示
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
    }
    
    render() {
        // 使用 VBO 进行渲染
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
        // 渲染代码
    }
}
```

### 2. 使用 WebGL 2.0 特性

```javascript
class WebGL2Animation {
    constructor(canvas) {
        this.gl = canvas.getContext('webgl2');
        this.init();
    }
    
    init() {
        // 使用 WebGL 2.0 特性
        if (this.gl) {
            // 使用实例化渲染
            this.gl.drawArraysInstanced(this.gl.TRIANGLES, 0, 6, 1000);
            
            // 使用变换反馈
            const transformFeedback = this.gl.createTransformFeedback();
            this.gl.bindTransformFeedback(this.gl.TRANSFORM_FEEDBACK, transformFeedback);
            
            // 使用多重渲染目标
            const framebuffer = this.gl.createFramebuffer();
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer);
        }
    }
}
```

## 最佳实践

1. 使用适当的缓冲区提示
2. 最小化状态改变
3. 使用批处理渲染
4. 优化着色器代码
5. 使用 WebGL 2.0 特性
6. 实现错误处理
7. 提供降级方案
8. 注意内存管理

## 相关资源

- [MDN WebGL 教程](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial)
- [WebGL 基础](https://webglfundamentals.org/)
- [WebGL 2.0 规范](https://www.khronos.org/registry/webgl/specs/latest/2.0/)
- [WebGL 性能优化](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/WebGL_best_practices) 