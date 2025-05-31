# Vue 2 WebSocket 最佳实践

## WebSocket 基础实现

### 1. WebSocket 服务封装

```typescript
// utils/websocket.ts
interface WebSocketOptions {
  url: string;
  protocols?: string | string[];
  reconnectLimit?: number;
  reconnectInterval?: number;
  heartbeatInterval?: number;
  heartbeatMessage?: string;
}

class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectCount = 0;
  private heartbeatTimer: number | null = null;
  private messageQueue: any[] = [];
  private options: Required<WebSocketOptions>;
  private listeners: Map<string, Function[]> = new Map();

  constructor(options: WebSocketOptions) {
    this.options = {
      url: options.url,
      protocols: options.protocols || [],
      reconnectLimit: options.reconnectLimit || 3,
      reconnectInterval: options.reconnectInterval || 3000,
      heartbeatInterval: options.heartbeatInterval || 30000,
      heartbeatMessage: options.heartbeatMessage || 'ping'
    };
  }

  // 连接 WebSocket
  connect() {
    try {
      this.ws = new WebSocket(this.options.url, this.options.protocols);
      this.initEventHandlers();
      this.startHeartbeat();
    } catch (error) {
      console.error('WebSocket 连接失败:', error);
      this.reconnect();
    }
  }

  // 初始化事件处理器
  private initEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket 连接成功');
      this.reconnectCount = 0;
      this.flushMessageQueue();
    };

    this.ws.onclose = () => {
      console.log('WebSocket 连接关闭');
      this.stopHeartbeat();
      this.reconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket 错误:', error);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('消息解析错误:', error);
      }
    };
  }

  // 发送消息
  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      this.messageQueue.push(data);
    }
  }

  // 重连机制
  private reconnect() {
    if (this.reconnectCount >= this.options.reconnectLimit) {
      console.error('WebSocket 重连次数超过限制');
      return;
    }

    this.reconnectCount++;
    console.log(`WebSocket 第 ${this.reconnectCount} 次重连`);

    setTimeout(() => {
      this.connect();
    }, this.options.reconnectInterval);
  }

  // 心跳机制
  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = window.setInterval(() => {
      this.send(this.options.heartbeatMessage);
    }, this.options.heartbeatInterval);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // 消息队列处理
  private flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.send(message);
    }
  }

  // 事件监听
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // 消息处理
  private handleMessage(data: any) {
    const { type, payload } = data;
    const callbacks = this.listeners.get(type);
    if (callbacks) {
      callbacks.forEach(callback => callback(payload));
    }
  }

  // 关闭连接
  close() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default WebSocketClient;
```

### 2. Vue 组件中使用

