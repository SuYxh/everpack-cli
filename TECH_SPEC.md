# XKit CLI 技术方案

## 1. 项目概述

### 1.1 项目信息

| 项目 | 值 |
|------|-----|
| **npm 包名** | `@everpack/cli` |
| **CLI 命令** | `xkit` |
| **GitHub 组织** | everpack |

### 1.2 项目背景

开发一款开发者工具 CLI，帮助开发者从 GitHub 模板仓库快速创建项目。该工具旨在简化项目初始化流程，提升开发效率，并支持后续扩展更多开发辅助命令。

### 1.3 核心目标

- **简单易用**：一条命令即可完成项目创建
- **交互友好**：提供清晰的交互式命令行界面
- **模板拉取**：直接从 GitHub 拉取完整模板，无需动态修改
- **易于扩展**：支持后续添加更多命令和功能

### 1.4 使用方式预览

```bash
# 全局安装
npm install -g @everpack/cli

# 交互式创建项目
xkit create

# 指定项目名称
xkit create my-project

# 指定模板
xkit create my-project --template react-pc

# 或者使用 npx（无需安装）
npx @everpack/cli create my-project
```

---

## 2. 技术选型

### 2.1 开发语言

**TypeScript** - 类型安全、IDE 支持好、社区生态丰富

### 2.2 核心依赖库

| 库名 | 用途 | 说明 |
|------|------|------|
| **cac** | 命令行框架 | 轻量级（3kb），支持多命令，Vite 在用 |
| **prompts** | 交互式命令行问答 | 轻量级，API 简洁 |
| **picocolors** | 终端颜色输出 | 零依赖，性能好，体积最小 |
| **giget** | Git 仓库下载 | 支持 GitHub/GitLab/Bitbucket |
| **fs-extra** | 文件系统操作增强 | 提供 copy、remove 等便捷方法 |

### 2.3 构建工具

**unbuild** - Vite/Nuxt 团队维护，支持多种输出格式，开发体验好

#### unbuild 特点：
- 支持 ESM + CJS 双格式输出
- 支持 stub 模式（开发时无需重新打包）
- 自动生成类型声明
- 与 Vite 生态一致

### 2.4 测试框架

**vitest** - Vite 生态测试框架，与项目技术栈一致

---

## 3. 项目架构

### 3.1 目录结构

```
@everpack/cli/
├── src/
│   ├── index.ts              # CLI 入口
│   ├── commands/             # 命令目录（易扩展）
│   │   ├── index.ts          # 命令注册
│   │   └── create.ts         # create 命令
│   ├── config/               # 配置目录
│   │   ├── index.ts          # 配置导出
│   │   └── templates.ts      # 模板配置
│   ├── utils/
│   │   ├── index.ts          # 工具导出
│   │   ├── logger.ts         # 日志输出
│   │   └── error.ts          # 错误处理
│   └── __tests__/            # 单元测试
│       ├── config.test.ts    # 配置测试
│       └── error.test.ts     # 错误处理测试
├── package.json
├── tsconfig.json
├── build.config.ts           # unbuild 配置
├── vitest.config.ts          # vitest 配置
└── README.md
```

### 3.2 多命令架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                      CLI 入口 (index.ts)                     │
│                   使用 cac 注册所有命令                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     命令注册中心 (commands/)                  │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
   │   create     │    │    add       │    │   upgrade    │
   │   创建项目    │    │  (未来扩展)   │    │  (未来扩展)   │
   └──────────────┘    └──────────────┘    └──────────────┘
```

### 3.3 命令扩展方式

添加新命令只需：

1. 在 `src/commands/` 下创建新文件
2. 导出命令配置
3. 在 `commands/index.ts` 中注册

```typescript
// src/commands/new-command.ts
import type { CAC } from 'cac'

export function registerNewCommand(cli: CAC) {
  cli
    .command('new-command', '命令描述')
    .option('-x, --xxx', '选项描述')
    .action(async (options) => {
      // 命令逻辑
    })
}
```

---

## 4. 核心功能设计

### 4.1 命令列表

```bash
xkit <command> [options]

Commands:
  create [name]    从模板创建新项目

