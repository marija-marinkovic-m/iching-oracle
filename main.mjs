import chalk from 'chalk'

import Enquiry from './src/Enquiry.mjs'
import readFlow from './src/flows/read.mjs'
import askFlow from './src/flows/ask.mjs'

const enquiry = new Enquiry()

const main = async (withGreeting = false) => {
  try {
    if (withGreeting) console.log(chalk.bgGreenBright('🔮 Welcome to the I Ching!'))

    const mainChoice = await enquiry.getMainChoice()

    if (mainChoice === enquiry.ASK_KEY) {
      await askFlow(enquiry)
    }

    if (mainChoice === enquiry.READ_KEY) {
      await readFlow(enquiry)
    }

    main()
  } catch (error) {
    console.log(chalk.blueBright(error.message))
  }
}

main(true)
