import Reveal from 'reveal.js';
import RevealHighlight from 'reveal.js/plugin/highlight/highlight.esm.js';
import RevealMath from 'reveal.js/plugin/math/math.esm.js';
import RevealNotes from 'reveal.js/plugin/notes/notes.esm.js';

import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/white.css';
import 'reveal.js/plugin/highlight/monokai.css';
import './styles.css';

const boxes = (values, options = {}) => values.map((value, index) => {
  const cls = ['obj-cell'];
  if (options.sortedUntil != null && index <= options.sortedUntil) cls.push('sorted');
  if (options.min === index) cls.push('min');
  if (options.hot === index) cls.push('hot');
  if (options.pivot === index) cls.push('pivot');
  if (options.ghost?.includes(index)) cls.push('ghost');
  const swapMove = options.swapMoves?.[index];
  const style = swapMove ? ` style="--swap-x:${swapMove.x}rem;--swap-y:${swapMove.y}rem"` : '';
  if (swapMove) cls.push('swap-cell', swapMove.y < 0 ? 'swap-arc-up' : 'swap-arc-down');
  return `<span class="${cls.join(' ')}"${style}>${value}</span>`;
}).join('');

const row = (values, options = {}) => `<div class="obj-array">${boxes(values, options)}</div>`;

const downArrow = (label = 'Sort', cls = '') => `<div class="sort-arrow ${cls}"><span>${label}</span><i></i></div>`;
const posRow = (values, x, y, options = {}) => `<div class="pos-row" style="--x:${x}rem;--y:${y}rem">${row(values, options)}</div>`;
const posText = (text, x, y, cls = 'red-note') => `<div class="pos-text ${cls}" style="--x:${x}rem;--y:${y}rem">${text}</div>`;
const posArrow = (x, y, h = 5.2, label = 'Sort', cls = '') => `<div class="pos-arrow ${cls}" style="--x:${x}rem;--y:${y}rem;--h:${h}rem"><span>${label}</span><i></i></div>`;

function algoSelectionForPage(page) {
  const lines = [
    '<b>Input:</b> An unsorted list A',
    '<b>Output:</b> A sorted list',
    'n = length of A',
    'for i = 0 -> n-2 do',
    '<span class="indent">jmin = i</span>',
    '<span class="indent">for j = i+1 -> n-1 do</span>',
    '<span class="indent2">if A[j] &lt; A[jmin] then jmin = j</span>',
    '<span class="indent">if jmin != i then swap A[i] and A[jmin]</span>',
    'return A'
  ];
  const countByPage = {22: 0, 23: 2, 24: 3, 25: 4, 26: 7, 27: 8, 28: 9, 29: 9};
  const visibleCount = countByPage[page] ?? 9;
  return `
  <div class="algo-box">
    <strong>Algorithm 1:</strong> Selection sort
    ${page === 22 ? '<p class="new-code-line">Start with the algorithm header.</p>' : ''}
    <ol>${lines.slice(0, visibleCount).map((line, index) => `<li class="${index === visibleCount - 1 && page >= 23 ? 'new-code-line' : ''}">${line}</li>`).join('')}</ol>
  </div>`;
}

function selectionPythonForPage(page) {
  return `
  <div class="python-code-card">
    <strong>Python version:</strong> selection_sort
    <pre><code class="language-python">def selection_sort(a):
    n = len(a)
    for i in range(n - 1):
        j_min = i
        for j in range(i + 1, n):
            if a[j] &lt; a[j_min]:
                j_min = j
        if j_min != i:
            a[i], a[j_min] = a[j_min], a[i]
    return a</code></pre>
  </div>`;
}

function mergePythonPanel() {
  return `
  <div class="python-code-card compact-python merge-python-card">
    <strong>Python version:</strong> merge_sort
    <pre><code class="language-python">def merge_sort(a):
    if len(a) &lt;= 1:
        return a
    mid = (len(a) + 1) // 2
    left = merge_sort(a[:mid])
    right = merge_sort(a[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i &lt; len(left) and j &lt; len(right):
        if left[i] &lt;= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result</code></pre>
  </div>`;
}

function algoMergeForPage(page) {
  const mergeSortLines = [
    'n = length(A)',
    'if n &lt;= 1 then return A',
    'left = right = []',
    'for i = 0 -> ceil(n/2)-1 append A[i] to left',
    'for i = ceil(n/2) -> n-1 append A[i] to right',
    'left = merge_sort(left)',
    'right = merge_sort(right)',
    'return merge(left, right)'
  ];
  const mergeLines = [
    'result = []',
    'while L1 != [] or L2 != [] do',
    '<span class="indent">append the smaller front item to result</span>',
    '<span class="indent">pop that item from its list</span>',
    'return result'
  ];
  const lineClass = page === 52 ? 'fragment' : '';
  return `
  <div class="algo-pair">
    <div class="algo-box compact-code">
      <strong>Algorithm 1:</strong> merge_sort(A)
      <ol>${mergeSortLines.map((line) => `<li class="${lineClass}">${line}</li>`).join('')}</ol>
    </div>
    <div class="algo-box compact-code">
      <strong>Algorithm 2:</strong> merge(L1, L2)
      <ol>${mergeLines.map((line) => `<li class="${lineClass}">${line}</li>`).join('')}</ol>
    </div>
  </div>`;
}

