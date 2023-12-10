import chalk from 'chalk'

import { deleteReading, getReadings } from '../../db/instance.mjs'
import { generateHexagramFromBinary } from '../hexagram/generateHexagram.mjs'
import printHexagram from '../utils/print.mjs'

/**
 * Reads a page based on the given page ID.
 *
 * @param {Enquiry} enquiry - The enquiry object.
 * @param {Array} readings - The array of readings.
 * @param {string} pageId - The ID of the page to read.
 * @returns {Promise<string>} - The page choice.
 */
const readPage = async (enquiry, readings, pageId) => {
  const reading = await readings.find(({ id }) => id === pageId)
  const hexagram = generateHexagramFromBinary(
    reading.hexBinStr,
    reading.changingLines?.split(',').map(Number) ?? []
  )
  printHexagram(hexagram)

  const pageChoice = await enquiry.getPageChoice()
  if (pageChoice === enquiry.DELETE_ENTRY_KEY) {
    await deleteReading(pageId)
    console.log(chalk.bgYellow('🗑️ Reading deleted.'))
  }
  return pageChoice
}

const readIndex = async (enquiry) => {
  const readings = await getReadings()
  if (!readings?.length) {
    console.log(chalk.bgGrey('🫙 No readings found.'))
    return
  }

  const pageId = await enquiry.getReadPage(readings)
  if (pageId === enquiry.MAIN_KEY) {
    return
  }

  const pageChoice = await readPage(enquiry, readings, pageId)

  if (pageChoice === enquiry.MAIN_KEY) {
    return
  }

  return readIndex(enquiry)
}

export default readIndex
