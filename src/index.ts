#!/usr/bin/env node
import cac from 'cac'
import { version } from '../package.json'
import { registerCommands } from './commands'

const cli = cac('xkit')

registerCommands(cli)

cli.help()
cli.version(version)

cli.parse()
