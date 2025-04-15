"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import {
  FileText,
  Shield,
  Briefcase,
  FileCheck,
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Calendar,
  ShieldCheck,
  HeartPulse,
  Clock,
  Award,
} from "lucide-react"
import OptimizedNodeVisualization from "./optimized-node-visualization"

export default function Hero() {
  // No state required here - all complexity moved to the optimized component

  return (
    <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-b from-[#f8faff] to-white">
      <div className="container px-4 sm:px-6 md:px-8 lg:px-12 mx-auto max-w-[110rem]">
        <div className="bg-white rounded-2xl shadow-[0_20px_80px_-10px_rgba(0,124,255,0.15)] border border-[#e6e6e6]/60 px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 py-8 sm:py-10 md:py-12 lg:py-14 backdrop-blur-sm bg-opacity-95">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 max-w-full items-center">
            {/* Texto principal a la izquierda */}
            <div className="lg:w-[45%] flex flex-col justify-center">
              <div className="relative">
                <div className="absolute -left-8 -top-8 w-32 h-32 bg-gradient-radial from-[#f0f7ff]/80 via-[#e6f0ff]/30 to-transparent rounded-full blur-2xl opacity-70"></div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl relative z-10">
                  <span className="text-gray-800">Transform Sales Communication</span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0054B4] to-[#007CFF]">Into Strategic Advantage</span>
                </h1>
              </div>
              <p className="mt-3 text-gray-600 max-w-[600px] text-base leading-relaxed">
                Our AI assistant analyzes conversations and delivers perfect follow-ups, increasing close rates by 25%
                and boosting productivity by 50%
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Link
                  href="#demo"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-[#0060CF] to-[#007CFF] px-8 text-sm font-medium text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 hover:from-[#0058BF] hover:to-[#0072E8]"
                >
                  Request a consultation
                </Link>
                <Link
                  href="#waitlist"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-[#E1E7F2] bg-white px-8 text-sm font-medium text-[#0054A3] shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#F5F8FF]"
                >
                  Join waitlist
                </Link>
              </div>
            </div>

            {/* Diagrama radial a la derecha */}
            <div className="lg:w-[55%] relative">
               <div className="absolute -right-8 -bottom-12 w-40 h-40 bg-gradient-radial from-[#f0f7ff]/80 via-[#e6f0ff]/30 to-transparent rounded-full blur-3xl opacity-60 z-0"></div>
              <div className="relative scale-100 transform lg:-translate-x-6">
                <div className="relative mb-2 z-10">
                  {/* Fondo con degradado y efecto de vidrio para integrar los botones con el diagrama */}
                  <div className="absolute inset-0 -bottom-12 rounded-3xl bg-gradient-to-b from-[#F0F7FF]/90 to-white/40 backdrop-blur-sm z-[-1]"></div>
                  
                  {/* Borde decorativo que conecta visualmente con el diagrama */}
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-[#007CFF]/50"></div>
                  
                  {/* Líneas decorativas laterales */}
                  <div className="absolute top-1/2 left-[15%] transform -translate-y-1/2 w-[5%] h-0.5 bg-gradient-to-r from-[#007CFF]/0 to-[#007CFF]/40"></div>
                  <div className="absolute top-1/2 right-[15%] transform -translate-y-1/2 w-[5%] h-0.5 bg-gradient-to-l from-[#007CFF]/0 to-[#007CFF]/40"></div>
                  
                  <div className="flex justify-center gap-8 py-4 relative">
                    <div className="border-2 border-[#0054B4] rounded-xl px-8 py-3 text-center bg-gradient-to-b from-white to-[#f0f7ff] shadow-md flex items-center justify-center">
                      <div className="w-6 h-6 bg-[#0054B4] rounded-full flex items-center justify-center text-white mr-2">
                        <FileText className="w-3 h-3" />
                      </div>
                      <span className="text-[#0054B4] font-bold text-sm tracking-wide uppercase">ACCOUNT INFORMATION</span>
                    </div>
                    <div className="border-2 border-[#0054B4] rounded-xl px-8 py-3 text-center bg-gradient-to-b from-white to-[#f0f7ff] shadow-md flex items-center justify-center">
                      <div className="w-6 h-6 bg-[#0054B4] rounded-full flex items-center justify-center text-white mr-2">
                        <Briefcase className="w-3 h-3" />
                      </div>
                      <span className="text-[#0054B4] font-bold text-sm tracking-wide uppercase">COMPANY INFORMATION</span>
                    </div>
                  </div>
                </div>

                {/* Integrated Visualization with Mind Map */}
                <div className="hidden md:block relative mt-2">
                  {/* Import OptimizedNodeVisualization for better performance */}
                  <div className="w-full relative overflow-visible">
                    <OptimizedNodeVisualization />
                  </div>
                </div>

                {/* Mobile Optimized Layout - Using the same optimized component */}
                <div className="md:hidden mt-8">
                  <div className="w-full">
                    <OptimizedNodeVisualization />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
