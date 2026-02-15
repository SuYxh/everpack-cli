import type { CAC } from 'cac'
import { registerCreateCommand } from './create'

export function registerCommands(cli: CAC) {
  registerCreateCommand(cli)
}
