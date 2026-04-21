import { MinHeap } from './MinHeap.js';
import { HuffmanNode } from './HuffmanNode.js';

/**
 * Step 1: Build a frequency table (HashMap) from the input text.
 * @param {string} text
 * @returns {Object} e.g. { 'a': 5, 'b': 2, ... }
 */
export function buildFrequencyMap(text) {
  const freq = {};
  for (const char of text) {
    freq[char] = (freq[char] || 0) + 1;
  }
  return freq;
}

/**
 * Step 2: Build the Huffman Binary Tree using a Min Heap.
 * - Insert all characters as leaf nodes into the heap.
 * - Repeatedly extract two lowest-freq nodes, merge them, re-insert.
 * - Final remaining node is the root.
 * @param {Object} freqMap
 * @returns {HuffmanNode} root of the tree
 */
export function buildHuffmanTree(freqMap) {
  const heap = new MinHeap();

  for (const [char, freq] of Object.entries(freqMap)) {
    heap.push(new HuffmanNode(char, freq));
  }

  // Edge case: only one unique character
  if (heap.size() === 1) {
    const only = heap.pop();
    return new HuffmanNode(null, only.freq, only, null);
  }

  while (heap.size() > 1) {
    const left = heap.pop();  // lowest freq
    const right = heap.pop(); // second lowest
    const merged = new HuffmanNode(null, left.freq + right.freq, left, right);
    heap.push(merged);
  }

  return heap.pop();
}

/**
 * Step 3: Generate Huffman codes by traversing the tree.
 * Left = '0', Right = '1'.
 * Stored in a HashMap for O(1) lookup during encoding.
 * @param {HuffmanNode} root
 * @returns {Object} e.g. { 'a': '01', 'b': '1', ... }
 */
export function generateCodes(root) {
  const codes = {};

  function dfs(node, code) {
    if (!node) return;
    if (node.isLeaf()) {
      codes[node.char] = code || '0'; // '0' handles single-char edge case
      return;
    }
    dfs(node.left, code + '0');
    dfs(node.right, code + '1');
  }

  dfs(root, '');
  return codes;
}

/**
 * Step 4: Encode the text using the HashMap of codes.
 * @param {string} text
 * @param {Object} codes
 * @returns {string} binary string e.g. "010110100..."
 */
export function encode(text, codes) {
  return text.split('').map(c => codes[c]).join('');
}

/**
 * Step 5: Decode a binary string using the Huffman tree.
 * Traverse tree per bit; emit char at each leaf node.
 * @param {string} bits
 * @param {HuffmanNode} root
 * @returns {string} decoded text
 */
export function decode(bits, root) {
  if (!root) return '';
  let result = '';
  let current = root;

  for (const bit of bits) {
    current = bit === '0' ? current.left : current.right;
    if (!current) break;
    if (current.isLeaf()) {
      result += current.char;
      current = root;
    }
  }

  return result;
}

/**
 * Full compression pipeline.
 * @param {string} text
 * @returns {{ bits, codes, freqMap, root, stats }}
 */
export function compress(text) {
  if (!text || text.length === 0) throw new Error('Input text is empty.');

  const freqMap = buildFrequencyMap(text);
  const root = buildHuffmanTree(freqMap);
  const codes = generateCodes(root);
  const bits = encode(text, codes);

  const originalBits = text.length * 8;
  const compressedBits = bits.length;
  const ratio = ((compressedBits / originalBits) * 100).toFixed(2);
  const saved = (100 - parseFloat(ratio)).toFixed(2);

  return {
    bits,
    codes,
    freqMap,
    root,
    stats: {
      originalBits,
      compressedBits,
      ratio: parseFloat(ratio),
      saved: parseFloat(saved),
      uniqueChars: Object.keys(freqMap).length,
      textLength: text.length,
    },
  };
}

/**
 * Full decompression pipeline.
 * Rebuilds the tree from codes, then decodes the bitstring.
 * @param {string} bits
 * @param {Object} codes - the original codes map
 * @returns {string} original text
 */
export function decompress(bits, codes) {
  // Rebuild frequency map (approximate, just for tree shape) using code lengths
  // We reconstruct the tree from the reverse map instead (simpler & lossless)
  const reverseMap = {};
  for (const [char, code] of Object.entries(codes)) {
    reverseMap[code] = char;
  }

  let decoded = '';
  let buffer = '';

  for (const bit of bits) {
    buffer += bit;
    if (reverseMap[buffer] !== undefined) {
      decoded += reverseMap[buffer];
      buffer = '';
    }
  }

  if (buffer.length > 0) {
    throw new Error('Decoding error: leftover bits. File may be corrupted.');
  }

  return decoded;
}

/**
 * Serialize compressed data to a storable JSON string.
 */
export function serialize(bits, codes, originalLength) {
  return JSON.stringify({ version: 1, bits, codes, originalLength });
}

/**
 * Deserialize a .huff file back into { bits, codes, originalLength }.
 */
export function deserialize(jsonString) {
  const data = JSON.parse(jsonString);
  if (!data.bits || !data.codes) throw new Error('Invalid .huff file format.');
  return data;
}
