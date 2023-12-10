import inquirer from 'inquirer'
import chalck from 'chalk'

/**
 * Represents an Enquiry object.
 * @class
 */
class Enquiry {
  ASK_KEY = 'ask'
  READ_KEY = 'read'
  DELETE_ENTRY_KEY = 'delete'
  MAIN_KEY = 'main'
  QUIT_KEY = 'quit'
  BACK_READ_KEY = 'back'
  YES_KEY = 'yes'

  mappings = {
    ask: '❔ Ask a question',
    read: '📖 Read Previous Answers',
    backRead: '👈 Back To Reading List',
    delete: '🗑️  Delete Entry?',
    main: '🏠 Main Menu',
    quit: '❌ Quit',
    yes: 'Yes'
  }

  constructor () {
    this.prompt = inquirer.prompt
  }

  getMainChoice = () => {
    return new Promise((resolve, reject) => {
      this.prompt({
        type: 'list',
        name: 'greeting',
        message: 'What would you like to do?',
        choices: [this.mappings.ask, this.mappings.read, this.mappings.quit]
      }).then((reply) => {
        switch (reply.greeting) {
          case this.mappings.ask:
            resolve(this.ASK_KEY)
            break

          case this.mappings.read:
            resolve(this.READ_KEY)
            break

          default:
            reject(new Error('👋 Have a great day!'))
            break
        }
      })
    })
  }

  getIsQuestion = () => {
    return new Promise((resolve, reject) => {
      this.prompt({
        type: 'input',
        name: 'question',
        message: 'What is your question?'
      }).then((prompt) => {
        const question = prompt.question.replace(/[^a-zA-Z0-9 ]/g, '') || 'General Reading'
        console.log(`You asked: ${chalck.italic(question)}`)
        resolve(question)
      })
    })
  }

  getIsStoreAnswer = () => {
    return new Promise((resolve, reject) => {
      this.prompt({
        type: 'list',
        name: 'store',
        message: 'Do you want to store this answer?',
        choices: [this.mappings.yes, 'No']
      }).then((reply) => {
        if (reply.store === this.mappings.yes) {
          resolve(this.YES_KEY)
        } else {
          resolve()
        }
      })
    })
  }

  getReadPage = (readingList) => {
    return new Promise((resolve, reject) => {
      this.prompt({
        type: 'list',
        name: 'reading',
        message: 'Which reading do you want to read?',
        choices: readingList
          .map(({ id, question, createdAt }) => {
            createdAt = new Date(createdAt).toLocaleDateString()
            return {
              name: `✔️ ${createdAt}: ${chalck.bold(question)}`,
              value: id
            }
          })
          .concat([this.mappings.main, this.mappings.quit])
      }).then((reply) => {
        if (reply.reading === this.mappings.quit) {
          reject(new Error('👋 Have a great day!'))
          return
        }

        if (reply.reading === this.mappings.main) {
          resolve(this.MAIN_KEY)
          return
        }

        resolve(reply.reading)
      })
    })
  }

  getPageChoice = () => {
    return new Promise((resolve, reject) => {
      this.prompt({
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: [
          this.mappings.backRead,
          this.mappings.main,
          this.mappings.delete,
          this.mappings.quit
        ]
      }).then((reply) => {
        switch (reply.choice) {
          case this.mappings.backRead:
            resolve(this.READ_KEY)
            break

          case this.mappings.main:
            resolve(this.MAIN_KEY)
            break

          case this.mappings.delete:
            resolve(this.DELETE_ENTRY_KEY)
            break

          default:
            reject(new Error('👋 Have a great day!'))
            break
        }
      })
    })
  }
}

export default Enquiry
