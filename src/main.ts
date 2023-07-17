#!/usr/bin/env node

import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { resolve } from 'path'
import { use } from './parser'

yargs(hideBin(process.argv))
    .command('use [prefix]', 'add Tailwind CSS prefix to your project and your files', (y: any) => {
        return y
            .positional('prefix', {
                describe: 'Tailwind CSS prefix',
                default: '',
            })
    }, (argv: any) => {
        const configPath = argv.config || resolve(process.cwd(), 'tailwind.config.js')
        use(argv.prefix, configPath)
    })
    .option('config', {
        alias: 'c',
        type: 'string',
        description: 'Path to your Tailwind CSS config file',
    })
    .parse()