function makeSlide(title, body, page) {
  const slide = document.createElement('section');
  slide.className = `object-frame page-${page}`;
  slide.dataset.transition = 'none';
  slide.innerHTML = `<h2>${title}</h2>${body}<span class="pdf-page">${page}</span>`;
  return slide;
}

const sortingRows = [
  ['Quicksort', '\\(n\\log n\\)', '\\(n\\log n\\)', '\\(n^2\\)', '\\(\\log n\\)', 'No'],
  ['Mergesort', '\\(n\\log n\\)', '\\(n\\log n\\)', '\\(n\\log n\\)', '\\(n\\)', 'Yes'],
  ['Heapsort', '\\(n\\log n\\)', '\\(n\\log n\\)', '\\(n\\log n\\)', '\\(1\\)', 'No'],
  ['Bubble sort', '\\(n\\)', '\\(n^2\\)', '\\(n^2\\)', '\\(1\\)', 'Yes'],
  ['Insertion sort', '\\(n\\)', '\\(n^2\\)', '\\(n^2\\)', '\\(1\\)', 'Yes'],
  ['Selection sort', '\\(n^2\\)', '\\(n^2\\)', '\\(n^2\\)', '\\(1\\)', 'No'],
  ['Tree sort', '\\(n\\log n\\)', '\\(n\\log n\\)', '\\(n\\log n\\)', '\\(n\\)', 'Yes']
];

