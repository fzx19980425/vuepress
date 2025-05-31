 # Electron 日志管理

## 日志系统设计

### 日志级别
1. 标准日志级别
   - ERROR: 错误信息
   - WARN: 警告信息
   - INFO: 一般信息
   - DEBUG: 调试信息
   - TRACE: 跟踪信息

2. 自定义日志级别
```javascript
const logLevels = {
  FATAL: 0,   // 致命错误
  ERROR: 1,   // 错误
  WARN: 2,    // 警告
  INFO: 3,    // 信息
  DEBUG: 4,   // 调试
  TRACE: 5    // 跟踪
};
```

### 日志格式
1. 基本格式
```javascript
{
  timestamp: '2024-01-20T10:30:00.000Z',
  level: 'INFO',
  message: '应用启动成功',
  context: {
    process: 'main',
    window: 'main-window',
    version: '1.0.0'
  }
}
```

2. 格式化配置
```javascript
const logFormat = {
  timestamp: () => new Date().toISOString(),
  level: (info) => info.level.toUpperCase(),
  message: (info) => info.message,
  context: (info) => JSON.stringify(info.context)
};
```

## 日志实现

### 使用 electron-log
1. 基本配置
```javascript
const log = require('electron-log');

// 配置日志
log.transports.file.level = 'info';
log.transports.file.maxSize = 10 * 1024 * 1024; // 10MB
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}] [{level}] {text}';

// 配置控制台输出
log.transports.console.level = 'debug';
log.transports.console.format = '[{level}] {text}';

// 配置日志文件路径
log.transports.file.resolvePath = () => path.join(app.getPath('userData'), 'logs/main.log');
```

2. 日志记录
```javascript
// 不同级别的日志
log.error('发生错误', new Error('错误详情'));
log.warn('警告信息');
log.info('普通信息');
log.debug('调试信息');
log.verbose('详细信息');

// 带上下文的日志
log.info('用户操作', {
  userId: '123',
  action: 'login',
  timestamp: Date.now()
});

// 异常日志
try {
  // 可能出错的代码
} catch (error) {
  log.error('操作失败', {
    error: error.message,
    stack: error.stack,
    context: { /* 上下文信息 */ }
  });
}
```

### 自定义日志系统
1. 日志类实现
```javascript
class Logger {
  constructor(options = {}) {
    this.level = options.level || 'info';
    this.format = options.format || this.defaultFormat;
    this.transports = options.transports || [];
  }

  log(level, message, context = {}) {
    if (this.shouldLog(level)) {
      const logEntry = this.format({
        timestamp: new Date(),
        level,
        message,
        context
      });

      this.transports.forEach(transport => {
        transport.write(logEntry);
      });
    }
  }

  shouldLog(level) {
    return logLevels[level] <= logLevels[this.level];
  }

  defaultFormat(entry) {
    return JSON.stringify(entry) + '\n';
  }
}
```

2. 日志传输器
```javascript
// 文件传输器
class FileTransport {
  constructor(options) {
    this.filePath = options.filePath;
    this.maxSize = options.maxSize || 10 * 1024 * 1024;
    this.currentSize = 0;
  }

  write(entry) {
    if (this.currentSize >= this.maxSize) {
      this.rotate();
    }

    fs.appendFileSync(this.filePath, entry);
    this.currentSize += entry.length;
  }

  rotate() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const newPath = `${this.filePath}.${timestamp}`;
    fs.renameSync(this.filePath, newPath);
    this.currentSize = 0;
  }
}

// 控制台传输器
class ConsoleTransport {
  write(entry) {
    const { level, message, context } = JSON.parse(entry);
    console[level.toLowerCase()](message, context);
  }
}
```

## 日志管理

### 日志轮转
1. 基于大小轮转
```javascript
const winston = require('winston');
require('winston-daily-rotate-file');

const transport = new winston.transports.DailyRotateFile({
  filename: 'application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  zippedArchive: true
});

const logger = winston.createLogger({
  transports: [transport]
});
```

2. 基于时间轮转
```javascript
const logrotate = require('logrotate-stream');

const stream = logrotate({
  file: 'application.log',
  size: '10m',
  keep: 5,
  compress: true
});

stream.write('日志内容\n');
```

