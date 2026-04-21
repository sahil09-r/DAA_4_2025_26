import { useState, useRef } from 'react';
import { compress, serialize } from '../utils/huffman.js';

export default function CompressTab({ onResult }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const SAMPLE =
    'Huffman coding is a lossless data compression algorithm. ' +
    'Characters that appear more frequently get shorter binary codes, ' +
    'and rarer characters get longer codes. This results in efficient compression. ' +
    'Data Structures used: Min Heap, Binary Tree, HashMap, Priority Queue.';

  function handleCompress() {
    setError('');
    try {
      const r = compress(text);
      setResult(r);
      onResult(r);
    } catch (e) {
      setError(e.message);
    }
  }

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setText(ev.target.result);
    reader.readAsText(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setText(ev.target.result);
    reader.readAsText(file);
  }

  function downloadHuff() {
    if (!result) return;
    const json = serialize(result.bits, result.codes, result.stats.textLength);
    const blob = new Blob([json], { type: 'application/octet-stream' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'compressed.huff';
    a.click();
  }

  const sorted = result
    ? Object.entries(result.codes).sort(
        (a, b) => (result.freqMap[b[0]] || 0) - (result.freqMap[a[0]] || 0)
      )
    : [];

  return (
    <div>
      {/* Drop Zone */}
      <div
        className="drop-zone"
        onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}
        onDragLeave={e => e.currentTarget.classList.remove('drag-over')}
        onDrop={e => { e.currentTarget.classList.remove('drag-over'); handleDrop(e); }}
        onClick={() => fileRef.current.click()}
      >
        <div className="drop-icon">📄</div>
        <p>Drop a <span className="accent">.txt file</span> or <span className="accent">click to browse</span></p>
        <input type="file" accept=".txt" ref={fileRef} onChange={handleFile} style={{ display: 'none' }} />
      </div>

      <textarea
        className="text-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={'Type or paste text here...\n\nTip: use Load Sample to see it in action.'}
        rows={6}
      />

      {error && <div className="alert alert-error">{error}</div>}

      <div className="btn-row">
        <button className="btn btn-primary" onClick={handleCompress} disabled={!text.trim()}>
          Compress →
        </button>
        <button className="btn btn-secondary" onClick={() => setText(SAMPLE)}>
          Load sample
        </button>
        <button className="btn btn-danger" onClick={() => { setText(''); setResult(null); onResult(null); }}>
          Clear
        </button>
      </div>

      {result && (
        <>
          {/* Stats */}
          <div className="stats-grid">
            {[
              { label: 'Original', value: result.stats.originalBits + ' bits', cls: 'blue' },
              { label: 'Compressed', value: result.stats.compressedBits + ' bits', cls: 'green' },
              { label: 'Ratio', value: result.stats.ratio + '%', cls: 'amber' },
              { label: 'Space saved', value: result.stats.saved + '%', cls: 'purple' },
              { label: 'Unique chars', value: result.stats.uniqueChars, cls: 'blue' },
              { label: 'Input length', value: result.stats.textLength + ' chars', cls: 'green' },
            ].map(s => (
              <div className="stat-box" key={s.label}>
                <div className="stat-label">{s.label}</div>
                <div className={`stat-value ${s.cls}`}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: result.stats.ratio + '%' }} />
          </div>
          <p style={{ fontSize: '0.72rem', color: '#555', marginBottom: '1rem' }}>
            Compressed size relative to original
          </p>

          {/* Bit preview */}
          <div className="card">
            <div className="card-title">Encoded bitstream preview</div>
            <div className="bit-preview">
              {result.bits.slice(0, 400).split('').map((b, i) => (
                <span key={i} className={b === '1' ? 'bit-1' : 'bit-0'}>{b}</span>
              ))}
              {result.bits.length > 400 && (
                <span style={{ color: '#333' }}> …+{result.bits.length - 400} more bits</span>
              )}
            </div>
          </div>

          {/* Code table */}
          <div className="card">
            <div className="card-title">Huffman code table — HashMap</div>
            <div className="table-scroll">
              <table className="code-table">
                <thead>
                  <tr>
                    <th>Char</th>
                    <th>Frequency</th>
                    <th>Code</th>
                    <th>Code length</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map(([char, code]) => (
                    <tr key={char}>
                      <td>
                        {char === ' ' ? <span className="dim">SPACE</span>
                         : char === '\n' ? <span className="dim">\n</span>
                         : char === '\t' ? <span className="dim">\t</span>
                         : char}
                      </td>
                      <td>{result.freqMap[char]}</td>
                      <td className="code-cell">{code}</td>
                      <td>{code.length} bit{code.length !== 1 ? 's' : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Download */}
          <div className="card">
            <div className="card-title">Save compressed file</div>
            <div className="btn-row">
              <button className="btn btn-primary" onClick={downloadHuff}>
                ⬇ Download compressed.huff
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigator.clipboard.writeText(JSON.stringify(result.codes, null, 2))}
              >
                Copy codes JSON
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
