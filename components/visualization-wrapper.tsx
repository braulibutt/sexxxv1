"use client"

import dynamic from 'next/dynamic'

// Use the optimized canvas visualization without external dependencies
const OptimizedVisualization = dynamic(() => import('@/components/optimized-visualization'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] flex items-center justify-center bg-[#f8faff] rounded-xl">
      <div className="text-[#0054B4] opacity-60">Loading visualization...</div>
    </div>
  )
})

export default function VisualizationWrapper() {
  return (
    <div className="w-full">
      <OptimizedVisualization />
    </div>
  )
}