 # 本地存储方案最佳实践

## 1. 基础存储实现

```typescript
// storage-manager.ts
import Store from 'electron-store'
import { app } from 'electron'
import * as path from 'path'
import * as fs from 'fs/promises'

export class StorageManager {
  private store: Store
  private fileStore: Map<string, string> = new Map()

  constructor() {
    // 初始化 electron-store
    this.store = new Store({
      name: 'app-config', // 配置文件名
      encryptionKey: 'your-encryption-key', // 加密密钥
      schema: {
        // 定义配置模式
        theme: {
          type: 'string',
          default: 'light'
        },
        language: {
          type: 'string',
          default: 'zh-CN'
        },
        autoUpdate: {
          type: 'boolean',
          default: true
        },
        windowBounds: {
          type: 'object',
          default: {
            width: 800,
            height: 600,
            x: 0,
            y: 0
          }
        }
      }
    })

    // 初始化文件存储目录
    this.initFileStorage()
  }

  // 初始化文件存储
  private async initFileStorage() {
    const storagePath = path.join(app.getPath('userData'), 'storage')
    try {
      await fs.mkdir(storagePath, { recursive: true })
    } catch (error) {
      console.error('创建存储目录失败:', error)
    }
  }

  // 获取配置值
  get<T>(key: string, defaultValue?: T): T {
    return this.store.get(key, defaultValue) as T
  }

  // 设置配置值
  set(key: string, value: any): void {
    this.store.set(key, value)
  }

  // 删除配置值
  delete(key: string): void {
    this.store.delete(key)
  }

  // 清除所有配置
  clear(): void {
    this.store.clear()
  }

  // 监听配置变化
  onDidChange(key: string, callback: (newValue: any, oldValue: any) => void): void {
    this.store.onDidChange(key, callback)
  }

  // 获取所有配置
  getAll(): Record<string, any> {
    return this.store.store
  }

  // 重置为默认值
  reset(): void {
    this.store.reset()
  }
}
```

## 2. 文件存储实现

```typescript
// file-storage.ts
import { app } from 'electron'
import * as path from 'path'
import * as fs from 'fs/promises'
import * as crypto from 'crypto'

export class FileStorage {
  private storagePath: string
  private cache: Map<string, Buffer> = new Map()

  constructor() {
    this.storagePath = path.join(app.getPath('userData'), 'files')
    this.initStorage()
  }

  // 初始化存储
  private async initStorage() {
    try {
      await fs.mkdir(this.storagePath, { recursive: true })
    } catch (error) {
      console.error('创建文件存储目录失败:', error)
    }
  }

  // 保存文件
  async saveFile(fileName: string, data: Buffer | string): Promise<string> {
    const filePath = this.getFilePath(fileName)
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data)
    
    // 计算文件哈希
    const hash = this.calculateHash(buffer)
    const finalPath = path.join(this.storagePath, `${hash}-${fileName}`)

    try {
      await fs.writeFile(finalPath, buffer)
      this.cache.set(fileName, buffer)
      return finalPath
    } catch (error) {
      console.error('保存文件失败:', error)
      throw error
    }
  }

  // 读取文件
  async readFile(fileName: string): Promise<Buffer> {
    // 检查缓存
    if (this.cache.has(fileName)) {
      return this.cache.get(fileName)!
    }

    const filePath = this.getFilePath(fileName)
    try {
      const data = await fs.readFile(filePath)
      this.cache.set(fileName, data)
      return data
    } catch (error) {
      console.error('读取文件失败:', error)
      throw error
    }
  }

  // 删除文件
  async deleteFile(fileName: string): Promise<void> {
    const filePath = this.getFilePath(fileName)
    try {
      await fs.unlink(filePath)
      this.cache.delete(fileName)
    } catch (error) {
      console.error('删除文件失败:', error)
      throw error
    }
  }

  // 获取文件路径
  private getFilePath(fileName: string): string {
    return path.join(this.storagePath, fileName)
  }

  // 计算文件哈希
  private calculateHash(data: Buffer): string {
    return crypto.createHash('sha256').update(data).digest('hex')
  }

  // 清理缓存
  clearCache(): void {
    this.cache.clear()
  }

  // 获取存储统计信息
  async getStorageStats(): Promise<{
    totalSize: number
    fileCount: number
    files: Array<{ name: string; size: number }>
  }> {
    const files = await fs.readdir(this.storagePath)
    const stats = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(this.storagePath, file)
        const stat = await fs.stat(filePath)
        return {
          name: file,
          size: stat.size
        }
      })
    )

    return {
      totalSize: stats.reduce((sum, file) => sum + file.size, 0),
      fileCount: stats.length,
      files: stats
    }
  }
}
```

