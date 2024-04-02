import Board from './board'
import { MinHeap } from 'min-heap-typed'

interface SearchNode {
  board: Board
  moves: number
  priority: number
  prev: SearchNode | null
}

class Solver {
  private initialBoard: Board
  private isInitialBoardSolvable: boolean
  private minMoves: number = Infinity
  private solution: Board[] | null = null

  constructor (initial: Board) {
    this.initialBoard = initial
    this.isInitialBoardSolvable = true
    this.solve()
  }

  isSolvable (): boolean {
    return this.isInitialBoardSolvable
  }

  moves (): number {
    return this.minMoves === Infinity ? -1 : this.minMoves
  }

  getSolution (): Board[] {
    return this.solution || []
  }
  private solve () {
    const initial: SearchNode = {
      board: this.initialBoard,
      moves: 0,
      priority: this.initialBoard.manhattan(),
      prev: null
    }
    const twin: SearchNode = {
      board: this.initialBoard.twin(),
      moves: 0,
      priority: this.initialBoard.twin().manhattan(),
      prev: null
    }
  
  // Create an instance of MinHeap with an empty array and the comparator function
  const heap = new MinHeap<SearchNode>([], {comparator: (a, b) => a.priority- b.priority});
    heap.add(initial)
    heap.add(twin)

    let prevBoard: Board | null = null
    while (!heap.isEmpty()) {
      const node = heap.poll()!
      if (node.board.isGoal()) {
        this.minMoves = node.moves
        this.solution = this.buildSolution(node)
        return
      }
      if (prevBoard !== null && node.board.equals(prevBoard)) {
        continue
      }
      prevBoard = node.board
      for (const neighbor of node.board.neighbors()) {
        const newNode: SearchNode = {
          board: neighbor,
          moves: node.moves + 1,
          priority: node.moves + 1 + neighbor.manhattan(),
          prev: node
        }
        heap.add(newNode)
      }
    }
    this.isInitialBoardSolvable = false
  }

  private buildSolution (node: SearchNode): Board[] {
    const solution: Board[] = []
    let curr: SearchNode | null = node
    while (curr !== null) {
      solution.unshift(curr.board)
      curr = curr.prev
    }
    return solution
  }
}

export default Solver
