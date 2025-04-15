"use client"

import type React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"

export default function ROICalculator() {
  // Form state with memoized default values
  const [formData, setFormData] = useState({
    reps: 7,
    dealsPerMonth: 8,
    avgDealSize: 24999,
    adminHours: 20,
  })

  // Results and animation states
  const [results, setResults] = useState<{
    additionalDeals: number
    annualRevenue: number
    hoursReclaimed: number
    fiveYearImpact: number
  } | null>(null)

  const [animatedValues, setAnimatedValues] = useState({
    revenue: 0,
    hours: 0,
    productivity: 0,
    impact: 0,
  })

  const [isCalculating, setIsCalculating] = useState(false)

  // Handle input changes with validation - memoized for better performance
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Validate input - only set state if input is a valid number or empty
    const numValue = parseFloat(value)
    if (value === "" || (!isNaN(numValue) && numValue >= 0)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : numValue,
      }))
    }
  }, [])

  // Constants for calculations - memoized to prevent recreating on each render
  const CONSTANTS = useMemo(() => ({
    PRODUCTIVITY_IMPROVEMENT: 0.25, // 25% improvement
    MONTHS_PER_YEAR: 12,
    WEEKS_PER_MONTH: 4,
    FORECAST_YEARS: 5,
    PRODUCTIVITY_PERCENTAGE: 50 // Fixed 50% productivity
  }), [])
  
  // Calculate ROI with optimized performance - memoized for better performance
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
    // Visual feedback during calculation
    setIsCalculating(true)

    // Reset animated values
    setAnimatedValues({
      revenue: 0,
      hours: 0,
      productivity: 0,
      impact: 0,
    })

    // Parse numeric values with better type handling
    // Using Number() is more efficient than parseInt for the numeric values we have
    const reps = Number(formData.reps) || 0
    const dealsPerMonth = Number(formData.dealsPerMonth) || 0
    const avgDealSize = Number(formData.avgDealSize) || 0
    const adminHours = Number(formData.adminHours) || 0

    // Use requestAnimationFrame for the short delay instead of setTimeout
    // This syncs with the browser's rendering loop for smoother transitions
    requestAnimationFrame(() => {
      // Calculate metrics with named constants for clarity
      const additionalDeals = Math.round(dealsPerMonth * reps * CONSTANTS.PRODUCTIVITY_IMPROVEMENT)
      const annualRevenue = additionalDeals * avgDealSize * CONSTANTS.MONTHS_PER_YEAR
      const hoursReclaimed = Math.round(adminHours * reps * CONSTANTS.PRODUCTIVITY_IMPROVEMENT * CONSTANTS.WEEKS_PER_MONTH)
      const fiveYearImpact = annualRevenue * CONSTANTS.FORECAST_YEARS

      // Set final results
      setResults({
        additionalDeals,
        annualRevenue,
        hoursReclaimed,
        fiveYearImpact,
      })
    })
  }, [formData, CONSTANTS])

  // Removed empty useEffect as it's unnecessary

  // Animate growing numbers effect with improved physics using requestAnimationFrame
  useEffect(() => {
    if (!results || !isCalculating) return;
    
    // Animation duration in ms - optimized for smooth performance
    const duration = 1500
    const startTime = performance.now()
    let animationFrameId: number

    // Animation loop using requestAnimationFrame for better performance
    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)
      
      // Improved easing function with better performance characteristics
      // Using direct cubic calculations without branching for better performance
      const easedProgress = progress < 0.8
        ? 1 - Math.pow(1 - progress / 0.8, 3) // Cubic ease-out 
        : 1 + Math.sin(((progress - 0.8) / 0.2) * Math.PI) * 0.02; // Slight elastic finish
      
      // Update animated values with minimal calculations
      setAnimatedValues({
        revenue: Math.round(easedProgress * results.annualRevenue),
        hours: Math.round(easedProgress * results.hoursReclaimed),
        productivity: Math.round(easedProgress * CONSTANTS.PRODUCTIVITY_PERCENTAGE),
        impact: Math.round(easedProgress * results.fiveYearImpact),
      })

      // Continue or end animation based on progress
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate)
      } else {
        setIsCalculating(false)
      }
    }

    // Start animation
    animationFrameId = requestAnimationFrame(animate)

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [results, isCalculating, CONSTANTS])

  // Format currency with memoization to improve performance
  const formatCurrency = useCallback((amount: number) => {
    // Using a simple formatter without unnecessary options
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount)
  }, [])

  return (
    <section className="py-16 md:py-24 w-full relative bg-gradient-to-b from-[#f8faff] to-white" id="roi-calculator">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#f0f7ff]/80 to-transparent pointer-events-none"></div>
      <div className="absolute -top-10 right-10 w-64 h-64 bg-gradient-radial from-[#007CFF]/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-40 left-20 w-96 h-96 bg-gradient-radial from-[#007CFF]/5 to-transparent rounded-full blur-3xl"></div>

      <div className="container px-4 sm:px-6 md:px-8 lg:px-12 mx-auto max-w-[110rem]">
        <div className="bg-white rounded-2xl shadow-[0_20px_80px_-10px_rgba(0,124,255,0.15)] border border-[#e6e6e6]/60 backdrop-blur-sm bg-opacity-95 overflow-hidden">
          {/* Header with more subtle gradient accent */}
          <div className="relative bg-gradient-to-r from-[#002957] to-[#003e7e] py-12 px-8 sm:px-12 md:px-16">
            <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5 mix-blend-overlay"></div>
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                Calculate Your Revenue Intelligence ROI
              </h2>
              <p className="text-lg leading-relaxed text-white/90 max-w-[720px] mx-auto font-light">
                See how our AI assistant can transform your sales metrics and boost your bottom line
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
              {/* Left Column - Team Details */}
              <div className="lg:w-2/5 xl:w-1/3">
                <div className="bg-[#f8faff]/70 rounded-xl p-6 border border-[#e6e6e6]/80 shadow-sm">
                  <h3 className="text-xl font-semibold text-[#1e3a5f] mb-6 flex items-center">
                    <span className="w-8 h-8 bg-[#2c5282] rounded-md flex items-center justify-center text-white mr-3 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </span>
                    Your Team Details
                  </h3>

                  <div className="space-y-6">
                    {/* Number of Sales Reps */}
                    <div>
                      <label htmlFor="reps" className="text-[15px] font-medium text-[#1e3a5f] mb-2 block">
                        Number of Sales Reps
                      </label>
                      <input
                        id="reps"
                        name="reps"
                        type="number"
                        min="1"
                        value={formData.reps}
                        onChange={handleChange}
                        className="w-full h-11 px-4 rounded-lg border border-[#d5e0f2] focus:outline-none focus:ring-1 focus:ring-[#2c5282] focus:border-[#2c5282] shadow-sm transition-all duration-200"
                      />
                      <p className="text-[13px] text-[#5a6b82] mt-2 ml-1">Team members involved in sales</p>
                    </div>

                    {/* Deals Per Month */}
                    <div>
                      <label htmlFor="dealsPerMonth" className="text-[15px] font-medium text-[#1e3a5f] mb-2 block">
                        Deals Per Month
                      </label>
                      <input
                        id="dealsPerMonth"
                        name="dealsPerMonth"
                        type="number"
                        min="1"
                        value={formData.dealsPerMonth}
                        onChange={handleChange}
                        className="w-full h-11 px-4 rounded-lg border border-[#d5e0f2] focus:outline-none focus:ring-1 focus:ring-[#2c5282] focus:border-[#2c5282] shadow-sm transition-all duration-200"
                      />
                      <p className="text-[13px] text-[#5a6b82] mt-2 ml-1">Average deals closed monthly per rep</p>
                    </div>

                    {/* Average Deal Size */}
                    <div>
                      <label htmlFor="avgDealSize" className="text-[15px] font-medium text-[#1e3a5f] mb-2 block">
                        Average Deal Size
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-[13px] text-[#5a6b82]">$</span>
                        <input
                          id="avgDealSize"
                          name="avgDealSize"
                          type="number"
                          min="1000"
                          value={formData.avgDealSize}
                          onChange={handleChange}
                          className="w-full h-11 px-4 pl-8 rounded-lg border border-[#d5e0f2] focus:outline-none focus:ring-1 focus:ring-[#2c5282] focus:border-[#2c5282] shadow-sm transition-all duration-200"
                        />
                      </div>
                      <p className="text-[13px] text-[#5a6b82] mt-2 ml-1">Value of typical contract</p>
                    </div>

                    {/* Admin Hours Per Week */}
                    <div>
                      <label htmlFor="adminHours" className="text-[15px] font-medium text-[#1e3a5f] mb-2 block">
                        Admin Hours Per Week
                      </label>
                      <input
                        id="adminHours"
                        name="adminHours"
                        type="number"
                        min="1"
                        value={formData.adminHours}
                        onChange={handleChange}
                        className="w-full h-11 px-4 rounded-lg border border-[#d5e0f2] focus:outline-none focus:ring-1 focus:ring-[#2c5282] focus:border-[#2c5282] shadow-sm transition-all duration-200"
                      />
                      <p className="text-[13px] text-[#5a6b82] mt-2 ml-1">Hours spent on non-selling activities</p>
                    </div>

                    {/* Calculate ROI Button with loading state */}
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      disabled={isCalculating}
                      className={`h-12 w-full rounded-lg shadow-sm transition-all font-medium mt-6 flex items-center justify-center relative overflow-hidden group
                        ${isCalculating 
                          ? 'bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] text-white/80 cursor-wait' 
                          : 'bg-gradient-to-r from-[#2c5282] to-[#2c5282] hover:from-[#1e3a5f] hover:to-[#2c5282] text-white hover:shadow-md'
                        }`}
                    >
                      <span className="relative z-10 flex items-center">
                        {isCalculating ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Calculating...</span>
                          </>
                        ) : (
                          <>
                            <span className="mr-2">Calculate Your ROI</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-200">
                              <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-[#1e3a5f] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Results */}
              <div className="lg:w-3/5 xl:w-2/3">
                {!results && (
                  <div className="h-full flex flex-col items-center justify-center text-center px-6 py-12 bg-gradient-to-b from-[#f8faff] to-white rounded-xl border border-dashed border-[#d5e0f2] shadow-sm">
                    <div className="w-16 h-16 bg-gradient-to-b from-[#f0f5ff] to-[#e8f0ff] rounded-full flex items-center justify-center mb-4 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2c5282" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
                        <path d="M12 2v5"></path>
                        <path d="M6.66 4h10.68l-.67 8H7.33"></path>
                        <path d="M4 22h16"></path>
                        <path d="M10 22v-5"></path>
                        <path d="M14 22v-5"></path>
                        <path d="M8 13v2a4 4 0 0 0 8 0v-2"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-[#1e3a5f] mb-2">Your ROI Results Will Appear Here</h3>
                    <p className="text-[#5a6b82] max-w-md mb-6">Complete the form and click the calculate button to see how our AI assistant can transform your sales metrics</p>
                    <div className="flex items-center text-[#2c5282] bg-[#f0f5ff]/70 px-4 py-2 rounded-full shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                      </svg>
                      <span className="font-medium">Input your team data to start</span>
                    </div>
                  </div>
                )}
                {results && (
                  <div className="transform transition-all duration-500 animate-fadeIn">
                    <div className="flex items-center mb-6 bg-gradient-to-r from-[#f8faff] to-white p-4 rounded-lg border border-[#e1e7f2]/50 shadow-sm">
                      <div className="w-10 h-10 bg-gradient-to-b from-[#2c5282] to-[#1e3a5f] rounded-full flex items-center justify-center text-white shadow-md mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#1e3a5f]">Your Revenue Intelligence Impact</h3>
                        <p className="text-sm text-[#5a6b82]">Based on your input, here's how we can transform your business</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Annual Revenue Card */}
                      <div className="bg-gradient-to-b from-[#f8faff] to-white rounded-xl border border-[#e1e7f2] overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] group">
                        <div className="h-1 bg-gradient-to-r from-[#1e3a5f] to-[#2c5282]"></div>
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <h4 className="text-[15px] font-semibold text-[#1e3a5f] group-hover:text-[#2c5282] transition-colors">
                              Annual Revenue Gain
                            </h4>
                            <div className="w-10 h-10 bg-gradient-to-b from-[#f0f5ff] to-[#e8f0ff] rounded-full flex items-center justify-center text-[#2c5282] shadow-sm group-hover:shadow transform group-hover:scale-110 transition-all duration-300">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="1" x2="12" y2="23"></line>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                              </svg>
                            </div>
                          </div>
                          <div className="text-4xl font-bold text-[#8a682c] mt-4 tracking-tight relative">
                            <span className={`${isCalculating ? 'blur-sm' : 'blur-none'} transition-all duration-300`}>
                              {formatCurrency(animatedValues.revenue)}
                            </span>
                            {isCalculating && (
                              <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent animate-pulse"></div>
                            )}
                          </div>
                          <div className="flex items-center mt-3">
                            <div className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full flex items-center shadow-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                <polyline points="17 6 23 6 23 12"></polyline>
                              </svg>
                              <span>{results.additionalDeals} deals</span>
                            </div>
                            <p className="text-[13px] text-[#5a6b82]">additional deals per year</p>
                          </div>
                        </div>
                      </div>

                      {/* Hours Saved Card */}
                      <div className="bg-gradient-to-b from-[#f8faff] to-white rounded-xl border border-[#e1e7f2] overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] group">
                        <div className="h-1 bg-gradient-to-r from-[#1e3a5f] to-[#2c5282]"></div>
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <h4 className="text-[15px] font-semibold text-[#1e3a5f] group-hover:text-[#2c5282] transition-colors">
                              Hours Saved Monthly
                            </h4>
                            <div className="w-10 h-10 bg-gradient-to-b from-[#f0f5ff] to-[#e8f0ff] rounded-full flex items-center justify-center text-[#2c5282] shadow-sm group-hover:shadow transform group-hover:scale-110 transition-all duration-300">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                              </svg>
                            </div>
                          </div>
                          <div className="flex items-baseline mt-4 relative">
                            <div className={`text-4xl font-bold text-[#8a682c] tracking-tight ${isCalculating ? 'blur-sm' : 'blur-none'} transition-all duration-300`}>
                              {animatedValues.hours}
                            </div>
                            <div className={`text-xl ml-2 text-[#8a682c] font-medium ${isCalculating ? 'blur-sm' : 'blur-none'} transition-all duration-300`}>hrs/mo</div>
                            {isCalculating && (
                              <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent animate-pulse"></div>
                            )}
                          </div>
                          <p className="text-[13px] text-[#5a6b82] mt-3">
                            That's <span className="font-semibold">{animatedValues.hours * 12}</span> hours saved annually
                          </p>
                        </div>
                      </div>

                      {/* Productivity Card */}
                      <div className="bg-gradient-to-b from-[#f8faff] to-white rounded-xl border border-[#e1e7f2] overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] group">
                        <div className="h-1 bg-gradient-to-r from-[#1e3a5f] to-[#2c5282]"></div>
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <h4 className="text-[15px] font-semibold text-[#1e3a5f] group-hover:text-[#2c5282] transition-colors">
                              Productivity Boost
                            </h4>
                            <div className="w-10 h-10 bg-gradient-to-b from-[#f0f5ff] to-[#e8f0ff] rounded-full flex items-center justify-center text-[#2c5282] shadow-sm group-hover:shadow transform group-hover:scale-110 transition-all duration-300">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                              </svg>
                            </div>
                          </div>
                          <div className="text-4xl font-bold text-[#8a682c] mt-4 tracking-tight relative">
                            <span className={`${isCalculating ? 'blur-sm' : 'blur-none'} transition-all duration-300`}>
                              +{animatedValues.productivity}%
                            </span>
                            {isCalculating && (
                              <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent animate-pulse"></div>
                            )}
                          </div>
                          <div className="flex items-center mt-3">
                            <div className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full shadow-sm">Efficiency</div>
                            <p className="text-[13px] text-[#5a6b82]">More time for revenue-generating activities</p>
                          </div>
                        </div>
                      </div>

                      {/* 5-Year Impact Card */}
                      <div className="bg-gradient-to-b from-[#f8faff] to-white rounded-xl border border-[#e1e7f2] overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] group">
                        <div className="h-1 bg-gradient-to-r from-[#1e3a5f] to-[#2c5282]"></div>
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <h4 className="text-[15px] font-semibold text-[#1e3a5f] group-hover:text-[#2c5282] transition-colors">
                              5-Year Revenue Impact
                            </h4>
                            <div className="w-10 h-10 bg-gradient-to-b from-[#f0f5ff] to-[#e8f0ff] rounded-full flex items-center justify-center text-[#2c5282] shadow-sm group-hover:shadow transform group-hover:scale-110 transition-all duration-300">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
                              </svg>
                            </div>
                          </div>
                          <div className="text-4xl font-bold text-[#8a682c] mt-4 tracking-tight relative">
                            <span className={`${isCalculating ? 'blur-sm' : 'blur-none'} transition-all duration-300`}>
                              {formatCurrency(animatedValues.impact)}
                            </span>
                            {isCalculating && (
                              <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent animate-pulse"></div>
                            )}
                          </div>
                          <p className="text-[13px] text-[#5a6b82] mt-3">
                            Compound effect of improved sales efficiency
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* CTA Area - Optimized with fewer gradients and transforms for better performance */}
                    <div className="mt-8 bg-[#001e44] rounded-xl p-8 shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5 mix-blend-overlay"></div>
                      
                      <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div>
                            <h4 className="text-white text-xl font-semibold mb-2">Ready to transform your sales process?</h4>
                            <p className="text-white/80 text-sm mb-4 max-w-md">Join the growing number of companies achieving these results with our intelligent ROI solution</p>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-4">
                            <a 
                              href="#demo" 
                              className="px-6 py-3 bg-[#c19932] rounded-lg text-white font-medium shadow-md hover:shadow-xl transition-all flex items-center justify-center whitespace-nowrap"
                              aria-label="Schedule a Demo"
                            >
                              <span className="flex items-center">
                                <span>Schedule a Demo</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 transition-transform duration-200">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                                </svg>
                              </span>
                            </a>
                            <a 
                              href="#contact" 
                              className="px-6 py-3 border border-white/30 bg-white/10 rounded-lg text-white font-medium hover:bg-white/20 transition-all flex items-center justify-center whitespace-nowrap"
                              aria-label="Contact Sales"
                            >
                              <span>Contact Sales</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

