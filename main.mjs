import chalk from 'chalk'
import inquirer from 'inquirer'

import generateHexagram, { generateHexagramFromBinary } from './src/generateHexagram.mjs'
import resolveChange from './src/resolveChange.mjs'

import { randomUUID } from 'crypto'
import { storeReading, getReadings, deleteReading } from './db/instance.mjs'
import logger from './src/logger.mjs'

const ASK_KEY = 'ask'
const READ_KEY = 'read'
const DELETE_ENTRY_KEY = 'delete'
const MAIN_KEY = 'main'

function produceAnswer (question) {
  const hexagram = generateHexagram()
  const { change, changingLines } = play(hexagram)
  const id = randomUUID()
  const hexbinStr = hexagram.binary
  const kingWen = [hexagram.kingWen, change.changedHexagram?.kingWen].filter(Boolean).join(', ')
  const createdAt = new Date().toISOString()

  return {
    id,
    hexbinStr,
    kingWen,
    changingLines,
    question,
    createdAt
  }
}

const play = (hexagram) => {
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

const getMainChoice = () => {
  return new Promise((resolve, reject) => {
    inquirer.prompt({
      type: 'list',
      name: 'greeting',
      message: 'What would you like to do?',
      choices: ['❔ Ask a question', '📖 Read Previous Answers', '❌ Quit']
    }).then((reply) => {
      switch (reply.greeting) {
        case '❔ Ask a question':
          resolve(ASK_KEY)
          break

        case '📖 Read Previous Answers':
          resolve(READ_KEY)
          break

        default:
          reject(new Error('👋 Have a great day!'))
          break
      }
    })
  })
}

const getIsQuestion = () => {
  return new Promise((resolve, reject) => {
    inquirer.prompt({
      type: 'input',
      name: 'question',
      message: 'What is your question?'
    }).then(prompt => {
      if (!prompt?.question) {
        reject(new Error('You must provide a question.'))
        return
      }
      console.log(`You asked: ${prompt.question}`)
      console.log('I Ching replies:')

      resolve(prompt.question.replace(/[^a-zA-Z0-9 ]/g, ''))
    })
  })
}

const getIsStoreAnswer = (answer) => {
  return new Promise((resolve, reject) => {
    inquirer.prompt({
      type: 'list',
      name: 'store',
      message: 'Do you want to store this answer?',
      choices: ['Yes', 'No']
    }).then((reply) => {
      if (reply.store === 'Yes') {
        resolve(reply.store)
      } else {
        reject(new Error('👋 Have a great day!'))
      }
    })
  })
}

const getReadPage = (readingList) => {
  return new Promise((resolve, reject) => {
    inquirer.prompt({
      type: 'list',
      name: 'reading',
      message: 'Which reading do you want to read?',
      choices: readingList.map(({ id, question }) => ({
        name: question,
        value: id
      })).concat(['🏠 Main Menu', '❌ Quit'])
    }).then((reply) => {
      if (reply.reading === 'Quit') {
        reject(new Error('👋 Have a great day!'))
        return
      }

      if (reply.reading === '🏠 Main Menu') {
        resolve(MAIN_KEY)
        return
      }

      resolve(reply.reading)
    })
  })
}

const getPageChoice = () => {
  return new Promise((resolve, reject) => {
    inquirer.prompt({
      type: 'list',
      name: 'choice',
      message: 'What would you like to do?',
      choices: ['👈 Back To Reading List', '🏠 Main Menu', '🗑️ Delete Entry?', 'Quit']
    }).then((reply) => {
      switch (reply.choice) {
        case '👈 Back To Reading List':
          resolve(READ_KEY)
          break

        case '🏠 Main Menu':
          resolve(MAIN_KEY)
          break

        case '🗑️ Delete Entry?':
          resolve(DELETE_ENTRY_KEY)
          break

        default:
          reject(new Error('👋 Have a great day!'))
          break
      }
    })
  })
}

const readFlow = async () => {
  const readings = await getReadings()

  if (!readings.length) {
    console.log(chalk.bgGrey('🫙 No readings found.'))
    main()
    return
  }

  const pageId = await getReadPage(readings)

  if (pageId === MAIN_KEY) {
    return main()
  }

  const reading = await readings.find(({ id }) => id === pageId)

  const hexagram = generateHexagramFromBinary(reading.hexBinStr, reading.changingLines?.split(',').map(Number) ?? [])

  play(hexagram)

  const pageChoice = await getPageChoice()

  if (pageChoice === DELETE_ENTRY_KEY) {
    await deleteReading(pageId)
    console.log(chalk.bgYellow('🗑️ Reading deleted.'))
  }

  if (pageChoice === MAIN_KEY) {
    return main()
  }

  return readFlow()
}

const main = async (withGreeting = false) => {
  try {
    if (withGreeting) console.log(chalk.bgGreenBright('🔮 Welcome to the I Ching!'))
    const mainChoice = await getMainChoice()

    switch (mainChoice) {
      case ASK_KEY: {
        const question = await getIsQuestion()
        const answer = produceAnswer(question)
        const store = await getIsStoreAnswer(answer)
        if (store === 'Yes') {
          const row = await storeReading(answer)
          console.table(row)
          main()
        }
        break
      }

      case READ_KEY: {
        await readFlow()
        break
      }

      case MAIN_KEY:
        main()
        break

      default:
        break
    }
  } catch (error) {
    console.log(chalk.bgGreenBright(error.message))
  }
}

main(true)
