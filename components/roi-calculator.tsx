"use client"

import type React from "react"
import { useState, useEffect } from "react"

export default function ROICalculator() {
  // Form state
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

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Calculate ROI with animations
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsCalculating(true)

    // Reset animated values
    setAnimatedValues({
      revenue: 0,
      hours: 0,
      productivity: 0,
      impact: 0,
    })

    // Parse numeric values
    const reps = Number.parseInt(formData.reps.toString()) || 0
    const dealsPerMonth = Number.parseInt(formData.dealsPerMonth.toString()) || 0
    const avgDealSize = Number.parseInt(formData.avgDealSize.toString()) || 0
    const adminHours = Number.parseInt(formData.adminHours.toString()) || 0

    // Calculate metrics
    const additionalDeals = Math.round(dealsPerMonth * reps * 0.25)
    const annualRevenue = additionalDeals * avgDealSize * 12
    const hoursReclaimed = Math.round(adminHours * reps * 0.25 * 4)
    const fiveYearImpact = annualRevenue * 5

    // Set final results
    setResults({
      additionalDeals,
      annualRevenue,
      hoursReclaimed,
      fiveYearImpact,
    })
  }

  // Initialize with default results
  useEffect(() => {
    // Calculate initial results
    const reps = Number.parseInt(formData.reps.toString()) || 0
    const dealsPerMonth = Number.parseInt(formData.dealsPerMonth.toString()) || 0
    const avgDealSize = Number.parseInt(formData.avgDealSize.toString()) || 0
    const adminHours = Number.parseInt(formData.adminHours.toString()) || 0

    const additionalDeals = Math.round(dealsPerMonth * reps * 0.25)
    const annualRevenue = additionalDeals * avgDealSize * 12
    const hoursReclaimed = Math.round(adminHours * reps * 0.25 * 4)
    const fiveYearImpact = annualRevenue * 5

    // Set initial results
    setResults({
      additionalDeals,
      annualRevenue,
      hoursReclaimed,
      fiveYearImpact,
    })

    // Set animated values to final values
    setAnimatedValues({
      revenue: annualRevenue,
      hours: hoursReclaimed,
      productivity: 50,
      impact: fiveYearImpact,
    })
  }, [])

  // Animate growing numbers effect
  useEffect(() => {
    if (results && isCalculating) {
      // Animation duration in ms
      const duration = 1500
      const frames = 80
      const interval = duration / frames

      let frame = 0
      let currentValues = {
        revenue: 0,
        hours: 0,
        productivity: 0,
        impact: 0,
      }

      const timer = setInterval(() => {
        frame++

        // Calculate progress with cubic-bezier easing for premium feel
        const progress = Math.min(frame / frames, 1)
        const easedProgress = 1 - Math.pow(1 - progress, 3)

        // Update animated values with easing
        currentValues = {
          revenue: Math.round(easedProgress * results.annualRevenue),
          hours: Math.round(easedProgress * results.hoursReclaimed),
          productivity: Math.round(easedProgress * 50), // Fixed 50% productivity
          impact: Math.round(easedProgress * results.fiveYearImpact),
        }

        // Update state with new values
        setAnimatedValues(currentValues)

        // End animation
        if (frame >= frames) {
          clearInterval(timer)
          setIsCalculating(false)
        }
      }, interval)

      return () => clearInterval(timer)
    }
  }, [results, isCalculating])

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <section className="py-16 md:py-24 w-full relative bg-gradient-to-b from-[#f8faff] to-white" id="roi-calculator">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#f0f7ff]/80 to-transparent pointer-events-none"></div>
      <div className="absolute -top-10 right-10 w-64 h-64 bg-gradient-radial from-[#007CFF]/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-40 left-20 w-96 h-96 bg-gradient-radial from-[#007CFF]/5 to-transparent rounded-full blur-3xl"></div>

      <div className="container px-4 sm:px-6 md:px-8 lg:px-12 mx-auto max-w-[110rem]">
        <div className="bg-white rounded-2xl shadow-[0_20px_80px_-10px_rgba(0,124,255,0.15)] border border-[#e6e6e6]/60 backdrop-blur-sm bg-opacity-95 overflow-hidden">
          {/* Header with gradient accent */}
          <div className="relative bg-gradient-to-r from-[#001240] to-[#003399] py-12 px-8 sm:px-12 md:px-16">
            <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5 mix-blend-overlay"></div>
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                Calculate Your Revenue Intelligence ROI
              </h2>
              <p className="text-lg leading-relaxed text-white/80 max-w-[720px] mx-auto font-light">
                See exactly how our AI assistant can transform your sales metrics and boost your bottom line
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
              {/* Left Column - Team Details */}
              <div className="lg:w-2/5 xl:w-1/3">
                <div className="bg-gradient-to-b from-[#f8faff] to-white rounded-xl p-6 border border-[#e6e6e6]/80 shadow-sm">
                  <h3 className="text-xl font-semibold text-[#001240] mb-6 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-br from-[#0060CF] to-[#007CFF] rounded-md flex items-center justify-center text-white mr-3 shadow-md">
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
                      <label htmlFor="reps" className="text-[15px] font-medium text-[#001240] mb-2 block">
                        Number of Sales Reps
                      </label>
                      <input
                        id="reps"
                        name="reps"
                        type="number"
                        min="1"
                        value={formData.reps}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-lg border border-[#e1e7f2] focus:outline-none focus:ring-2 focus:ring-[#007CFF] focus:border-transparent shadow-sm"
                      />
                      <p className="text-[13px] text-[#6b7280] mt-2 ml-1">Team members involved in sales</p>
                    </div>

                    {/* Deals Per Month */}
                    <div>
                      <label htmlFor="dealsPerMonth" className="text-[15px] font-medium text-[#001240] mb-2 block">
                        Deals Per Month
                      </label>
                      <input
                        id="dealsPerMonth"
                        name="dealsPerMonth"
                        type="number"
                        min="1"
                        value={formData.dealsPerMonth}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-lg border border-[#e1e7f2] focus:outline-none focus:ring-2 focus:ring-[#007CFF] focus:border-transparent shadow-sm"
                      />
                      <p className="text-[13px] text-[#6b7280] mt-2 ml-1">Average deals closed monthly per rep</p>
                    </div>

                    {/* Average Deal Size */}
                    <div>
                      <label htmlFor="avgDealSize" className="text-[15px] font-medium text-[#001240] mb-2 block">
                        Average Deal Size
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-[14px] text-[#6b7280]">$</span>
                        <input
                          id="avgDealSize"
                          name="avgDealSize"
                          type="number"
                          min="1000"
                          value={formData.avgDealSize}
                          onChange={handleChange}
                          className="w-full h-12 px-4 pl-8 rounded-lg border border-[#e1e7f2] focus:outline-none focus:ring-2 focus:ring-[#007CFF] focus:border-transparent shadow-sm"
                        />
                      </div>
                      <p className="text-[13px] text-[#6b7280] mt-2 ml-1">Value of typical contract</p>
                    </div>

                    {/* Admin Hours Per Week */}
                    <div>
                      <label htmlFor="adminHours" className="text-[15px] font-medium text-[#001240] mb-2 block">
                        Admin Hours Per Week
                      </label>
                      <input
                        id="adminHours"
                        name="adminHours"
                        type="number"
                        min="1"
                        value={formData.adminHours}
                        onChange={handleChange}
                        className="w-full h-12 px-4 rounded-lg border border-[#e1e7f2] focus:outline-none focus:ring-2 focus:ring-[#007CFF] focus:border-transparent shadow-sm"
                      />
                      <p className="text-[13px] text-[#6b7280] mt-2 ml-1">Hours spent on non-selling activities</p>
                    </div>

                    {/* Calculate ROI Button */}
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="h-12 w-full bg-gradient-to-r from-[#0060CF] to-[#007CFF] text-white rounded-lg hover:shadow-lg hover:from-[#0058BF] hover:to-[#0072E8] transition-all font-medium shadow-md mt-4 flex items-center justify-center"
                    >
                      <span className="mr-2">Calculate Your ROI</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Results */}
              <div className="lg:w-3/5 xl:w-2/3">
                {results && (
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#0060CF] to-[#007CFF] rounded-full flex items-center justify-center text-white shadow-md mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#001240]">Your Revenue Intelligence Impact</h3>
                        <p className="text-sm text-[#6b7280]">Based on your input, here's how we can transform your business</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Annual Revenue Card */}
                      <div className="bg-gradient-to-b from-[#f8faff] to-white rounded-xl border border-[#e1e7f2] overflow-hidden transition-all duration-300 hover:shadow-lg group">
                        <div className="h-2 bg-gradient-to-r from-[#0060CF] to-[#007CFF]"></div>
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <h4 className="text-[15px] font-semibold text-[#001240] group-hover:text-[#007CFF] transition-colors">
                              Annual Revenue Gain
                            </h4>
                            <div className="w-8 h-8 bg-[#f0f7ff] rounded-full flex items-center justify-center text-[#007CFF]">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="1" x2="12" y2="23"></line>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                              </svg>
                            </div>
                          </div>
                          <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mt-4 tracking-tight">
                            {formatCurrency(animatedValues.revenue)}
                          </div>
                          <div className="flex items-center mt-3">
                            <div className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                <polyline points="17 6 23 6 23 12"></polyline>
                              </svg>
                              <span>{results.additionalDeals} deals</span>
                            </div>
                            <p className="text-[13px] text-[#6b7280]">additional deals per year</p>
                          </div>
                        </div>
                      </div>

                      {/* Hours Saved Card */}
                      <div className="bg-gradient-to-b from-[#f8faff] to-white rounded-xl border border-[#e1e7f2] overflow-hidden transition-all duration-300 hover:shadow-lg group">
                        <div className="h-2 bg-gradient-to-r from-[#0060CF] to-[#007CFF]"></div>
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <h4 className="text-[15px] font-semibold text-[#001240] group-hover:text-[#007CFF] transition-colors">
                              Hours Saved Monthly
                            </h4>
                            <div className="w-8 h-8 bg-[#f0f7ff] rounded-full flex items-center justify-center text-[#007CFF]">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                              </svg>
                            </div>
                          </div>
                          <div className="flex items-baseline mt-4">
                            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 tracking-tight">
                              {animatedValues.hours}
                            </div>
                            <div className="text-xl ml-2 text-amber-500 font-semibold">hrs/mo</div>
                          </div>
                          <p className="text-[13px] text-[#6b7280] mt-3">
                            That's <span className="font-semibold">{animatedValues.hours * 12}</span> hours saved annually
                          </p>
                        </div>
                      </div>

                      {/* Productivity Card */}
                      <div className="bg-gradient-to-b from-[#f8faff] to-white rounded-xl border border-[#e1e7f2] overflow-hidden transition-all duration-300 hover:shadow-lg group">
                        <div className="h-2 bg-gradient-to-r from-[#0060CF] to-[#007CFF]"></div>
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <h4 className="text-[15px] font-semibold text-[#001240] group-hover:text-[#007CFF] transition-colors">
                              Productivity Boost
                            </h4>
                            <div className="w-8 h-8 bg-[#f0f7ff] rounded-full flex items-center justify-center text-[#007CFF]">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                              </svg>
                            </div>
                          </div>
                          <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mt-4 tracking-tight">
                            +{animatedValues.productivity}%
                          </div>
                          <div className="flex items-center mt-3">
                            <div className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">Efficiency</div>
                            <p className="text-[13px] text-[#6b7280]">More time for revenue-generating activities</p>
                          </div>
                        </div>
                      </div>

                      {/* 5-Year Impact Card */}
                      <div className="bg-gradient-to-b from-[#f8faff] to-white rounded-xl border border-[#e1e7f2] overflow-hidden transition-all duration-300 hover:shadow-lg group">
                        <div className="h-2 bg-gradient-to-r from-[#0060CF] to-[#007CFF]"></div>
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <h4 className="text-[15px] font-semibold text-[#001240] group-hover:text-[#007CFF] transition-colors">
                              5-Year Revenue Impact
                            </h4>
                            <div className="w-8 h-8 bg-[#f0f7ff] rounded-full flex items-center justify-center text-[#007CFF]">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
                              </svg>
                            </div>
                          </div>
                          <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mt-4 tracking-tight">
                            {formatCurrency(animatedValues.impact)}
                          </div>
                          <p className="text-[13px] text-[#6b7280] mt-3">
                            Compound effect of improved sales efficiency
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* CTA Area */}
                    <div className="mt-8 bg-gradient-to-r from-[#001240] to-[#002466] rounded-xl p-6 shadow-md relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5 mix-blend-overlay"></div>
                      <div className="relative z-10">
                        <h4 className="text-white text-lg font-semibold mb-2">Ready to transform your sales process?</h4>
                        <p className="text-white/70 text-sm mb-4">Join the growing number of companies achieving these results</p>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                          <a href="#demo" className="px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 rounded-lg text-white font-medium hover:shadow-lg transition-all flex items-center justify-center whitespace-nowrap">
                            <span>Schedule a Demo</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                              <circle cx="12" cy="12" r="10"></circle>
                              <polygon points="10 8 16 12 10 16 10 8"></polygon>
                            </svg>
                          </a>
                          <a href="#contact" className="px-5 py-3 border border-white/30 bg-white/10 backdrop-blur-sm rounded-lg text-white font-medium hover:bg-white/20 transition-all flex items-center justify-center whitespace-nowrap">
                            <span>Contact Sales</span>
                          </a>
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