## 3. 数据库存储实现

```typescript
// database-storage.ts
import Database from 'better-sqlite3'
import { app } from 'electron'
import * as path from 'path'

export class DatabaseStorage {
  private db: Database.Database

  constructor() {
    const dbPath = path.join(app.getPath('userData'), 'database.sqlite')
    this.db = new Database(dbPath)
    this.initDatabase()
  }

  // 初始化数据库
  private initDatabase() {
    // 创建用户表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 创建设置表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 创建日志表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        level TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
  }

  // 插入数据
  insert(table: string, data: Record<string, any>): number {
    const keys = Object.keys(data)
    const values = Object.values(data)
    const placeholders = keys.map(() => '?').join(', ')
    
    const stmt = this.db.prepare(`
      INSERT INTO ${table} (${keys.join(', ')})
      VALUES (${placeholders})
    `)

    const result = stmt.run(...values)
    return result.lastInsertRowid as number
  }

  // 更新数据
  update(table: string, data: Record<string, any>, where: string, params: any[]): number {
    const setClause = Object.keys(data)
      .map(key => `${key} = ?`)
      .join(', ')
    
    const stmt = this.db.prepare(`
      UPDATE ${table}
      SET ${setClause}
      WHERE ${where}
    `)

    const result = stmt.run(...Object.values(data), ...params)
    return result.changes
  }

  // 查询数据
  query<T>(table: string, where?: string, params: any[] = []): T[] {
    const sql = where
      ? `SELECT * FROM ${table} WHERE ${where}`
      : `SELECT * FROM ${table}`
    
    const stmt = this.db.prepare(sql)
    return stmt.all(...params) as T[]
  }

  // 删除数据
  delete(table: string, where: string, params: any[]): number {
    const stmt = this.db.prepare(`
      DELETE FROM ${table}
      WHERE ${where}
    `)

    const result = stmt.run(...params)
    return result.changes
  }

  // 事务处理
  transaction<T>(callback: (db: Database.Database) => T): T {
    return this.db.transaction(callback)()
  }

  // 备份数据库
  async backup(backupPath: string): Promise<void> {
    await this.db.backup(backupPath)
  }

  // 优化数据库
  optimize(): void {
    this.db.pragma('optimize')
  }

  // 关闭数据库
  close(): void {
    this.db.close()
  }
}
```

## 4. 缓存管理实现

