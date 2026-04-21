import { useState } from 'react';
import CompressTab from './components/CompressTab.jsx';
import DecompressTab from './components/DecompressTab.jsx';
import TreeTab from './components/TreeTab.jsx';
import './styles.css';

const TABS = [
  { id: 'compress', label: '⬇ Compress' },
  { id: 'decompress', label: '⬆ Decompress' },
  { id: 'tree', label: '⬡ Tree View' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('compress');
  const [compressResult, setCompressResult] = useState(null);

  return (
    <div className="app">
      <header className="header">
        <h1>Huffman Compressor</h1>
        <p>Min Heap · Binary Tree · HashMap · Priority Queue</p>
      </header>

      <div className="tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'compress' && (
          <CompressTab onResult={setCompressResult} />
        )}
        {activeTab === 'decompress' && (
          <DecompressTab lastCompressed={compressResult} />
        )}
        {activeTab === 'tree' && (
          <TreeTab compressResult={compressResult} />
        )}
      </div>
    </div>
  );
}
