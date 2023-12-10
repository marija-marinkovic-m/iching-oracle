const NUMBER_OF_STALKS = 50

export const resolveSeparation = (numberOfStalks) => {
  const observer = 1
  const westPile = Math.floor(Math.random() * numberOfStalks)
  const eastPile = numberOfStalks - westPile - observer

  const westRemainder = westPile % 4 || 4
  const eastRemainder = eastPile % 4 || 4

  return observer + westRemainder + eastRemainder > 5 ? 2 : 3
}

const resolveLine = () => {
  let numberOfStalks = NUMBER_OF_STALKS - 1

  const draws = Array.from({ length: 3 }, () => {
    const draw = resolveSeparation(numberOfStalks)
    numberOfStalks -= draw
    return draw
  })

  switch (draws.reduce((acc, curr) => acc + curr, 0)) {
    case 6:
      return { old: true, binary: 0 } // old yin
    case 7:
      return { old: false, binary: 1 } // young yang
    case 8:
      return { old: false, binary: 0 } // young yin
    case 9:
      return { old: true, binary: 1 } // old yang
    default:
      throw new Error('Something went wrong!')
  }
}

export default resolveLine
