"use client"

import React, { useEffect, useRef } from 'react'

const OptimizedVisualization = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || !canvasRef.current) return
    
    // Add roundRect polyfill for browsers that don't support it
    if (typeof window !== 'undefined' && window.CanvasRenderingContext2D) {
      if (!CanvasRenderingContext2D.prototype.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = function(
          x: number, 
          y: number, 
          width: number, 
          height: number, 
          radius: number | number[]
        ) {
          if (typeof radius === 'number') {
            radius = [radius, radius, radius, radius]
          }
          
          const [tl, tr, br, bl] = radius as number[];
          this.beginPath();
          this.moveTo(x + tl, y);
          this.lineTo(x + width - tr, y);
          this.quadraticCurveTo(x + width, y, x + width, y + tr);
          this.lineTo(x + width, y + height - br);
          this.quadraticCurveTo(x + width, y + height, x + width - br, y + height);
          this.lineTo(x + bl, y + height);
          this.quadraticCurveTo(x, y + height, x, y + height - bl);
          this.lineTo(x, y + tl);
          this.quadraticCurveTo(x, y, x + tl, y);
          this.closePath();
          return this;
        };
      }
    }
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas dimensions
    const updateCanvasSize = () => {
      const container = canvas.parentElement
      if (!container) return
      
      const { width } = container.getBoundingClientRect()
      const height = 450 // Fixed height to match visualization area
      
      // Set display size (css pixels)
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      
      // Set actual size in memory (scaled for high DPI)
      const dpr = Math.min(window.devicePixelRatio || 1, 2) // Cap at 2x to prevent performance issues
      canvas.width = width * dpr
      canvas.height = height * dpr
      
      // Reset the context
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      
      // Scale the context to ensure correct drawing operations
      ctx.scale(dpr, dpr)
      
      console.log('Canvas resized to:', width, 'x', height, 'with DPR:', dpr)
      
      return { width, height }
    }
    
    const { width, height } = updateCanvasSize() || { width: 0, height: 0 }
    
    // Define nodes
    const createNodes = () => {
      // Left side nodes (Account Information)
      const leftNodes = [
        { id: 'follow-up-templates', x: 0.30, y: 0.35, size: 18 },
        { id: 'competitor-analysis', x: 0.20, y: 0.62, size: 16 },
        { id: 'technical-details', x: 0.15, y: 0.42, size: 15 },
        { id: 'faq', x: 0.10, y: 0.70, size: 14 },
        { id: 'case-studies', x: 0.12, y: 0.25, size: 16 },
        { id: 'company-research', x: 0.05, y: 0.48, size: 17 },
        { id: 'contracts', x: 0.22, y: 0.18, size: 15 },
        { id: 'white-papers', x: 0.08, y: 0.32, size: 14 },
      ]
      
      // Right side nodes (Company Information)
      const rightNodes = [
        { id: 'meeting-transcripts', x: 0.70, y: 0.35, size: 18 },
        { id: 'objection', x: 0.80, y: 0.62, size: 16 },
        { id: 'email-transcripts', x: 0.85, y: 0.42, size: 17 },
        { id: 'bant', x: 0.90, y: 0.70, size: 15 },
        { id: 'medpic', x: 0.88, y: 0.25, size: 14 },
        { id: 'stakeholder-mapping', x: 0.95, y: 0.48, size: 16 },
        { id: 'personal-information', x: 0.78, y: 0.18, size: 15 },
        { id: 'follow-up-cycles', x: 0.92, y: 0.32, size: 16 },
      ]
      
      return {
        leftNodes,
        rightNodes
      }
    }
    
    // Get real coordinates from relative positions
    const getCoordinates = (x: number, y: number, width: number, height: number) => {
      return {
        x: x * width,
        y: y * height
      }
    }
    
    const { leftNodes, rightNodes } = createNodes()
    
    // For animation
    let time = 0
    const animationSpeed = 0.0005
    
    // Draw function optimized for performance
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height)
      
      // Update time
      time += animationSpeed
      
      // Draw decorative circles
      const centerX = width / 2
      const centerY = height / 2
      
      // Draw outer circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, Math.min(width, height) * 0.45, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(0, 124, 255, 0.15)'
      ctx.lineWidth = 1
      ctx.stroke()
      
      // Draw middle circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, Math.min(width, height) * 0.35, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(0, 124, 255, 0.2)'
      ctx.lineWidth = 1
      ctx.stroke()
      
      // Draw inner circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, Math.min(width, height) * 0.25, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(0, 124, 255, 0.25)'
      ctx.lineWidth = 1
      ctx.stroke()
      
      // Draw central node
      const centerNodeWidth = 100
      const centerNodeHeight = 60
      const radius = 10
      
      // Function to draw rounded rectangle
      const drawRoundedRect = (
        x: number, 
        y: number, 
        width: number, 
        height: number, 
        radius: number
      ) => {
        ctx.beginPath()
        ctx.moveTo(x + radius, y)
        ctx.lineTo(x + width - radius, y)
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
        ctx.lineTo(x + width, y + height - radius)
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
        ctx.lineTo(x + radius, y + height)
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
        ctx.lineTo(x, y + radius)
        ctx.quadraticCurveTo(x, y, x + radius, y)
        ctx.closePath()
      }
      
      // Create glow effect for central node by drawing multiple layers
      // First draw a larger, blurred background for the glow effect
      ctx.globalAlpha = 0.3;
      for (let i = 0; i < 3; i++) {
        const glowSize = 5 + i * 3;
        drawRoundedRect(
          centerX - centerNodeWidth / 2 - glowSize,
          centerY - centerNodeHeight / 2 - glowSize,
          centerNodeWidth + glowSize * 2,
          centerNodeHeight + glowSize * 2,
          radius + glowSize
        )
        ctx.fillStyle = '#007CFF';
        ctx.fill();
      }
      
      // Reset alpha for main node
      ctx.globalAlpha = 1.0;
      
      // Draw the main central node
      drawRoundedRect(
        centerX - centerNodeWidth / 2,
        centerY - centerNodeHeight / 2,
        centerNodeWidth,
        centerNodeHeight,
        radius
      )
      
      // Fill with gradient
      try {
        const gradient = ctx.createLinearGradient(
          centerX - centerNodeWidth / 2,
          centerY,
          centerX + centerNodeWidth / 2,
          centerY
        )
        gradient.addColorStop(0, '#001240')
        gradient.addColorStop(1, '#003399')
        ctx.fillStyle = gradient
        ctx.fill()
      } catch (error) {
        ctx.fillStyle = '#001240'
        ctx.fill()
      }
      
      // Stroke with thicker line for emphasis
      ctx.lineWidth = 3
      ctx.strokeStyle = '#007CFF'
      ctx.stroke()
      
      // Draw text
      ctx.fillStyle = '#FFB74D'
      ctx.font = 'bold 20px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('CHRM.AI', centerX, centerY)
      
      // Function to draw a node
      const drawNode = (
        nodeX: number, 
        nodeY: number, 
        size: number, 
        isLeft: boolean,
        index: number
      ) => {
        // Apply subtle movement
        const offset = Math.sin(time + index * 0.5) * 2
        
        // Apply the offset in different directions based on position
        const adjustedX = nodeX + (isLeft ? -offset : offset) * 0.5
        const adjustedY = nodeY + offset * 0.5
        
        // Draw connection line to center
        ctx.beginPath()
        ctx.moveTo(adjustedX, adjustedY)
        ctx.lineTo(centerX, centerY)
        ctx.strokeStyle = 'rgba(0, 124, 255, 0.2)'
        ctx.lineWidth = 1
        ctx.stroke()
        
        // Draw node circle
        ctx.beginPath()
        ctx.arc(adjustedX, adjustedY, size, 0, Math.PI * 2)
        
        // Create gradient for node
        try {
          const nodeGradient = ctx.createLinearGradient(
            adjustedX - size,
            adjustedY - size,
            adjustedX + size,
            adjustedY + size
          )
          
          if (isLeft) {
            nodeGradient.addColorStop(0, '#0054B4')
            nodeGradient.addColorStop(1, '#007CFF')
          } else {
            nodeGradient.addColorStop(0, '#0060CF')
            nodeGradient.addColorStop(1, '#0092FF')
          }
          
          ctx.fillStyle = nodeGradient
          ctx.fill()
        } catch (error) {
          // Fallback to solid color
          ctx.fillStyle = isLeft ? '#0054B4' : '#0060CF'
          ctx.fill()
        }
        
        // Add white border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }
      
      // Draw nodes
      leftNodes.forEach((node, i) => {
        const { x, y } = getCoordinates(node.x, node.y, width, height)
        drawNode(x, y, node.size, true, i)
      })
      
      rightNodes.forEach((node, i) => {
        const { x, y } = getCoordinates(node.x, node.y, width, height)
        drawNode(x, y, node.size, false, i)
      })
      
      // Continue animation
      animationRef.current = requestAnimationFrame(draw)
    }
    
    // Start animation
    draw()
    
    // Handle window resize
    const handleResize = () => {
      const newDimensions = updateCanvasSize()
      if (newDimensions) {
        // This correctly updates the width and height variables
        Object.assign({ width, height }, newDimensions)
        
        // Clear the canvas and redraw everything with new dimensions
        if (ctx) {
          ctx.clearRect(0, 0, width, height)
          draw()
        }
      }
    }
    
    window.addEventListener('resize', handleResize)
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])
  
  return (
    <div className="w-full h-[450px] relative">
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
        style={{ maxWidth: '100%' }}
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

export default OptimizedVisualization