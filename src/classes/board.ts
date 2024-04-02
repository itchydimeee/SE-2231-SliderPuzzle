class Board {

  private tiles: number[][]
  private n: number

  constructor (tiles: number[][]) {
    this.n = tiles.length
    this.tiles = tiles.map(row => [...row])
  }

  toString (): string {
    let str = `${this.n}\n`
    for (const row of this.tiles) {
      str += row.join(' ') + '\n'
    }
    return str.trim()
  }

  dimension (): number {
    return this.n
  }

  // number of tiles out of place
  hamming (): number {
    // PLS MODIFY
    let count = 0
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        const tile = this.tiles[i][j]
        if (tile !== 0 && tile !== i * this.n + j + 1) {
          count++
        }
      }
    }
    return count
  }

  // sum of Manhattan distances between tiles and goal
  manhattan (): number {
    // PLS MODIFY
    let distance = 0
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        const tile = this.tiles[i][j]
        if (tile !== 0) {
          const goalRow = Math.floor((tile - 1) / this.n)
          const goalCol = (tile - 1) % this.n
          distance += Math.abs(i - goalRow) + Math.abs(j - goalCol)
        }
      }
    }
    return distance
  }

  // is this board the goal board?
  isGoal (): boolean {
    // PLS MODIFY
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        const tile = this.tiles[i][j]
        if (tile !== (i * this.n + j + 1) % (this.n * this.n)) {
          return false
        }
      }
    }
    return true
  }

  // does this board equal y?
  equals (y: Board): boolean {
    if (this.n !== y.dimension()) {
      return false
    }
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        if (this.tiles[i][j] !== y.tiles[i][j]) {
          return false
        }
      }
    }
    return true
  }

  // all neighboring boards
  neighbors (): Board[] {
    // PLS MODIFY
    const neighbors: Board[] = []
    const blankRow = this.findBlankRow()
    const blankCol = this.findBlankCol()

    // Try sliding tiles up
    if (blankRow > 0) {
      const newTiles = this.copyTiles()
      newTiles[blankRow][blankCol] = newTiles[blankRow - 1][blankCol]
      newTiles[blankRow - 1][blankCol] = 0
      neighbors.push(new Board(newTiles))
    }

    // Try sliding tiles down
    if (blankRow < this.n - 1) {
      const newTiles = this.copyTiles()
      newTiles[blankRow][blankCol] = newTiles[blankRow + 1][blankCol]
      newTiles[blankRow + 1][blankCol] = 0
      neighbors.push(new Board(newTiles))
    }

    // Try sliding tiles left
    if (blankCol > 0) {
      const newTiles = this.copyTiles()
      newTiles[blankRow][blankCol] = newTiles[blankRow][blankCol - 1]
      newTiles[blankRow][blankCol - 1] = 0
      neighbors.push(new Board(newTiles))
    }

    // Try sliding tiles right
    if (blankCol < this.n - 1) {
      const newTiles = this.copyTiles()
      newTiles[blankRow][blankCol] = newTiles[blankRow][blankCol + 1]
      newTiles[blankRow][blankCol + 1] = 0
      neighbors.push(new Board(newTiles))
    }

    return neighbors
  }

  // a board that is obtained by exchanging any pair of tiles
  twin (): Board {
    const newTiles = this.copyTiles()
    let swapped = false
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n - 1; j++) {
        if (newTiles[i][j] !== 0 && newTiles[i][j + 1] !== 0) {
          ;[newTiles[i][j], newTiles[i][j + 1]] = [
            newTiles[i][j + 1],
            newTiles[i][j]
          ]
          swapped = true
          break
        }
      }
      if (swapped) {
        break
      }
    }
    return new Board(newTiles)
  }

  private findBlankRow (): number {
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        if (this.tiles[i][j] === 0) {
          return i
        }
      }
    }
    throw new Error('Blank square not found')
  }

  private findBlankCol (): number {
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        if (this.tiles[i][j] === 0) {
          return j
        }
      }
    }
    throw new Error('Blank square not found')
  }

  private copyTiles (): number[][] {
    return this.tiles.map(row => [...row])
  }
}

export default Board
