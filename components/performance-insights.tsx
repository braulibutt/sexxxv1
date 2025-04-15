"use client"

import { useEffect, useRef, useState } from "react"

export default function PerformanceInsights() {
  const [animatedValues, setAnimatedValues] = useState({
    productivity: 0,
    revenue: 0
  })
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // Check if section is in viewport to trigger animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        root: null,
        threshold: 0.2,
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.disconnect()
      }
    }
  }, [])

  // Animate the values when section becomes visible
  useEffect(() => {
    if (!isVisible) return

    // Animate values growing effect
    const duration = 1500
    const frames = 60
    const interval = duration / frames
    
    let frame = 0
    const timer = setInterval(() => {
      frame++
      
      // Easing function for smooth animation
      const progress = Math.min(frame / frames, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      
      setAnimatedValues({
        productivity: Math.round(easedProgress * 50),
        revenue: Math.round(easedProgress * 25)
      })
      
      if (frame >= frames) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [isVisible])

  return (
    <section ref={sectionRef} className="py-16 md:py-20 w-full relative bg-gradient-to-b from-[#f8faff] to-white" id="performance-insights">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#f8faff] to-transparent pointer-events-none"></div>
      <div className="absolute -top-10 right-10 w-64 h-64 bg-gradient-radial from-[#007CFF]/5 to-transparent rounded-full blur-3xl"></div>

      <div className="container px-4 sm:px-6 md:px-8 lg:px-12 mx-auto max-w-[110rem]">
        <div className="bg-white rounded-2xl shadow-[0_20px_80px_-10px_rgba(0,124,255,0.15)] border border-[#e6e6e6]/60 px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 py-12 md:py-14 backdrop-blur-sm bg-opacity-95">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0054B4] to-[#007CFF]">
                  AI-Powered Performance Gains
                </span>
              </h2>
              <p className="text-gray-600 max-w-[800px] mx-auto text-lg leading-relaxed">
                Our AI transforms how your team works, optimizing time-consuming activities and 
                delivering measurable results to your bottom line.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Productivity Gain */}
              <div className="relative bg-gradient-to-b from-[#f8faff] to-white rounded-xl border border-[#e1e7f2] overflow-hidden p-6 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-[#001240]">Productivity Gain</h3>
                  <div className="w-12 h-12 bg-gradient-to-r from-[#0054B4] to-[#007CFF] rounded-full flex items-center justify-center text-white shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                  </div>
                </div>
                
                <div className="mb-2 flex items-baseline">
                  <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0054B4] to-[#007CFF]">
                    +{animatedValues.productivity}%
                  </span>
                </div>
                
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
                  <div 
                    className="h-full bg-gradient-to-r from-[#0054B4] to-[#007CFF] transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${animatedValues.productivity * 2}%`,
                    }}
                  ></div>
                </div>
                
                <p className="text-gray-600">
                  Our AI assistant automates administrative tasks, meeting prep, and follow-ups, 
                  allowing your team to focus on high-value client interactions.
                </p>
              </div>

              {/* Revenue Impact */}
              <div className="relative bg-gradient-to-b from-[#f8faff] to-white rounded-xl border border-[#e1e7f2] overflow-hidden p-6 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-[#001240]">Revenue Impact</h3>
                  <div className="w-12 h-12 bg-gradient-to-r from-[#0054B4] to-[#007CFF] rounded-full flex items-center justify-center text-white shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                </div>
                
                <div className="mb-2 flex items-baseline">
                  <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0054B4] to-[#007CFF]">
                    +{animatedValues.revenue}%
                  </span>
                </div>
                
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
                  <div 
                    className="h-full bg-gradient-to-r from-[#0060CF] to-[#0092FF] transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${animatedValues.revenue * 4}%`,
                    }}
                  ></div>
                </div>
                
                <p className="text-gray-600">
                  Increased close rates and faster sales cycles translate directly to revenue growth, 
                  with clients seeing an average 25% boost in quarterly results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}