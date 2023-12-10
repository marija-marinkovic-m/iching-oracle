import chalk from 'chalk'
import resolveChange from './hexagram/resolveChange.mjs'
const printHexagram = (hexagram) => {
  const change = resolveChange(hexagram)
  const changingLines = hexagram.changes.map((line) => line.position).join(', ')

  console.log(chalk.blue(hexagram.title))
  console.log(chalk.green(hexagram.judgement))
  console.log(chalk.red(change.description))
  if (change.line) {
    if (hexagram.changes.length > 1) {
      console.log(
        chalk.bgGray(changingLines)
      )
    }
    console.log(chalk.cyan(hexagram.line(change.line)))
    console.log(chalk.magenta(change.changedHexagram.title))
    console.log(chalk.bgCyanBright(change.changedHexagram.judgement))
  }

  return {
    change,
    changingLines
  }
}

export default printHexagram
