import Board from './board'
import { MinHeap } from 'min-heap-typed'

interface SearchNode {
  board: Board
  moves: number
  priority: number
  previous: SearchNode | null
}

class Solver {
  private initialBoard: Board
  private isInitialBoardSolvable: boolean
  private minMoves: number = Infinity
  private solution: Board[] | null = null
  private visitedBoards: Set<string> = new Set(); // to keep track of visited boards

  constructor (initial: Board) {
    this.initialBoard = initial
    this.isInitialBoardSolvable = true
    if (!this.checkSolvable(this.initialBoard)) {
      this.isInitialBoardSolvable = false;
      return; 
    }
    this.solve();
  }

  private checkSolvable(board: Board): boolean {
    const flatten = board.tiles.flat().filter(num => num !== 0);
    let inversionCount = 0;
    for (let i = 0; i < flatten.length - 1; i++) {
      for (let j = i + 1; j < flatten.length; j++) {
        if (flatten[i] > flatten[j]) {
          inversionCount++;
        }
      }
    }
    const blankRow = board.findBlankRow();
    const gridWidth = board.dimension();
    if (gridWidth % 2 === 1) {
      return inversionCount % 2 === 0;
    } else {
      return (inversionCount + blankRow) % 2 === 1;
    }
  }


  isSolvable (): boolean {
    return this.isInitialBoardSolvable
  }

  moves (): number {
    return this.isInitialBoardSolvable ? this.minMoves : -1
  }

  getSolution (): Board[] | null {
    return this.isInitialBoardSolvable ? this.solution : null
  }

  private buildSolution(node: SearchNode): Board[] {
    const solution: Board[] = [];
    let current: SearchNode | null = node;
    while (current !== null) {
      solution.unshift(current.board);
      current = current.previous;
    }
    return solution;
  }

  private solve() {
    const initial: SearchNode = {
      board: this.initialBoard,
      moves: 0,
      priority: this.initialBoard.manhattan(),
      previous: null
    };
    const twin: SearchNode = {
      board: this.initialBoard.twin(),
      moves: 0,
      priority: this.initialBoard.twin().manhattan(),
      previous: null
    };

    const heap = new MinHeap<SearchNode>([], {
      comparator: (a, b) => a.priority - b.priority
    });
    heap.add(initial);
    heap.add(twin);

    while (!heap.isEmpty()) {
      const node = heap.poll()!;
      if (node.board.isGoal()) {
        this.minMoves = node.moves;
        this.solution = this.buildSolution(node);
        return;
      }
      if (this.visitedBoards.has(node.board.toString())) { // if the board has been visited
        continue;
      }
      this.visitedBoards.add(node.board.toString()); // mark the board as visited
      for (const neighbor of node.board.neighbors()) {
        const newNode: SearchNode = {
          board: neighbor,
          moves: node.moves + 1,
          priority: node.moves + 1 + neighbor.manhattan(),
          previous: node
        };
        heap.add(newNode);
      }
    }
    this.isInitialBoardSolvable = false;
  }
}


export default Solver