```vue
<!-- components/ChatRoom.vue -->
<template>
  <div class="chat-room">
    <div class="message-list" ref="messageList">
      <div v-for="msg in messages" :key="msg.id" class="message-item">
        {{ msg.content }}
      </div>
    </div>
    
    <div class="input-area">
      <input 
        v-model="inputMessage" 
        @keyup.enter="sendMessage"
        placeholder="输入消息..."
      />
      <button @click="sendMessage">发送</button>
    </div>

    <div class="status-bar">
      <span :class="['status', connectionStatus]">
        {{ statusText }}
      </span>
    </div>
  </div>
</template>

<script>
import WebSocketClient from '@/utils/websocket';

export default {
  name: 'ChatRoom',
  
  data() {
    return {
      // WebSocket 实例
      ws: null,
      // 消息列表
      messages: [],
      // 输入消息
      inputMessage: '',
      // 连接状态
      connectionStatus: 'disconnected'
    };
  },

  computed: {
    // 状态文本
    statusText() {
      const statusMap = {
        connected: '已连接',
        disconnected: '已断开',
        connecting: '连接中'
      };
      return statusMap[this.connectionStatus];
    }
  },

  created() {
    // 初始化 WebSocket
    this.initWebSocket();
  },

  mounted() {
    // 添加事件监听
    this.addEventListeners();
  },

  beforeDestroy() {
    // 清理 WebSocket 连接
    this.cleanup();
  },

  methods: {
    // 初始化 WebSocket
    initWebSocket() {
      this.ws = new WebSocketClient({
        url: 'ws://your-websocket-server.com',
        heartbeatInterval: 30000,
        reconnectLimit: 5
      });

      this.ws.connect();
    },

    // 添加事件监听
    addEventListeners() {
      // 监听消息
      this.ws.on('message', this.handleMessage);
      
      // 监听连接状态
      this.ws.on('open', () => {
        this.connectionStatus = 'connected';
      });
      
      this.ws.on('close', () => {
        this.connectionStatus = 'disconnected';
      });
      
      this.ws.on('error', () => {
        this.connectionStatus = 'disconnected';
      });
    },

    // 处理接收到的消息
    handleMessage(payload) {
      this.messages.push({
        id: Date.now(),
        content: payload.content
      });
      
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },

    // 发送消息
    sendMessage() {
      if (!this.inputMessage.trim()) return;
      
      this.ws.send({
        type: 'message',
        payload: {
          content: this.inputMessage,
          timestamp: Date.now()
        }
      });
      
      this.inputMessage = '';
    },

    // 滚动到底部
    scrollToBottom() {
      const messageList = this.$refs.messageList;
      if (messageList) {
        messageList.scrollTop = messageList.scrollHeight;
      }
    },

    // 清理资源
    cleanup() {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
    }
  }
};
</script>

<style scoped>
.chat-room {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 20px;
}

.message-item {
  margin-bottom: 10px;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 4px;
}

.input-area {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.input-area input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.input-area button {
  padding: 8px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.input-area button:hover {
  background: #45a049;
}

.status-bar {
  font-size: 14px;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
}

.status.connected {
  background: #e8f5e9;
  color: #2e7d32;
}

.status.disconnected {
  background: #ffebee;
  color: #c62828;
}

.status.connecting {
  background: #fff3e0;
  color: #ef6c00;
}
</style>
```

### 3. Vuex 集成

```typescript
// store/modules/websocket.ts
import WebSocketClient from '@/utils/websocket';

const state = {
  connectionStatus: 'disconnected',
  messages: [],
  error: null
};

const mutations = {
  SET_CONNECTION_STATUS(state, status) {
    state.connectionStatus = status;
  },
  
  ADD_MESSAGE(state, message) {
    state.messages.push(message);
  },
  
  SET_ERROR(state, error) {
    state.error = error;
  },
  
  CLEAR_MESSAGES(state) {
    state.messages = [];
  }
};

const actions = {
  initWebSocket({ commit, dispatch }) {
    const ws = new WebSocketClient({
      url: 'ws://your-websocket-server.com',
      heartbeatInterval: 30000,
      reconnectLimit: 5
    });

    // 连接事件处理
    ws.on('open', () => {
      commit('SET_CONNECTION_STATUS', 'connected');
    });

    ws.on('close', () => {
      commit('SET_CONNECTION_STATUS', 'disconnected');
    });

    ws.on('error', (error) => {
      commit('SET_ERROR', error);
      commit('SET_CONNECTION_STATUS', 'disconnected');
    });

    // 消息处理
    ws.on('message', (payload) => {
      commit('ADD_MESSAGE', {
        id: Date.now(),
        content: payload.content,
        timestamp: payload.timestamp
      });
    });

    // 保存 WebSocket 实例
    commit('SET_WEBSOCKET', ws);
    
    // 连接 WebSocket
    ws.connect();
  },

  sendMessage({ state }, message) {
    const ws = state.ws;
    if (ws && state.connectionStatus === 'connected') {
      ws.send({
        type: 'message',
        payload: {
          content: message,
          timestamp: Date.now()
        }
      });
    }
  },

  closeWebSocket({ state, commit }) {
    if (state.ws) {
      state.ws.close();
      commit('SET_WEBSOCKET', null);
      commit('SET_CONNECTION_STATUS', 'disconnected');
    }
  }
};

const getters = {
  isConnected: state => state.connectionStatus === 'connected',
  messageCount: state => state.messages.length,
  lastMessage: state => state.messages[state.messages.length - 1]
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
```

