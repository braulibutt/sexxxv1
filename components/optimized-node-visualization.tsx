"use client"

import React, { useRef, useEffect, useState, useCallback, memo } from "react"
import { FileText, Shield, Briefcase, FileCheck, User, Mail, Calendar } from "lucide-react"
import { useInView } from "react-intersection-observer"

// Polyfill for roundRect is loaded via script tag in layout.tsx

// Define types for nodes, connections, and positions
interface NodeData {
  id: string
  label: string
  icon: string
  x: number
  y: number
  size?: number
  primary?: boolean
  secondary?: boolean
}

// Hard-coded node positions and data to prevent unnecessary re-renders
const ACCOUNT_NODES: NodeData[] = [
  { id: "white-papers", label: "White Papers", icon: "FileText", x: 4, y: 14, size: 0.92 },
  { id: "contracts", label: "Contracts", icon: "FileCheck", x: 14, y: 28, size: 0.96 },
  { id: "company-research", label: "Company Research", icon: "Briefcase", x: 8, y: 50, size: 0.97 },
  { id: "relevant-case-studies", label: "Relevant Case Studies", icon: "Briefcase", x: 20, y: 65, size: 0.95 },
  { id: "faq", label: "FAQ", icon: "FileText", x: 6, y: 80, size: 0.9 },
  { id: "technical-details", label: "Technical Details", icon: "FileCheck", x: 25, y: 42, size: 1.05, secondary: true },
  { id: "competitor-analysis", label: "Competitor Analysis", icon: "Briefcase", x: 32, y: 85, size: 1.05, secondary: true },
  { id: "follow-up-templates", label: "Follow-up Templates", icon: "FileText", x: 18, y: 22, size: 1.15, primary: true },
]

const COMPANY_NODES: NodeData[] = [
  { id: "meeting-transcripts", label: "Meeting Transcripts", icon: "FileCheck", x: 68, y: 22, size: 1.15, primary: true },
  { id: "objection", label: "Objection", icon: "Shield", x: 75, y: 42, size: 1.15, primary: true },
  { id: "email-transcripts", label: "Email Transcripts", icon: "Mail", x: 63, y: 65, size: 1.05, secondary: true },
  { id: "bant", label: "BANT", icon: "FileText", x: 82, y: 80, size: 1.15, primary: true },
  { id: "medpic", label: "MEDPIC", icon: "FileCheck", x: 95, y: 65, size: 0.9 },
  { id: "stakeholder-mapping", label: "Stakeholder Mapping", icon: "User", x: 88, y: 50, size: 1.05, secondary: true },
  { id: "personal-information", label: "Personal Information", icon: "User", x: 96, y: 28, size: 0.91 },
  { id: "follow-up-cycles", label: "Follow-up Cycles", icon: "Calendar", x: 76, y: 14, size: 0.98 },
]

// Animation sequence to prevent unnecessary calculations
const ANIMATION_SEQUENCE = [
  // First wave - extreme opposites
  "white-papers", "personal-information",
  // Second wave - peripheral nodes
  "faq", "medpic",
  // Third wave - bottom extremes
  "competitor-analysis", "bant",
  // Fourth wave - filling in
  "contracts", "follow-up-cycles",
  // Fifth wave - mid-level info
  "company-research", "stakeholder-mapping",
  // Sixth wave - specific info
  "relevant-case-studies", "email-transcripts",
  // Seventh wave - technical
  "technical-details",
  // Eighth wave - critical nodes near center
  "objection", "follow-up-templates", "meeting-transcripts",
]

// Background decoration points
const DECORATION_POINTS = [
  { x: 72, y: 18, size: 0.4, color: "#FFA500", opacity: 0.6, anim: "slow" },
  { x: 84, y: 28, size: 0.2, color: "#007CFF", opacity: 0.3, anim: "fast" },
  { x: 92, y: 42, size: 0.3, color: "#007CFF", opacity: 0.6, anim: "slow" },
  { x: 88, y: 58, size: 0.4, color: "#FFA500", opacity: 0.3, anim: "fast" },
  { x: 95, y: 65, size: 0.2, color: "#007CFF", opacity: 0.4, anim: "slow" },
  { x: 83, y: 75, size: 0.3, color: "#007CFF", opacity: 0.6, anim: "fast" },
  { x: 74, y: 80, size: 0.5, color: "#E3F2FD", opacity: 0.4, anim: "slow" },
  { x: 65, y: 85, size: 0.2, color: "#007CFF", opacity: 0.3, anim: "fast" },
  { x: 54, y: 88, size: 0.4, color: "#FFA500", opacity: 0.6, anim: "slow" },
  { x: 45, y: 84, size: 0.2, color: "#007CFF", opacity: 0.3, anim: "fast" },
  { x: 36, y: 88, size: 0.3, color: "#007CFF", opacity: 0.6, anim: "slow" },
  { x: 30, y: 82, size: 0.5, color: "#E3F2FD", opacity: 0.4, anim: "fast" },
  { x: 20, y: 78, size: 0.2, color: "#007CFF", opacity: 0.3, anim: "slow" },
  { x: 14, y: 67, size: 0.4, color: "#FFA500", opacity: 0.6, anim: "fast" },
  { x: 8, y: 58, size: 0.2, color: "#007CFF", opacity: 0.4, anim: "slow" },
  { x: 6, y: 48, size: 0.3, color: "#007CFF", opacity: 0.6, anim: "fast" },
  { x: 10, y: 38, size: 0.5, color: "#E3F2FD", opacity: 0.3, anim: "slow" },
  { x: 16, y: 26, size: 0.2, color: "#007CFF", opacity: 0.4, anim: "fast" },
  { x: 25, y: 18, size: 0.4, color: "#FFA500", opacity: 0.3, anim: "slow" },
  { x: 35, y: 15, size: 0.2, color: "#007CFF", opacity: 0.3, anim: "fast" },
  { x: 48, y: 12, size: 0.3, color: "#007CFF", opacity: 0.6, anim: "slow" },
  { x: 60, y: 15, size: 0.5, color: "#E3F2FD", opacity: 0.4, anim: "fast" },
]

