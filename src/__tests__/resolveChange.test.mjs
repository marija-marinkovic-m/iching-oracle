import { test, expect } from '@jest/globals'
import Hexagram from '../hexagram/Hexagram.mjs'
import resolveChange, { getPrevailingLine } from '../hexagram/resolveChange.mjs'

const hexagram1 = new Hexagram([
  { binary: 0, old: false, position: 1 },
  { binary: 0, old: false, position: 2 },
  { binary: 0, old: false, position: 3 },
  { binary: 0, old: false, position: 4 },
  { binary: 0, old: false, position: 5 },
  { binary: 0, old: true, position: 6 }
])

const hexagram2 = new Hexagram([
  { binary: 0, old: false, position: 1 },
  { binary: 0, old: false, position: 2 },
  { binary: 0, old: false, position: 3 },
  { binary: 0, old: false, position: 4 },
  { binary: 0, old: false, position: 5 },
  { binary: 1, old: false, position: 6 }
])

test('resolveChange returns a change object', () => {
  const result1 = resolveChange(hexagram1)
  const result2 = resolveChange(hexagram2)

  expect(result1.description).toBe('One change.')
  expect(result2.description).toBe('No changes.')
})

test('getPrevailingLine returns the first old yin line', () => {
  const result1 = getPrevailingLine(hexagram1)
  const result2 = getPrevailingLine(hexagram2)
  expect(result1).toBe(6)
  expect(result2).toBeUndefined()
})
