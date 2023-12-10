import { randomUUID } from 'crypto'
import generateHexagram from '../hexagram/generateHexagram.mjs'

import { storeReading } from '../../db/instance.mjs'
import getChangeData from '../hexagram/getChangeData.mjs'
import printHexagram from '../utils/print.mjs'

/**
 * Generates an answer based on the given question.
 * @param {string} question - The question to generate an answer for.
 * @returns {object} - An object containing the generated answer and the corresponding hexagram.
 */
function produceAnswer (question) {
  const hexagram = generateHexagram()
  const { change, changingLines } = getChangeData(hexagram)

  return {
    entry: {
      id: randomUUID(),
      hexbinStr: hexagram.binary,
      kingWen: [
        hexagram.kingWen,
        change.changedHexagram?.kingWen
      ].filter(Boolean).join(', '),
      changingLines,
      question,
      createdAt: new Date().toISOString()
    },
    hexagram
  }
}

const ask = async (enquiry) => {
  const question = await enquiry.getIsQuestion()
  const answer = produceAnswer(question)
  printHexagram(answer.hexagram)

  const shouldStore = await enquiry.getIsStoreAnswer()
  if (shouldStore !== enquiry.YES_KEY) {
    return
  }

  const row = await storeReading(answer.entry)
  console.table(row)
}

export default ask
