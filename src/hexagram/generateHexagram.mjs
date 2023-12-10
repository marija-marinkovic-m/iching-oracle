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

/**
 * Generates a hexagram from a binary string.
 *
 * @param {string} binary - The binary string representing the hexagram.
 * @param {number[]} changingLines - An array of positions of the changing lines.
 * @returns {Hexagram} The generated hexagram.
 * @throws {Error} If the binary string is empty or undefined.
 */
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
