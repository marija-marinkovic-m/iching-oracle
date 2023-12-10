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

export default generateHexagram
