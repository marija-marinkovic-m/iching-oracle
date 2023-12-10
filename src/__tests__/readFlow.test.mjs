import { describe, it, expect, jest } from '@jest/globals'
import readIndex from '../flows/read.mjs'

describe('readIndex', () => {
  it('should return undefined when there are no readings', async () => {
    const enquiry = {
      getReadPage: jest.fn().mockResolvedValue('main'),
      MAIN_KEY: 'main'
    }
    const result = await readIndex(enquiry)
    expect(result).toBe(undefined)
  })

  it('should return undefined when the user chooses to go back to the main menu', async () => {
    const enquiry = {
      getReadPage: jest.fn().mockResolvedValue('main'),
      MAIN_KEY: 'main'
    }
    const result = await readIndex(enquiry)
    expect(result).toBe(undefined)
  })
})
