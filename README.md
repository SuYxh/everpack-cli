# XKit CLI

> 🚀 开发者工具 CLI，快速从模板创建项目

## 安装

```bash
# 全局安装（发布后）
npm install -g @everpack/cli

# 或使用 pnpm
pnpm add -g @everpack/cli
```

## 使用

```bash
# 交互式创建项目
xkit create

# 指定项目名称
xkit create my-app

# 指定模板
xkit create my-app --template react-pc

# 强制覆盖已存在的目录
xkit create my-app --template express --force
```

## 可用模板

| 模板 | 命令 | 描述 |
|------|------|------|
| React PC | `--template react-pc` | React 18 + TypeScript + Vite + Ant Design + Zustand |
| Express | `--template express` | Express + TypeScript + Prisma + MySQL + Redis |
| Electron | `--template electron` | Electron + React + TypeScript + Vite |

## 本地开发

### 1. 安装依赖

```bash
pnpm install
```

### 2. 构建

```bash
pnpm build
```

### 3. 本地测试

方式一：直接运行

```bash
# 查看帮助
node dist/index.mjs --help

# 查看 create 命令帮助
node dist/index.mjs create --help

# 创建项目
node dist/index.mjs create my-app --template react-pc
```

方式二：使用 npm 脚本

```bash
# 查看帮助
pnpm xkit -- --help

# 创建项目
pnpm xkit create my-app --template express
```

方式三：全局链接

```bash
# 链接到全局
pnpm link --global

# 确保 pnpm 全局 bin 在 PATH 中
export PATH="$(pnpm bin -g):$PATH"

# 然后就可以直接使用
xkit create my-app
```

方式四：npx 测试（推荐）

```bash
# 在项目目录下
npx . create my-app --template react-pc
```

### 4. 开发模式（stub 模式）

```bash
# 启用 stub 模式，修改代码无需重新构建
pnpm dev

# 然后直接运行
node dist/index.mjs create my-app
```

## 命令

```bash
xkit <command> [options]

Commands:
  create [name]    从模板创建新项目

Options:
  -h, --help       显示帮助信息
  -v, --version    显示版本号
```

### create 命令

```bash
xkit create [name] [options]

Options:
  -t, --template <name>  使用指定模板 (react-pc, express, electron)
  --force                强制覆盖已存在的目录
  -h, --help             显示帮助信息
```

## 发布

```bash
# 构建
pnpm build

# 发布到 npm
npm publish --access public
```

## 技术栈

- **语言**: TypeScript
- **CLI 框架**: cac
- **交互**: prompts
- **颜色输出**: picocolors
- **模板下载**: giget
- **构建工具**: unbuild

## License

MIT
