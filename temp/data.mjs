import fs from 'fs'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, './data.json'), 'utf-8'))

export default data
