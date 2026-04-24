# Sudoku Solver

A clean, interactive Sudoku Solver built with **HTML, CSS, and JavaScript** using the **Backtracking algorithm** — a classic Data Structures & Algorithms approach.

---

## Features

- 9×9 interactive Sudoku grid with keyboard navigation (arrow keys)
- **Solve** — instantly computes the solution using Backtracking
- **Visualize** — animated step-by-step solving with backtrack highlights
- **Sample** — loads a pre-built puzzle for demo
- **Clear** — resets the entire grid
- Invalid input detection with red cell highlights
- Stats panel: steps taken, backtracks, solve time
- Fully responsive (mobile-friendly)

---

## Algorithm: Backtracking

### How it works

1. **Find** the first empty cell (value = 0) scanning left-to-right, top-to-bottom.
2. **Try** digits 1–9 at that cell, checking all three Sudoku constraints:
   - No duplicate in the same **row**
   - No duplicate in the same **column**
   - No duplicate in the same **3×3 sub-grid**
3. If a digit is valid, **place** it and **recurse** to the next empty cell.
4. If recursion fails (dead end), **backtrack** — erase the digit and try the next one.
5. If no digit works → return `false` to trigger backtracking one level up.
6. **Base case**: no empty cells remain → puzzle is solved!

### Complexity

| | Complexity | Notes |
|---|---|---|
| **Time** | O(9^m) | m = number of empty cells |
| **Space** | O(m) | Recursion stack depth |

In practice, constraint pruning makes it much faster than the worst case.

---

## File Structure

```
sudoku-solver/
├── index.html   — HTML structure and layout
├── style.css    — Dark industrial theme, animations, responsive design
├── solver.js    — Core backtracking algorithm (well-commented)
├── ui.js        — DOM interaction, visualization, event handlers
└── README.md    — This file
```

---

## How to Run

Just open `index.html` in any modern browser — no server or build step needed.

---

## Usage

1. **Type numbers (1–9)** into any cell, or click **Sample** to load a demo puzzle.
2. Click **Solve** for an instant solution, or **Visualize** to watch it solve step-by-step.
3. Solved cells appear in **cyan**; user-input cells stay **white**.
4. If the board has conflicts, conflicting cells highlight in **red**.
5. Use **Arrow keys** to navigate between cells.

---

## Tech Stack

- **HTML5** — semantic structure
- **CSS3** — custom properties, grid, keyframe animations, responsive layout
- **Vanilla JavaScript** — no frameworks or dependencies
- **Google Fonts** — Space Mono + Syne
