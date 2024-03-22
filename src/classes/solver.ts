import Board from './board';
import { MinPriorityQueue } from '@datastructures-js/priority-queue';


interface SearchNode {
  board: Board;
  moves: number;
  priority: number;
  prev: SearchNode | null;
}

class Solver {
  private initialBoard: Board;
  private isSolvable: boolean;
  private minMoves: number = Infinity;
  private solution: Board[] | null = null;

  constructor(initial: Board) {
    this.initialBoard = initial;
    this.isSolvable = true;
    this.solve();
  }

  getIsSolvable(): boolean {
    return this.isSolvable;
  }

  moves(): number {
    return this.minMoves === Infinity ? -1 : this.minMoves;
  }

  getSolution(): Board[] | null {
    return this.solution;
  }

  private solve() {
    const initial: SearchNode = {
      board: this.initialBoard,
      moves: 0,
      priority: this.initialBoard.manhattan(),
      prev: null,
    };

    const twin: SearchNode = {
      board: this.initialBoard.twin(),
      moves: 0,
      priority: this.initialBoard.twin().manhattan(),
      prev: null,
    };

    const pq = new MinPriorityQueue<SearchNode>((node: SearchNode) => node.priority);

    pq.enqueue(initial);
    pq.enqueue(twin);

    let prevBoard: Board | null = null;

    while (!pq.isEmpty()) {
      const node = pq.dequeue();

      if (node.board.isGoal()) {
        this.minMoves = node.moves;
        this.solution = this.buildSolution(node);
        return;
      }

      if (prevBoard !== null && node.board.equals(prevBoard)) {
        continue;
      }

      prevBoard = node.board;

      for (const neighbor of node.board.neighbors()) {
        const newNode: SearchNode = {
          board: neighbor,
          moves: node.moves + 1,
          priority: node.moves + 1 + neighbor.manhattan(),
          prev: node,
        };
        pq.enqueue(newNode);
      }
    }

    this.isSolvable = false;
  }

  private buildSolution(node: SearchNode): Board[] {
    const solution: Board[] = [];
    let curr: SearchNode | null = node;

    while (curr !== null) {
      solution.unshift(curr.board);
      curr = curr.prev;
    }

    return solution;
  }
}

export default Solver;