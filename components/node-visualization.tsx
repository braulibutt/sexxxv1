"use client"

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { FileText, Shield, Briefcase, FileCheck, User, Mail, Calendar } from 'lucide-react'
// Import ForceGraph via dynamic import to avoid SSR issues
import dynamic from 'next/dynamic'
import * as d3 from 'd3-force'

// Dynamically import ForceGraph2D with explicit no-ssr
const ForceGraph2D = dynamic(() => 
  import('react-force-graph').then(mod => mod.ForceGraph2D), 
  { ssr: false, loading: () => (
    <div className="w-full h-[450px] bg-[#f8faff] rounded-xl flex items-center justify-center">
      <div className="text-[#0054B4]">Loading visualization...</div>
    </div>
  )}
)

interface NodeData {
  id: string
  label: string
  group: string
  size: number
  icon: React.ReactNode
  color?: string
}

interface LinkData {
  source: string
  target: string
  value: number
}

export default function NodeVisualization() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 450 })
  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<any>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [centerHighlighted, setCenterHighlighted] = useState(false)

  // Memoize node data to prevent unnecessary recreations
  const nodes: NodeData[] = useMemo(() => [
    // Account Information nodes (left side)
    { id: "follow-up-templates", label: "Follow-up Templates", group: "account", size: 18, icon: <FileText size={16} /> },
    { id: "competitor-analysis", label: "Competitor Analysis", group: "account", size: 16, icon: <Briefcase size={16} /> },
    { id: "technical-details", label: "Technical Details", group: "account", size: 15, icon: <FileCheck size={16} /> },
    { id: "faq", label: "FAQ", group: "account", size: 14, icon: <FileText size={16} /> },
    { id: "case-studies", label: "Relevant Case Studies", group: "account", size: 16, icon: <Briefcase size={16} /> },
    { id: "company-research", label: "Company Research", group: "account", size: 17, icon: <Briefcase size={16} /> },
    { id: "contracts", label: "Contracts", group: "account", size: 15, icon: <FileCheck size={16} /> },
    { id: "white-papers", label: "White Papers", group: "account", size: 14, icon: <FileText size={16} /> },
    
    // Company Information nodes (right side)
    { id: "meeting-transcripts", label: "Meeting Transcripts", group: "company", size: 18, icon: <FileCheck size={16} /> },
    { id: "objection", label: "Objection", group: "company", size: 16, icon: <Shield size={16} /> },
    { id: "email-transcripts", label: "Email Transcripts", group: "company", size: 17, icon: <Mail size={16} /> },
    { id: "bant", label: "BANT", group: "company", size: 15, icon: <FileText size={16} /> },
    { id: "medpic", label: "MEDPIC", group: "company", size: 14, icon: <FileCheck size={16} /> },
    { id: "stakeholder-mapping", label: "Stakeholder Mapping", group: "company", size: 16, icon: <User size={16} /> },
    { id: "personal-information", label: "Personal Information", group: "company", size: 15, icon: <User size={16} /> },
    { id: "follow-up-cycles", label: "Follow-up Cycles", group: "company", size: 16, icon: <Calendar size={16} /> },
    
    // Central node (AI agent)
    { id: "chrm-ai", label: "CHRM.AI", group: "central", size: 30, icon: null, color: "#001240" }
  ], [])

  // Create connections between nodes - mostly to the central node with some cross-connections
  const links: LinkData[] = useMemo(() => {
    const result: LinkData[] = []
    
    // Connect all nodes to the central AI agent with varying strengths
    nodes.forEach(node => {
      if (node.id !== "chrm-ai") {
        // Determine connection strength based on node size/importance
        const value = (node.size - 10) / 10
        result.push({
          source: node.id,
          target: "chrm-ai",
          value: value
        })
      }
    })
    
    // Add some cross-connections between related nodes for additional complexity
    const relatedPairs = [
      ["follow-up-templates", "follow-up-cycles"],
      ["competitor-analysis", "company-research"],
      ["technical-details", "bant"],
      ["case-studies", "stakeholder-mapping"],
      ["meeting-transcripts", "email-transcripts"],
      ["faq", "objection"],
      ["personal-information", "contracts"],
      ["white-papers", "medpic"]
    ]
    
    relatedPairs.forEach(([source, target]) => {
      result.push({
        source,
        target,
        value: 0.2 // Weaker connections between related nodes
      })
    })
    
    return result
  }, [nodes])

  // Format data for force graph
  const graphData = useMemo(() => ({
    nodes: nodes.map(node => ({ 
      ...node, 
      // Pre-position nodes to speed up initial layout
      x: node.group === "account" ? -50 : node.group === "company" ? 50 : 0,
      y: node.group === "central" ? 0 : (Math.random() - 0.5) * 100
    })),
    links
  }), [nodes, links])

  // Update dimensions when component mounts or window resizes
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: 450
        })
      }
    }
    
    // Set mounted flag to allow client-side rendering
    setIsMounted(true)
    
    // Initial dimension measurement
    updateDimensions()
    
    // Add resize listener
    window.addEventListener('resize', updateDimensions)
    
    // Highlight center node after initial render
    const timer = setTimeout(() => {
      setCenterHighlighted(true)
    }, 1500)
    
    return () => {
      window.removeEventListener('resize', updateDimensions)
      clearTimeout(timer)
    }
  }, [])

  // Custom node renderer for better performance and control
  const nodeCanvasObject = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const { x, y, id, label, size, group, color } = node
    const fontSize = 10 / globalScale
    const nodeSize = size / globalScale
    
    // Base colors
    const accountColor = "#0060CF"
    const companyColor = "#0072E8"
    const centralColor = color || "#001240"
    
    // Node is hovered or central node is highlighted
    const isHighlighted = id === hoveredNode || (id === "chrm-ai" && centerHighlighted)
    
    // Draw node
    ctx.beginPath()
    
    if (id === "chrm-ai") {
      // Special styling for central node
      // Draw rounded rectangle for central node
      const width = nodeSize * 1.8
      const height = nodeSize * 1.2
      const radius = 8 / globalScale
      
      ctx.fillStyle = isHighlighted ? "#003399" : centralColor
      
      // Draw rounded rectangle
      ctx.beginPath()
      ctx.moveTo(x - width/2 + radius, y - height/2)
      ctx.lineTo(x + width/2 - radius, y - height/2)
      ctx.arcTo(x + width/2, y - height/2, x + width/2, y - height/2 + radius, radius)
      ctx.lineTo(x + width/2, y + height/2 - radius)
      ctx.arcTo(x + width/2, y + height/2, x + width/2 - radius, y + height/2, radius)
      ctx.lineTo(x - width/2 + radius, y + height/2)
      ctx.arcTo(x - width/2, y + height/2, x - width/2, y + height/2 - radius, radius)
      ctx.lineTo(x - width/2, y - height/2 + radius)
      ctx.arcTo(x - width/2, y - height/2, x - width/2 + radius, y - height/2, radius)
      ctx.closePath()
      ctx.fill()
      
      // Add border
      ctx.strokeStyle = "#007CFF"
      ctx.lineWidth = isHighlighted ? 4 / globalScale : 2 / globalScale
      ctx.stroke()
      
      // Add text
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.font = `bold ${fontSize * 1.5}px Arial`
      ctx.fillStyle = isHighlighted ? "#FFB74D" : "#FFB74D"
      ctx.fillText("CHRM.AI", x, y)
      
      // Add glow effect when highlighted
      if (isHighlighted) {
        ctx.shadowColor = '#007CFF'
        ctx.shadowBlur = 15 / globalScale
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.stroke()
        ctx.shadowBlur = 0
      }
    } else {
      // Regular nodes
      const nodeColor = group === "account" ? accountColor : companyColor
      
      // Draw circle for regular nodes
      ctx.fillStyle = isHighlighted ? "#004FAC" : nodeColor
      ctx.arc(x, y, nodeSize, 0, 2 * Math.PI)
      ctx.fill()
      
      // Add border
      ctx.strokeStyle = "#FFFFFF"
      ctx.lineWidth = 1.5 / globalScale
      ctx.stroke()
      
      // Label background for better readability
      if (isHighlighted || globalScale > 1.2) {
        const textWidth = ctx.measureText(label).width
        const bgHeight = fontSize * 1.5
        const bgWidth = textWidth + 8 / globalScale
        
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
        ctx.roundRect(
          x - bgWidth / 2,
          y + nodeSize + 2 / globalScale,
          bgWidth,
          bgHeight,
          3 / globalScale
        )
        ctx.fill()
        
        // Add node label
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.font = `${fontSize}px Arial`
        ctx.fillStyle = isHighlighted ? "#004FAC" : "#0054B4"
        ctx.fillText(
          label,
          x,
          y + nodeSize + (fontSize * 0.8)
        )
      }
    }
  }, [hoveredNode, centerHighlighted])

  // Custom link renderer for connections
  const linkCanvasObject = useCallback((link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    // Get source and target nodes
    const source = link.source
    const target = link.target
    
    // Draw link
    ctx.beginPath()
    ctx.moveTo(source.x, source.y)
    ctx.lineTo(target.x, target.y)
    
    // Set stroke based on connection type
    const isCentralConnection = source.id === "chrm-ai" || target.id === "chrm-ai"
    
    if (isCentralConnection) {
      // Central connections
      ctx.strokeStyle = "#007CFF"
      ctx.lineWidth = 1.5 / globalScale
      ctx.setLineDash([])
    } else {
      // Non-central connections (fainter)
      ctx.strokeStyle = "rgba(0, 124, 255, 0.3)"
      ctx.lineWidth = 1 / globalScale
      ctx.setLineDash([2 / globalScale, 2 / globalScale])
    }
    
    // Draw the link
    ctx.stroke()
  }, [])

  // Configure force graph's forces
  const forceConfiguration = useCallback((graph: any) => {
    // Apply custom force configurations
    graph
      .d3Force("link")
      .distance((link: any) => link.value === 0.2 ? 150 : 100) // Longer distance for cross-connections
      .strength((link: any) => {
        // Connection to central node is stronger
        if (link.source.id === "chrm-ai" || link.target.id === "chrm-ai") {
          return 0.4
        }
        // Cross-connections are weaker
        return 0.1
      })
    
    // Center force - pull all nodes toward the center with varying strengths
    graph
      .d3Force("center")
      .strength(0.05)
    
    // Charge force - how much nodes repel each other
    graph
      .d3Force("charge")
      .strength((node: any) => node.id === "chrm-ai" ? -300 : -150)
    
    // Special force to separate account and company groups
    graph.d3Force("group", (alpha: number) => {
      graphData.nodes.forEach((node: any) => {
        if (node.group === "account") {
          // Pull account nodes to the left
          node.vx -= alpha * 2
        } else if (node.group === "company") {
          // Pull company nodes to the right
          node.vx += alpha * 2
        }
      })
    })
    
    // Add the collision force to prevent overlap
    graph.d3Force("collision", d3.forceCollide((node: any) => node.size * 1.2))
  }, [graphData.nodes])

  // Handle node hover
  const handleNodeHover = useCallback((node: any) => {
    setHoveredNode(node ? node.id : null)
  }, [])

  // Handle node click - implement interactions if needed
  const handleNodeClick = useCallback((node: any) => {
    // Optional: implement click behavior
    console.log("Clicked node:", node.id)
  }, [])

  // Only render on client-side to avoid hydration issues
  if (!isMounted) {
    return (
      <div 
        ref={containerRef} 
        className="w-full h-[450px] flex items-center justify-center bg-white/50 rounded-xl"
      >
        <span className="text-[#0054B4]">Loading visualization...</span>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="w-full relative overflow-hidden" 
      style={{ height: dimensions.height }}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8faff] to-white opacity-70"></div>

      {/* Decorative circles */}
      <div className="absolute w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] rounded-full border border-[#007CFF]/20"></div>
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] rounded-full border border-[#007CFF]/30"></div>
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] rounded-full border border-[#007CFF]/40"></div>
      </div>

      {/* Force-directed graph */}
      {dimensions.width > 0 && (
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          width={dimensions.width}
          height={dimensions.height}
          nodeCanvasObject={nodeCanvasObject}
          linkCanvasObject={linkCanvasObject}
          onNodeHover={handleNodeHover}
          onNodeClick={handleNodeClick}
          onEngineStop={() => graphRef.current && graphRef.current.zoomToFit(400)}
          cooldownTime={1000}
          onEngineInitialized={forceConfiguration}
          enableNodeDrag={false}
          enablePanInteraction={false}
          enableZoomInteraction={false}
        />
      )}
      
      {/* Accessibility description (hidden visually) */}
      <div className="sr-only">
        Interactive visualization showing how CHRM.AI connects and organizes sales communication data including
        account information such as follow-up templates, competitor analysis, and technical details, and
        company information such as meeting transcripts, objections, and stakeholder mapping.
      </div>
    </div>
  )
}