### 日志清理
1. 自动清理
```javascript
function cleanupLogs() {
  const logDir = path.join(app.getPath('userData'), 'logs');
  const maxAge = 30 * 24 * 60 * 60 * 1000; // 30天

  fs.readdir(logDir, (err, files) => {
    if (err) return;

    files.forEach(file => {
      const filePath = path.join(logDir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return;

        if (Date.now() - stats.mtime.getTime() > maxAge) {
          fs.unlink(filePath, err => {
            if (err) log.error('删除日志文件失败', err);
          });
        }
      });
    });
  });
}
```

2. 手动清理
```javascript
function clearLogs(options = {}) {
  const {
    before = new Date(),
    level = 'debug',
    maxSize = 100 * 1024 * 1024 // 100MB
  } = options;

  // 清理指定时间之前的日志
  if (before) {
    // 实现清理逻辑
  }

  // 清理指定级别以下的日志
  if (level) {
    // 实现清理逻辑
  }

  // 限制日志总大小
  if (maxSize) {
    // 实现清理逻辑
  }
}
```

## 日志分析

### 日志查询
1. 基本查询
```javascript
class LogQuery {
  constructor(logPath) {
    this.logPath = logPath;
  }

  async search(options) {
    const {
      level,
      startTime,
      endTime,
      keyword
    } = options;

    const logs = await this.readLogs();
    return logs.filter(log => {
      if (level && log.level !== level) return false;
      if (startTime && new Date(log.timestamp) < startTime) return false;
      if (endTime && new Date(log.timestamp) > endTime) return false;
      if (keyword && !log.message.includes(keyword)) return false;
      return true;
    });
  }

  async readLogs() {
    // 实现日志读取逻辑
  }
}
```

2. 高级查询
```javascript
class AdvancedLogQuery extends LogQuery {
  async searchByPattern(pattern) {
    const logs = await this.readLogs();
    const regex = new RegExp(pattern);
    return logs.filter(log => regex.test(log.message));
  }

  async searchByContext(context) {
    const logs = await this.readLogs();
    return logs.filter(log => {
      return Object.entries(context).every(([key, value]) => {
        return log.context[key] === value;
      });
    });
  }
}
```

### 日志分析
1. 错误分析
```javascript
async function analyzeErrors() {
  const query = new LogQuery('application.log');
  const errors = await query.search({ level: 'error' });

  const errorStats = errors.reduce((stats, error) => {
    const type = error.context.errorType || 'unknown';
    stats[type] = (stats[type] || 0) + 1;
    return stats;
  }, {});

  return {
    totalErrors: errors.length,
    errorTypes: errorStats,
    mostCommonError: Object.entries(errorStats)
      .sort((a, b) => b[1] - a[1])[0]
  };
}
```

2. 性能分析
```javascript
async function analyzePerformance() {
  const query = new LogQuery('application.log');
  const perfLogs = await query.search({
    level: 'info',
    keyword: 'performance'
  });

  return perfLogs.reduce((stats, log) => {
    const { operation, duration } = log.context;
    if (!stats[operation]) {
      stats[operation] = {
        count: 0,
        totalDuration: 0,
        min: Infinity,
        max: 0
      };
    }

    stats[operation].count++;
    stats[operation].totalDuration += duration;
    stats[operation].min = Math.min(stats[operation].min, duration);
    stats[operation].max = Math.max(stats[operation].max, duration);

    return stats;
  }, {});
}
```

## 最佳实践

### 1. 日志记录
- 使用合适的日志级别
- 包含必要的上下文信息
- 避免记录敏感信息
- 使用结构化日志格式

### 2. 日志管理
- 实现日志轮转
- 定期清理旧日志
- 压缩归档日志
- 监控日志大小

### 3. 日志分析
- 实现日志查询功能
- 分析错误模式
- 监控性能指标
- 生成分析报告

### 4. 安全考虑
- 加密敏感日志
- 控制日志访问权限
- 实现日志审计
- 保护日志完整性

## 相关资源

- [electron-log 文档](https://github.com/megahertz/electron-log)
- [Winston 日志库](https://github.com/winstonjs/winston)
- [日志最佳实践](https://www.electronjs.org/docs/tutorial/logging)
- [日志分析工具](https://www.elastic.co/products/logstash)