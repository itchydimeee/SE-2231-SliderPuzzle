import Solver from "./classes/solver";
import Board from "./classes/board";
import { readFileSync } from "fs";
import path from 'path';

const fileName: string = process.argv[2];

if (!fileName) {
  console.error('Please provide a puzzle file name as a command-line argument.');
  process.exit(1);
}

const puzzlesDir = path.join(__dirname, '..', 'puzzles');
const filePath = path.join(puzzlesDir, fileName);

try {
  const lines: string[] = readFileSync(filePath, "utf8").split("\n");
  const n: number = parseInt(lines[0]);
  const tiles: number[][] = Array(n).fill(Array(n));

  lines.forEach((line, row) => {
    if (row === 0) {
      return;
    }

    const nums = line
      .split(" ")
      .map((s) => parseInt(s))
      .filter((x) => !isNaN(x));

    if (nums.length === 0) {
      return;
    }

    tiles[row - 1] = nums;
  });

  const initial: Board = new Board(tiles);

  // solve the puzzle
  const solver: Solver = new Solver(initial);

  // print solution to standard output
  if (!solver.getIsSolvable()) {
    console.log("No solution possible");
  } else {
    console.log("Minimum number of moves = " + solver.moves());
    const solution = solver.getSolution()
    if (solution != null) {
        for (let board of solution) {
            console.log(board.toString());
          }
    }
  
  }
} catch (err) {
  console.error(`Error reading file: ${(err as Error).message}`);
  process.exit(1);
}