```typescript
// cache-manager.ts
import { app } from 'electron'
import * as path from 'path'
import * as fs from 'fs/promises'
import * as crypto from 'crypto'

export class CacheManager {
  private cachePath: string
  private memoryCache: Map<string, {
    data: any
    expiry: number
  }> = new Map()

  constructor() {
    this.cachePath = path.join(app.getPath('userData'), 'cache')
    this.initCache()
  }

  // 初始化缓存
  private async initCache() {
    try {
      await fs.mkdir(this.cachePath, { recursive: true })
    } catch (error) {
      console.error('创建缓存目录失败:', error)
    }
  }

  // 设置缓存
  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    const hash = this.hashKey(key)
    const cacheFile = path.join(this.cachePath, hash)
    const expiry = Date.now() + ttl * 1000

    const cacheData = {
      value,
      expiry
    }

    // 保存到内存缓存
    this.memoryCache.set(key, {
      data: value,
      expiry
    })

    // 保存到文件缓存
    try {
      await fs.writeFile(cacheFile, JSON.stringify(cacheData))
    } catch (error) {
      console.error('保存缓存失败:', error)
    }
  }

  // 获取缓存
  async get<T>(key: string): Promise<T | null> {
    // 检查内存缓存
    const memoryCache = this.memoryCache.get(key)
    if (memoryCache && memoryCache.expiry > Date.now()) {
      return memoryCache.data as T
    }

    // 检查文件缓存
    const hash = this.hashKey(key)
    const cacheFile = path.join(this.cachePath, hash)

    try {
      const data = await fs.readFile(cacheFile, 'utf-8')
      const cacheData = JSON.parse(data)

      if (cacheData.expiry > Date.now()) {
        // 更新内存缓存
        this.memoryCache.set(key, {
          data: cacheData.value,
          expiry: cacheData.expiry
        })
        return cacheData.value as T
      } else {
        // 删除过期缓存
        await this.delete(key)
      }
    } catch (error) {
      // 缓存不存在或读取失败
    }

    return null
  }

  // 删除缓存
  async delete(key: string): Promise<void> {
    const hash = this.hashKey(key)
    const cacheFile = path.join(this.cachePath, hash)

    // 删除内存缓存
    this.memoryCache.delete(key)

    // 删除文件缓存
    try {
      await fs.unlink(cacheFile)
    } catch (error) {
      // 文件可能不存在
    }
  }

  // 清理过期缓存
  async cleanup(): Promise<void> {
    const now = Date.now()

    // 清理内存缓存
    for (const [key, cache] of this.memoryCache.entries()) {
      if (cache.expiry <= now) {
        this.memoryCache.delete(key)
      }
    }

    // 清理文件缓存
    try {
      const files = await fs.readdir(this.cachePath)
      for (const file of files) {
        const filePath = path.join(this.cachePath, file)
        const data = await fs.readFile(filePath, 'utf-8')
        const cacheData = JSON.parse(data)

        if (cacheData.expiry <= now) {
          await fs.unlink(filePath)
        }
      }
    } catch (error) {
      console.error('清理缓存失败:', error)
    }
  }

  // 计算缓存键的哈希值
  private hashKey(key: string): string {
    return crypto.createHash('md5').update(key).digest('hex')
  }

  // 获取缓存统计信息
  async getStats(): Promise<{
    memoryCacheSize: number
    fileCacheSize: number
    fileCount: number
  }> {
    let fileCacheSize = 0
    let fileCount = 0

    try {
      const files = await fs.readdir(this.cachePath)
      fileCount = files.length

      for (const file of files) {
        const filePath = path.join(this.cachePath, file)
        const stat = await fs.stat(filePath)
        fileCacheSize += stat.size
      }
    } catch (error) {
      console.error('获取缓存统计信息失败:', error)
    }

    return {
      memoryCacheSize: this.memoryCache.size,
      fileCacheSize,
      fileCount
    }
  }
}
```

## 5. 最佳实践总结

### 5.1 数据安全
1. 使用加密存储敏感数据
2. 实现数据备份机制
3. 定期清理过期数据
4. 验证数据完整性
5. 实现访问控制

### 5.2 性能优化
1. 使用内存缓存
2. 实现数据压缩
3. 优化数据库查询
4. 使用批量操作
5. 实现懒加载

### 5.3 错误处理
1. 实现数据恢复机制
2. 处理存储空间不足
3. 处理文件损坏
4. 实现重试机制
5. 记录错误日志

### 5.4 用户体验
1. 实现数据同步
2. 提供进度反馈
3. 支持数据导出
4. 实现自动备份
5. 提供数据统计

### 5.5 跨平台兼容
1. 处理路径差异
2. 适配不同文件系统
3. 处理编码问题
4. 考虑权限差异
5. 测试不同平台

## 6. 常见问题解决方案

### 6.1 存储空间管理
```typescript
class StorageSpaceManager {
  private readonly maxStorageSize = 1024 * 1024 * 1024 // 1GB

  async checkStorageSpace(): Promise<boolean> {
    const stats = await this.getStorageStats()
    return stats.totalSize < this.maxStorageSize
  }

  async cleanupOldData(): Promise<void> {
    const stats = await this.getStorageStats()
    if (stats.totalSize >= this.maxStorageSize) {
      // 实现清理策略
    }
  }
}
```

### 6.2 数据同步
```typescript
class DataSyncManager {
  private syncQueue: Array<{
    operation: 'create' | 'update' | 'delete'
    data: any
  }> = []

  async syncData(): Promise<void> {
    while (this.syncQueue.length > 0) {
      const operation = this.syncQueue.shift()!
      await this.processSyncOperation(operation)
    }
  }

  private async processSyncOperation(operation: any): Promise<void> {
    // 实现同步逻辑
  }
}
```

### 6.3 数据迁移
```typescript
class DataMigrationManager {
  async migrateData(fromVersion: string, toVersion: string): Promise<void> {
    // 实现数据迁移逻辑
    const migrations = this.getMigrations(fromVersion, toVersion)
    for (const migration of migrations) {
      await this.applyMigration(migration)
    }
  }

  private getMigrations(fromVersion: string, toVersion: string): any[] {
    // 获取需要执行的迁移
    return []
  }

  private async applyMigration(migration: any): Promise<void> {
    // 应用迁移
  }
}
```