/**
 * HuffmanNode — a node in the Huffman Binary Tree.
 * Leaf nodes store an actual character.
 * Internal nodes store null for char; they are merge-result nodes.
 */
export class HuffmanNode {
  constructor(char, freq, left = null, right = null) {
    this.char = char;   // null for internal nodes
    this.freq = freq;   // frequency count
    this.left = left;   // left child (bit: 0)
    this.right = right; // right child (bit: 1)
  }

  isLeaf() {
    return this.left === null && this.right === null;
  }
}