## 性能优化策略

### 1. 消息队列管理

```typescript
// 消息队列管理器
class MessageQueue {
  private queue: any[] = [];
  private maxSize: number;
  private batchSize: number;
  private batchInterval: number;
  private timer: number | null = null;

  constructor(options = {
    maxSize: 1000,
    batchSize: 50,
    batchInterval: 1000
  }) {
    this.maxSize = options.maxSize;
    this.batchSize = options.batchSize;
    this.batchInterval = options.batchInterval;
  }

  // 添加消息
  push(message: any) {
    if (this.queue.length >= this.maxSize) {
      this.queue.shift(); // 移除最旧的消息
    }
    this.queue.push(message);
  }

  // 批量处理消息
  process(callback: (messages: any[]) => void) {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = window.setTimeout(() => {
      const batch = this.queue.splice(0, this.batchSize);
      if (batch.length > 0) {
        callback(batch);
      }
    }, this.batchInterval);
  }

  // 清空队列
  clear() {
    this.queue = [];
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
```

### 2. 消息压缩

```typescript
// 消息压缩工具
class MessageCompressor {
  // 压缩消息
  static compress(message: any): string {
    const jsonString = JSON.stringify(message);
    // 使用简单的压缩算法
    return jsonString
      .replace(/"([^"]+)":/g, '$1:') // 移除属性名引号
      .replace(/\s+/g, '') // 移除空白字符
      .replace(/"([^"]+)"/g, "'$1'"); // 使用单引号
  }

  // 解压消息
  static decompress(compressed: string): any {
    try {
      // 还原压缩的消息
      const jsonString = compressed
        .replace(/([a-zA-Z0-9_]+):/g, '"$1":') // 还原属性名引号
        .replace(/'([^']+)'/g, '"$1"'); // 还原双引号
      
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('消息解压失败:', error);
      return null;
    }
  }
}
```

### 3. 断线重连优化

```typescript
// 断线重连管理器
class ReconnectionManager {
  private reconnectCount = 0;
  private maxReconnectAttempts: number;
  private baseDelay: number;
  private maxDelay: number;
  private currentDelay: number;

  constructor(options = {
    maxReconnectAttempts: 5,
    baseDelay: 1000,
    maxDelay: 30000
  }) {
    this.maxReconnectAttempts = options.maxReconnectAttempts;
    this.baseDelay = options.baseDelay;
    this.maxDelay = options.maxDelay;
    this.currentDelay = this.baseDelay;
  }

  // 计算下次重连延迟
  getNextDelay(): number {
    if (this.reconnectCount >= this.maxReconnectAttempts) {
      return -1; // 超过最大重试次数
    }

    // 使用指数退避算法
    this.currentDelay = Math.min(
      this.currentDelay * 1.5,
      this.maxDelay
    );
    
    this.reconnectCount++;
    return this.currentDelay;
  }

  // 重置重连状态
  reset() {
    this.reconnectCount = 0;
    this.currentDelay = this.baseDelay;
  }

  // 检查是否可以重连
  canReconnect(): boolean {
    return this.reconnectCount < this.maxReconnectAttempts;
  }
}
```

## 最佳实践

### 1. 错误处理

```typescript
// WebSocket 错误处理
class WebSocketErrorHandler {
  private static readonly ERROR_TYPES = {
    CONNECTION_FAILED: 'CONNECTION_FAILED',
    MESSAGE_PARSE_ERROR: 'MESSAGE_PARSE_ERROR',
    TIMEOUT: 'TIMEOUT',
    NETWORK_ERROR: 'NETWORK_ERROR'
  };

  // 处理错误
  static handleError(error: any, type: string) {
    console.error(`WebSocket ${type} 错误:`, error);

    // 错误上报
    this.reportError({
      type,
      message: error.message,
      timestamp: Date.now(),
      stack: error.stack
    });

    // 根据错误类型采取不同措施
    switch (type) {
      case this.ERROR_TYPES.CONNECTION_FAILED:
        // 处理连接失败
        break;
      case this.ERROR_TYPES.MESSAGE_PARSE_ERROR:
        // 处理消息解析错误
        break;
      case this.ERROR_TYPES.TIMEOUT:
        // 处理超时
        break;
      case this.ERROR_TYPES.NETWORK_ERROR:
        // 处理网络错误
        break;
    }
  }

  // 错误上报
  private static reportError(error: any) {
    // 实现错误上报逻辑
    // 可以发送到监控系统或日志服务器
  }
}
```