// Output types and their colors
const OUTPUTS = [
  { id: "email", label: "Perfect email", colors: ["#FBBF24", "#F59E0B"] },
  { id: "followup", label: "Follow-up", colors: ["#7DD3FC", "#3B82F6"] },
  { id: "objection", label: "Objection handling", colors: ["#7DD3FC", "#3B82F6"] },
]

// Canvas-based node visualization component
const OptimizedNodeVisualization = () => {
  // Intersection observer to only render when in viewport
  const { ref: containerRef, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  // Canvas and hover state refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [visibleNodes, setVisibleNodes] = useState<string[]>([])
  const [animationComplete, setAnimationComplete] = useState(false)
  const [currentOutput, setCurrentOutput] = useState("email")
  const [outputAnimationPhase, setOutputAnimationPhase] = useState<"in" | "stay" | "out" | "none">("stay")
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const animationRef = useRef<NodeJS.Timeout | null>(null)
  const outputAnimationRef = useRef<NodeJS.Timeout | null>(null)
  const mousePosition = useRef({ x: 0, y: 0 })
  const needsRedraw = useRef(true)
  
  // Find the node at the current mouse position
  const findNodeAtPosition = useCallback((x: number, y: number) => {
    const allNodes = [...ACCOUNT_NODES, ...COMPANY_NODES]
    // Only check visible nodes
    const visibleNodesList = allNodes.filter(node => visibleNodes.includes(node.id))
    
    for (const node of visibleNodesList) {
      const nodeX = (node.x / 100) * canvasSize.width
      const nodeY = (node.y / 100) * canvasSize.height
      
      // Calculate size dynamically based on the node's size attribute
      const nodeSize = (node.size || 1) * 100
      
      // Simple radius-based hit detection with a small buffer for better UX
      const dx = nodeX - x
      const dy = nodeY - y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < nodeSize / 2 + 10) {
        return node.id
      }
    }
    
    // Check if output box is hovered
    if (animationComplete) {
      const outputX = canvasSize.width / 2
      const outputY = canvasSize.height - 70
      const outputWidth = 140
      const outputHeight = 40
      
      if (
        x > outputX - outputWidth / 2 &&
        x < outputX + outputWidth / 2 &&
        y > outputY - outputHeight / 2 &&
        y < outputY + outputHeight / 2
      ) {
        return "output"
      }
    }
    
    return null
  }, [visibleNodes, canvasSize, animationComplete])
  
  // Handle resize to update canvas dimensions
  const handleResize = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return
    
    try {
      // Get the container dimensions
      const container = containerRef.current as HTMLDivElement
      const rect = container.getBoundingClientRect()
      
      // Skip if dimensions are invalid (prevents NaN errors)
      if (rect.width <= 0 || !isFinite(rect.width)) {
        console.warn('Invalid container width, skipping canvas resize')
        return
      }
      
      // Set canvas dimensions with high-DPI display support
      const dpr = window.devicePixelRatio || 1
      const scaleFactor = Math.min(dpr, 2) // Cap at 2x to prevent overly large canvas on very high DPI displays
      
      // Use a fixed height for consistent display
      const canvasHeight = 450
      
      // Set actual size in memory (scaled for high DPI)
      canvasRef.current.width = rect.width * scaleFactor
      canvasRef.current.height = canvasHeight * scaleFactor
      
      // Set display size (CSS pixels)
      canvasRef.current.style.width = `${rect.width}px`
      canvasRef.current.style.height = `${canvasHeight}px`
      
      // Update size state for calculations
      setCanvasSize({
        width: rect.width,
        height: canvasHeight,
      })
      
      // Force a redraw after resize
      needsRedraw.current = true
      
      console.log('Canvas resized:', rect.width, 'x', canvasHeight, 'scale factor:', scaleFactor)
    } catch (error) {
      console.error('Error during canvas resize:', error)
    }
  }, [])
  
  // Handle mouse move to detect hovering on nodes
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    mousePosition.current = { x, y }
    
    const nodeUnderMouse = findNodeAtPosition(x, y)
    if (nodeUnderMouse !== hoveredNode) {
      setHoveredNode(nodeUnderMouse)
      needsRedraw.current = true
    }
  }, [findNodeAtPosition, hoveredNode])
  
  // Handle mouse leave to clear hover state
  const handleMouseLeave = useCallback(() => {
    setHoveredNode(null)
    needsRedraw.current = true
  }, [])
  
  // Sequential node animation
  const animateNodesSequentially = useCallback(() => {
    let currentIndex = 0
    
    const showNextNode = () => {
      if (currentIndex < ANIMATION_SEQUENCE.length) {
        const nodeId = ANIMATION_SEQUENCE[currentIndex]
        setVisibleNodes(prev => [...prev, nodeId])
        currentIndex++
        
        // Non-linear intervals for more dynamic appearance
        let interval
        if (currentIndex < 4) {
          interval = 80 // Initial speed
        } else if (currentIndex < 12) {
          interval = 60 - (currentIndex * 2) // Accelerate
        } else {
          interval = 20 // Fast finish
        }
        
        animationRef.current = setTimeout(showNextNode, interval)
        needsRedraw.current = true
      } else {
        // All nodes visible, enable output
        setTimeout(() => {
          setAnimationComplete(true)
          needsRedraw.current = true
        }, 200)
      }
    }
    
    showNextNode()
  }, [])
  
  // Handle output animation cycle
  const animateOutputsSequentially = useCallback(() => {
    // First animation cycle
    setCurrentOutput("email")
    setOutputAnimationPhase("in")
    
    const sequence = [
      () => {
        setOutputAnimationPhase("stay")
        return 1500
      },
      () => {
        setOutputAnimationPhase("out")
        return 300
      },
      () => {
        setCurrentOutput("followup")
        setOutputAnimationPhase("in")
        return 300
      },
      () => {
        setOutputAnimationPhase("stay")
        return 1500
      },
      () => {
        setOutputAnimationPhase("out")
        return 300
      },
      () => {
        setCurrentOutput("objection")
        setOutputAnimationPhase("in")
        return 300
      },
      () => {
        setOutputAnimationPhase("stay")
        return 1500
      },
      () => {
        setOutputAnimationPhase("out")
        return 300
      },
      () => {
        // Loop back
        setCurrentOutput("email")
        setOutputAnimationPhase("in")
        return 300
      },
    ]
    
    let currentStep = 0
    
    const runSequence = () => {
      if (currentStep < sequence.length) {
        const delay = sequence[currentStep]()
        currentStep++
        
        if (delay > 10) {
          outputAnimationRef.current = setTimeout(() => {
            runSequence()
            needsRedraw.current = true
          }, delay)
        }
      } else {
        // Reset for the next cycle
        currentStep = 0
        runSequence()
      }
    }
    
    outputAnimationRef.current = setTimeout(runSequence, 300)
  }, [])
  
  // Render loop for the canvas
  const renderCanvas = useCallback(() => {
    try {
      const canvas = canvasRef.current
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        console.error('Failed to get canvas context')
        return
      }
      
      // Only redraw when needed to save CPU cycles
      if (!needsRedraw.current && animationFrameRef.current) return
      
      needsRedraw.current = false
      
      // Clear the canvas with error handling
      try {
        const dpr = window.devicePixelRatio || 1
        const scaleFactor = Math.min(dpr, 2) // Match the same scale factor used in handleResize
        
        // Clear with the correct dimensions
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.save()
        ctx.scale(scaleFactor, scaleFactor)
        
        // Set default values to prevent rendering artifacts
        ctx.globalAlpha = 1.0
        ctx.fillStyle = '#ffffff'
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 1.0
        ctx.setLineDash([])
        ctx.shadowBlur = 0
        ctx.shadowColor = 'transparent'
        
        // Draw components with error handling
        try {
          // Draw the decorative background
          drawBackground(ctx)
          
          // Draw connections between nodes and center
          drawConnections(ctx)
          
          // Draw bottom output element
          if (animationComplete) {
            drawOutput(ctx)
          }
          
          // Draw nodes
          drawNodes(ctx)
        } catch (error) {
          console.error('Error during canvas rendering:', error)
        }
        
        // Restore context state
        ctx.restore()
        
      } catch (error) {
        console.error('Failed to clear or setup canvas:', error)
      }
      
      // Request another frame
      animationFrameRef.current = requestAnimationFrame(renderCanvas)
      
    } catch (error) {
      console.error('Critical error in render loop:', error)
      // Attempt to recover by requesting another frame after a delay
      setTimeout(() => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
        animationFrameRef.current = requestAnimationFrame(renderCanvas)
      }, 1000)
    }
  }, [canvasSize, visibleNodes, hoveredNode, animationComplete, currentOutput, outputAnimationPhase, 
      drawBackground, drawConnections, drawOutput, drawNodes])
  
  // Draw background decorations
  const drawBackground = useCallback((ctx: CanvasRenderingContext2D) => {
    // Decorative circles
    const centerX = canvasSize.width / 2
    const centerY = canvasSize.height / 2
    
    // Draw large orbit circles
    ctx.beginPath()
    ctx.arc(centerX, centerY, canvasSize.width * 0.48, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(0, 124, 255, 0.4)'
    ctx.setLineDash([3, 5])
    ctx.lineWidth = 0.2
    ctx.stroke()
    
    ctx.beginPath()
    ctx.arc(centerX, centerY, canvasSize.width * 0.39, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(0, 124, 255, 0.35)'
    ctx.setLineDash([2, 4])
    ctx.lineWidth = 0.2
    ctx.stroke()
    
    ctx.beginPath()
    ctx.arc(centerX, centerY, canvasSize.width * 0.25, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(0, 124, 255, 0.3)'
    ctx.setLineDash([2, 3])
    ctx.lineWidth = 0.2
    ctx.stroke()
    
    ctx.setLineDash([])
    
    // Draw decorative points with subtle animation
    const currentTime = Date.now()
    DECORATION_POINTS.forEach((point, i) => {
      // Ensure point coordinates are valid and within bounds
      if (!isFinite(point.x) || !isFinite(point.y) || !isFinite(point.size)) {
        return // Skip invalid points
      }
      
      const x = (point.x / 100) * canvasSize.width
      const y = (point.y / 100) * canvasSize.height
      const size = (point.size / 100) * canvasSize.width
      
      // Ensure calculated values are valid
      if (!isFinite(x) || !isFinite(y) || !isFinite(size) || size <= 0) {
        return // Skip invalid calculations
      }
      
      // Simple animation based on time with error prevention
      let fadeMultiplier = 0.8 // Default value if calculation fails
      try {
        fadeMultiplier = point.anim === "slow" 
          ? (Math.sin(currentTime / 3000 + i) + 1) / 2 * 0.4 + 0.6
          : (Math.sin(currentTime / 2000 + i) + 1) / 2 * 0.4 + 0.6
        
        // Ensure the multiplier is valid
        if (!isFinite(fadeMultiplier)) fadeMultiplier = 0.8
      } catch (error) {
        console.warn('Animation calculation failed, using default value')
      }
      
      try {
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = point.color
        ctx.globalAlpha = point.opacity * fadeMultiplier
        ctx.fill()
        ctx.globalAlpha = 1.0
      } catch (error) {
        console.warn('Error drawing decoration point', error)
      }
    })
  }, [canvasSize])
  
  // Draw connections between nodes and center
  const drawConnections = useCallback((ctx: CanvasRenderingContext2D) => {
    const centerX = canvasSize.width / 2
    const centerY = canvasSize.height * 0.35 // Central node is higher up
    
    // Combine visible account and company nodes
    const allNodes = [...ACCOUNT_NODES, ...COMPANY_NODES]
    const visibleNodesList = allNodes.filter(node => visibleNodes.includes(node.id))
    
    // Draw connections to central node
    visibleNodesList.forEach(node => {
      const nodeX = (node.x / 100) * canvasSize.width
      const nodeY = (node.y / 100) * canvasSize.height
      
      // Calculate direction vector
      const dx = centerX - nodeX
      const dy = centerY - nodeY
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      // Skip if distance is too small (prevents division by zero)
      if (distance < 1) return
      
      // Normalize the vector and scale for the endpoint
      const ndx = dx / distance
      const ndy = dy / distance
      
      // Calculate start point (at node)
      const startX = nodeX + ndx * ((node.size || 1) * 25)
      const startY = nodeY + ndy * ((node.size || 1) * 25)
      
      // Calculate end point (at center)
      const endX = centerX - ndx * 35 // Central node radius
      const endY = centerY - ndy * 35
      
      // Ensure all coordinates are valid numbers (prevent NaN errors)
      if (
        !isFinite(startX) || 
        !isFinite(startY) || 
        !isFinite(endX) || 
        !isFinite(endY)
      ) {
        return // Skip this connection if any coordinates are invalid
      }
      
      // Draw the connection with gradient
      try {
        const gradient = ctx.createLinearGradient(startX, startY, endX, endY)
        
        // Different colors based on node side and hover state
        const isHovered = hoveredNode === node.id
        const isLeftSide = node.x < 50
        
        if (isHovered) {
          // Hovered connection
          gradient.addColorStop(0, 'rgba(217, 119, 6, 0.7)')
          gradient.addColorStop(1, 'rgba(217, 119, 6, 0.2)')
        } else if (isLeftSide) {
          // Left side connection (account info)
          gradient.addColorStop(0, 'rgba(0, 124, 255, 0.5)')
          gradient.addColorStop(1, 'rgba(0, 124, 255, 0.2)')
        } else {
          // Right side connection (company info)
          gradient.addColorStop(0, 'rgba(0, 124, 255, 0.5)')
          gradient.addColorStop(1, 'rgba(0, 124, 255, 0.2)')
        }
        
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.strokeStyle = gradient
        ctx.lineWidth = isHovered ? 1.5 : 0.8
        ctx.stroke()
      } catch (error) {
        // Fallback to a solid color if gradient creation fails
        console.warn('Gradient creation failed, using fallback solid color')
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.strokeStyle = 'rgba(0, 124, 255, 0.4)'
        ctx.lineWidth = 0.8
        ctx.stroke()
      }
    })
    
    // Draw central node
    if (visibleNodes.length > 0) {
      try {
        // Central node shadow - with filter fallback
        try {
          ctx.beginPath()
          ctx.arc(centerX, centerY, 45, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(0, 124, 255, 0.2)'
          
          // Some browsers may not support filter
          if (typeof ctx.filter !== 'undefined') {
            ctx.filter = 'blur(15px)'
            ctx.fill()
            ctx.filter = 'none'
          } else {
            // Fallback for browsers without filter support
            ctx.fill()
            // Create multiple circles with decreasing opacity
            for (let i = 0; i < 5; i++) {
              ctx.beginPath()
              ctx.arc(centerX, centerY, 45 + i * 3, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(0, 124, 255, ${0.1 - i * 0.02})`
              ctx.fill()
            }
          }
        } catch (error) {
          console.warn('Error drawing central node shadow:', error)
          // Simple fallback shadow
          ctx.beginPath()
          ctx.arc(centerX, centerY, 45, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(0, 124, 255, 0.2)'
          ctx.fill()
        }
        
        // Central node background - with gradient fallback
        let centralNodeGradient;
        try {
          // Ensure coordinates are valid
          if (isFinite(centerX) && isFinite(centerY)) {
            centralNodeGradient = ctx.createLinearGradient(
              centerX - 35, centerY - 35,
              centerX + 35, centerY + 35
            )
            centralNodeGradient.addColorStop(0, '#001240')
            centralNodeGradient.addColorStop(1, '#003399')
            ctx.fillStyle = centralNodeGradient
          } else {
            // Fallback for invalid coordinates
            ctx.fillStyle = '#001240'
          }
        } catch (error) {
          console.warn('Error creating central node gradient:', error)
          // Fallback solid color
          ctx.fillStyle = '#001240'
        }
        
        // Draw the central node background
        ctx.beginPath()
        ctx.arc(centerX, centerY, 35, 0, Math.PI * 2)
        ctx.fill()
        
        // Central node border
        ctx.beginPath()
        ctx.arc(centerX, centerY, 35, 0, Math.PI * 2)
        ctx.strokeStyle = '#007CFF'
        ctx.lineWidth = 3
        ctx.stroke()
        
        // Inner glow effects with safety checks
        let glowRadius = 25;
        try {
          const glowTime = Date.now() / 1000
          glowRadius = 25 + Math.sin(glowTime) * 3
          
          // Validate glowRadius
          if (!isFinite(glowRadius) || glowRadius <= 0) {
            glowRadius = 25; // Default fallback
          }
        } catch (error) {
          console.warn('Error calculating glow radius:', error)
        }
        
        // Blue glow
        try {
          if (isFinite(centerX) && isFinite(centerY) && isFinite(glowRadius)) {
            const blueGlow = ctx.createRadialGradient(
              centerX, centerY, 0,
              centerX, centerY, glowRadius
            )
            blueGlow.addColorStop(0, 'rgba(0, 124, 255, 0.4)')
            blueGlow.addColorStop(1, 'rgba(0, 124, 255, 0)')
            
            ctx.beginPath()
            ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2)
            ctx.fillStyle = blueGlow
            ctx.fill()
          }
        } catch (error) {
          console.warn('Error creating blue glow:', error)
          // Simple fallback glow
          ctx.beginPath()
          ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(0, 124, 255, 0.2)'
          ctx.fill()
        }
        
        // Amber glow - slightly offset for visual interest
        try {
          if (isFinite(centerX) && isFinite(centerY) && isFinite(glowRadius)) {
            const amberGlow = ctx.createRadialGradient(
              centerX, centerY + 5, 0,
              centerX, centerY + 5, glowRadius * 0.8
            )
            amberGlow.addColorStop(0, 'rgba(255, 165, 0, 0.3)')
            amberGlow.addColorStop(1, 'rgba(255, 165, 0, 0)')
            
            ctx.beginPath()
            ctx.arc(centerX, centerY + 5, glowRadius * 0.8, 0, Math.PI * 2)
            ctx.fillStyle = amberGlow
            ctx.fill()
          }
        } catch (error) {
          console.warn('Error creating amber glow:', error)
        }
        
        // Central node text - "AI AGENT"
        try {
          ctx.fillStyle = 'white'
          ctx.font = '8px Arial, sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText("AI AGENT", centerX, centerY - 8)
        } catch (error) {
          console.warn('Error drawing AI AGENT text:', error)
        }
        
        // CHRM text with gradient fill
        try {
          ctx.font = 'bold 18px Arial, sans-serif'
          ctx.textBaseline = 'middle'
          
          // Create gradient for CHRM text with validation
          if (isFinite(centerX) && isFinite(centerY)) {
            const textGradient = ctx.createLinearGradient(
              centerX - 25, centerY,
              centerX + 25, centerY + 10
            )
            textGradient.addColorStop(0, '#FBBF24') // amber-300
            textGradient.addColorStop(1, '#F59E0B') // amber-500
            
            ctx.fillStyle = textGradient
            ctx.fillText("CHRM", centerX, centerY + 8)
          } else {
            // Fallback for invalid coordinates
            ctx.fillStyle = '#F59E0B'
            ctx.fillText("CHRM", centerX, centerY + 8)
          }
        } catch (error) {
          console.warn('Error drawing CHRM text:', error)
          // Fallback to solid color
          ctx.fillStyle = '#F59E0B'
          ctx.fillText("CHRM", centerX, centerY + 8)
        }
      } catch (error) {
        console.error('Failed to draw central node:', error)
      }
      
      // Connection to output box
      if (animationComplete) {
        const outputX = centerX
        const outputY = canvasSize.height - 70
        
        const isHovered = hoveredNode === "output"
        
        ctx.beginPath()
        ctx.moveTo(centerX, centerY + 35)
        ctx.lineTo(outputX, outputY - 20)
        ctx.strokeStyle = isHovered ? '#B87333' : '#007CFF'
        ctx.lineWidth = isHovered ? 1.5 : 1
        ctx.globalAlpha = 0.7
        ctx.stroke()
        ctx.globalAlpha = 1.0
        
        // Arrow at the bottom
        ctx.beginPath()
        ctx.moveTo(outputX, outputY - 10)
        ctx.lineTo(outputX - 5, outputY - 20)
        ctx.lineTo(outputX + 5, outputY - 20)
        ctx.closePath()
        ctx.fillStyle = isHovered ? '#B87333' : '#007CFF'
        ctx.globalAlpha = 0.7
        ctx.fill()
        ctx.globalAlpha = 1.0
      }
    }
  }, [canvasSize, visibleNodes, hoveredNode, animationComplete])
  
  // Draw the output box at the bottom
  const drawOutput = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!animationComplete) return
    
    const centerX = canvasSize.width / 2
    const outputY = canvasSize.height - 70
    const outputWidth = 140
    const outputHeight = 40
    
    const isHovered = hoveredNode === "output"
    
    // Box background gradient
    try {
      const gradient = ctx.createLinearGradient(
        centerX - outputWidth / 2, outputY - outputHeight / 2,
        centerX + outputWidth / 2, outputY + outputHeight / 2
      )
      gradient.addColorStop(0, '#001240')
      gradient.addColorStop(1, '#003399')
      
      // Draw output box
      ctx.beginPath()
      ctx.roundRect(
        centerX - outputWidth / 2,
        outputY - outputHeight / 2,
        outputWidth,
        outputHeight,
        8
      )
      ctx.fillStyle = gradient
      ctx.fill()
    } catch (error) {
      // Fallback to solid color
      ctx.beginPath()
      ctx.roundRect(
        centerX - outputWidth / 2,
        outputY - outputHeight / 2,
        outputWidth,
        outputHeight,
        8
      )
      ctx.fillStyle = '#001240'
      ctx.fill()
    }
    
    // Border
    ctx.beginPath()
    ctx.roundRect(
      centerX - outputWidth / 2,
      outputY - outputHeight / 2,
      outputWidth,
      outputHeight,
      8
    )
    ctx.strokeStyle = 'rgba(0, 124, 255, 0.8)'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Inner highlight for glass effect
    ctx.beginPath()
    ctx.roundRect(
      centerX - outputWidth / 2 + 2,
      outputY - outputHeight / 2 + 2,
      outputWidth - 4,
      outputHeight - 4,
      6
    )
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 1
    ctx.stroke()
    
    // Output text
    const output = OUTPUTS.find(o => o.id === currentOutput)
    if (!output) return
    
    // Animation calculations
    let textX = centerX
    let opacity = 1
    
    if (outputAnimationPhase === "in") {
      const progress = (Date.now() % 300) / 300
      textX = centerX + 20 * (1 - progress)
      opacity = progress
    } else if (outputAnimationPhase === "out") {
      const progress = (Date.now() % 300) / 300
      textX = centerX - 20 * progress
      opacity = 1 - progress
    }
    
    // Create gradient for text
    ctx.font = 'bold 14px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.globalAlpha = opacity
    
    try {
      const textGradient = ctx.createLinearGradient(
        textX - 50, outputY,
        textX + 50, outputY
      )
      textGradient.addColorStop(0, output.colors[0])
      textGradient.addColorStop(1, output.colors[1])
      ctx.fillStyle = textGradient
      ctx.fillText(output.label, textX, outputY)
    } catch (error) {
      // Fallback to solid color
      ctx.fillStyle = output.colors[0]
      ctx.fillText(output.label, textX, outputY)
    }
    
    ctx.globalAlpha = 1.0
  }, [canvasSize, animationComplete, currentOutput, outputAnimationPhase])
  
  // Draw nodes with labels
  const drawNodes = useCallback((ctx: CanvasRenderingContext2D) => {
    // Combine visible account and company nodes
    const allNodes = [...ACCOUNT_NODES, ...COMPANY_NODES]
    const visibleNodesList = allNodes.filter(node => visibleNodes.includes(node.id))
    
    visibleNodesList.forEach(node => {
      const nodeX = (node.x / 100) * canvasSize.width
      const nodeY = (node.y / 100) * canvasSize.height
      const isHovered = hoveredNode === node.id
      const isLeftSide = node.x < 50
      
      // Node scale based on size attribute and hover state
      const scale = (node.size || 1) * (isHovered ? 1.1 : 1.0)
      
      // Node container
      ctx.beginPath()
      ctx.roundRect(
        nodeX - 50 * scale,
        nodeY - 12 * scale,
        100 * scale,
        24 * scale,
        12 * scale
      )
      
      // Background gradient
      try {
        const gradientDirection = isLeftSide ? 'to-right' : 'to-left'
        const gradient = ctx.createLinearGradient(
          nodeX - 50 * scale,
          nodeY,
          nodeX + 50 * scale,
          nodeY
        )
        
        if (gradientDirection === 'to-right') {
          gradient.addColorStop(0, 'white')
          gradient.addColorStop(1, '#f5f9ff')
        } else {
          gradient.addColorStop(0, '#f5f9ff')
          gradient.addColorStop(1, 'white')
        }
        
        ctx.fillStyle = gradient
        ctx.fill()
      } catch (error) {
        // Fallback to solid color
        ctx.fillStyle = 'white'
        ctx.fill()
      }
      
      // Border
      ctx.strokeStyle = isHovered ? 'rgba(217, 119, 6, 0.8)' : 'rgba(0, 124, 255, 0.6)'
      ctx.lineWidth = 1
      ctx.stroke()
      
      // Shadow effect
      if (isHovered) {
        ctx.shadowColor = 'rgba(255, 180, 0, 0.3)'
        ctx.shadowBlur = 15
        ctx.stroke()
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
      }
      
      // Icon circle
      const iconX = isLeftSide ? nodeX - 35 * scale : nodeX + 35 * scale
      ctx.beginPath()
      ctx.arc(iconX, nodeY, 8 * scale, 0, Math.PI * 2)
      
      // Icon background gradient
      try {
        const iconGradient = ctx.createLinearGradient(
          iconX - 8 * scale,
          nodeY - 8 * scale,
          iconX + 8 * scale,
          nodeY + 8 * scale
        )
        
        if (isHovered) {
          iconGradient.addColorStop(0, '#F59E0B') // amber-400
          iconGradient.addColorStop(1, '#D97706') // amber-500
        } else {
          iconGradient.addColorStop(0, '#0066CC')
          iconGradient.addColorStop(1, '#007CFF')
        }
        
        ctx.fillStyle = iconGradient
        ctx.fill()
      } catch (error) {
        // Fallback to solid color
        ctx.fillStyle = isHovered ? '#F59E0B' : '#0066CC'
        ctx.fill()
      }
      
      // Draw text label
      ctx.font = `${isHovered ? 'bold ' : ''}${10 * scale}px Arial`
      ctx.fillStyle = isHovered ? '#D97706' : '#001240'
      ctx.textAlign = isLeftSide ? 'left' : 'right'
      ctx.textBaseline = 'middle'
      
      const textX = isLeftSide ? nodeX - 22 * scale : nodeX + 22 * scale
      ctx.fillText(node.label, textX, nodeY)
      
      // Icon drawing
      ctx.fillStyle = 'white'
      
      // Draw simple icon representations (simplified for canvas)
      const iconSize = 3.5 * scale
      
      switch (node.icon) {
        case "FileText":
          // Document icon
          ctx.fillRect(iconX - iconSize, nodeY - iconSize, iconSize * 2, iconSize * 2)
          ctx.strokeStyle = isHovered ? '#F59E0B' : '#0066CC'
          ctx.lineWidth = 0.5
          ctx.strokeRect(iconX - iconSize, nodeY - iconSize, iconSize * 2, iconSize * 2)
          // Lines for text
          ctx.fillStyle = isHovered ? '#F59E0B' : '#0066CC'
          ctx.fillRect(iconX - iconSize + 1, nodeY - iconSize + 2, iconSize * 1.2, 0.5)
          ctx.fillRect(iconX - iconSize + 1, nodeY, iconSize * 1.2, 0.5)
          ctx.fillStyle = 'white'
          break
          
        case "Shield":
          // Shield icon
          ctx.beginPath()
          ctx.moveTo(iconX, nodeY - iconSize)
          ctx.lineTo(iconX + iconSize, nodeY - iconSize / 2)
          ctx.lineTo(iconX + iconSize, nodeY + iconSize / 2)
          ctx.lineTo(iconX, nodeY + iconSize)
          ctx.lineTo(iconX - iconSize, nodeY + iconSize / 2)
          ctx.lineTo(iconX - iconSize, nodeY - iconSize / 2)
          ctx.closePath()
          ctx.fill()
          break
          
        case "Briefcase":
          // Briefcase icon
          ctx.fillRect(iconX - iconSize, nodeY - iconSize / 2, iconSize * 2, iconSize * 1.5)
          ctx.fillRect(iconX - iconSize / 2, nodeY - iconSize, iconSize, iconSize / 2)
          break
          
        case "FileCheck":
          // FileCheck icon
          ctx.fillRect(iconX - iconSize, nodeY - iconSize, iconSize * 2, iconSize * 2)
          ctx.strokeStyle = isHovered ? '#F59E0B' : '#0066CC'
          ctx.lineWidth = 0.5
          ctx.strokeRect(iconX - iconSize, nodeY - iconSize, iconSize * 2, iconSize * 2)
          // Checkmark
          ctx.beginPath()
          ctx.moveTo(iconX - iconSize / 2, nodeY)
          ctx.lineTo(iconX, nodeY + iconSize / 2)
          ctx.lineTo(iconX + iconSize, nodeY - iconSize / 2)
          ctx.strokeStyle = isHovered ? '#F59E0B' : '#0066CC'
          ctx.lineWidth = 1
          ctx.stroke()
          break
          
        case "User":
          // User icon
          ctx.beginPath()
          ctx.arc(iconX, nodeY - iconSize / 2, iconSize / 2, 0, Math.PI * 2)
          ctx.fill()
          // Body
          ctx.beginPath()
          ctx.moveTo(iconX - iconSize, nodeY + iconSize)
          ctx.lineTo(iconX + iconSize, nodeY + iconSize)
          ctx.lineTo(iconX + iconSize / 2, nodeY)
          ctx.lineTo(iconX - iconSize / 2, nodeY)
          ctx.closePath()
          ctx.fill()
          break
          
        case "Mail":
          // Mail icon
          ctx.fillRect(iconX - iconSize, nodeY - iconSize, iconSize * 2, iconSize * 2)
          // Envelope triangle
          ctx.beginPath()
          ctx.moveTo(iconX - iconSize, nodeY - iconSize)
          ctx.lineTo(iconX + iconSize, nodeY - iconSize)
          ctx.lineTo(iconX, nodeY)
          ctx.closePath()
          ctx.strokeStyle = isHovered ? '#F59E0B' : '#0066CC'
          ctx.lineWidth = 0.5
          ctx.stroke()
          break
          
        case "Calendar":
          // Calendar icon
          ctx.fillRect(iconX - iconSize, nodeY - iconSize, iconSize * 2, iconSize * 2)
          ctx.strokeStyle = isHovered ? '#F59E0B' : '#0066CC'
          ctx.lineWidth = 0.5
          ctx.strokeRect(iconX - iconSize, nodeY - iconSize, iconSize * 2, iconSize * 2)
          // Calendar bars
          ctx.fillStyle = isHovered ? '#F59E0B' : '#0066CC'
          ctx.fillRect(iconX - iconSize + 1, nodeY - iconSize * 0.5, iconSize * 0.5, 1)
          ctx.fillRect(iconX + iconSize * 0.5 - 1, nodeY - iconSize * 0.5, iconSize * 0.5, 1)
          ctx.fillRect(iconX - iconSize + 1, nodeY, iconSize * 0.5, 1)
          ctx.fillRect(iconX + iconSize * 0.5 - 1, nodeY, iconSize * 0.5, 1)
          ctx.fillStyle = 'white'
          break
          
        default:
          // Fallback dot
          ctx.beginPath()
          ctx.arc(iconX, nodeY, 2, 0, Math.PI * 2)
          ctx.fill()
      }
    })
  }, [canvasSize, visibleNodes, hoveredNode])
  
  // Initialize animations and event handlers when component mounts
  useEffect(() => {
    // The roundRect polyfill is now loaded via script tag in layout.tsx
    
    if (!inView) return
    
    console.log('Node visualization entered viewport, initializing...')
    
    // Clear previous animation timeouts
    if (animationRef.current) clearTimeout(animationRef.current)
    if (outputAnimationRef.current) clearTimeout(outputAnimationRef.current)
    
    // Reset state
    setVisibleNodes([])
    setAnimationComplete(false)
    
    // Initialize with resize for proper dimensions
    handleResize()
    
    // Log canvas capabilities for debugging
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        console.log('Canvas context obtained successfully')
        console.log('Canvas roundRect support:', typeof ctx.roundRect !== 'undefined')
        console.log('Canvas filter support:', typeof ctx.filter !== 'undefined')
      } else {
        console.warn('Failed to get canvas context')
      }
    }
    
    // Add window resize listener
    window.addEventListener('resize', handleResize)
    
    // Start the animation sequence after a short delay
    console.log('Starting node animation sequence...')
    setTimeout(() => {
      animateNodesSequentially()
    }, 100)
    
    return () => {
      console.log('Cleaning up node visualization resources')
      // Clean up animations and event listeners
      window.removeEventListener('resize', handleResize)
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      
      if (animationRef.current) {
        clearTimeout(animationRef.current)
        animationRef.current = null
      }
      
      if (outputAnimationRef.current) {
        clearTimeout(outputAnimationRef.current)
        outputAnimationRef.current = null
      }
    }
  }, [handleResize, animateNodesSequentially, inView])
  
  // Start the output animation cycle when node animation completes
  useEffect(() => {
    if (animationComplete && inView) {
      outputAnimationRef.current = setTimeout(() => {
        animateOutputsSequentially()
      }, 100)
    }
    
    return () => {
      if (outputAnimationRef.current) {
        clearTimeout(outputAnimationRef.current)
      }
    }
  }, [animationComplete, animateOutputsSequentially, inView])
  
  // Main rendering loop
  useEffect(() => {
    if (!inView) return
    
    // Start render loop
    renderCanvas()
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [renderCanvas, inView])
  
  // Only trigger redraws when needed to optimize performance
  useEffect(() => {
    needsRedraw.current = true
  }, [hoveredNode, visibleNodes, animationComplete, currentOutput, outputAnimationPhase])
  
  return (
    <div 
      ref={containerRef} 
      className="w-full relative mt-2"
      aria-label="Interactive node visualization of AI agent capabilities"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-[450px]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-hidden="true"
        style={{ maxWidth: '100%', margin: '0 auto' }}
      />
      
      {/* Fallback for non-JS environments or canvas errors */}
      <noscript>
        <div className="w-full h-[450px] bg-gray-100 flex items-center justify-center">
          <p>This visualization requires JavaScript to display.</p>
        </div>
      </noscript>
      
      {/* Explicit dimensions for iOS WebKit */}
      <div 
        className="hidden"
        style={{ position: 'absolute', width: '1000px', height: '450px', top: 0, left: '-2000px' }}
        aria-hidden="true"
      />
    </div>
  )
}

OptimizedNodeVisualization.displayName = 'OptimizedNodeVisualization'

export default memo(OptimizedNodeVisualization)