function sortingTable(page) {
  const highlight = page === 88 ? ' class="highlight-row"' : '';
  const visibleRows = page === 86 ? [] : sortingRows;
  const bodyRows = visibleRows.map((cells, index) => `<tr${index === 6 ? highlight : ''}>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
  const emptyRows = page === 86 ? '<tr><td colspan="6" class="table-preview-cell">Comparing common sorting algorithms</td></tr>' : '';
  const question = page >= 89 ? '<p class="question exact-question">Can we beat \\(O(n\\log n)\\)???</p>' : '';
  return `
    <table class="complexity-table exact-complexity">
      <thead>
        <tr><th>Name</th><th>Best</th><th>Average</th><th>Worst</th><th>Memory (Worst)</th><th>Stable</th></tr>
      </thead>
      <tbody>${bodyRows}${emptyRows}</tbody>
    </table>
    ${question}`;
}

function sortingTableFrame(page) {
  return makeSlide('Sorting algorithms', sortingTable(page), page);
}

function selectionFrame(page) {
  const states = {
    3: ['5','6','1','4','2','3'], 4: ['5','6','1','4','2','3'], 5: ['5','6','1','4','2','3'],
    6: ['1','6','5','4','2','3'], 7: ['1','6','5','4','2','3'], 8: ['1','6','5','4','2','3'],
    9: ['1','2','5','4','6','3'], 10: ['1','2','5','4','6','3'], 11: ['1','2','5','4','6','3'],
    12: ['1','2','3','4','6','5'], 13: ['1','2','3','4','6','5'], 14: ['1','2','3','4','6','5'],
    15: ['1','2','3','4','6','5'], 16: ['1','2','3','4','6','5'], 17: ['1','2','3','4','6','5'],
    18: ['1','2','3','4','5','6'], 19: ['1','2','3','4','5','6'], 20: ['1','2','3','4','5','6']
  };
  const arr = states[page] || ['1','2','3','4','5','6'];
  const sortedUntil = page < 6 ? null : page < 9 ? 0 : page < 12 ? 1 : page < 15 ? 2 : page < 18 ? 3 : 5;
  const min = {4: 2, 7: 4, 10: 5, 13: 3, 16: 5}[page];
  const note = {
    4: 'Select the minimum element',
    5: 'Swap the minimum element with the first element',
    7: 'Select the minimum element in the unsorted sublist',
    8: 'Swap the minimum element with the first element of the unsorted sublist',
    10: 'Select the minimum element in the unsorted sublist',
    11: 'Swap the minimum element with the first element of the unsorted sublist',
    13: 'Select the minimum element in the unsorted sublist',
    14: 'No need to swap!',
    16: 'Select the minimum element in the unsorted sublist',
    17: 'Swap the minimum element with the first element of the unsorted sublist',
    19: 'No need to do anything!'
  }[page];
  const swapPairs = {
    5: [0, 2],
    8: [1, 4],
    11: [2, 5],
    17: [4, 5]
  };
  const activeSwap = swapPairs[page];
  const swapCellStep = 2.35;
  const swapMoves = activeSwap ? {
    [activeSwap[0]]: { x: (activeSwap[1] - activeSwap[0]) * swapCellStep, y: -2.45 },
    [activeSwap[1]]: { x: (activeSwap[0] - activeSwap[1]) * swapCellStep, y: 2.45 }
  } : null;
  const swapArrowId = `swap-arrow-head-${page}`;
  const swap = activeSwap ? `
    <div class="swap-mark animated-swap-mark" aria-label="swap">
      <svg class="swap-curves" viewBox="0 0 120 68" role="img" aria-hidden="true">
        <defs>
          <marker id="${swapArrowId}" class="swap-arrow-head" markerWidth="11" markerHeight="11" refX="9.4" refY="5.5" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L11,5.5 L0,11 Z"></path>
          </marker>
        </defs>
        <path class="swap-curve swap-curve-top" marker-end="url(#${swapArrowId})" d="M12 23 C 35 -3, 85 -3, 108 23" />
        <path class="swap-curve swap-curve-bottom" marker-end="url(#${swapArrowId})" d="M108 45 C 85 71, 35 71, 12 45" />
      </svg>
      <span>swap</span>
    </div>` : '';
  const codePanel = page >= 28 ? selectionPythonForPage(page) : page >= 22 ? algoSelectionForPage(page) : '';
  const body = `
    <div class="selection-layout">
      <div class="${activeSwap ? 'selection-swap-stage' : ''}">
        ${row(arr, { sortedUntil, min, swapMoves })}
        ${swap}
        <div class="range-label">${sortedUntil == null ? 'unsorted' : sortedUntil === 5 ? 'sorted' : 'sorted / unsorted'}</div>
        ${note ? `<p class="red-note">${note}</p>` : ''}
        ${page >= 21 ? '<p class="red-note">How to present this selection sort algorithm?</p>' : ''}
        ${page === 29 ? '<p class="red-note">Running time?</p>' : ''}
      </div>
      ${codePanel}
    </div>`;
  return makeSlide('Selection sort', body, page);
}

function mergeResultSlots(values = [], length = 8) {
  const padded = Array.from({ length }, (_, i) => values[i] || '');
  return `<div class="merge-result">${padded.map(v => `<span>${v}</span>`).join('')}</div>`;
}

function mergeScene(page) {
  const topX = 10.8;
  const leftX = 6.8;
  const rightX = 22.9;
  const splitX = topX + 4 * 2.05 + 0.6;
  const leftCenter = leftX + 4.42;
  const rightCenter = rightX + 4.42;
  const board = ['<div class="sort-board merge-board-exact">'];
  if (page >= 31) board.push(posRow(['5','2','4','8','1','3','7','6'], topX, 0));
  if (page === 32) board.push(`<div class="split-mark positioned-split" style="--x:${splitX}rem"></div>`);
  if (page >= 33) {
    board.push(posRow(['5','2','4','8'], leftX, 3.1));
    board.push(posRow(['1','3','7','6'], rightX, 3.1));
  }
  if (page >= 34 && page <= 47) {
    board.push(posArrow(leftCenter, 6.4, 5.7, 'Sort'));
    if (page >= 35) board.push(posArrow(rightCenter, 6.4, 5.7, 'Sort'));
  }
  if (page >= 34 && page <= 47) board.push(posRow(['2','4','5','8'], leftX, 13.2));
  if (page >= 35 && page <= 47) board.push(posRow(['1','3','6','7'], rightX, 13.2));
  const mergeProgress = {
    36: [], 37: ['1'], 38: ['1','2'], 39: ['1','2','3'], 40: ['1','2','3','4'],
    41: ['1','2','3','4','5'], 42: ['1','2','3','4','5','6'], 43: ['1','2','3','4','5','6','7'],
    44: ['1','2','3','4','5','6','7','8'], 45: [], 46: [], 47: []
  }[page];
  if (mergeProgress) board.push(`<div class="pos-result" style="--x:${topX}rem;--y:16.9rem">${mergeResultSlots(mergeProgress)}</div>`);
  if (page === 46) board.push(posText('How to sort ???', 19, 9.4));
  if (page === 47) board.push(posText('How to sort ???<br><b>Recursion</b>', 19, 9.1));
  if (page >= 48) {
    board.push(posRow(['5','2'], 3.7, 6.2));
    board.push(posRow(['4','8'], 12, 6.2));
    board.push(posRow(['1','3'], 21.7, 6.2));
    board.push(posRow(['7','6'], 30, 6.2));
    if (page >= 48) {
      board.push(posArrow(5.8, 9.1, 3.0, 'Sort', 'small-sort-arrow'));
      board.push(posArrow(14.1, 9.1, 3.0, 'Sort', 'small-sort-arrow'));
      board.push(posArrow(23.8, 9.1, 3.0, 'Sort', 'small-sort-arrow'));
      board.push(posArrow(32.1, 9.1, 3.0, 'Sort', 'small-sort-arrow'));
    }
    board.push(`<div class="pos-result small-result" style="--x:3.7rem;--y:13.1rem">${mergeResultSlots(page >= 50 ? ['2','5'] : page >= 49 ? ['5'] : [], 2)}</div>`);
    board.push(`<div class="pos-result small-result" style="--x:12rem;--y:13.1rem">${mergeResultSlots(page >= 50 ? ['4','8'] : [], 2)}</div>`);
    board.push(`<div class="pos-result small-result" style="--x:21.7rem;--y:13.1rem">${mergeResultSlots(page >= 51 ? ['1','3'] : [], 2)}</div>`);
    board.push(`<div class="pos-result small-result" style="--x:30rem;--y:13.1rem">${mergeResultSlots(page >= 52 ? ['6','7'] : [], 2)}</div>`);
    if (page >= 51) board.push(posRow(['2','4','5','8'], leftX, 16.4));
    if (page >= 52) board.push(posRow(['1','3','6','7'], rightX, 16.4));
    if (page >= 53) board.push(posRow(['1','2','3','4','5','6','7','8'], topX, 19.4));
  }
  board.push('</div>');
  return board.join('');
}

function mergeTree(stage) {
  const rows = [
    [['5','2','4','8','1','3','7','6']],
    [['5','2','4','8'], ['1','3','7','6']],
    [['5','2'], ['4','8'], ['1','3'], ['7','6']],
    [['5'], ['2'], ['4'], ['8'], ['1'], ['3'], ['7'], ['6']],
    [['2','5'], ['4','8'], ['1','3'], ['6','7']],
    [['2','4','5','8'], ['1','3','6','7']],
    [['1','2','3','4','5','6','7','8']]
  ];
  return `<div class="object-tree">${rows.slice(0, stage).map(r => `<div class="object-tree-row">${r.map(v => row(v)).join('')}</div>`).join('')}</div>`;
}

function mergeFrame(page) {
  const analysis = [
    page >= 53 ? '<p class="red-note analysis-heading">Running time?</p>' : '',
    page >= 54 ? '<p class="equation merge-analysis">\\[T(n)=2T(n/2)+\\Theta(n)\\]</p>' : '',
    page >= 55 ? '<p class="blue-note merge-side-note">Master theorem</p>' : '',
    page >= 56 ? '<p class="equation merge-analysis">\\[\\Rightarrow T(n)=O(n\\log n)\\]</p>' : ''
  ].join('');
  const codePanel = page >= 53 ? mergePythonPanel() : page >= 52 ? algoMergeForPage(page) : '';
  return makeSlide('Merge sort', `<div class="merge-object-layout compact-sort-layout"><div>${mergeScene(page)}${analysis}</div>${codePanel}</div>`, page);
}

function algoQuickForPage(page) {
  const lines = [
    '<b>Input:</b> An unsorted array A',
    '<b>Output:</b> A is sorted in ascending order and returned',
    'If A has less than two elements then return A itself',
    'Pick a pivot that is an element of A',
    'Partition other elements into \\(A_{less}\\) and \\(A_{greater}\\)',
    '\\(A_{less,sorted}=quick\\_sort(A_{less})\\)',
    '\\(A_{greater,sorted}=quick\\_sort(A_{greater})\\)',
    'return concatenate(\\(A_{less,sorted}\\), [pivot], \\(A_{greater,sorted}\\))'
  ];
  const visibleByPage = {76: 2, 77: 3, 78: 4, 79: 5, 80: 6, 81: 7, 82: 8, 83: 8, 84: 8, 85: 8};
  const visibleCount = visibleByPage[page] ?? 8;
  return `
  <div class="algo-box quick-code-box">
    <strong>Algorithm 3:</strong> quick_sort
    <ol>${lines.slice(0, visibleCount).map((line, index) => `<li class="${index === visibleCount - 1 ? 'new-code-line' : ''}">${line}</li>`).join('')}</ol>
  </div>`;
}

function quickPythonPanel() {
  return `
  <div class="python-code-card compact-python quick-python-card">
    <strong>Python version:</strong> quick_sort
    <pre><code class="language-python">def quick_sort(a):
    if len(a) &lt; 2:
        return a
    pivot = a[-1]
    less = []
    greater = []
    for x in a[:-1]:
        if x &lt; pivot:
            less.append(x)
        else:
            greater.append(x)
    return quick_sort(less) + [pivot] + quick_sort(greater)</code></pre>
  </div>`;
}

function quickFrame(page) {
  const stage = page < 61 ? 0 : page < 63 ? 1 : page < 65 ? 2 : page < 68 ? 3 : page < 70 ? 4 : page < 76 ? 5 : 6;
  const pivot = page >= 59 ? 7 : null;
  const topNote = page === 58 ? '<p class="red-note choose-pivot">choose a pivot</p>' : '';
  const isolatedPivot = page === 60 ? '<div class="quick-pivot-drop"><span class="single-pivot">6</span></div>' : '';
  const partitionLabels = stage >= 1 ? `<div class="quick-pivot-label-row">
      <span>${page >= 61 ? '&lt; pivot' : ''}</span>
      <span>${page >= 60 ? 'pivot' : ''}</span>
      <span>${page >= 62 ? '&gt; pivot' : ''}</span>
    </div>` : '';
  const parts = [
    topNote,
    `<div class="quick-top">${row(['5','2','4','8','1','3','7','6'], { pivot })}</div>`,
    isolatedPivot,
    partitionLabels,
    stage >= 1 ? `<div class="quick-row partition-row">${row(['5','2','4','1','3'])}<span class="single-pivot">6</span>${row(['8','7'])}</div>` : '',
    stage >= 2 ? `<div class="quick-arrows">${downArrow('Sort')}${page >= 64 ? downArrow('Sort') : ''}</div>` : '',
    stage >= 3 ? `<div class="quick-row">${row(['1','2','3','4','5'])}${row(['7','8'])}</div>` : '',
    page >= 66 ? `<div class="quick-row">${row(['1','2','3','4','5'])}<span class="single-pivot">6</span>${page >= 67 ? row(['1','2','3','4','5','6','7','8']) : ''}</div>` : '',
    stage >= 4 ? `<p class="red-note">${page >= 69 ? 'How to sort ?<br><b>Recursion</b>' : 'How to sort ?'}</p>` : '',
    stage >= 5 ? `<div class="quick-row recursion-row">${page >= 70 ? row(['2','1']) : ''}${page >= 70 ? '<span class="single-pivot">3</span>' : ''}${page >= 70 ? row(['5','4']) : ''}${page >= 71 ? row(['7']) : ''}${page >= 71 ? row(['8']) : ''}</div><div class="quick-row recursion-row">${page >= 72 ? row(['1','2']) : ''}${page >= 73 ? row(['4','5']) : ''}${page >= 74 ? row(['1','2','3','4','5']) : ''}${page >= 75 ? row(['1','2','3','4','5','6','7','8']) : ''}</div>` : '',
    stage >= 6 ? `<div class="quick-row">${row(['1','2','3','4','5'])}<span class="single-pivot">6</span>${row(['7','8'])}</div><div>${row(['1','2','3','4','5','6','7','8'], { sortedUntil: 7 })}</div>` : ''
  ].join('');
  const runtimeBlock = page >= 83 ? `
    <div class="quick-runtime-panel">
      <p class="red-note analysis-heading">Running time?</p>
      <p class="equation quick-recurrence">\\[T(n)=T(|A_{less}|)+T(|A_{greater}|)+\\Theta(n)\\]</p>
      ${page >= 83 ? `<p class="red-note quick-scenario">Scenario 1: \\(T(n)=T(n/2)+T(n/2)+\\Theta(n)\\)<br>\\(\\rightarrow T(n)=O(n\\log n)\\) (Best)</p>` : ''}
      ${page >= 84 ? `<p class="red-note quick-scenario">Scenario 2: \\(T(n)=T(0)+T(n-1)+\\Theta(n)\\)${page >= 85 ? '<br>\\(\\rightarrow T(n)=O(n^2)\\) (Worst)' : ''}</p>` : ''}
    </div>` : '';
  const codePanel = page >= 83 ? quickPythonPanel() : page >= 76 ? algoQuickForPage(page) : '';
  return makeSlide('Quick sort', `<div class="quick-object-layout compact-quick-layout quick-page-${page} ${page >= 76 ? 'analysis-quick' : ''}"><div class="quick-visual-column">${parts}</div>${codePanel}${runtimeBlock}</div>`, page);
}

const closestPoints = [
  [16, 18], [17, 30], [31, 22], [42, 43], [48, 36], [41, 68],
  [60, 18], [70, 32], [79, 12], [83, 54], [90, 62]
];

function closestGraph(page) {
  const pts = closestPoints.map(([x, y]) => `<span class="pt" style="--x:${x}%;--y:${y}%"></span>`).join('');
  const split = page >= 95 ? '<i class="split-line"></i>' : '';
  const left = page >= 97 ? '<i class="dl-line"></i><b class="dl-label">\\(d_l\\)</b>' : '';
  const right = page >= 99 ? '<i class="dr-line"></i><b class="dr-label">\\(d_r\\)</b>' : '';
  const strip = page >= 101 ? '<i class="band"></i><i class="strip-left"></i><i class="strip-right"></i><b class="strip-label strip-label-left">\\(d\\)</b><b class="strip-label strip-label-right">\\(d\\)</b>' : '';
  const grid = page >= 103 ? `
    <i class="grid-lines">
      <span class="grid-h grid-h1"></span>
      <span class="grid-h grid-h2"></span>
      <span class="grid-h grid-h3"></span>
      <span class="grid-h grid-h4"></span>
    </i>` : '';
  const dFormula = page >= 100 ? '<p class="equation closest-graph-equation">\\[d = \\min\\{d_l,d_r\\}\\]</p>' : '';
  return `<div class="closest-graph-stack"><div class="closest-graph exact">${pts}${strip}${split}${left}${right}${grid}</div>${dFormula}</div>`;
}

function closestFrame(page) {
  const intro = page === 92 || page === 93 ? '<p class="blue-note">Find a pair of points that the distance is smallest</p>' : '';
  const exhaustive = page === 93 ? '<p class="red-note">Exhaustive search: \\(\\Theta(n^2)\\)</p>' : '';
  const divide = page >= 94 && page < 96 ? '<p class="red-note">Divide points into two equal halves by x-coordinate</p>' : '';
  const left = page >= 96 && page < 98 ? '<p class="red-note">Find the closest pair of the left</p>' : '';
  const right = page >= 98 && page < 100 ? '<p class="red-note">Find the closest pair of the right</p>' : '';
  const packing = page >= 107 ? '<p class="blue-note">Each \\(d/2 \\times d/2\\) square has at most one point only</p>' : '';
  const eight = page >= 108 ? '<p class="red-note">For each node in the left strip, check at most 8 points in the right strip!</p>' : '';
  const closestLines = [
    'Input: A set of points P = {p1, p2, ..., pn}',
    'Sort all points by x-coordinate',
    'Divide P into P_left and P_right by x-coordinate',
    'Find \\(d_l\\), \\(d_r\\), set \\(d=\\min\\{d_l,d_r\\}\\)',
    'Build left and right strips',
    'Sort right-strip points by y-coordinate',
    'For each left-strip point, binary-search right-strip y-range \\([p_y-d,p_y+d]\\)',
    'Check candidates and return the closest pair and distance'
  ];
  const closestCount = page >= 110 ? Math.min(8, Math.max(1, page - 109)) : 0;
  const closestCodePanel = page >= 115
    ? closestPythonPanel()
    : page >= 110 ? `
    <div class="algo-box closest-code">
      <strong>Algorithm 3:</strong> Find the closest pair in 2D space
      <ol>${closestLines.slice(0, closestCount).map((line, index) => `<li class="${index === closestCount - 1 ? 'new-code-line' : ''}">${line}</li>`).join('')}</ol>
    </div>` : '';
  const pseudo = page >= 110 ? `
    ${closestCodePanel}` : '';
  const complexity = page >= 114 ? `
    <div class="closest-complexity-box">
      <p>Running time?</p>
      <p>\\(T(n)=2T(n/2)+\\Theta(n\\log n)\\)</p>
      ${page >= 115 ? '<p>\\(T(n)=O(n\\log n\\log n)\\)</p>' : ''}
    </div>` : '';
  return makeSlide('Closest pair', `<div class="closest-exact-layout ${page >= 110 ? 'closest-code-view' : ''}"><div class="closest-text-column">${intro}${exhaustive}${divide}${left}${right}${packing}${eight}${pseudo}${complexity}</div>${closestGraph(page)}</div>`, page);
}

function closestPythonPanel() {
  return `
  <div class="python-code-card compact-python closest-python-card">
    <strong>Python version:</strong> closest_pair
    <pre><code class="language-python">def closest_pair(points):
    points_x = sorted(points)
    points_y = sorted(points, key=lambda p: p[1])
    return closest_rec(points_x, points_y)

def closest_rec(px, py):
    if len(px) &lt;= 3:
        return brute_force(px)
    mid = len(px) // 2
    mid_x = px[mid][0]
    left_x, right_x = px[:mid], px[mid:]
    left_set = set(left_x)
    left_y = [p for p in py if p in left_set]
    right_y = [p for p in py if p not in left_set]
    pair_l, d_l = closest_rec(left_x, left_y)
    pair_r, d_r = closest_rec(right_x, right_y)
    best_pair, d = (pair_l, d_l) if d_l &lt;= d_r else (pair_r, d_r)
    strip = [p for p in py if abs(p[0] - mid_x) &lt; d]
    for i, p in enumerate(strip):
        for q in strip[i + 1:i + 8]:
            best_pair, d = update_best(best_pair, d, p, q)
    return best_pair, d</code></pre>
  </div>`;
}

function matrixMultiplyDiagram(page) {
  const showA = page >= 117;
  const showB = page >= 118;
  const showC = page >= 119;
  const showCDims = page >= 120;
  const showI = page >= 121;
  const showJ = page >= 122;
  const showEntry = page >= 123;
  return `
    <div class="matrix-visual exact-matrix">
      ${showA ? `<div class="mat-wrap mat-a">
        <span class="dim top">\\(k\\)</span><span class="dim left bottom-left">\\(n\\)</span>${showI ? '<span class="dim left top-left">\\(i\\)</span>' : ''}
        <div class="mat-rect tall">${showI ? '<i class="row-band"></i>' : ''}</div><strong>A</strong>
      </div>` : ''}
      ${showB ? '<div class="operator">\\(\\times\\)</div>' : ''}
      ${showB ? `<div class="mat-wrap mat-b">
        <span class="dim top right-top">\\(m\\)</span><span class="dim left mid-left">\\(k\\)</span>${showJ ? '<span class="dim top col-j">\\(j\\)</span>' : ''}
        <div class="mat-rect wide">${showJ ? '<i class="col-band"></i>' : ''}</div><strong>B</strong>
      </div>` : ''}
      ${showC ? '<div class="operator">=</div>' : ''}
      ${showC ? `<div class="mat-wrap mat-c">
        ${showCDims ? '<span class="dim top right-top">\\(m\\)</span><span class="dim left bottom-left">\\(n\\)</span>' : ''}
        <div class="mat-rect square">${showEntry ? '<i class="entry-cell"></i><em>\\((i,j)\\)</em>' : ''}</div><strong>C</strong>
      </div>` : ''}
    </div>`;
}

const blockSetup = `
  <p class="equation block-setup">\\[
    A=\\begin{bmatrix}A_{11}&A_{12}\\\\A_{21}&A_{22}\\end{bmatrix},
    \\qquad
    B=\\begin{bmatrix}B_{11}&B_{12}\\\\B_{21}&B_{22}\\end{bmatrix}
  \\]</p>`;

const naiveBlock = `
  <div class="matrix-algo-block naiveBlock">
    <p>Naive algorithm</p>
    <p class="equation">\\[
      C=AB=
      \\begin{bmatrix}
        A_{11}B_{11}+A_{12}B_{21} & A_{11}B_{12}+A_{12}B_{22}\\\\
        A_{21}B_{11}+A_{22}B_{21} & A_{21}B_{12}+A_{22}B_{22}
      \\end{bmatrix}
    \\]</p>
  </div>`;

const strassenProducts = (page) => `
  <div class="matrix-algo-block strassen-list">
    <p class="strassen-title">Strassen algorithm</p>
    <p>\\(M_1=(A_{11}+A_{22})(B_{11}+B_{22})\\)</p>
    <p>\\(M_2=(A_{21}+A_{22})B_{11}\\)</p>
    <p>\\(M_3=A_{11}(B_{12}-B_{22})\\)</p>
    <p>\\(M_4=A_{22}(B_{21}-B_{11})\\)</p>
    <p>\\(M_5=(A_{11}+A_{12})B_{22}\\)</p>
    <p>\\(M_6=(A_{21}-A_{11})(B_{11}+B_{12})\\)</p>
    <p>\\(M_7=(A_{12}-A_{22})(B_{21}+B_{22})\\)</p>
  </div>`;

const strassenCombine = `
  <p class="equation strassen-combine">\\[
    C=AB=
    \\begin{bmatrix}
      M_1+M_4-M_5+M_7 & M_3+M_5\\\\
      M_2+M_4 & M_1-M_2+M_3+M_6
    \\end{bmatrix}
  \\]</p>`;

const matrixGhost = (content, show, className = '') => `<div class="${className} ${show ? '' : 'matrix-ghost'}">${content}</div>`;

function matrixAlgorithmSequence(page) {
  const naiveTime = `
    <div class="naive-time-row">
      <p class="red-note matrix-recurrence naive-time ${page >= 130 ? '' : 'matrix-ghost'}">\\[T(n)=8T(n/2)+\\Theta(n^2)\\]</p>
      <p class="red-note matrix-recurrence naive-time naive-result ${page >= 131 ? '' : 'matrix-ghost'}">\\[\\rightarrow T(n)=O(n^3)\\]</p>
    </div>`;
  const strassenTime = `
    <div class="strassen-time-block ${page >= 135 ? '' : 'matrix-ghost'}">
      <p class="red-note matrix-recurrence strassen-time">\\[T(n)=7T(n/2)+\\Theta(n^2)\\]</p>
      <p class="red-note matrix-recurrence strassen-time strassen-result">\\[\\rightarrow T(n)=O(n^{\\log_2 7})\\approx O(n^{2.81})\\]</p>
    </div>`;

  return `
    <div class="matrix-algorithm-layout matrix-running-view matrix-fixed-view">
      ${matrixGhost(blockSetup, page >= 127, 'matrix-intro-slot')}
      <div class="naive-top-row">
        ${matrixGhost(naiveBlock, page >= 128, 'matrix-naive-slot')}
        ${naiveTime}
      </div>
      ${matrixGhost(strassenProducts(page), page >= 132, 'matrix-strassen-slot')}
      <div class="strassen-bottom-row">
        ${matrixGhost(strassenCombine, page >= 134, 'matrix-combine-slot')}
        ${strassenTime}
      </div>
    </div>`;
}

function matrixFrame(page) {
  if (page <= 125) {
    const formula = page >= 124 ? '<p class="equation matrix-entry">\\[C_{i,j}=\\sum_{p=1}^{k} A_{i,p}B_{p,j}\\]</p>' : '';
    const total = page >= 125 ? '<p class="blue-note matrix-total">Total time complexity: \\(\\Theta(mnk)\\)</p>' : '';
    return makeSlide('Matrix multiplication', `${matrixMultiplyDiagram(page)}${formula}${total}`, page);
  }

  if (page >= 127 && page <= 135) {
    return makeSlide('Matrix multiplication algorithms', matrixAlgorithmSequence(page), page);
  }

  const intro = page >= 127 ? blockSetup : '<div class="matrix-algo-opener"><div class="mini-block-matrix"><span></span><span></span><span></span><span></span></div><strong>Block decomposition</strong><div class="mini-block-matrix"><span></span><span></span><span></span><span></span></div></div>';
  const naive = page >= 128 ? naiveBlock : '';
  const runningNaive = page >= 129 && page <= 131 ? '<p class="red-note matrix-running">Running time?</p>' : '';
  const naiveRecurrence = page === 135
    ? `<div class="naive-time-row">
        <p class="red-note matrix-recurrence naive-time">\\[T(n)=8T(n/2)+\\Theta(n^2)\\]</p>
        <p class="red-note matrix-recurrence naive-time naive-result">\\[\\rightarrow T(n)=O(n^3)\\]</p>
      </div>`
    : page >= 130 ? `<div class="matrix-time-pair">
        <p class="red-note matrix-recurrence">\\[T(n)=8T(n/2)+\\Theta(n^2)\\]</p>
        ${page >= 131 ? '<p class="red-note matrix-recurrence matrix-result">\\[\\rightarrow T(n)=O(n^3)\\]</p>' : '<span></span>'}
      </div>` : '';
  const naiveResult = '';
  const strassen = page >= 132 ? strassenProducts(page) : '';
  const strassenTime = page === 135 ? `
    <div class="strassen-time-block">
      <p class="red-note matrix-recurrence strassen-time">\\[T(n)=7T(n/2)+\\Theta(n^2)\\]</p>
      <p class="red-note matrix-recurrence strassen-time strassen-result">\\[\\rightarrow T(n)=O(n^{\\log_2 7})\\approx O(n^{2.81})\\]</p>
    </div>` : '';
  const combine = page === 135
    ? `<div class="strassen-bottom-row">${strassenCombine}${strassenTime}</div>`
    : page >= 134 ? strassenCombine : '';
  const runningStrassen = '';
  const strassenRecurrence = '';
  const strassenResult = '';
  return makeSlide('Matrix multiplication algorithms', `
    <div class="matrix-algorithm-layout ${page === 135 ? 'matrix-running-view' : ''} ${page >= 136 ? 'matrix-final-view' : ''}">
      ${intro}
      ${page === 135 ? `<div class="naive-top-row">${naive}${naiveRecurrence}</div>` : `${naive}${runningNaive}${naiveRecurrence}${naiveResult}`}
      ${strassen}
      ${combine}
      ${runningStrassen}${strassenRecurrence}${strassenResult}
    </div>`, page);
}

function buildObjectDecks() {
  const builders = {
    selection: () => Array.from({ length: 27 }, (_, i) => selectionFrame(i + 3)),
    merge: () => Array.from({ length: 27 }, (_, i) => mergeFrame(i + 30)),
    quick: () => Array.from({ length: 29 }, (_, i) => quickFrame(i + 57)),
    'sorting-table': () => Array.from({ length: 4 }, (_, i) => sortingTableFrame(i + 86)),
    closest: () => Array.from({ length: 26 }, (_, i) => closestFrame(i + 90)),
    matrix: () => Array.from({ length: 20 }, (_, i) => matrixFrame(i + 116))
  };

  document.querySelectorAll('[data-object-deck]').forEach((deck) => {
    const slides = builders[deck.dataset.objectDeck]?.() || [];
    deck.innerHTML = '';
    slides.forEach((slide) => deck.append(slide));
  });
}

buildObjectDecks();

const deck = new Reveal({
  hash: true,
  controls: true,
  progress: true,
  slideNumber: 'c/t',
  center: true,
  transition: 'fade',
  backgroundTransition: 'fade',
  katex: {
    version: '0.16.11'
  },
  plugins: [RevealHighlight, RevealMath.KaTeX, RevealNotes]
});

deck.initialize();

const staticPdfPage = document.createElement('span');
staticPdfPage.className = 'static-pdf-page';
document.body.append(staticPdfPage);

function updateStaticPdfPage() {
  const currentSlide = deck.getCurrentSlide();
  const pageNumber = currentSlide?.querySelector('.pdf-page')?.textContent?.trim() || '';
  staticPdfPage.textContent = pageNumber;
}

function replaySelectionSwap() {
  const currentSlide = deck.getCurrentSlide();
  const animated = currentSlide?.querySelectorAll('.swap-cell, .swap-curve, .animated-swap-mark span') || [];
  animated.forEach((element) => {
    element.style.animation = 'none';
    void element.offsetWidth;
    element.style.animation = '';
  });
}

deck.on('ready', updateStaticPdfPage);
deck.on('ready', replaySelectionSwap);
deck.on('slidechanged', () => {
  updateStaticPdfPage();
  replaySelectionSwap();
});
deck.on('fragmentshown', updateStaticPdfPage);
deck.on('fragmenthidden', updateStaticPdfPage);
updateStaticPdfPage();
replaySelectionSwap();