Options:
  -h, --help       显示帮助信息
  -v, --version    显示版本号
```

### 4.2 create 命令

```bash
xkit create [project-name] [options]

Options:
  -t, --template <name>    使用指定模板
  --force                  强制覆盖已存在的目录
```

### 4.3 可用模板

| 模板名称 | 描述 | 仓库 |
|---------|------|------|
| **react-pc** | React 18 + TypeScript + Vite + Ant Design + Zustand | github:SuYxh/react-pc-template |
| **express** | Express + TypeScript + Prisma + MySQL + Redis | github:SuYxh/express-template |
| **electron** | Electron + React + TypeScript + Vite | github:SuYxh/electron-template |

### 4.4 交互流程

```
┌─────────────────────────────────────────────────────────────┐
│  $ xkit create                                              │
│                                                             │
│  🚀 XKit - 开发者工具 CLI                                    │
│                                                             │
│  ✔ 项目名称: › my-app                                        │
│  ✔ 选择模板:                                                 │
│    ❯ React PC Template  - React 18 + TypeScript + ...       │
│      Express Template   - Express + TypeScript + ...        │
│      Electron Template  - Electron + React + ...            │
│                                                             │
│  ⏳ 正在下载模板 React PC Template...                        │
│                                                             │
│  ✔ 项目创建成功!                                             │
│                                                             │
│    接下来运行:                                               │
│                                                             │
│      cd my-app                                              │
│      pnpm install                                           │
│      pnpm dev                                               │
└─────────────────────────────────────────────────────────────┘
```

### 4.5 错误处理

CLI 会对常见错误提供友好的中文提示：

| 错误类型 | 提示信息 |
|---------|---------|
| 目录已存在 | 目标目录已存在，请使用 --force 选项覆盖或选择其他项目名称 |
| 权限不足 | 权限不足，请检查目录写入权限 |
| 网络错误 | 网络连接失败，请检查网络设置或稍后重试 |
| 模板不存在 | 模板仓库不存在，请检查模板配置 |
| API 限流 | GitHub API 请求频率超限，请稍后重试 |

---

## 5. 核心代码示例

### 5.1 入口文件 (src/index.ts)

```typescript
#!/usr/bin/env node
import cac from 'cac'
import { version } from '../package.json'
import { registerCommands } from './commands'

const cli = cac('xkit')

registerCommands(cli)

cli.help()
cli.version(version)

cli.parse()
```

### 5.2 模板配置 (src/config/templates.ts)

```typescript
import pc from 'picocolors'

export interface Template {
  name: string
  display: string
  description: string
  repo: string
  color: (str: string) => string
}

export const TEMPLATES: Template[] = [
  {
    name: 'react-pc',
    display: 'React PC Template',
    description: 'React 18 + TypeScript + Vite + Ant Design + Zustand',
    repo: 'github:SuYxh/react-pc-template',
    color: pc.cyan,
  },
  {
    name: 'express',
    display: 'Express Template',
    description: 'Express + TypeScript + Prisma + MySQL + Redis',
    repo: 'github:SuYxh/express-template',
    color: pc.green,
  },
  {
    name: 'electron',
    display: 'Electron Template',
    description: 'Electron + React + TypeScript + Vite',
    repo: 'github:SuYxh/electron-template',
    color: pc.magenta,
  },
]

export function getTemplateNames(): string[] {
  return TEMPLATES.map((t) => t.name)
}

export function findTemplate(name: string): Template | undefined {
  return TEMPLATES.find((t) => t.name === name)
}
```

### 5.3 日志工具 (src/utils/logger.ts)

```typescript
import pc from 'picocolors'

