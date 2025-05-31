# Canvas 游戏开发

## 游戏开发基础

### 1. 游戏循环

```javascript
class GameLoop {
    constructor() {
        this.lastTime = 0;
        this.accumulator = 0;
        this.timeStep = 1000 / 60; // 60 FPS
        this.running = false;
    }
    
    start() {
        this.running = true;
        requestAnimationFrame(this.update.bind(this));
    }
    
    stop() {
        this.running = false;
    }
    
    update(currentTime) {
        if (!this.running) return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.accumulator += deltaTime;
        
        while (this.accumulator >= this.timeStep) {
            this.update(this.timeStep);
            this.accumulator -= this.timeStep;
        }
        
        this.render();
        requestAnimationFrame(this.update.bind(this));
    }
    
    update(deltaTime) {
        // 更新游戏状态
    }
    
    render() {
        // 渲染游戏画面
    }
}
```

### 2. 游戏对象管理

```javascript
class GameObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocity = { x: 0, y: 0 };
        this.active = true;
    }
    
    update(deltaTime) {
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;
    }
    
    render(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    collidesWith(other) {
        return this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y;
    }
}

class GameObjectManager {
    constructor() {
        this.objects = new Set();
    }
    
    add(object) {
        this.objects.add(object);
    }
    
    remove(object) {
        this.objects.delete(object);
    }
    
    update(deltaTime) {
        this.objects.forEach(object => {
            if (object.active) {
                object.update(deltaTime);
            }
        });
    }
    
    render(ctx) {
        this.objects.forEach(object => {
            if (object.active) {
                object.render(ctx);
            }
        });
    }
    
    checkCollisions() {
        const objects = Array.from(this.objects);
        for (let i = 0; i < objects.length; i++) {
            for (let j = i + 1; j < objects.length; j++) {
                if (objects[i].collidesWith(objects[j])) {
                    this.handleCollision(objects[i], objects[j]);
                }
            }
        }
    }
    
    handleCollision(obj1, obj2) {
        // 处理碰撞
    }
}
```

### 3. 输入处理

```javascript
class InputHandler {
    constructor() {
        this.keys = new Set();
        this.mouse = { x: 0, y: 0, pressed: false };
        this.init();
    }
    
    init() {
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
        window.addEventListener('mousedown', this.handleMouseDown.bind(this));
        window.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }
    
    handleKeyDown(e) {
        this.keys.add(e.key);
    }
    
    handleKeyUp(e) {
        this.keys.delete(e.key);
    }
    
    handleMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }
    
    handleMouseDown(e) {
        this.mouse.pressed = true;
    }
    
    handleMouseUp(e) {
        this.mouse.pressed = false;
    }
    
    isKeyPressed(key) {
        return this.keys.has(key);
    }
    
    isMousePressed() {
        return this.mouse.pressed;
    }
}
```

## 游戏示例

### 1. 弹球游戏

