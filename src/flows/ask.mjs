import { randomUUID } from 'crypto'
import generateHexagram from '../hexagram/generateHexagram.mjs'

import { storeReading } from '../../db/instance.mjs'
import printHexagram from '../print.mjs'

function produceAnswer (question) {
  const hexagram = generateHexagram()
  const { change, changingLines } = printHexagram(hexagram)
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

const ask = async (enquiry) => {
  const question = await enquiry.getIsQuestion()
  const answer = produceAnswer(question)
  const shouldStore = await enquiry.getIsStoreAnswer(answer)
  if (shouldStore === enquiry.YES_KEY) {
    const row = await storeReading(answer)
    console.table(row)
  }
  return enquiry.MAIN_KEY
}

export default ask
