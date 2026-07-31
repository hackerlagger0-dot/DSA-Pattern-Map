import React from 'react';
import {
  Background,
  Controls,
  Edge,
  Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { GitFork, HelpCircle, Info, Sparkles } from 'lucide-react';
import { Pattern } from '../../types';

interface DecisionTreeViewProps {
  patterns: Pattern[];
  onSelectPattern: (pattern: Pattern) => void;
}

const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 400, y: 0 },
    data: { label: 'Start: What is the problem asking for?' },
    style: {
      background: '#1e1b4b',
      color: '#c7d2fe',
      border: '2px solid #6366f1',
      borderRadius: '12px',
      padding: '12px',
      fontWeight: 'bold',
      fontSize: '13px',
    },
  },
  // Level 1: Input Categories
  {
    id: '2',
    position: { x: 50, y: 120 },
    data: { label: 'Contiguous Subarray / Substring?' },
    style: {
      background: '#0f172a',
      color: '#f8fafc',
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '12px',
    },
  },
  {
    id: '3',
    position: { x: 300, y: 120 },
    data: { label: 'Sorted Array / Pair Search?' },
    style: {
      background: '#0f172a',
      color: '#f8fafc',
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '12px',
    },
  },
  {
    id: '4',
    position: { x: 550, y: 120 },
    data: { label: 'Tree / Graph / Hierarchy?' },
    style: {
      background: '#0f172a',
      color: '#f8fafc',
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '12px',
    },
  },
  {
    id: '5',
    position: { x: 800, y: 120 },
    data: { label: 'Extreme Values / Top K / Order?' },
    style: {
      background: '#0f172a',
      color: '#f8fafc',
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '12px',
    },
  },

  // Level 2: Decision Outcomes -> Pattern Nodes
  {
    id: 'pat-1',
    position: { x: 30, y: 260 },
    data: { label: '✨ Sliding Window Pattern' },
    style: {
      background: '#064e3b',
      color: '#a7f3d0',
      border: '2px solid #10b981',
      borderRadius: '10px',
      padding: '10px',
      fontWeight: 'bold',
      fontSize: '12px',
      cursor: 'pointer',
    },
  },
  {
    id: 'pat-15',
    position: { x: 170, y: 260 },
    data: { label: '✨ Prefix Sum Pattern' },
    style: {
      background: '#064e3b',
      color: '#a7f3d0',
      border: '2px solid #10b981',
      borderRadius: '10px',
      padding: '10px',
      fontWeight: 'bold',
      fontSize: '12px',
      cursor: 'pointer',
    },
  },
  {
    id: 'pat-2',
    position: { x: 300, y: 260 },
    data: { label: '✨ Two Pointers Pattern' },
    style: {
      background: '#064e3b',
      color: '#a7f3d0',
      border: '2px solid #10b981',
      borderRadius: '10px',
      padding: '10px',
      fontWeight: 'bold',
      fontSize: '12px',
      cursor: 'pointer',
    },
  },
  {
    id: 'pat-6',
    position: { x: 460, y: 260 },
    data: { label: '✨ Tree BFS Pattern' },
    style: {
      background: '#064e3b',
      color: '#a7f3d0',
      border: '2px solid #10b981',
      borderRadius: '10px',
      padding: '10px',
      fontWeight: 'bold',
      fontSize: '12px',
      cursor: 'pointer',
    },
  },
  {
    id: 'pat-7',
    position: { x: 590, y: 260 },
    data: { label: '✨ Tree DFS Pattern' },
    style: {
      background: '#064e3b',
      color: '#a7f3d0',
      border: '2px solid #10b981',
      borderRadius: '10px',
      padding: '10px',
      fontWeight: 'bold',
      fontSize: '12px',
      cursor: 'pointer',
    },
  },
  {
    id: 'pat-10',
    position: { x: 740, y: 260 },
    data: { label: '✨ Top K Elements (Heap)' },
    style: {
      background: '#064e3b',
      color: '#a7f3d0',
      border: '2px solid #10b981',
      borderRadius: '10px',
      padding: '10px',
      fontWeight: 'bold',
      fontSize: '12px',
      cursor: 'pointer',
    },
  },
  {
    id: 'pat-11',
    position: { x: 890, y: 260 },
    data: { label: '✨ Monotonic Stack' },
    style: {
      background: '#064e3b',
      color: '#a7f3d0',
      border: '2px solid #10b981',
      borderRadius: '10px',
      padding: '10px',
      fontWeight: 'bold',
      fontSize: '12px',
      cursor: 'pointer',
    },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
  { id: 'e1-4', source: '1', target: '4', animated: true },
  { id: 'e1-5', source: '1', target: '5', animated: true },

  { id: 'e2-p1', source: '2', target: 'pat-1', label: 'Continuous Window' },
  { id: 'e2-p15', source: '2', target: 'pat-15', label: 'Range Subsum' },
  { id: 'e3-p2', source: '3', target: 'pat-2', label: 'Opposite Ends' },
  { id: 'e4-p6', source: '4', target: 'pat-6', label: 'Level Order' },
  { id: 'e4-p7', source: '4', target: 'pat-7', label: 'Path Recursion' },
  { id: 'e5-p10', source: '5', target: 'pat-10', label: 'Kth Largest' },
  { id: 'e5-p11', source: '5', target: 'pat-11', label: 'Next Greater' },
];

export const DecisionTreeView: React.FC<DecisionTreeViewProps> = ({
  patterns,
  onSelectPattern,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    if (node.id.startsWith('pat-')) {
      const match = patterns.find((p) => p.id === node.id);
      if (match) {
        onSelectPattern(match);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GitFork className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Pattern Decision Flowchart</h2>
          </div>
          <p className="text-xs text-slate-400">
            Follow the clues to find the right pattern! Click any green pattern box to learn how to use it.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-300 text-xs font-medium">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Easy Map (Drag & Zoom)</span>
        </div>
      </div>

      {/* React Flow Container */}
      <div className="w-full h-[520px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-inner relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          fitView
        >
          <Background color="#334155" gap={20} size={1} />
          <Controls className="bg-slate-900 border-slate-800 text-slate-100 fill-slate-100" />
        </ReactFlow>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 backdrop-blur p-3 rounded-xl text-xs space-y-1.5 text-slate-300 shadow-lg">
          <div className="flex items-center gap-2 font-bold text-slate-200">
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            <span>Map Legend</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-indigo-900 border border-indigo-500" />
            <span>Decision Trait</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-emerald-900 border border-emerald-500" />
            <span>Clickable Pattern (Opens Modal)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
