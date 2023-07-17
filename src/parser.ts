import { allPseudo } from './consts.ts'
// import spawnAsync from '@expo/spawn-async';
import { resolve, parse } from 'path'
import { readFile } from 'fs/promises'
import { glob } from 'glob'
import { readFileSync, writeFileSync } from 'fs'

function removePseudoFromString(className: string) {
    const pseudoIndex = allPseudo.findIndex((pseudo) => className.endsWith(pseudo))
    if (pseudoIndex > -1) {
        return className.slice(0, -allPseudo[pseudoIndex].length)
    }
    return className
}

export function extractClassNamesFromFileContent(fileContent: string) {
    const classRegex = /(?<=\s|})\.([^{}\s]+)/g
    const commentRegex = /\/\*[\s\S]*?\*\//g

    // Remove comments from the file content
    const cleanedContent = fileContent.replace(commentRegex, '')

    const classes = cleanedContent.match(classRegex) || []
    const uniqueClassNames = [...new Set(classes)]

    // Remove . from the beginning of the class names and \\ escape characters
    const cleanedClassNames = uniqueClassNames.map((className) =>
        removePseudoFromString(className.replace(/^\.|\\/g, '')),
    )
    return cleanedClassNames
}
export function getPrefixedClassNamesMap(prefix: string, classNames: string[]) {
    const prefixedClassNamesMap = new Map<string, string>()
    classNames.forEach((className) => {
        const prefixedClassName = addPrefixToClassName(prefix, className)
        if (prefixedClassName) {
            prefixedClassNamesMap.set(className, prefixedClassName)
        }
    })
    return Object.fromEntries(prefixedClassNamesMap)
}
export function addPrefixToClassName(prefix: string, item: string) {
    const lastColonIndex = item.lastIndexOf(":");
    if (lastColonIndex !== -1) {
        const className = item.slice(lastColonIndex + 1);
        const alphanumericIndex = className.search(/\w/);
        if (alphanumericIndex !== -1) {
            const insertIndex = lastColonIndex + alphanumericIndex + 1;
            const transformedClass = item.slice(0, insertIndex) + prefix + item.slice(insertIndex);
            return transformedClass;
        }
    } else {
        // If no ":", prepend the prefix before the first alphanumeric character.
        const alphanumericIndex = item.search(/\w/);
        if (alphanumericIndex !== -1) {
            const insertIndex = alphanumericIndex;
            const transformedClass = item.slice(0, insertIndex) + prefix + item.slice(insertIndex);
            return transformedClass;
        }
    }
}

function replaceAll(content: string, oldStrings: string[], newStrings: string[]) {
    let newContent = content;
    for (let i = 0; i < oldStrings.length; i++) {
        newContent = newContent.split(oldStrings[i]).join(newStrings[i]);
    }
    return newContent;
}

export async function use(prefix: string, configPath: string) {
    console.log(`Using prefix "${prefix}" with config file "${configPath}"`)
    const tailwindConfig = require(configPath)
    if (!tailwindConfig || !tailwindConfig.content) return console.log('No content found in Tailwind CSS config')
    const configDir = parse(configPath).dir
    console.log('Tailwind CSS config:', tailwindConfig)
    // let resultPromise = spawnAsync('npx', ['tailwindcss', '-c', configPath, '-o', resolve(process.cwd(), 'temp', 'output.css')])
    // let spawnedChildProcess = resultPromise.child;
    // await spawnedChildProcess;
    const tailwindOutput = await readFile(resolve(process.cwd(), 'temp', 'output.css'), 'utf8')
    const classNames = extractClassNamesFromFileContent(tailwindOutput)
    console.log(`Found ${classNames.length} class names`)
    const files = await glob(tailwindConfig.content, { cwd: parse(configPath).dir })
    console.log(`Found ${files.length} files in`, configDir)
    const prefixedClassNamesMap = getPrefixedClassNamesMap(prefix, classNames)
    console.log(prefixedClassNamesMap)
    files.forEach((filepath) => {
        const path = resolve(configDir, filepath)
        const fileContents = readFileSync(path, "utf8");
        const replacedContents = replaceAll(fileContents, Object.keys(prefixedClassNamesMap), Object.values(prefixedClassNamesMap));
        writeFileSync(path, replacedContents);
        console.log("File replaced successfully!");
    })
}
