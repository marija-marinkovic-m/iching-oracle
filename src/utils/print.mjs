import chalk from 'chalk'
import getChangeData from '../hexagram/getChangeData.mjs'

const printHexagram = (hexagram) => {
  const { change, changingLines } = getChangeData(hexagram)

  const content = []

  content.push(chalk.blue(hexagram.title))
  content.push(chalk.green(hexagram.judgement))
  content.push(chalk.red(change.description))
  if (change.line) {
    if (hexagram.changes.length > 1) {
      content.push(
        chalk.bgGray(changingLines)
      )
    }
    content.push(chalk.cyan(hexagram.line(change.line)))
    content.push(chalk.magenta(change.changedHexagram.title))
    content.push(chalk.bgCyanBright(change.changedHexagram.judgement))
  }

  console.table(content.join('\n'))
}

export default printHexagram
