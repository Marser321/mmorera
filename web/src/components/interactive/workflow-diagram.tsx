"use client";

import React, { useCallback } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
    { id: '1', position: { x: 50, y: 50 }, data: { label: 'Lead Capturado (Web/Ads)' }, type: 'input' },
    { id: '2', position: { x: 50, y: 150 }, data: { label: 'Clasificación IA (Fit / No Fit)' } },
    { id: '3', position: { x: 50, y: 250 }, data: { label: 'Enrutamiento a CRM' } },
    { id: '4', position: { x: 250, y: 150 }, data: { label: 'Discard / Nurturing' } },
    { id: '5', position: { x: 50, y: 350 }, data: { label: 'Notificación Slack/WhatsApp' }, type: 'output' },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3', animated: true, label: 'Alto Fit' },
    { id: 'e2-4', source: '2', target: '4', animated: true, label: 'Bajo Fit' },
    { id: 'e3-5', source: '3', target: '5', animated: true },
];

export function WorkflowDiagram() {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    return (
        <div style={{ width: '100%', height: '500px' }} className="rounded-xl overflow-hidden border border-border">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                colorMode="dark"
            >
                <Controls />
                <MiniMap nodeStrokeColor={() => '#3b82f6'} nodeColor={() => '#1e293b'} maskColor="rgba(0,0,0,0.5)" />
                <Background gap={12} size={1} />
            </ReactFlow>
        </div>
    );
}
