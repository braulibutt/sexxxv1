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
    <section className="py-16 min-h-screen flex items-center" id="roi-calculator">
      <div className="container px-4 md:px-8 mx-auto w-full">
        <div className="bg-[#f0f7ff] p-8 md:p-12 rounded-2xl shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-2">
              Calculate Your Revenue Intelligence ROI
            </h2>
            <p className="text-[17px] leading-[1.47] text-[#86868b] max-w-[680px] mx-auto">
              Our AI doesn't just find leads—it identifies the exact signals that predict buying behavior with uncanny
              precision
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Team Details */}
              <div className="lg:w-1/3">
                <h3 className="text-xl font-medium text-[#1d1d1f] mb-6">Your Team Details</h3>

                <div className="space-y-6">
                  {/* Number of Sales Reps */}
                  <div>
                    <label htmlFor="reps" className="text-[16px] font-medium text-[#1d1d1f] mb-2 block">
                      Number of Sales Reps
                    </label>
                    <input
                      id="reps"
                      name="reps"
                      type="number"
                      min="1"
                      value={formData.reps}
                      onChange={handleChange}
                      className="w-full h-[44px] px-4 rounded-md border border-[#d2d2d7] focus:outline-none focus:ring-2 focus:ring-[#007CFF]"
                    />
                    <p className="text-[14px] text-[#86868b] mt-2">Team members involved in sales</p>
                  </div>

                  {/* Deals Per Month */}
                  <div>
                    <label htmlFor="dealsPerMonth" className="text-[16px] font-medium text-[#1d1d1f] mb-2 block">
                      Deals Per Month
                    </label>
                    <input
                      id="dealsPerMonth"
                      name="dealsPerMonth"
                      type="number"
                      min="1"
                      value={formData.dealsPerMonth}
                      onChange={handleChange}
                      className="w-full h-[44px] px-4 rounded-md border border-[#d2d2d7] focus:outline-none focus:ring-2 focus:ring-[#007CFF]"
                    />
                    <p className="text-[14px] text-[#86868b] mt-2">Average deals closed monthly per rep</p>
                  </div>

                  {/* Average Deal Size */}
                  <div>
                    <label htmlFor="avgDealSize" className="text-[16px] font-medium text-[#1d1d1f] mb-2 block">
                      Average Deal Size
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-[12px] text-[#86868b]">$</span>
                      <input
                        id="avgDealSize"
                        name="avgDealSize"
                        type="number"
                        min="1000"
                        value={formData.avgDealSize}
                        onChange={handleChange}
                        className="w-full h-[44px] px-4 pl-8 rounded-md border border-[#d2d2d7] focus:outline-none focus:ring-2 focus:ring-[#007CFF]"
                      />
                    </div>
                    <p className="text-[14px] text-[#86868b] mt-2">Value of typical contract</p>
                  </div>

                  {/* Admin Hours Per Week */}
                  <div>
                    <label htmlFor="adminHours" className="text-[16px] font-medium text-[#1d1d1f] mb-2 block">
                      Admin Hours Per Week
                    </label>
                    <input
                      id="adminHours"
                      name="adminHours"
                      type="number"
                      min="1"
                      value={formData.adminHours}
                      onChange={handleChange}
                      className="w-full h-[44px] px-4 rounded-md border border-[#d2d2d7] focus:outline-none focus:ring-2 focus:ring-[#007CFF]"
                    />
                    <p className="text-[14px] text-[#86868b] mt-2">Hours spent on non-selling activities</p>
                  </div>

                  {/* Calculate ROI Button */}
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="h-[44px] w-full bg-[#007CFF] text-white rounded-md hover:bg-[#007CFF]/90 transition-all font-medium"
                  >
                    Activate Revenue Intelligence
                  </button>
                </div>
              </div>

              {/* Right Column - Results */}
              <div className="lg:w-2/3">
                {results && (
                  <div>
                    <h3 className="text-xl font-medium text-[#1d1d1f] mb-4">Your Revenue Intelligence Results</h3>
                    <p className="text-[16px] text-[#86868b] mb-6">On Average, Our Customers See:</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {/* Annual Revenue */}
                      <div className="bg-white border-2 border-[#e6e6e6] rounded-2xl p-10 flex flex-col items-center justify-center hover:border-[#007CFF] transition-colors duration-300 hover:shadow-lg">
                        <h4 className="text-[16px] font-medium text-[#1d1d1f] mb-2 text-center">Annual Revenue Gain</h4>
                        <div className="text-[42px] font-bold text-[#b38628] mb-2 text-center">
                          {formatCurrency(animatedValues.revenue)}
                        </div>
                        <p className="text-[14px] text-[#86868b] text-center">
                          {results.additionalDeals} additional deals uncovered
                        </p>
                      </div>

                      {/* Time Saved */}
                      <div className="bg-white border-2 border-[#e6e6e6] rounded-2xl p-10 flex flex-col items-center justify-center hover:border-[#007CFF] transition-colors duration-300 hover:shadow-lg">
                        <h4 className="text-[16px] font-medium text-[#1d1d1f] mb-2 text-center">Hours Saved Monthly</h4>
                        <div className="flex items-center justify-center">
                          <div className="text-[42px] font-bold text-[#b38628] mb-2">{animatedValues.hours}</div>
                          <div className="text-[20px] ml-2 mb-2 text-[#b38628]">hrs/mo</div>
                        </div>
                        <p className="text-[14px] text-[#86868b] text-center">Eliminate manual data entry</p>
                      </div>

                      {/* Productivity */}
                      <div className="bg-white border-2 border-[#e6e6e6] rounded-2xl p-10 flex flex-col items-center justify-center hover:border-[#007CFF] transition-colors duration-300 hover:shadow-lg">
                        <h4 className="text-[16px] font-medium text-[#1d1d1f] mb-2 text-center">Productivity Boost</h4>
                        <div className="text-[42px] font-bold text-[#b38628] mb-2 text-center">
                          {animatedValues.productivity}%
                        </div>
                        <p className="text-[14px] text-[#86868b] text-center">More time for selling activities</p>
                      </div>

                      {/* 5-Year Impact */}
                      <div className="bg-white border-2 border-[#e6e6e6] rounded-2xl p-10 flex flex-col items-center justify-center hover:border-[#007CFF] transition-colors duration-300 hover:shadow-lg">
                        <h4 className="text-[16px] font-medium text-[#1d1d1f] mb-2 text-center">
                          5-Year Revenue Impact
                        </h4>
                        <div className="text-[42px] font-bold text-[#b38628] mb-2 text-center">
                          {formatCurrency(animatedValues.impact)}
                        </div>
                        <p className="text-[14px] text-[#86868b] text-center">Compound growth effect</p>
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

