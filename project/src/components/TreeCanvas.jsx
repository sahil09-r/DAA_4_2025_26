import { useEffect, useRef } from 'react';

/**
 * TreeCanvas — renders the Huffman Binary Tree on an HTML5 Canvas.
 * Uses recursive DFS to position nodes by depth and horizontal spread.
 */
export default function TreeCanvas({ root }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!root || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const W = canvas.offsetWidth;
    const H = 420;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);

    function treeDepth(n) {
      if (!n) return 0;
      return 1 + Math.max(treeDepth(n.left), treeDepth(n.right));
    }

    const depth = treeDepth(root);
    const R = Math.max(12, Math.min(20, W / (Math.pow(2, depth) * 2.5)));
    const LEVEL_H = Math.min(65, (H - 40) / depth);

    function drawNode(node, x, y, spread) {
      if (!node) return;

      // Draw edges first
      if (node.left) {
        ctx.beginPath();
        ctx.strokeStyle = '#1e2a45';
        ctx.lineWidth = 1.5;
        ctx.moveTo(x, y);
        ctx.lineTo(x - spread, y + LEVEL_H);
        ctx.stroke();
        // Label '0'
        ctx.fillStyle = '#00d4aa';
        ctx.font = '9px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('0', x - spread / 2 - 5, y + LEVEL_H / 2 - 2);
      }

      if (node.right) {
        ctx.beginPath();
        ctx.strokeStyle = '#1e2a45';
        ctx.lineWidth = 1.5;
        ctx.moveTo(x, y);
        ctx.lineTo(x + spread, y + LEVEL_H);
        ctx.stroke();
        // Label '1'
        ctx.fillStyle = '#7c6aff';
        ctx.font = '9px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('1', x + spread / 2 + 5, y + LEVEL_H / 2 - 2);
      }

      // Draw node circle
      ctx.beginPath();
      ctx.arc(x, y, R, 0, Math.PI * 2);

      if (node.char !== null) {
        // Leaf node — teal
        ctx.fillStyle = '#0d2a1f';
        ctx.fill();
        ctx.strokeStyle = '#00d4aa';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        // Internal node — blue
        ctx.fillStyle = '#0d1a2a';
        ctx.fill();
        ctx.strokeStyle = '#0066bb';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw text
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (node.char !== null) {
        const label =
          node.char === ' ' ? '·'
          : node.char === '\n' ? '↵'
          : node.char === '\t' ? '→'
          : node.char;
        ctx.font = `${R < 15 ? 9 : 10}px Courier New`;
        ctx.fillStyle = '#00d4aa';
        ctx.fillText(label, x, y - 3);
        ctx.font = '8px Courier New';
        ctx.fillStyle = '#00a07a';
        ctx.fillText(node.freq, x, y + 5);
      } else {
        ctx.font = `${R < 15 ? 9 : 10}px Courier New`;
        ctx.fillStyle = '#4a7ab5';
        ctx.fillText(node.freq, x, y);
      }

      // Recurse
      drawNode(node.left, x - spread, y + LEVEL_H, spread * 0.52);
      drawNode(node.right, x + spread, y + LEVEL_H, spread * 0.52);
    }

    drawNode(root, W / 2, 28, W / 4);
  }, [root]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', display: 'block', borderRadius: '8px' }}
    />
  );
}
