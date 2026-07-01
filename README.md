# CS302 Lecture 2: Divide and Conquer

This project recreates `CS302_Lecture_2_Divide_and_Conquer.pdf` as a native
reveal.js deck. The lecture is rebuilt from editable slide components: text,
arrays, tables, diagrams, fragments, LaTeX formulas, and speaker notes.

## Run locally

```bash
pnpm install
pnpm dev
```

Then open the URL printed by Vite.

## Useful reveal.js controls

- Press `S` for speaker view.
- Press `O` for overview mode.
- Press `F` for fullscreen.
- Press `Esc` to leave overview/fullscreen.
- Use `?` inside the deck to see reveal.js shortcuts.

## Current coverage

The deck covers the lecture content as editable reveal.js slides:

- Selection sort warm-up
- Selection sort pseudocode, input/output contract, sorted-array state, and running-time summation
- Merge sort and its recurrence
- Merge sort animation states, merge pseudocode, merge step, and recursion-tree analysis
- Quick sort, recursive partitioning, pseudocode, and best/worst recurrence cases
- Sorting algorithm comparison table
- Closest pair original point graph, divide line, \(d_L\), \(d_R\), strip/packing annotations, pseudocode, and recurrence
- Matrix multiplication dimensions, row/column entry calculation, total \(\Theta(mnk)\), block multiplication, naive recurrence, Strassen \(M_1\)-\(M_7\), and Strassen combination formula
- Master theorem cases in LaTeX
- Summary

The original PDF has 139 pages, many of which are animation frames. This
reveal.js version rebuilds those frames as native HTML/CSS slide objects rather
than static page screenshots.
