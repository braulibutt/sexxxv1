"use client"

import React, { useEffect, useRef, useState } from 'react'
import { FileText, Shield, Briefcase, FileCheck, User, Mail, Calendar } from 'lucide-react'

// Node data interfaces
interface NodeData {
  id: string
  label: string
  icon: React.ReactNode
  group: 'account' | 'company'
  size: number
}

export default function SimpleNodeVisualization() {
  const [mounted, setMounted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 450 })
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const reqIdRef = useRef<number | null>(null)
  
  // Define nodes
  const nodes: NodeData[] = [
    // Account Information nodes
    { id: 'follow-up-templates', label: 'Follow-up Templates', icon: <FileText size={16} />, group: 'account', size: 18 },
    { id: 'competitor-analysis', label: 'Competitor Analysis', icon: <Briefcase size={16} />, group: 'account', size: 16 },
    { id: 'technical-details', label: 'Technical Details', icon: <FileCheck size={16} />, group: 'account', size: 15 },
    { id: 'faq', label: 'FAQ', icon: <FileText size={16} />, group: 'account', size: 14 },
    { id: 'case-studies', label: 'Relevant Case Studies', icon: <Briefcase size={16} />, group: 'account', size: 16 },
    { id: 'company-research', label: 'Company Research', icon: <Briefcase size={16} />, group: 'account', size: 17 },
    { id: 'contracts', label: 'Contracts', icon: <FileCheck size={16} />, group: 'account', size: 15 },
    { id: 'white-papers', label: 'White Papers', icon: <FileText size={16} />, group: 'account', size: 14 },
    
    // Company Information nodes
    { id: 'meeting-transcripts', label: 'Meeting Transcripts', icon: <FileCheck size={16} />, group: 'company', size: 18 },
    { id: 'objection', label: 'Objection', icon: <Shield size={16} />, group: 'company', size: 16 },
    { id: 'email-transcripts', label: 'Email Transcripts', icon: <Mail size={16} />, group: 'company', size: 17 },
    { id: 'bant', label: 'BANT', icon: <FileText size={16} />, group: 'company', size: 15 },
    { id: 'medpic', label: 'MEDPIC', icon: <FileCheck size={16} />, group: 'company', size: 14 },
    { id: 'stakeholder-mapping', label: 'Stakeholder Mapping', icon: <User size={16} />, group: 'company', size: 16 },
    { id: 'personal-information', label: 'Personal Information', icon: <User size={16} />, group: 'company', size: 15 },
    { id: 'follow-up-cycles', label: 'Follow-up Cycles', icon: <Calendar size={16} />, group: 'company', size: 16 },
  ]
  
  // Predefined positions for nodes
  const nodePositions = {
    'follow-up-templates': { x: 0.35, y: 0.4 },
    'competitor-analysis': { x: 0.24, y: 0.65 },
    'technical-details': { x: 0.15, y: 0.45 },
    'faq': { x: 0.08, y: 0.7 },
    'case-studies': { x: 0.12, y: 0.25 },
    'company-research': { x: 0.05, y: 0.5 },
    'contracts': { x: 0.22, y: 0.15 },
    'white-papers': { x: 0.07, y: 0.3 },
    
    'meeting-transcripts': { x: 0.65, y: 0.4 },
    'objection': { x: 0.76, y: 0.65 },
    'email-transcripts': { x: 0.85, y: 0.45 },
    'bant': { x: 0.92, y: 0.7 },
    'medpic': { x: 0.88, y: 0.25 },
    'stakeholder-mapping': { x: 0.95, y: 0.5 },
    'personal-information': { x: 0.78, y: 0.15 },
    'follow-up-cycles': { x: 0.93, y: 0.3 },
  }
  
  // Update dimension on component mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: 450
        })
      }
    }
    
    setMounted(true)
    updateDimensions()
    
    window.addEventListener('resize', updateDimensions)
    return () => {
      window.removeEventListener('resize', updateDimensions)
      if (reqIdRef.current) {
        cancelAnimationFrame(reqIdRef.current)
      }
    }
  }, [])
  
  // Draw the visualization on canvas
  useEffect(() => {
    if (!mounted || !canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas resolution
    const dpr = window.devicePixelRatio || 1
    canvas.width = dimensions.width * dpr
    canvas.height = dimensions.height * dpr
    ctx.scale(dpr, dpr)
    
    // Drawing function
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)
      
      // Draw decorative circles
      ctx.beginPath()
      ctx.arc(dimensions.width / 2, dimensions.height / 2, dimensions.width * 0.45, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(0, 124, 255, 0.2)'
      ctx.lineWidth = 1
      ctx.stroke()
      
      ctx.beginPath()
      ctx.arc(dimensions.width / 2, dimensions.height / 2, dimensions.width * 0.35, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(0, 124, 255, 0.3)'
      ctx.lineWidth = 1
      ctx.stroke()
      
      ctx.beginPath()
      ctx.arc(dimensions.width / 2, dimensions.height / 2, dimensions.width * 0.25, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(0, 124, 255, 0.4)'
      ctx.lineWidth = 1
      ctx.stroke()
      
      // Draw central node
      ctx.beginPath()
      const centerX = dimensions.width / 2
      const centerY = dimensions.height / 2
      const centerWidth = 100
      const centerHeight = 60
      const radius = 10
      
      // Draw rounded rectangle
      ctx.moveTo(centerX - centerWidth/2 + radius, centerY - centerHeight/2)
      ctx.lineTo(centerX + centerWidth/2 - radius, centerY - centerHeight/2)
      ctx.arcTo(centerX + centerWidth/2, centerY - centerHeight/2, centerX + centerWidth/2, centerY - centerHeight/2 + radius, radius)
      ctx.lineTo(centerX + centerWidth/2, centerY + centerHeight/2 - radius)
      ctx.arcTo(centerX + centerWidth/2, centerY + centerHeight/2, centerX + centerWidth/2 - radius, centerY + centerHeight/2, radius)
      ctx.lineTo(centerX - centerWidth/2 + radius, centerY + centerHeight/2)
      ctx.arcTo(centerX - centerWidth/2, centerY + centerHeight/2, centerX - centerWidth/2, centerY + centerHeight/2 - radius, radius)
      ctx.lineTo(centerX - centerWidth/2, centerY - centerHeight/2 + radius)
      ctx.arcTo(centerX - centerWidth/2, centerY - centerHeight/2, centerX - centerWidth/2 + radius, centerY - centerHeight/2, radius)
      ctx.closePath()
      
      ctx.fillStyle = '#001240'
      ctx.fill()
      ctx.strokeStyle = '#007CFF'
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Draw central text
      ctx.fillStyle = '#FFB74D'
      ctx.font = 'bold 18px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('CHRM.AI', centerX, centerY)
      
      // Draw connections to center
      nodes.forEach(node => {
        const nodeX = nodePositions[node.id].x * dimensions.width
        const nodeY = nodePositions[node.id].y * dimensions.height
        
        // Draw line to center
        ctx.beginPath()
        ctx.moveTo(nodeX, nodeY)
        ctx.lineTo(centerX, centerY)
        ctx.strokeStyle = 'rgba(0, 124, 255, 0.3)'
        ctx.lineWidth = 1
        ctx.stroke()
      })
      
      // Draw nodes
      nodes.forEach(node => {
        const nodeX = nodePositions[node.id].x * dimensions.width
        const nodeY = nodePositions[node.id].y * dimensions.height
        const nodeSize = node.size
        const isHovered = hoveredNode === node.id
        
        // Draw node circle
        ctx.beginPath()
        ctx.arc(nodeX, nodeY, nodeSize, 0, Math.PI * 2)
        ctx.fillStyle = node.group === 'account' ? '#0060CF' : '#0072E8'
        ctx.fill()
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 1.5
        ctx.stroke()
        
        // Draw node label if hovered
        if (isHovered) {
          const label = node.label
          ctx.font = '12px Arial'
          const textWidth = ctx.measureText(label).width
          
          // Draw label background
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
          const padding = 6
          ctx.fillRect(
            nodeX - textWidth/2 - padding/2,
            nodeY + nodeSize + 2,
            textWidth + padding,
            20
          )
          
          // Draw text
          ctx.fillStyle = '#0054B4'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(label, nodeX, nodeY + nodeSize + 12)
        }
      })
      
      // Continue animation loop
      reqIdRef.current = requestAnimationFrame(draw)
    }
    
    // Start animation loop
    draw()
    
    return () => {
      if (reqIdRef.current) {
        cancelAnimationFrame(reqIdRef.current)
      }
    }
  }, [dimensions, mounted, hoveredNode])
  
  // Handle mouse interaction
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    // Check if mouse is over any node
    let hoveredNodeId: string | null = null
    
    for (const node of nodes) {
      const nodeX = nodePositions[node.id].x * dimensions.width
      const nodeY = nodePositions[node.id].y * dimensions.height
      const distance = Math.sqrt(Math.pow(x - nodeX, 2) + Math.pow(y - nodeY, 2))
      
      if (distance <= node.size) {
        hoveredNodeId = node.id
        break
      }
    }
    
    setHoveredNode(hoveredNodeId)
  }
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    setHoveredNode(null)
  }
  
  if (!mounted) {
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
      
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: dimensions.width, height: dimensions.height }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      
      {/* Accessibility description */}
      <div className="sr-only">
        Interactive visualization showing how CHRM.AI connects and organizes sales communication data including
        account information such as follow-up templates, competitor analysis, and technical details, and
        company information such as meeting transcripts, objections, and stakeholder mapping.
      </div>
    </div>
  )
}