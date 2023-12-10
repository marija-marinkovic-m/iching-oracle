import data from '../temp/data.mjs'
import logger from './logger.mjs'

class Hexagram {
  constructor (linesArray) {
    this.hexagram = linesArray
    this.changed = linesArray.map((line) => ({
      ...line,
      binary: line.old ? Number(!line.binary) : line.binary
    }))

    this.hexagramDefinition = data.find(
      (hexagram) => hexagram.binStr === this.binary
    )
  }

  get changes () {
    return this.hexagram.filter((line) => line.old)
  }

  get noChanges () {
    return this.hexagram.filter((line) => !line.old)
  }

  get binary () {
    return this.hexagram.map((line) => line.binary).join('')
  }

  get title () {
    try {
      return `${this.definition.kingWen}. ${this.definition.chars} ${this.definition.title}`
    } catch (error) {
      logger.error(this.hexagram)
      return `Error: Could not find hexagram definition. ID: ${this.binary}`
    }
  }

  get judgement () {
    try {
      return this.definition.judgement.join('\n')
    } catch (error) {
      logger.error({ id: this.binary, ...this.hexagram })
      return `Error: Could not find hexagram judgement. ID: ${this.binary}`
    }
  }

  get length () {
    return this.hexagram.length
  }

  get definition () {
    return this.hexagramDefinition
  }

  get lines () {
    try {
      return this.definition.lines
    } catch (error) {
      logger.error({ id: this.binary, ...this.hexagram })
      return `Error: Could not find hexagram lines. ID: ${this.binary}`
    }
  }

  get changedHexagram () {
    if (!this.changes.length) return null
    return new Hexagram(this.changed)
  }

  line (position) {
    if (!position || position > this.length || position < 1) {
      return
    }
    return this.lines
      .find((line) => line.position === position)
      .text.join('\n')
  }
}

export default Hexagram