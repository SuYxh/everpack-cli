import type { CAC } from 'cac'
import prompts from 'prompts'
import { downloadTemplate } from 'giget'
import pc from 'picocolors'
import { TEMPLATES, findTemplate, getTemplateNames } from '../config'
import { logger, parseDownloadError } from '../utils'

export function registerCreateCommand(cli: CAC) {
  cli
    .command('create [name]', '从模板创建新项目')
    .option('-t, --template <name>', '使用指定模板')
    .option('--force', '强制覆盖已存在的目录')
    .action(async (name: string | undefined, options: { template?: string; force?: boolean }) => {
      logger.banner('XKit - 开发者工具 CLI')

      let projectName = name
      let templateName = options.template

      const result = await prompts(
        [
          {
            type: projectName ? null : 'text',
            name: 'projectName',
            message: '项目名称:',
            initial: 'my-project',
            validate: (value: string) => {
              if (!value.trim()) return '项目名称不能为空'
              if (!/^[a-z0-9-_]+$/i.test(value)) return '项目名称只能包含字母、数字、中划线和下划线'
              return true
            },
          },
          {
            type: templateName ? null : 'select',
            name: 'template',
            message: '选择模板:',
            choices: TEMPLATES.map((t) => ({
              title: `${t.color(t.display)} ${pc.dim(`- ${t.description}`)}`,
              value: t.name,
            })),
          },
        ],
        {
          onCancel: () => {
            logger.blank()
            logger.error('操作已取消')
            process.exit(0)
          },
        }
      )

      projectName = projectName || result.projectName
      templateName = templateName || result.template

      if (!projectName || !templateName) {
        logger.error('操作已取消')
        return
      }

      const template = findTemplate(templateName)
      if (!template) {
        logger.error(`未知模板: ${templateName}`)
        logger.dim(`  可用模板: ${getTemplateNames().join(', ')}`)
        return
      }

      logger.blank()
      logger.loading(`正在下载模板 ${pc.bold(template.display)}...`)

      try {
        await downloadTemplate(template.repo, {
          dir: projectName,
          force: options.force,
        })

        logger.blank()
        logger.success('项目创建成功!')
        logger.nextSteps([`cd ${projectName}`, 'pnpm install', 'pnpm dev'])
      } catch (error: unknown) {
        const errorMessage = parseDownloadError(error)
        logger.blank()
        logger.error(`下载失败: ${errorMessage}`)
        process.exit(1)
      }
    })
}
