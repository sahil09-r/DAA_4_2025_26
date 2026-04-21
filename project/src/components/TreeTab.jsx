import TreeCanvas from './TreeCanvas.jsx';

const DS_INFO = [
  {
    name: 'Min Heap / Priority Queue',
    color: '#00d4aa',
    desc: 'Nodes sorted by frequency. Always extracts the two lowest-frequency nodes to merge. push O(log n), pop O(log n).',
    file: 'src/utils/MinHeap.js',
  },
  {
    name: 'Binary Tree',
    color: '#0099ff',
    desc: 'Left edge = 0, Right edge = 1. Leaf nodes hold actual characters. Path from root to leaf = the Huffman code for that char.',
    file: 'src/utils/HuffmanNode.js',
  },
  {
    name: 'HashMap / Dictionary',
    color: '#a78bfa',
    desc: 'Maps each character to its binary code. Built in O(n) tree traversal. O(1) lookup during encoding.',
    file: 'src/utils/huffman.js → generateCodes()',
  },
  {
    name: 'Frequency Table',
    color: '#fbbf24',
    desc: 'First single O(n) pass over the input. Counts character occurrences. Seeds the priority queue.',
    file: 'src/utils/huffman.js → buildFrequencyMap()',
  },
];

const ALGO_STEPS = [
  'Count character frequencies → buildFrequencyMap()',
  'Insert all chars as leaf HuffmanNodes into MinHeap',
  'While heap.size() > 1: pop two lowest, merge, push parent',
  'Rebuild the tree — single remaining node is root',
  'DFS the tree: left=0, right=1 → generateCodes() fills HashMap',
  'Encode: replace every char with its code from HashMap → encode()',
  'Decode: traverse tree bit-by-bit, emit char at each leaf → decode()',
];

export default function TreeTab({ compressResult }) {
  if (!compressResult) {
    return (
      <div className="alert alert-info">
        Compress some text first (on the Compress tab) to see the Huffman tree here.
      </div>
    );
  }

  const { root, codes, freqMap, stats } = compressResult;

  return (
    <div>
      {/* Tree canvas */}
      <div className="card">
        <div className="card-title">Huffman binary tree — leaf nodes = characters, edges = bits</div>
        <TreeCanvas root={root} />
        <p style={{ fontSize: '0.72rem', color: '#444', marginTop: '0.5rem' }}>
          <span style={{ color: '#00d4aa' }}>■</span> Leaf node (character)&nbsp;&nbsp;
          <span style={{ color: '#0066bb' }}>■</span> Internal node (merged)&nbsp;&nbsp;
          <span style={{ color: '#00d4aa' }}>0</span> Left edge&nbsp;&nbsp;
          <span style={{ color: '#7c6aff' }}>1</span> Right edge
        </p>
      </div>

      {/* Top 5 codes */}
      <div className="card">
        <div className="card-title">Most frequent characters — shortest codes</div>
        <div className="table-scroll">
          <table className="code-table">
            <thead>
              <tr><th>Char</th><th>Frequency</th><th>Code</th><th>Bits</th></tr>
            </thead>
            <tbody>
              {Object.entries(codes)
                .sort((a, b) => (freqMap[b[0]] || 0) - (freqMap[a[0]] || 0))
                .slice(0, 8)
                .map(([char, code]) => (
                  <tr key={char}>
                    <td>{char === ' ' ? <span className="dim">SPACE</span> : char === '\n' ? <span className="dim">\n</span> : char}</td>
                    <td>{freqMap[char]}</td>
                    <td className="code-cell">{code}</td>
                    <td>{code.length}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Structures */}
      <div className="card">
        <div className="card-title">Data structures used</div>
        <div className="ds-grid">
          {DS_INFO.map(ds => (
            <div className="ds-box" key={ds.name}>
              <div className="ds-name" style={{ color: ds.color }}>{ds.name}</div>
              <div className="ds-desc">{ds.desc}</div>
              <div className="ds-file">{ds.file}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Algorithm steps */}
      <div className="card">
        <div className="card-title">Algorithm steps (this run)</div>
        <ol className="algo-steps">
          {ALGO_STEPS.map((step, i) => (
            <li key={i}>
              <span className="step-num">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <div className="stats-grid" style={{ marginTop: '1rem' }}>
          <div className="stat-box">
            <div className="stat-label">Unique chars</div>
            <div className="stat-value green">{stats.uniqueChars}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Tree nodes</div>
            <div className="stat-value blue">{stats.uniqueChars * 2 - 1}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Space saved</div>
            <div className="stat-value amber">{stats.saved}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
