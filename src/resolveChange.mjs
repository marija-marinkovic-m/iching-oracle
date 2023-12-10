const DESCRIPTIONS = {
  0: 'No changes. This is a static hexagram.',
  1: 'One change. This is a dynamic hexagram.',
  2: 'Two changes. The upper line prevails.',
  3: 'Three changes. The middle line prevails.',
  4: 'Four changes. The upper, non-changing line prevails.',
  5: 'Five changes. The only non-changing line prevails.',
  6: 'All changing lines! Only the transformed hexagram applies!'
}

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
