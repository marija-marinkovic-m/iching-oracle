import resolveLine from './resolveLine.mjs'
import Hexagram from './Hexagram.mjs'

const generateHexagram = () => {
  const hexagram = []
  for (let position = 1; position < 7; position++) {
    const line = resolveLine()
    hexagram.push({
      ...line,
      position
    })
  }
  return new Hexagram(hexagram)
}

export const generateHexagramFromBinary = (binary, changingLines) => {
  if (!binary) throw new Error('Binary is required')
  const hexagram = binary.split('')
    .map((binary, position) => {
      const old = changingLines?.length ? changingLines.includes(position + 1) : false
      return { binary, position: position + 1, old }
    })
  return new Hexagram(hexagram)
}

export default generateHexagram
