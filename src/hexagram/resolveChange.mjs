const DESCRIPTIONS = {
  0: 'No changes.',
  1: 'One change.',
  2: 'Two changes. The upper line prevails.',
  3: 'Three changes. The middle line prevails.',
  4: 'Four changes. The upper, non-changing line prevails.',
  5: 'Five changes. The only non-changing line prevails.',
  6: 'All changing lines! Only the transformed hexagram applies!'
}

/**
 * Returns the position of the prevailing line in a hexagram.
 *
 * @param {object} hexagram - The hexagram object.
 * @returns {number|undefined} - The position of the prevailing line, or undefined if not found.
 */
export const getPrevailingLine = (hexagram) => {
  const changesLength = hexagram.changes.length

  if (changesLength === 4 || changesLength === 5) {
    return hexagram.noChanges[hexagram.noChanges.length - 1]?.position
  }

  const prevailingIndex = changesLength - (changesLength === 3 ? 2 : 1)
  return hexagram.changes[prevailingIndex]?.position
}

const resolveChange = (hexagram) => {
  if (!hexagram.length) throw new Error('Hexagram is empty!')

  if (hexagram.changes.length > 6) throw new Error('Too many changes!')

  return {
    description: DESCRIPTIONS[hexagram.changes.length || 0],
    changedHexagram: hexagram.changedHexagram,
    line: getPrevailingLine(hexagram)
  }
}

export default resolveChange
