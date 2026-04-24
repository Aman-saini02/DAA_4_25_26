/**
 * ============================================================
 * SUDOKU SOLVER — ui.js
 * Handles DOM rendering, user interaction, and visualization
 * ============================================================
 */

/* ── State ──────────────────────────────────────────────── */
let userInputMask = Array.from({ length: 9 }, () => Array(9).fill(false));
let isVisualizing = false;
let vizCancelFlag = false;

/* ── DOM ready ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  buildGrid();
  setStatus('ready', 'Ready — enter numbers and press Solve');
});

/* ── Build the 9×9 Grid ─────────────────────────────────── */
function buildGrid() {
  const grid = document.getElementById('sudokuGrid');
  grid.innerHTML = '';

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement('input');
      cell.type         = 'text';
      cell.maxLength    = 1;
      cell.classList.add('cell');
      cell.dataset.row  = row;
      cell.dataset.col  = col;
      cell.setAttribute('inputmode', 'numeric');
      cell.setAttribute('aria-label', `Row ${row + 1}, Column ${col + 1}`);

      cell.addEventListener('input',   onCellInput);
      cell.addEventListener('keydown', onCellKeydown);
      cell.addEventListener('focus',   onCellFocus);

      grid.appendChild(cell);
    }
  }
}

/* ── Cell Input Handler ─────────────────────────────────── */
function onCellInput(e) {
  const cell  = e.target;
  const row   = parseInt(cell.dataset.row);
  const col   = parseInt(cell.dataset.col);
  const raw   = cell.value.replace(/[^1-9]/g, '');

  // Accept only digits 1–9
  cell.value = raw ? raw[raw.length - 1] : '';

  // Mark this as a user-provided cell
  if (cell.value) {
    cell.classList.add('user-input');
    cell.classList.remove('solved-cell', 'invalid');
    userInputMask[row][col] = true;
  } else {
    cell.classList.remove('user-input', 'invalid');
    userInputMask[row][col] = false;
  }

  // Clear any previous solve results
  clearSolvedCells();
  setStatus('ready', 'Ready — enter numbers and press Solve');
}

/* ── Keyboard Navigation ────────────────────────────────── */
function onCellKeydown(e) {
  const cell = e.target;
  const row  = parseInt(cell.dataset.row);
  const col  = parseInt(cell.dataset.col);

  const moves = {
    ArrowRight: [row, col + 1],
    ArrowLeft:  [row, col - 1],
    ArrowDown:  [row + 1, col],
    ArrowUp:    [row - 1, col],
  };

  if (moves[e.key]) {
    e.preventDefault();
    const [nr, nc] = moves[e.key];
    if (nr >= 0 && nr < 9 && nc >= 0 && nc < 9) {
      getCell(nr, nc).focus();
    }
  }

  // Tab navigation stays within grid
  if (e.key === 'Backspace' && !cell.value) {
    e.preventDefault();
    const prevCol = col - 1 >= 0 ? col - 1 : (col === 0 && row > 0 ? 8  : -1);
    const prevRow = col - 1 >= 0 ? row      : (row > 0 ? row - 1 : -1);
    if (prevRow >= 0 && prevCol >= 0) getCell(prevRow, prevCol).focus();
  }
}

/* ── Cell Focus ─────────────────────────────────────────── */
function onCellFocus(e) {
  e.target.select();
}

/* ── Helper: get cell element ───────────────────────────── */
function getCell(row, col) {
  return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

/* ── Read Current Grid from DOM ─────────────────────────── */
function readGrid() {
  const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = parseInt(getCell(r, c).value);
      grid[r][c] = isNaN(val) ? 0 : val;
    }
  }
  return grid;
}

/* ── Write Grid to DOM ──────────────────────────────────── */
function writeGrid(grid, original) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = getCell(r, c);
      if (!original[r][c]) {
        // This was an empty cell — filled by solver
        cell.value = grid[r][c];
        cell.classList.add('solved-cell');
        cell.classList.remove('user-input', 'invalid');
      }
    }
  }
}

/* ── Clear only solver-filled cells ─────────────────────── */
function clearSolvedCells() {
  document.querySelectorAll('.cell.solved-cell').forEach(cell => {
    cell.value = '';
    cell.classList.remove('solved-cell', 'viz-active', 'viz-backtrack');
  });
}

/* ── SOLVE (instant) ─────────────────────────────────────── */
function handleSolve() {
  if (isVisualizing) { stopVisualization(); return; }

  const rawGrid   = readGrid();
  const origEmpty = rawGrid.map(row => row.map(v => v === 0));

  // Validate the user's input before solving
  const { valid, conflictCells } = validateBoard(rawGrid);
  if (!valid) {
    highlightConflicts(conflictCells);
    setStatus('error', '✕ Invalid board — conflicting numbers highlighted in red');
    return;
  }

  clearConflicts();
  setStatus('solving', 'Solving…');

  const stats    = { steps: 0, backtracks: 0 };
  const gridCopy = rawGrid.map(r => [...r]);
  const t0       = performance.now();
  const solved   = solveSudoku(gridCopy, stats);
  const elapsed  = (performance.now() - t0).toFixed(2);

  if (solved) {
    writeGrid(gridCopy, origEmpty);
    showStats(stats.steps, stats.backtracks, elapsed + 'ms', 'Solved ✓');
    setStatus('solved', `✓ Solved in ${elapsed} ms · ${stats.steps.toLocaleString()} steps · ${stats.backtracks.toLocaleString()} backtracks`);
  } else {
    setStatus('error', '✕ No solution exists for this puzzle');
    showStats(stats.steps, stats.backtracks, elapsed + 'ms', 'Unsolvable');
  }
}

