import resolveChange from './resolveChange.mjs'

/**
 * Retrieves the change data for a given hexagram.
 * @param {object} hexagram - The hexagram object.
 * @returns {object} - The change data, including the change and the changing lines.
 */
const getChangeData = (hexagram) => {
  const change = resolveChange(hexagram)
  const changingLines = hexagram.changes.map((line) => line.position).join(', ')
  return {
    change,
    changingLines
  }
}

export default getChangeData