```javascript
class Ball extends GameObject {
    constructor(x, y, radius) {
        super(x, y, radius * 2, radius * 2);
        this.radius = radius;
        this.speed = 5;
        this.velocity = {
            x: Math.random() * this.speed * 2 - this.speed,
            y: -this.speed
        };
    }
    
    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // 碰撞检测
        if (this.x <= 0 || this.x + this.width >= canvas.width) {
            this.velocity.x *= -1;
        }
        if (this.y <= 0) {
            this.velocity.y *= -1;
        }
    }
}

class Paddle extends GameObject {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.speed = 8;
    }
    
    render(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    move(direction) {
        this.velocity.x = direction * this.speed;
    }
}

class Brick extends GameObject {
    constructor(x, y, width, height, color) {
        super(x, y, width, height);
        this.color = color;
        this.hits = 1;
    }
    
    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    hit() {
        this.hits--;
        return this.hits <= 0;
    }
}

class BreakoutGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gameLoop = new GameLoop();
        this.objectManager = new GameObjectManager();
        this.input = new InputHandler();
        this.score = 0;
        this.init();
    }
    
    init() {
        // 创建球
        this.ball = new Ball(
            this.canvas.width / 2,
            this.canvas.height - 50,
            10
        );
        this.objectManager.add(this.ball);
        
        // 创建挡板
        this.paddle = new Paddle(
            this.canvas.width / 2 - 50,
            this.canvas.height - 20,
            100,
            10
        );
        this.objectManager.add(this.paddle);
        
        // 创建砖块
        this.createBricks();
        
        // 开始游戏循环
        this.gameLoop.start();
    }
    
    createBricks() {
        const rows = 5;
        const cols = 8;
        const brickWidth = 80;
        const brickHeight = 20;
        const padding = 10;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const brick = new Brick(
                    col * (brickWidth + padding) + padding,
                    row * (brickHeight + padding) + padding,
                    brickWidth,
                    brickHeight,
                    `hsl(${row * 30}, 70%, 50%)`
                );
                this.objectManager.add(brick);
            }
        }
    }
    
    update(deltaTime) {
        // 处理输入
        if (this.input.isKeyPressed('ArrowLeft')) {
            this.paddle.move(-1);
        } else if (this.input.isKeyPressed('ArrowRight')) {
            this.paddle.move(1);
        } else {
            this.paddle.move(0);
        }
        
        // 更新游戏对象
        this.objectManager.update(deltaTime);
        
        // 检查碰撞
        this.checkCollisions();
        
        // 检查游戏状态
        this.checkGameState();
    }
    
    checkCollisions() {
        // 球与挡板碰撞
        if (this.ball.collidesWith(this.paddle)) {
            this.ball.velocity.y = -Math.abs(this.ball.velocity.y);
            this.ball.velocity.x += (this.ball.x - this.paddle.x) * 0.1;
        }
        
        // 球与砖块碰撞
        this.objectManager.objects.forEach(object => {
            if (object instanceof Brick && this.ball.collidesWith(object)) {
                if (object.hit()) {
                    this.objectManager.remove(object);
                    this.score += 10;
                }
                this.ball.velocity.y *= -1;
            }
        });
    }
    
    checkGameState() {
        // 检查球是否落到底部
        if (this.ball.y > this.canvas.height) {
            this.gameOver();
        }
        
        // 检查是否清除所有砖块
        const bricks = Array.from(this.objectManager.objects).filter(obj => obj instanceof Brick);
        if (bricks.length === 0) {
            this.win();
        }
    }
    
    render() {
        // 清空画布
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 渲染游戏对象
        this.objectManager.render(this.ctx);
        
        // 渲染分数
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
    }
    
    gameOver() {
        this.gameLoop.stop();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over', this.canvas.width / 2, this.canvas.height / 2);
    }
    
    win() {
        this.gameLoop.stop();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('You Win!', this.canvas.width / 2, this.canvas.height / 2);
    }
}

// 使用示例
const canvas = document.getElementById('gameCanvas');
const game = new BreakoutGame(canvas);
```

### 2. 贪吃蛇游戏

