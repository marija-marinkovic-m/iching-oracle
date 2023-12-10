import { test, expect } from '@jest/globals'
import resolveLine from '../hexagram/resolveLine.mjs'

// Mock Math.random
const mockMath = Object.create(global.Math)
global.Math = mockMath

test('resolveLine returns old yin when sum is greater than 5', () => {
  mockMath.random = () => 0.9
  const result = resolveLine(50)
  expect(result).toEqual({ binary: 0, old: true })
})

test('resolveLine returns yang when sum is not greater than 5', () => {
  mockMath.random = () => 0.2
  const result = resolveLine(50)
  expect(result).toEqual({ binary: 1, old: false })
})