### 2. 安全性考虑

```typescript
// WebSocket 安全工具
class WebSocketSecurity {
  // 消息加密
  static encrypt(message: any, key: string): string {
    // 实现消息加密逻辑
    // 可以使用 AES 等加密算法
    return message;
  }

  // 消息解密
  static decrypt(encrypted: string, key: string): any {
    // 实现消息解密逻辑
    return encrypted;
  }

  // 验证消息签名
  static verifySignature(message: any, signature: string, key: string): boolean {
    // 实现签名验证逻辑
    return true;
  }

  // 生成消息签名
  static generateSignature(message: any, key: string): string {
    // 实现签名生成逻辑
    return '';
  }
}
```

### 3. 监控和日志

```typescript
// WebSocket 监控工具
class WebSocketMonitor {
  private static metrics = {
    messagesSent: 0,
    messagesReceived: 0,
    errors: 0,
    reconnects: 0,
    latency: [] as number[]
  };

  // 记录消息发送
  static recordMessageSent() {
    this.metrics.messagesSent++;
  }

  // 记录消息接收
  static recordMessageReceived() {
    this.metrics.messagesReceived++;
  }

  // 记录错误
  static recordError() {
    this.metrics.errors++;
  }

  // 记录重连
  static recordReconnect() {
    this.metrics.reconnects++;
  }

  // 记录延迟
  static recordLatency(latency: number) {
    this.metrics.latency.push(latency);
    if (this.metrics.latency.length > 100) {
      this.metrics.latency.shift();
    }
  }

  // 获取性能指标
  static getMetrics() {
    return {
      ...this.metrics,
      averageLatency: this.calculateAverageLatency()
    };
  }

  // 计算平均延迟
  private static calculateAverageLatency(): number {
    if (this.metrics.latency.length === 0) return 0;
    const sum = this.metrics.latency.reduce((a, b) => a + b, 0);
    return sum / this.metrics.latency.length;
  }
}
```

## 注意事项

1. **连接管理**
   - 合理设置心跳间隔
   - 实现可靠的断线重连机制
   - 注意资源释放和清理

2. **消息处理**
   - 实现消息队列管理
   - 考虑消息压缩
   - 处理消息丢失和重复

3. **性能优化**
   - 使用消息批处理
   - 实现消息压缩
   - 优化重连策略

4. **安全性**
   - 实现消息加密
   - 添加消息签名验证
   - 防止重放攻击

5. **监控和调试**
   - 实现性能监控
   - 记录关键日志
   - 设置告警机制

## Vue 2 特定注意事项

1. **生命周期管理**
   - 在 `created` 钩子中初始化 WebSocket
   - 在 `beforeDestroy` 钩子中清理资源
   - 使用 `this.$nextTick` 处理 DOM 更新

2. **Vuex 集成**
   - 使用 Vuex 管理 WebSocket 状态
   - 通过 actions 处理异步操作
   - 使用 getters 获取派生状态

3. **组件通信**
   - 使用事件总线（EventBus）处理跨组件通信
   - 合理使用 props 和 events
   - 避免过度依赖全局状态

4. **性能考虑**
   - 使用 `v-once` 处理静态内容
   - 合理使用计算属性和侦听器
   - 避免不必要的组件重渲染

## 相关资源

- [WebSocket MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)
- [Vue 2 官方文档](https://cn.vuejs.org/v2/guide/)
- [Vuex 官方文档](https://vuex.vuejs.org/zh/)
- [WebSocket 协议规范](https://tools.ietf.org/html/rfc6455) 