```javascript
class Snake {
    constructor(x, y, size) {
        this.segments = [{ x, y }];
        this.size = size;
        this.direction = 'right';
        this.nextDirection = 'right';
        this.growing = false;
    }
    
    update() {
        // 更新方向
        this.direction = this.nextDirection;
        
        // 获取头部位置
        const head = { ...this.segments[0] };
        
        // 根据方向移动头部
        switch (this.direction) {
            case 'up': head.y -= this.size; break;
            case 'down': head.y += this.size; break;
            case 'left': head.x -= this.size; break;
            case 'right': head.x += this.size; break;
        }
        
        // 添加新的头部
        this.segments.unshift(head);
        
        // 如果不是在生长，则移除尾部
        if (!this.growing) {
            this.segments.pop();
        }
        this.growing = false;
    }
    
    render(ctx) {
        ctx.fillStyle = 'green';
        this.segments.forEach((segment, index) => {
            if (index === 0) {
                ctx.fillStyle = 'darkgreen';  // 头部颜色
            } else {
                ctx.fillStyle = 'green';  // 身体颜色
            }
            ctx.fillRect(segment.x, segment.y, this.size - 1, this.size - 1);
        });
    }
    
    changeDirection(newDirection) {
        const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };
        
        if (opposites[newDirection] !== this.direction) {
            this.nextDirection = newDirection;
        }
    }
    
    grow() {
        this.growing = true;
    }
    
    checkCollision(width, height) {
        const head = this.segments[0];
        
        // 检查是否撞墙
        if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
            return true;
        }
        
        // 检查是否撞到自己
        for (let i = 1; i < this.segments.length; i++) {
            if (head.x === this.segments[i].x && head.y === this.segments[i].y) {
                return true;
            }
        }
        
        return false;
    }
}

class Food {
    constructor(size) {
        this.size = size;
        this.position = { x: 0, y: 0 };
    }
    
    spawn(width, height, snake) {
        const gridSize = this.size;
        const maxX = Math.floor(width / gridSize);
        const maxY = Math.floor(height / gridSize);
        
        do {
            this.position = {
                x: Math.floor(Math.random() * maxX) * gridSize,
                y: Math.floor(Math.random() * maxY) * gridSize
            };
        } while (this.isOnSnake(snake));
    }
    
    isOnSnake(snake) {
        return snake.segments.some(segment => 
            segment.x === this.position.x && segment.y === this.position.y
        );
    }
    
    render(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.size - 1,
            this.size - 1
        );
    }
}

class SnakeGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gridSize = 20;
        this.snake = new Snake(0, 0, this.gridSize);
        this.food = new Food(this.gridSize);
        this.score = 0;
        this.gameLoop = new GameLoop();
        this.input = new InputHandler();
        this.init();
    }
    
    init() {
        // 设置画布大小
        this.canvas.width = 400;
        this.canvas.height = 400;
        
        // 生成第一个食物
        this.food.spawn(this.canvas.width, this.canvas.height, this.snake);
        
        // 设置输入处理
        this.setupInput();
        
        // 开始游戏循环
        this.gameLoop.start();
    }
    
    setupInput() {
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowUp': this.snake.changeDirection('up'); break;
                case 'ArrowDown': this.snake.changeDirection('down'); break;
                case 'ArrowLeft': this.snake.changeDirection('left'); break;
                case 'ArrowRight': this.snake.changeDirection('right'); break;
            }
        });
    }
    
    update(deltaTime) {
        this.snake.update();
        
        // 检查是否吃到食物
        const head = this.snake.segments[0];
        if (head.x === this.food.position.x && head.y === this.food.position.y) {
            this.snake.grow();
            this.food.spawn(this.canvas.width, this.canvas.height, this.snake);
            this.score += 10;
        }
        
        // 检查碰撞
        if (this.snake.checkCollision(this.canvas.width, this.canvas.height)) {
            this.gameOver();
        }
    }
    
    render() {
        // 清空画布
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格
        this.ctx.strokeStyle = '#333';
        for (let x = 0; x < this.canvas.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        
        // 绘制蛇和食物
        this.snake.render(this.ctx);
        this.food.render(this.ctx);
        
        // 绘制分数
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
    }
    
    gameOver() {
        this.gameLoop.stop();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over', this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.font = '24px Arial';
        this.ctx.fillText(
            `Final Score: ${this.score}`,
            this.canvas.width / 2,
            this.canvas.height / 2 + 40
        );
    }
}

// 使用示例
const canvas = document.getElementById('gameCanvas');
const game = new SnakeGame(canvas);
```

## 性能优化

### 1. 使用对象池

```javascript
class GameObjectPool {
    constructor(createFn, resetFn, initialSize = 100) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.pool = [];
        this.active = new Set();
        
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.createFn());
        }
    }
    
    get() {
        const obj = this.pool.pop() || this.createFn();
        this.active.add(obj);
        return obj;
    }
    
    release(obj) {
        if (this.active.has(obj)) {
            this.resetFn(obj);
            this.active.delete(obj);
            this.pool.push(obj);
        }
    }
    
    releaseAll() {
        this.active.forEach(obj => this.release(obj));
    }
}
```

### 2. 使用离屏渲染

```javascript
class GameRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.offscreen = document.createElement('canvas');
        this.offscreen.width = canvas.width;
        this.offscreen.height = canvas.height;
        this.offCtx = this.offscreen.getContext('2d');
    }
    
    render(gameObjects) {
        // 清空离屏画布
        this.offCtx.clearRect(0, 0, this.offscreen.width, this.offscreen.height);
        
        // 在离屏画布上绘制
        gameObjects.forEach(obj => obj.render(this.offCtx));
        
        // 将离屏画布内容复制到主画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.offscreen, 0, 0);
    }
}
```

## 最佳实践

1. 使用游戏循环控制更新和渲染
2. 合理使用对象池管理游戏对象
3. 使用离屏渲染优化性能
4. 实现碰撞检测系统
5. 处理用户输入
6. 管理游戏状态
7. 优化内存使用
8. 提供游戏配置选项

## 相关资源

- [MDN Canvas 游戏教程](https://developer.mozilla.org/zh-CN/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript)
- [Canvas 游戏开发最佳实践](https://developer.mozilla.org/zh-CN/docs/Games/Techniques/2D_collision_detection)
- [游戏开发资源](https://developer.mozilla.org/zh-CN/docs/Games)
- [WebGL 游戏开发](https://developer.mozilla.org/zh-CN/docs/Games/Techniques/3D_on_the_web) 