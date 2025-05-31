module.exports = {
  base: '/welcome/',
  title: '胖虎 博客',
  description: '胖虎 个人技术博客',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      {
        text: '前端', items: [
          { text: 'HTML', link: '/frontend/html/' },
          { text: 'CSS', link: '/frontend/css/' },
          { text: 'JavaScript', link: '/frontend/js/' },
          { text: 'TypeScript', link: '/frontend/ts/' },
          { text: 'Vue', link: '/frontend/vue/' },
          { text: 'React', link: '/frontend/react/' },
          { text: 'jQuery', link: '/frontend/jquery/' },
          { text: '动画', link: '/frontend/animation/' },
          { text: 'uni-app', link: '/frontend/uni-app/' },
          { text: '微信小程序', link: '/frontend/weixin/' },
          { text: 'Electron', link: '/frontend/electron/' },
          { text: 'Node.js', link: '/frontend/node/' }
        ]
      },
      {
        text: 'UI',
        items: [
          { text: '设计规范', link: '/ui/' },
        ]
      },
      {
        text: '关于我',
        items: [
          { text: 'Github', link: 'https://github.com/fzx19980425' },
          { text: 'Gitee', link: 'https://gitee.com/fzx0425' },
          { text: '掘金', link: 'https://juejin.cn/user/1900382830734376' }
        ]
      }
    ],
    sidebar: {
      '/frontend/html/': [
        {
          title: 'HTML 基础',
          collapsable: true,
          children: [
            ['', 'HTML 简介'],
            ['basic', 'HTML 基础'],
            ['tags', '常用 HTML 标签'],
            ['html5', 'HTML5 新特性'],
            ['semantic', 'HTML 语义化'],
            ['forms', 'HTML 表单']
          ]
        }
      ],
      '/frontend/css/': [
        {
          title: 'CSS 基础',
          collapsable: true,
          children: [
            ['', 'CSS简介'],
            ['basics', '基础概念'],
            ['box-model', '盒模型'],
            ['layout-basics', '布局基础'],
            ['flexbox', 'Flexbox布局'],
            ['grid', 'Grid布局'],
            ['variables', 'CSS变量'],
            ['animation', '动画效果']
          ]
        },
        {
          title: 'CSS 布局',
          collapsable: true,
          children: [
            ['responsive', '响应式布局'],
            ['architecture', '架构设计']
          ]
        },
        {
          title: 'CSS 预处理器',
          collapsable: true,
          children: [
            ['sass', 'Sass/SCSS'],
            ['less', 'Less']
          ]
        },
        {
          title: 'CSS 兼容性',
          collapsable: true,
          children: [
            ['compatibility', '浏览器兼容'],
            ['prefixes', '浏览器前缀']
          ]
        },
        {
          title: 'CSS 工具资源',
          collapsable: true,
          children: [
            ['tools', '开发工具'],
            ['resources', '学习资源'],
            ['performance', '性能优化']
          ]
        }
      ],
      '/frontend/animation/': [
        {
          title: '动画基础',
          collapsable: true,
          children: [
            ['', '动画简介'],
            ['principles', '动画原理'],
            ['css3', 'CSS3 动画基础'],
            ['transitions', 'CSS 过渡'],
            ['keyframes', '关键帧动画'],
            ['transform', 'CSS 变换'],
            ['filters', 'CSS 滤镜'],
            ['css3-examples', 'CSS3 动画示例']
          ]
        },
        {
          title: 'JavaScript 动画',
          collapsable: true,
          children: [
            ['javascript', 'JavaScript 动画基础'],
            ['request-animation-frame', 'requestAnimationFrame'],
            ['animation-libraries', '动画库概览'],
            ['gsap', 'GSAP 动画库'],
            ['lottie', 'Lottie 动画']
          ]
        },
        {
          title: 'Canvas 动画',
          collapsable: true,
          children: [
            ['canvas', 'Canvas 基础'],
            ['canvas-animation', 'Canvas 动画'],
            ['canvas-examples', 'Canvas 示例'],
            ['canvas-games', 'Canvas 游戏开发']
          ]
        },
        {
          title: 'SVG 动画',
          collapsable: true,
          children: [
            ['svg', 'SVG 基础'],
            ['svg-morphing', 'SVG 变形动画'],
            ['svg-examples', 'SVG 动画示例']
          ]
        },
        {
          title: '3D 动画',
          collapsable: true,
          children: [
            ['webgl', 'WebGL 基础'],
            ['threejs', 'Three.js 基础'],
            ['threejs-examples', 'Three.js 示例'],
            ['cesium', 'Cesium 基础'],
            ['cesium-examples', 'Cesium 示例']
          ]
        },
        {
          title: '数据可视化',
          collapsable: true,
          children: [
            ['echarts', 'ECharts 数据可视化'],
            ['echarts-examples', 'ECharts 示例']
          ]
        },
        {
          title: '高级主题',
          collapsable: true,
          children: [
            ['advanced-examples', '高级动画示例'],
            ['performance', '性能优化'],
            ['best-practices', '最佳实践']
          ]
        },
        {
          title: '工具与资源',
          collapsable: true,
          children: [
            ['tools', '动画开发工具'],
            ['resources', '学习资源']
          ]
        }
      ],
      '/frontend/vue/': [
        {
          title: 'Vue 概述',
          collapsable: true,
          children: [
            ['', 'Vue 简介'],
            ['vue2_overview', 'Vue2 概述'],
            ['vue3_overview', 'Vue3 概述']
          ]
        },
        {
          title: 'Vue2 基础',
          collapsable: true,
          children: [
            ['vue2', '基础概念'],
            ['vue2_full', '详细参考'],
            ['vue2_components', '组件基础'],
            ['vue2_form', '表单处理'],
            ['vue2_table', '表格组件']
          ]
        },
        {
          title: 'Vue2 进阶',
          collapsable: true,
          children: [
            ['vue2_router', '路由管理'],
            ['vue2_vuex', '状态管理'],
            ['vue2_permission', '权限管理'],
            ['vue2_axios', '网络请求'],
            ['vue2_i18n', '国际化'],
            ['vue2_websocket', 'WebSocket']
          ]
        },
        {
          title: 'Vue2 工程化',
          collapsable: true,
          children: [
            ['vue2_standards', '项目规范'],
            ['vue2_performance', '性能优化'],
            ['vue2_testing', '单元测试'],
            ['vue2_deployment', '项目部署'],
            ['vue2_error_handling', '错误处理'],
            ['vue2_security', '安全最佳实践'],
            ['vue2_maintenance', '项目维护'],
            ['vue2_tips', '开发技巧']
          ]
        },
        {
          title: 'Vue3 基础',
          collapsable: true,
          children: [
            ['vue3', '基础概念'],
            ['vue3_full', '详细参考'],
            ['vue3_components', '组件基础'],
            ['vue3_form', '表单处理'],
            ['vue3_table', '表格组件']
          ]
        },
        {
          title: 'Vue3 进阶',
          collapsable: true,
          children: [
            ['vue3_router', '路由管理'],
            ['vue3_pinia', '状态管理'],
            ['vue3_permission', '权限管理'],
            ['vue3_axios', '网络请求'],
            ['vue3_i18n', '国际化'],
            ['vue3_websocket', 'WebSocket'],
            ['vue3_ts', 'TypeScript'],
          ]
        },
        {
          title: 'Vue3 工程化',
          collapsable: true,
          children: [
            ['vue3_standards', '项目规范'],
            ['vue3_performance', '性能优化'],
            ['vue3_testing', '单元测试'],
            ['vue3_deployment', '项目部署'],
            ['vue3_error_handling', '错误处理'],
            ['vue3_security', '安全最佳实践'],
            ['vue3_maintenance', '项目维护'],
            ['vue3_tips', '开发技巧']
          ]
        },
        {
          title: '服务端渲染',
          collapsable: true,
          children: [
            ['ssr', 'SSR 实现']
          ]
        }
      ],
      '/frontend/react/': [
        {
          title: 'React 基础',
          collapsable: true,
          children: [
            ['', 'React 简介'],
            ['basic', '基础教程'],
            ['advanced', '高级特性']
          ]
        },
        {
          title: 'React 进阶',
          collapsable: true,
          children: [
            ['router', '路由管理'],
            ['state-management', '状态管理'],
            ['ssr', '服务端渲染']
          ]
        },
        {
          title: 'React 工程化',
          collapsable: true,
          children: [
            ['performance', '性能优化'],
            ['testing', '测试策略']
          ]
        }
      ],
      '/frontend/weixin/': [
        {
          title: '小程序基础',
          collapsable: true,
          children: [
            ['', '小程序简介'],
            ['basic', '基础概念'],
            ['lifecycle', '生命周期'],
            ['components', '组件开发'],
            ['api', 'API 使用'],
            ['events', '事件系统']
          ]
        }
      ],
      '/frontend/jquery/': [
        {
          title: 'jQuery 基础',
          collapsable: true,
          children: [
            ['', 'jQuery 简介']
          ]
        }
      ],
      '/frontend/uni-app/': [
        {
          title: 'uni-app 基础',
          collapsable: true,
          children: [
            ['', 'uni-app 简介'],
            ['basic', '基础概念'],
            ['lifecycle', '生命周期'],
            ['components', '组件开发'],
            ['framework', '框架特性'],
            ['router', '路由管理'],
            ['state-management', '状态管理'],
            ['network', '网络请求'],
            ['platform', '平台差异'],
            ['performance', '性能优化']
          ]
        }
      ],
      '/frontend/js/': [
        {
          title: 'JavaScript 基础',
          collapsable: true,
          children: [
            ['', 'JavaScript 简介'],
            ['basic', '基础语法'],
            ['data-types', '数据类型'],
            ['operators', '运算符'],
            ['control-flow', '流程控制'],
            ['functions', '函数'],
            ['objects', '对象'],
            ['arrays', '数组'],
            ['dom', 'DOM 操作'],
            ['events', '事件处理']
          ]
        },
        {
          title: 'JavaScript 进阶',
          collapsable: true,
          children: [
            ['es6', 'ES6+ 特性'],
            ['async', '异步编程基础'],
            ['promise', 'Promise'],
            ['async-await', 'Async/Await'],
            ['modules', '模块化'],
            ['oop', '面向对象'],
            ['design-patterns', '设计模式']
          ]
        },
        {
          title: 'JavaScript 工程化',
          collapsable: true,
          children: [
            ['tools', '开发工具'],
            ['debugging', '调试技巧'],
            ['testing', '单元测试'],
            ['performance', '性能优化'],
            ['security', '安全最佳实践']
          ]
        }
      ],
      '/frontend/electron/': [
        {
          title: '基础入门',
          collapsable: true,
          children: [
            ['', 'Electron 开发指南'],
            ['guide/dev-environment', '开发环境配置'],
            ['guide/getting-started', '快速开始'],
            ['guide/main-renderer', '主进程与渲染进程'],
            ['guide/app-lifecycle', '应用生命周期'],
            ['guide/project-structure', '项目结构'],
            ['guide/window-management', '窗口管理'],
            ['guide/ipc', '进程间通信'],
            ['guide/debugging', '调试技巧'],
            ['guide/security', '安全模型']
          ]
        },
        {
          title: '核心功能',
          collapsable: true,
          children: [
            ['features/tray', '系统托盘'],
            ['features/menu', '菜单'],
            ['features/dialog', '对话框'],
            ['features/notification', '通知'],
            ['features/shortcut', '快捷键'],
            ['features/clipboard', '剪贴板'],
            ['features/file-system', '文件系统'],
            ['features/network', '网络请求']
          ]
        },
        {
          title: '进阶主题',
          collapsable: true,
          children: [
            ['advanced/process', '进程管理'],
            ['advanced/logging', '日志管理'],
            ['advanced/crash-report', '崩溃报告'],
            ['advanced/performance', '性能优化'],
            ['advanced/security', '安全加固'],
            ['advanced/packaging', '应用打包'],
            ['advanced/auto-update', '自动更新'],
            ['advanced/i18n', '国际化'],
            ['advanced/storage', '数据存储']
          ]
        },
        {
          title: '实战案例',
          collapsable: true,
          children: [
            ['cases/basic-app', '基础应用开发'],
            ['cases/advanced-app', '进阶应用开发'],
            ['cases/enterprise-app', '企业级应用开发']
          ]
        },
        {
          title: '最佳实践',
          collapsable: true,
          children: [
            ['best-practices/architecture', '架构设计'],
            ['best-practices/development-practices', '开发规范'],
            ['best-practices/security-practices', '安全实践'],
            ['best-practices/testing-practices', '测试实践'],
          ]
        }
      ],
      '/frontend/node/': [
        {
          title: 'Node.js 基础',
          collapsable: true,
          children: [
            ['', 'Node.js 简介'],
            ['basic', '基础概念'],
            ['module', '模块系统'],
            ['npm', '包管理器']
          ]
        },
        {
          title: '核心模块',
          collapsable: true,
          children: [
            ['fs', '文件系统'],
            ['http', 'HTTP 模块'],
            ['process', '进程管理']
          ]
        },
        {
          title: 'Web 开发',
          collapsable: true,
          children: [
            ['express', 'Express 框架'],
            ['middleware', '中间件开发'],
            ['database', '数据库操作']
          ]
        }
      ],
      '/frontend/ts/': [
        {
          title: 'TypeScript 基础',
          collapsable: true,
          children: [
            ['', 'TypeScript 简介'],
            ['basic', '基础概念'],
            ['advanced', '高级特性'],
            ['practice', '实战案例']
          ]
        }
      ],
      '/ui/': [
        {
          title: '设计规范',
          collapsable: true,
          children: [
            ['', ' 设计指南'],
            ['design-principles', '设计原则'],
            ['design-system', '设计系统'],
            ['design-responsive', '响应式设计'],
          ]
        }
      ],
    },
    lastUpdated: '上次更新',
  },
  plugins: [
    '@vuepress/back-to-top',
    '@vuepress/medium-zoom',
    '@vuepress/nprogress',
    [
      '@vuepress/plugin-demo-container',
      {
        components: ['DemoBlock'],
        locales: {
          '/': {
            'hide-text': '隐藏代码',
            'show-text': '显示代码',
            'copy-text': '复制代码',
            'copy-success': '复制成功'
          }
        }
      }
    ]
  ],
  devServer: {
    hot: true,
    open: true
  },
  chainWebpack: (config) => {
    config.watchOptions({
      poll: 1000,
      aggregateTimeout: 300,
    })
  }
}