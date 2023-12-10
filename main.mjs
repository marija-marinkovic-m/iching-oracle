import chalk from 'chalk'

import generateHexagram from './src/generateHexagram.mjs'
import resolveChange from './src/resolveChange.mjs'
import readline from 'readline'
import { randomUUID } from 'crypto'
import { storeReading } from './db/instance.mjs'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function produceAnswer (question) {
  const hexagram = generateHexagram()
  const change = resolveChange(hexagram)

  const id = randomUUID()
  const hexbinStr = hexagram.binary
  const createdAt = new Date().toISOString()
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
    id,
    hexbinStr,
    changingLines,
    question,
    createdAt
  }
}

const askAQuestion = () => {
  return new Promise((resolve, reject) => {
    rl.question('What is your question? ', (prompt) => {
      if (!prompt) {
        reject(new Error('You must provide a question.'))
        return
      }
      console.log(`You asked: ${prompt}`)
      console.log('I Ching replies:')

      resolve(prompt.replace(/[^a-zA-Z0-9 ]/g, ''))
    })
  })
}

const storeIChingAnswer = (answer) => {
  return new Promise((resolve, reject) => {
    rl.question('Do you want to store the answer? (Y/n) ', (reply) => {
      if (reply.toLowerCase() === 'yes' || reply.toLowerCase() === 'y') {
        resolve(reply)
      } else {
        reject(new Error('Have a great day'))
      }
    })
  })
}

const main = async () => {
  try {
    const question = await askAQuestion()
    const iChingAnswer = produceAnswer(question)
    await storeIChingAnswer(iChingAnswer)

    await storeReading(iChingAnswer)
    console.log(`You stored the answer: ${JSON.stringify(iChingAnswer)}`)
  } catch (error) {
    console.log(chalk.bgRedBright(error.message))
  } finally {
    rl.close()
  }
}

main()
