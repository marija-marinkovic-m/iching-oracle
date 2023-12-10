import chalk from 'chalk'
import getChangeData from '../hexagram/getChangeData.mjs'

const printHexagram = (hexagram) => {
  const { change, changingLines } = getChangeData(hexagram)

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
}

export default printHexagram