export const logger = {
  info: (msg: string) => console.log(pc.cyan(msg)),
  success: (msg: string) => console.log(pc.green(`✔ ${msg}`)),
  warn: (msg: string) => console.log(pc.yellow(`⚠ ${msg}`)),
  error: (msg: string) => console.log(pc.red(`✖ ${msg}`)),
  dim: (msg: string) => console.log(pc.dim(msg)),
  bold: (msg: string) => console.log(pc.bold(msg)),
  log: (msg: string) => console.log(msg),
  blank: () => console.log(),

  banner: (title: string) => {
    console.log()
    console.log(pc.bold(pc.cyan(`  🚀 ${title}`)))
    console.log()
  },

  loading: (msg: string) => console.log(`${pc.cyan('⏳')} ${msg}`),

  nextSteps: (steps: string[]) => {
    console.log()
    console.log(pc.dim('  接下来运行:'))
    console.log()
    steps.forEach((step) => console.log(pc.cyan(`    ${step}`)))
    console.log()
  },
}
```

### 5.4 unbuild 配置 (build.config.ts)

```typescript
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
  clean: true,
  rollup: {
    inlineDependencies: true,
    esbuild: {
      target: 'node18',
      minify: true,
    },
  },
  declaration: true,
})
```

---

## 6. 发布配置

### 6.1 package.json

```json
{
  "name": "@everpack/cli",
  "version": "0.1.0",
  "description": "XKit - 开发者工具 CLI",
  "type": "module",
  "bin": {
    "xkit": "./dist/index.mjs"
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "unbuild",
    "dev": "unbuild --stub",
    "start": "node dist/index.mjs",
    "xkit": "node dist/index.mjs",
    "test": "vitest run",
    "test:watch": "vitest",
    "prepublishOnly": "npm run build"
  },
  "dependencies": {
    "cac": "^6.7.14",
    "giget": "^1.2.3",
    "picocolors": "^1.1.1",
    "prompts": "^2.4.2",
    "fs-extra": "^11.2.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "unbuild": "^2.0.0",
    "vitest": "^2.1.0",
    "@types/node": "^22.0.0",
    "@types/prompts": "^2.4.9",
    "@types/fs-extra": "^11.0.4"
  },
  "engines": {
    "node": ">=18"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/everpack/cli"
  },
  "keywords": [
    "cli",
    "scaffold",
    "template",
    "xkit"
  ],
  "license": "MIT"
}
```

### 6.2 使用方式

```bash
# 方式一：全局安装（推荐）
npm install -g @everpack/cli
xkit create my-app

# 方式二：npx（无需安装）
npx @everpack/cli create my-app

# 方式三：项目内使用
npm install @everpack/cli -D
npx xkit create my-app
```

---

## 7. 开发计划

### 7.1 阶段划分

| 阶段 | 任务 | 产出 |
|------|------|------|
| **P0 - MVP** | 项目初始化 | package.json, tsconfig, unbuild 配置 |
| | create 命令实现 | 交互式选择 + GitHub 模板下载 |
| | 基础模板准备 | 2-3 个可用模板 |
| | 单元测试 | vitest 测试覆盖核心功能 |
| | 发布到 npm | @everpack/cli 首版 |
| **P1 - 增强** | 更多模板 | 覆盖常见技术栈 |
| | 错误处理优化 | 友好的错误提示 ✅ |
| | 帮助信息美化 | 更好的 CLI 体验 |
| **P2 - 扩展** | 新命令 | add、upgrade 等 |
| | 插件系统 | 支持第三方扩展 |
| | 更新检测 | CLI 自动更新提醒 |

---

## 8. 未来扩展命令预览

```bash
# 创建项目
xkit create my-app

# 添加功能到现有项目（未来）
xkit add eslint
xkit add prettier
xkit add husky

# 升级项目模板（未来）
xkit upgrade

# 查看可用模板（未来）
xkit list

# 配置 CLI（未来）
xkit config set registry https://xxx
```

---

## 9. 总结

本方案设计了 **XKit CLI** (`@everpack/cli`)，核心特性：

1. **TypeScript + unbuild** - 类型安全，与 Vite 生态一致
2. **cac 多命令框架** - 轻量级，易于扩展新命令
3. **GitHub 模板直接拉取** - 简单直接，模板独立维护
4. **模块化架构** - 每个命令独立文件，便于维护和扩展
5. **完善的错误处理** - 针对不同错误类型提供友好的中文提示
6. **单元测试覆盖** - 使用 vitest 确保核心功能稳定

使用方式：
```bash
npm install -g @everpack/cli
xkit create my-app
```
