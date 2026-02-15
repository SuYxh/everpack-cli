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
