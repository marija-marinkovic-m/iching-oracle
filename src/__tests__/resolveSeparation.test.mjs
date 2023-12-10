import { test, expect } from '@jest/globals'
import { resolveSeparation } from '../resolveLine'

// Mock Math.random
const mockMath = Object.create(global.Math)
global.Math = mockMath

test('resolveSeparation returns 2 when sum is greater than 5', () => {
  mockMath.random = () => 0.1 // This will make the westPile large enough to ensure the sum is greater than 5
  const result = resolveSeparation(49)
  expect(result).toBe(2)
})

test('resolveSeparation returns 3 when sum is not greater than 5', () => {
  mockMath.random = () => 0.95 // This will make the westPile small enough to ensure the sum is not greater than 5
  const result = resolveSeparation(49)
  expect(result).toBe(3)
})
