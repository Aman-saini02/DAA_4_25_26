/**
 * ============================================================
 * SUDOKU SOLVER — solver.js
 * Algorithm: Backtracking (Depth-First Search with pruning)
 *
 * Time Complexity:  O(9^m)  where m = number of empty cells
 * Space Complexity: O(m)    for the recursion call stack
 * ============================================================
 */

/**
 * Checks if placing `num` at grid[row][col] is valid.
 * Validates three Sudoku constraints:
 *   1. The number does not appear in the same row.
 *   2. The number does not appear in the same column.
 *   3. The number does not appear in the same 3×3 sub-grid.
 *
 * @param {number[][]} grid - 9×9 board (0 = empty)
 * @param {number}     row  - Target row index (0–8)
 * @param {number}     col  - Target col index (0–8)
 * @param {number}     num  - Digit to place (1–9)
 * @returns {boolean}       - true if placement is valid
 */
function isValid(grid, row, col, num) {
  // ── Constraint 1: Row check ──────────────────────────────
  for (let c = 0; c < 9; c++) {
    if (grid[row][c] === num) return false;
  }

  // ── Constraint 2: Column check ───────────────────────────
  for (let r = 0; r < 9; r++) {
    if (grid[r][col] === num) return false;
  }

  // ── Constraint 3: 3×3 sub-grid check ────────────────────
  // Find the top-left corner of the sub-grid containing (row, col)
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (grid[r][c] === num) return false;
    }
  }

  return true; // All three constraints pass → valid placement
}


/**
 * Core Backtracking Solver (synchronous, returns result immediately).
 *
 * How it works:
 *   1. Scan for the first empty cell (value 0).
 *   2. If none found → puzzle is solved (base case).
 *   3. Try digits 1–9. For each valid digit:
 *        a. Place it on the board.
 *        b. Recurse into the next state.
 *        c. If recursion succeeds → propagate success upward.
 *        d. If recursion fails → undo (backtrack) and try next digit.
 *   4. If no digit works → return false (trigger backtrack above).
 *
 * @param {number[][]} grid  - 9×9 board (mutated in-place)
 * @param {Object}     stats - Mutable stats object { steps, backtracks }
 * @returns {boolean}        - true if solved, false if unsolvable
 */
function solveSudoku(grid, stats = { steps: 0, backtracks: 0 }) {
  // ── Step 1: Find the next empty cell ────────────────────
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] !== 0) continue; // Cell already filled

      // ── Step 2: Try each digit 1–9 ──────────────────────
      for (let num = 1; num <= 9; num++) {
        stats.steps++;

        if (isValid(grid, row, col, num)) {
          // ── Place the digit (tentative choice) ──────────
          grid[row][col] = num;

          // ── Recurse deeper ───────────────────────────────
          if (solveSudoku(grid, stats)) {
            return true; // Puzzle solved — propagate success
          }

          // ── Backtrack: undo the choice ───────────────────
          grid[row][col] = 0;
          stats.backtracks++;
        }
      }

      // No digit worked for this cell → unsolvable from here
      return false;
    }
  }

  // ── Base Case: No empty cell found → solved! ────────────
  return true;
}


/**
 * Validates that a partially-filled board has no conflicts.
 * (Used before attempting to solve.)
 *
 * @param {number[][]} grid - 9×9 board
 * @returns {{ valid: boolean, conflictCells: Set<string> }}
 */
function validateBoard(grid) {
  const conflictCells = new Set();

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const num = grid[row][col];
      if (num === 0) continue;

      // Temporarily clear this cell and check if it's valid
      grid[row][col] = 0;
      if (!isValid(grid, row, col, num)) {
        conflictCells.add(`${row}-${col}`);
      }
      grid[row][col] = num; // Restore
    }
  }

  return {
    valid: conflictCells.size === 0,
    conflictCells
  };
}


/**
 * Generates a snapshot list of solver steps for step-by-step visualization.
 * Returns an array of { row, col, num, isBacktrack } events.
 *
 * IMPORTANT: This runs on a COPY of the grid so the original is untouched.
 *
 * @param {number[][]} grid       - Original 9×9 board (0 = empty)
 * @returns {{ steps: Array, solved: boolean, finalGrid: number[][] }}
 */
function recordSolveSteps(grid) {
  // Deep-clone so we don't mutate the original
  const workGrid = grid.map(row => [...row]);
  const steps    = [];
  const stats    = { steps: 0, backtracks: 0 };

  /**
   * Inner recursive solver that records every placement and backtrack.
   */
  function solveWithRecord(g) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (g[row][col] !== 0) continue;

        for (let num = 1; num <= 9; num++) {
          stats.steps++;
          if (isValid(g, row, col, num)) {
            g[row][col] = num;
            steps.push({ row, col, num, isBacktrack: false });

            if (solveWithRecord(g)) return true;

            // Backtrack
            steps.push({ row, col, num: 0, isBacktrack: true });
            g[row][col] = 0;
            stats.backtracks++;
          }
        }

        return false; // No valid digit for this cell
      }
    }
    return true; // Solved
  }

  const solved = solveWithRecord(workGrid);

  return { steps, solved, finalGrid: workGrid, stats };
}


/**
 * A sample "hard" Sudoku puzzle for demonstration.
 * 0 represents an empty cell.
 *
 * @returns {number[][]} 9×9 grid
 */
function getSamplePuzzle() {
  return [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ];
}