/* ── VISUALIZE (step-by-step animation) ─────────────────── */
async function handleVisualize() {
  if (isVisualizing) {
    stopVisualization();
    return;
  }

  const rawGrid = readGrid();
  const { valid, conflictCells } = validateBoard(rawGrid);
  if (!valid) {
    highlightConflicts(conflictCells);
    setStatus('error', '✕ Invalid board — fix conflicts first');
    return;
  }

  clearConflicts();
  clearSolvedCells();

  const { steps, solved, finalGrid, stats } = recordSolveSteps(rawGrid);
  const origEmpty = rawGrid.map(row => row.map(v => v === 0));

  if (!solved) {
    setStatus('error', '✕ No solution exists for this puzzle');
    return;
  }

  isVisualizing = true;
  vizCancelFlag = false;
  document.getElementById('visualizeBtn').textContent = '⏹ Stop';
  document.getElementById('solveBtn').disabled = true;
  setStatus('solving', `Visualizing ${steps.length.toLocaleString()} steps…`);

  // Determine playback speed based on step count
  // More steps → faster to keep animation reasonable
  const delay = steps.length > 5000 ? 2 : steps.length > 1000 ? 6 : 12;

  let stepIdx = 0;
  const t0 = performance.now();

  function animateChunk() {
    if (vizCancelFlag) return;
    // Process multiple steps per frame for speed
    const batchSize = Math.max(1, Math.floor(steps.length / 1000));
    for (let i = 0; i < batchSize && stepIdx < steps.length; i++, stepIdx++) {
      const { row, col, num, isBacktrack } = steps[stepIdx];
      const cell = getCell(row, col);

      if (isBacktrack) {
        cell.value = '';
        cell.classList.remove('viz-active', 'solved-cell');
        cell.classList.add('viz-backtrack');
        setTimeout(() => cell.classList.remove('viz-backtrack'), delay * 4);
      } else {
        cell.value = num;
        cell.classList.remove('viz-backtrack');
        cell.classList.add('viz-active');
        setTimeout(() => {
          cell.classList.remove('viz-active');
          cell.classList.add('solved-cell');
        }, delay * 3);
      }
    }

    if (stepIdx < steps.length) {
      setTimeout(animateChunk, delay);
    } else {
      // Finalize
      const elapsed = (performance.now() - t0).toFixed(0);
      writeGrid(finalGrid, origEmpty);
      showStats(stats.steps, stats.backtracks, elapsed + 'ms', 'Solved ✓');
      setStatus('solved', `✓ Visualization complete · ${elapsed} ms`);
      endVisualization();
    }
  }

  animateChunk();
}

function stopVisualization() {
  vizCancelFlag = true;
  clearSolvedCells();
  setStatus('ready', 'Visualization stopped — grid reset');
  endVisualization();
}

function endVisualization() {
  isVisualizing = false;
  const vizBtn = document.getElementById('visualizeBtn');
  vizBtn.innerHTML = '<span class="btn-icon">◈</span><span>Visualize</span>';
  document.getElementById('solveBtn').disabled = false;
}

/* ── LOAD SAMPLE PUZZLE ──────────────────────────────────── */
function loadSample() {
  if (isVisualizing) stopVisualization();
  const sample = getSamplePuzzle();
  clearGrid(false);

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (sample[r][c] !== 0) {
        const cell = getCell(r, c);
        cell.value = sample[r][c];
        cell.classList.add('user-input');
        userInputMask[r][c] = true;
      }
    }
  }

  setStatus('ready', 'Sample puzzle loaded — press Solve or Visualize');
  hideStats();
}

/* ── CLEAR GRID ──────────────────────────────────────────── */
function clearGrid(resetStatus = true) {
  if (isVisualizing) stopVisualization();

  userInputMask = Array.from({ length: 9 }, () => Array(9).fill(false));

  document.querySelectorAll('.cell').forEach(cell => {
    cell.value = '';
    cell.className = 'cell';
  });

  if (resetStatus) {
    setStatus('ready', 'Grid cleared — ready for new input');
    hideStats();
  }
}

/* ── Conflict Highlighting ───────────────────────────────── */
function highlightConflicts(conflictCells) {
  conflictCells.forEach(key => {
    const [r, c] = key.split('-').map(Number);
    getCell(r, c).classList.add('invalid');
  });
}

function clearConflicts() {
  document.querySelectorAll('.cell.invalid').forEach(c => c.classList.remove('invalid'));
}

/* ── Status Bar ──────────────────────────────────────────── */
function setStatus(type, message) {
  const bar  = document.getElementById('statusBar');
  const text = document.getElementById('statusText');

  bar.className = 'status-bar';
  if (type !== 'ready') bar.classList.add(type);
  text.textContent = message;
}

/* ── Stats Panel ─────────────────────────────────────────── */
function showStats(steps, backtracks, time, status) {
  document.getElementById('statSteps').textContent      = steps.toLocaleString();
  document.getElementById('statBacktracks').textContent = backtracks.toLocaleString();
  document.getElementById('statTime').textContent       = time;
  document.getElementById('statStatus').textContent     = status;
  document.getElementById('statsPanel').classList.add('visible');
}

function hideStats() {
  document.getElementById('statsPanel').classList.remove('visible');
}
