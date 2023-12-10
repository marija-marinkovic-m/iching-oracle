import resolveChange from './resolveChange.mjs'

const getChangeData = (hexagram) => {
  const change = resolveChange(hexagram)
  const changingLines = hexagram.changes.map((line) => line.position).join(', ')
  return {
    change,
    changingLines
  }
}

export default getChangeData
