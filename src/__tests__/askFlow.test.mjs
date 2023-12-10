import { describe, it, jest, expect } from '@jest/globals'
import askFlow from '../flows/ask.mjs'

describe('askFlow', () => {
  it('should return the main key', async () => {
    const enquiry = {
      getIsQuestion: jest.fn().mockResolvedValue('question'),
      getIsStoreAnswer: jest.fn().mockResolvedValue('no'),
      MAIN_KEY: 'main'
    }
    const result = await askFlow(enquiry)
    expect(result).toBeUndefined()
  })

  it('should return the main key when the user chooses not to store the answer', async () => {
    const enquiry = {
      getIsQuestion: jest.fn().mockResolvedValue('question'),
      getIsStoreAnswer: jest.fn().mockResolvedValue('no'),
      MAIN_KEY: 'main'
    }
    const result = await askFlow(enquiry)
    expect(result).toBeUndefined()
  })
})
