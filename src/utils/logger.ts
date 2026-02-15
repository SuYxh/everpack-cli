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
