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

export default function Hero() {
  // Contenedor con padding responsivo
  const containerStyles = {
    padding: '1rem',
  }
  // Estilos para los gradientes del fondo
  const gradientStyles = {
    backgroundImage: `
      radial-gradient(circle at 30% 20%, rgb(0, 79, 249), transparent 40%),
      radial-gradient(circle at 70% 80%, rgba(7, 231, 89, 0.15), transparent 40%),
      linear-gradient(120deg, rgba(224, 242, 254, 0.2), rgba(240, 253, 244, 0.2), rgba(224, 247, 241, 0.2))
    `
  }
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [currentOutput, setCurrentOutput] = useState<string | null>("email")
  const [animationPhase, setAnimationPhase] = useState<"in" | "stay" | "out" | "none">("stay")

  // Estado para controlar qué nodos están visibles
  const [visibleNodes, setVisibleNodes] = useState<string[]>([])
  const [animationComplete, setAnimationComplete] = useState(false)
  const animationRef = useRef<NodeJS.Timeout | null>(null)
  const outputAnimationRef = useRef<NodeJS.Timeout | null>(null)

  // Nodos del lado izquierdo (Account Information) con iconos mejorados
  const accountNodes = [
    { id: "Follow-up Templates", label: "Follow-up Templates", icon: <FileText className="w-4 h-4" /> },
    { id: "Competitor Analysis", label: "Competitor Analysis", icon: <Briefcase className="w-4 h-4" /> },
    { id: "Technical Details", label: "Technical Details", icon: <FileCheck className="w-4 h-4" /> },
    { id: "FAQ", label: "FAQ", icon: <FileText className="w-4 h-4" /> },
    { id: "Relevant Case Studies", label: "Relevant Case Studies", icon: <Briefcase className="w-4 h-4" /> },
    { id: "Company Research", label: "Company Research", icon: <Briefcase className="w-4 h-4" /> },
    { id: "Contracts", label: "Contracts", icon: <FileCheck className="w-4 h-4" /> },
    { id: "White Papers", label: "White Papers", icon: <FileText className="w-4 h-4" /> },
  ]

  // Nodos del lado derecho (Company Information) con iconos mejorados
  const companyNodes = [
    { id: "Meeting Transcripts", label: "Meeting Transcripts", icon: <FileCheck className="w-4 h-4" /> },
    { id: "Objection", label: "Objection", icon: <Shield className="w-4 h-4" /> },
    { id: "Email Transcripts", label: "Email Transcripts", icon: <Mail className="w-4 h-4" /> },
    { id: "BANT", label: "BANT", icon: <FileText className="w-4 h-4" /> },
    { id: "MEDPIC", label: "MEDPIC", icon: <FileCheck className="w-4 h-4" /> },
    { id: "Stakeholder Mapping", label: "Stakeholder Mapping", icon: <User className="w-4 h-4" /> },
    { id: "Personal Information", label: "Personal Information", icon: <User className="w-4 h-4" /> },
    { id: "Follow-up Cycles", label: "Follow-up Cycles", icon: <Calendar className="w-4 h-4" /> },
  ]

  // Posiciones optimizadas para los nodos del lado izquierdo, más cercanos al centro
  const leftPositions = [
    { x: 20, y: 15 },   // White Papers - superior izquierdo
    { x: 12, y: 25 },   // Contracts - superior más a la izquierda
    { x: 10, y: 40 },   // Company Research - izquierda
    { x: 12, y: 55 },   // Relevant Case Studies - izquierda media
    { x: 18, y: 68 },   // FAQ - izquierda baja
    { x: 27, y: 78 },   // Technical Details - inferior izquierdo
    { x: 35, y: 82 },   // Competitor Analysis - inferior centro-izquierda
    { x: 43, y: 70 },   // Follow-up Templates - centro-izquierda
  ]

  // Posiciones optimizadas para los nodos del lado derecho, más cercanos al centro
  const rightPositions = [
    { x: 57, y: 70 },   // Meeting Transcripts - centro-derecha
    { x: 65, y: 82 },   // Objection - inferior centro-derecha
    { x: 73, y: 78 },   // Email Transcripts - inferior derecho
    { x: 82, y: 68 },   // BANT - derecho bajo
    { x: 88, y: 55 },   // MEDPIC - derecha media
    { x: 90, y: 40 },   // Stakeholder Mapping - derecha
    { x: 88, y: 25 },   // Personal Information - superior más a la derecha
    { x: 80, y: 15 },   // Follow-up Cycles - superior derecho
  ]

  // Iniciar animaciones al montar el componente
  useEffect(() => {
    // Limpiar cualquier animación previa
    if (animationRef.current) clearTimeout(animationRef.current)
    if (outputAnimationRef.current) clearTimeout(outputAnimationRef.current)

    // Reiniciar estados
    setVisibleNodes([])
    setAnimationComplete(false)

    // Iniciar la animación de los nodos después de un breve retraso
    setTimeout(() => {
      animateNodesSequentially()
    }, 100)

    // Limpiar timeouts al desmontar
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current)
      if (outputAnimationRef.current) clearTimeout(outputAnimationRef.current)
    }
  }, [])

  // Iniciar la animación de outputs cuando se completa la animación de nodos
  useEffect(() => {
    if (animationComplete) {
      outputAnimationRef.current = setTimeout(() => {
        animateOutputsSequentially()
      }, 100)
    }

    return () => {
      if (outputAnimationRef.current) clearTimeout(outputAnimationRef.current)
    }
  }, [animationComplete])

  // Añadir la función para animar los nodos secuencialmente
  const animateNodesSequentially = () => {
    // Crear un array con todos los IDs de nodos en el orden deseado
    const allNodeIds = [
      // Alternamos entre nodos de la izquierda y derecha para un efecto más equilibrado
      accountNodes[7].id,
      companyNodes[7].id,
      accountNodes[3].id,
      companyNodes[3].id,
      accountNodes[5].id,
      companyNodes[5].id,
      accountNodes[2].id,
      companyNodes[2].id,
      accountNodes[4].id,
      companyNodes[4].id,
      accountNodes[1].id,
      companyNodes[1].id,
      accountNodes[0].id,
      companyNodes[0].id,
      accountNodes[6].id,
      companyNodes[6].id,
    ]

    let currentIndex = 0

    const showNextNode = () => {
      if (currentIndex < allNodeIds.length) {
        const nodeId = allNodeIds[currentIndex]
        setVisibleNodes((prev) => [...prev, nodeId])
        currentIndex++

        // Programar la siguiente animación
        animationRef.current = setTimeout(showNextNode, 30)
      } else {
        // Todos los nodos están visibles
        setAnimationComplete(true)
      }
    }

    // Iniciar la secuencia
    showNextNode()
  }

  // Añadir la función para verificar si un nodo está visible
  const isNodeVisible = (nodeId: string) => {
    if (!nodeId) return false
    return visibleNodes.includes(nodeId)
  }

  // Animación secuencial de los outputs - Loop continuo
  const animateOutputsSequentially = () => {
    // First animation - Perfect email
    setCurrentOutput("email")
    setAnimationPhase("in")

    const sequence = [
      () => {
        setAnimationPhase("stay")
        return 2000
      },
      () => {
        setAnimationPhase("out")
        return 500
      },
      () => {
        setCurrentOutput("followup")
        setAnimationPhase("in")
        return 500
      },
      () => {
        setAnimationPhase("stay")
        return 2000
      },
      () => {
        setAnimationPhase("out")
        return 500
      },
      () => {
        setCurrentOutput("objection")
        setAnimationPhase("in")
        return 500
      },
      () => {
        setAnimationPhase("stay")
        return 2000
      },
      () => {
        setAnimationPhase("out")
        return 500
      },
      () => {
        // Loop directo sin pausa - vuelve a la primera animación
        setCurrentOutput("email")
        setAnimationPhase("in")
        return 500
      },
    ]

    let currentStep = 0

    const runSequence = () => {
      if (currentStep < sequence.length) {
        const delay = sequence[currentStep]()
        currentStep++

        if (delay > 10) {
          outputAnimationRef.current = setTimeout(runSequence, delay)
        }
      }
    }

    // Iniciar la secuencia después de un breve retraso
    outputAnimationRef.current = setTimeout(runSequence, 500)
  }

  // Get animation class based on phase
  const getAnimationClass = () => {
    if (animationPhase === "in") return "slide-in-right"
    if (animationPhase === "out") return "slide-out-left"
    return ""
  }

  return (
    <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-b from-[#f8faff] to-white">
      <div className="container px-4 sm:px-6 md:px-8 lg:px-12 mx-auto max-w-[110rem]">
        <div className="bg-white rounded-2xl shadow-[0_20px_80px_-10px_rgba(0,124,255,0.15)] border border-[#e6e6e6]/60 px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 py-8 sm:py-10 md:py-12 lg:py-14 backdrop-blur-sm bg-opacity-95">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 max-w-full items-center">
            {/* Texto principal a la izquierda */}
            <div className="lg:w-[45%] flex flex-col justify-center">
              <div className="relative">
                <div className="absolute -left-8 -top-8 w-32 h-32 bg-gradient-radial from-[#f0f7ff]/80 via-[#e6f0ff]/30 to-transparent rounded-full blur-2xl opacity-70"></div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl relative z-10">
                  <span className="text-gray-800">Transform Sales Communication</span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0054B4] to-[#007CFF]">Into Strategic Advantage</span>
                </h1>
              </div>
              <p className="mt-4 text-gray-600 max-w-[600px] text-lg leading-relaxed">
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
                  
                  <div className="flex justify-center gap-16 py-4 relative">
                    <div className="border-2 border-[#007CFF] rounded-xl px-6 py-2 text-center bg-gradient-to-b from-white to-[#f5f9ff] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#f5f9ff]/0 via-[#f5f9ff]/80 to-[#f5f9ff]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-0"></div>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0054B4] to-[#007CFF] font-semibold text-base tracking-wide group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#0040A0] group-hover:to-[#0065CC]">ACCOUNT INFORMATION</span>
                    </div>
                    <div className="border-2 border-[#007CFF] rounded-xl px-6 py-2 text-center bg-gradient-to-b from-white to-[#f5f9ff] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#f5f9ff]/0 via-[#f5f9ff]/80 to-[#f5f9ff]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-0"></div>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0054B4] to-[#007CFF] font-semibold text-base tracking-wide group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#0040A0] group-hover:to-[#0065CC]">COMPANY INFORMATION</span>
                    </div>
                  </div>
                </div>

                {/* Desktop Mind Map */}
                <div className="hidden md:block relative mt-3">
                  <div className="w-full h-[400px] relative overflow-visible">
                    {/* Central Node - Diseño mejorado y posicionado más arriba */}
                    <div className="absolute left-1/2 top-[30%] transform -translate-x-1/2 -translate-y-1/2 z-20">
                      <div className="bg-gradient-to-br from-[#001240] to-[#003399] border-4 border-[#007CFF] rounded-2xl p-7 w-60 text-center relative shadow-2xl overflow-hidden">
                        {/* Fondo base con efecto de cristal */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm"></div>
                        <div className="absolute inset-0 rounded-xl shadow-[0_0_60px_rgba(0,124,255,0.6)] z-[-1]"></div>

                        {/* Efecto de luz interior */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-52 h-52 rounded-full bg-gradient-radial from-[#007CFF] via-[#007CFF]/30 to-transparent opacity-70 blur-xl animate-pulse-slow"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-44 h-44 rounded-full bg-gradient-radial from-[#FFA500] via-[#FFA500]/30 to-transparent opacity-60 blur-xl animate-pulse-fast"></div>
                        </div>
                        
                        {/* Efecto de línea brillante en el borde */}
                        <div className="absolute inset-0 rounded-xl border-2 border-white/20"></div>

                        <h3 className="text-xl font-bold text-white mb-3 relative z-10 font-inter tracking-widest drop-shadow-lg">AI AGENT</h3>
                        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 relative z-10 font-inter drop-shadow-[0_0_8px_rgba(255,165,0,0.5)]">CHRM</h2>
                      </div>
                    </div>

                    {/* Efecto de fondo orbital con puntos y líneas decorativas */}
                    <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                      {/* Círculo decorativo externo */}
                      <circle 
                        cx="50%" 
                        cy="50%" 
                        r="45%" 
                        fill="none" 
                        stroke="#007CFF" 
                        strokeWidth="0.2" 
                        strokeDasharray="3,5" 
                        strokeOpacity="0.4"
                        className="animate-pulse-slow"
                      />
                      
                      {/* Círculo decorativo interno */}
                      <circle 
                        cx="50%" 
                        cy="50%" 
                        r="30%" 
                        fill="none" 
                        stroke="#007CFF" 
                        strokeWidth="0.2" 
                        strokeDasharray="2,3" 
                        strokeOpacity="0.3"
                        className="animate-pulse-fast"
                      />
                      
                      {/* Puntos decorativos alrededor */}
                      {[...Array(24)].map((_, i) => {
                        const angle = (i * 15) * Math.PI / 180;
                        const r = 37 + (i % 3) * 4;
                        const x = 50 + r * Math.cos(angle);
                        const y = 50 + r * Math.sin(angle);
                        
                        return (
                          <circle 
                            key={`dot-${i}`}
                            cx={`${x}%`} 
                            cy={`${y}%`} 
                            r={i % 4 === 0 ? "0.4%" : "0.2%"}
                            fill={i % 5 === 0 ? "#FFA500" : "#007CFF"}
                            fillOpacity={i % 3 === 0 ? "0.5" : "0.3"}
                            className={i % 2 === 0 ? "animate-pulse-slow" : "animate-pulse-fast"}
                          />
                        );
                      })}

                      {/* Bottom arrow - Solo mostrar cuando la animación está completa */}
                      {animationComplete && (
                        <>
                          <line
                            x1="50%"
                            y1="30%"
                            x2="50%"
                            y2="73%"
                            stroke={hoveredNode === "output" ? "#B87333" : "#007CFF"}
                            strokeWidth="2"
                            strokeOpacity="0.7"
                            className="animate-fadeIn"
                          />
                          <polygon
                            points="0,0 5,-10 10,0"
                            transform="translate(50%, 73%) translate(-5, 0)"
                            fill={hoveredNode === "output" ? "#B87333" : "#007CFF"}
                            fillOpacity="0.7"
                            className="animate-fadeIn"
                          />
                        </>
                      )}
                    </svg>

                    {/* Left Side Nodes - Account Information - Mejorados con mejor distribución de texto */}
                    {accountNodes.map((node, index) => {
                      if (!node || !node.id) return null
                      const position = leftPositions[index]

                      // Solo mostrar nodos visibles
                      if (!isNodeVisible(node.id)) return null

                      return (
                        <div
                          key={node.id}
                          className={`absolute flex items-center gap-2 bg-gradient-to-r from-white to-[#f5f9ff] backdrop-blur-sm border ${
                            hoveredNode === node.id ? "border-amber-400 shadow-[0_0_15px_rgba(255,180,0,0.3)]" : "border-[#007CFF]/60"
                          } rounded-full py-2 px-4 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg ${
                            hoveredNode === node.id ? "scale-110" : ""
                          }`}
                          style={{
                            left: `${position.x}%`,
                            top: `${position.y}%`,
                            transform: "translate(-50%, -50%)",
                            animation: "scaleIn 0.8s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards",
                            zIndex: hoveredNode === node.id ? 25 : 10,
                            minWidth: "fit-content"
                          }}
                          onMouseEnter={() => setHoveredNode(node.id)}
                          onMouseLeave={() => setHoveredNode(null)}
                        >
                          <div className={`${hoveredNode === node.id ? "bg-gradient-to-br from-amber-400 to-amber-500" : "bg-gradient-to-br from-[#0066CC] to-[#007CFF]"} text-white p-2 rounded-full flex-shrink-0 shadow-sm transition-all duration-300 flex items-center justify-center`}>{node.icon}</div>
                          <span className={`text-sm font-medium ${hoveredNode === node.id ? "text-amber-600" : "text-[#001240]"} font-inter max-w-[140px] truncate transition-colors duration-300`}>{node.label}</span>
                        </div>
                      )
                    })}

                    {/* Right Side Nodes - Company Information - Mejorados con mejor distribución de texto */}
                    {companyNodes.map((node, index) => {
                      if (!node || !node.id) return null
                      const position = rightPositions[index]

                      // Solo mostrar nodos visibles
                      if (!isNodeVisible(node.id)) return null

                      return (
                        <div
                          key={node.id}
                          className={`absolute flex items-center justify-end gap-2 bg-gradient-to-r from-[#f5f9ff] to-white backdrop-blur-sm border ${
                            hoveredNode === node.id ? "border-amber-400 shadow-[0_0_15px_rgba(255,180,0,0.3)]" : "border-[#007CFF]/60"
                          } rounded-full py-2 px-4 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg ${
                            hoveredNode === node.id ? "scale-110" : ""
                          }`}
                          style={{
                            left: `${position.x}%`,
                            top: `${position.y}%`,
                            transform: "translate(-50%, -50%)",
                            animation: "scaleIn 0.8s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards",
                            zIndex: hoveredNode === node.id ? 25 : 10,
                            minWidth: "fit-content"
                          }}
                          onMouseEnter={() => setHoveredNode(node.id)}
                          onMouseLeave={() => setHoveredNode(null)}
                        >
                          <span className={`text-sm font-medium ${hoveredNode === node.id ? "text-amber-600" : "text-[#001240]"} font-inter max-w-[140px] truncate transition-colors duration-300`}>{node.label}</span>
                          <div className={`${hoveredNode === node.id ? "bg-gradient-to-br from-amber-400 to-amber-500" : "bg-gradient-to-br from-[#0066CC] to-[#007CFF]"} text-white p-2 rounded-full flex-shrink-0 shadow-sm transition-all duration-300 flex items-center justify-center`}>{node.icon}</div>
                        </div>
                      )
                    })}

                    {/* Bottom Outputs - Static Box with Changing Text - Solo mostrar cuando la animación está completa */}
                    {animationComplete && (
                      <div
                        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center animate-fadeIn"
                        onMouseEnter={() => setHoveredNode("output")}
                        onMouseLeave={() => setHoveredNode(null)}
                      >
                        <div className="bg-gradient-to-br from-[#001240] to-[#003399] border-2 border-[#007CFF]/80 rounded-lg p-4 w-72 h-16 text-center overflow-hidden shadow-lg mt-4 relative">
                          {/* Efecto de brillos */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-lg"></div>
                          <div className="absolute inset-0 rounded-lg shadow-[0_0_30px_rgba(0,124,255,0.4)] z-[-1]"></div>
                          
                          {/* Línea brillante en el borde */}
                          <div className="absolute inset-0 rounded-lg border border-white/20"></div>
                          
                          {/* Contenedor de altura fija para mantener las dimensiones constantes */}
                          <div className="relative w-full h-full flex items-center justify-center">
                            {currentOutput === "email" && (
                              <div
                                className={`text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 ${getAnimationClass()} whitespace-nowrap font-inter drop-shadow-[0_0_8px_rgba(255,165,0,0.5)]`}
                              >
                                Perfect email
                              </div>
                            )}

                            {currentOutput === "followup" && (
                              <div
                                className={`text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-500 ${getAnimationClass()} whitespace-nowrap font-inter drop-shadow-[0_0_8px_rgba(0,124,255,0.5)]`}
                              >
                                Follow-up
                              </div>
                            )}

                            {currentOutput === "objection" && (
                              <div
                                className={`text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-500 ${getAnimationClass()} whitespace-nowrap font-inter drop-shadow-[0_0_8px_rgba(0,124,255,0.5)]`}
                              >
                                Objection handling
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden mt-8">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-[#001240] to-[#003399] border-3 border-[#007CFF] rounded-lg p-6 text-center mb-8 relative shadow-2xl overflow-hidden">
                      {/* Fondo base con efecto de cristal */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm"></div>
                      <div className="absolute inset-0 rounded-lg shadow-[0_0_40px_rgba(0,124,255,0.5)] z-[-1]"></div>

                      {/* Efecto de luz interior */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-36 h-36 rounded-full bg-gradient-radial from-[#007CFF] via-[#007CFF]/30 to-transparent opacity-70 blur-lg animate-pulse-slow"></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-28 h-28 rounded-full bg-gradient-radial from-[#FFA500] via-[#FFA500]/30 to-transparent opacity-60 blur-lg animate-pulse-fast"></div>
                      </div>
                      
                      {/* Efecto de línea brillante en el borde */}
                      <div className="absolute inset-0 rounded-lg border border-white/20"></div>

                      <h3 className="text-lg font-bold text-white mb-2 relative z-10 font-inter tracking-wider drop-shadow-lg">AI AGENT</h3>
                      <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 relative z-10 font-inter drop-shadow-[0_0_6px_rgba(255,165,0,0.5)]">CHRM</h2>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <h3 className="text-sm font-medium text-[#007CFF] mb-2 font-inter">Account Information</h3>
                    <div className="flex flex-col gap-2">
                      {accountNodes.map((node) => (
                        <div
                          key={node.id}
                          className={`flex items-center gap-2 bg-gradient-to-r from-white to-[#f5f9ff] backdrop-blur-sm border ${
                            hoveredNode === `${node.id}-m` ? "border-amber-400 shadow-[0_0_12px_rgba(255,180,0,0.25)]" : "border-[#007CFF]/60"
                          } rounded-full py-2 px-4 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg`}
                          onMouseEnter={() => setHoveredNode(`${node.id}-m`)}
                          onMouseLeave={() => setHoveredNode(null)}
                        >
                          <div className={`${hoveredNode === `${node.id}-m` ? "bg-gradient-to-br from-amber-400 to-amber-500" : "bg-gradient-to-br from-[#0066CC] to-[#007CFF]"} text-white p-1.5 rounded-full flex-shrink-0 shadow-sm transition-all duration-300`}>{node.icon}</div>
                          <span className={`text-xs font-medium ${hoveredNode === `${node.id}-m` ? "text-amber-600" : "text-[#001240]"} font-inter transition-colors duration-300`}>{node.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <h3 className="text-sm font-medium text-[#007CFF] mb-2 font-inter">Company Information</h3>
                    <div className="flex flex-col gap-2">
                      {companyNodes.map((node) => (
                        <div
                          key={node.id}
                          className={`flex items-center justify-end gap-2 bg-gradient-to-r from-[#f5f9ff] to-white backdrop-blur-sm border ${
                            hoveredNode === `${node.id}-m` ? "border-amber-400 shadow-[0_0_12px_rgba(255,180,0,0.25)]" : "border-[#007CFF]/60"
                          } rounded-full py-2 px-4 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg`}
                          onMouseEnter={() => setHoveredNode(`${node.id}-m`)}
                          onMouseLeave={() => setHoveredNode(null)}
                        >
                          <span className={`text-xs font-medium ${hoveredNode === `${node.id}-m` ? "text-amber-600" : "text-[#001240]"} font-inter transition-colors duration-300`}>{node.label}</span>
                          <div className={`${hoveredNode === `${node.id}-m` ? "bg-gradient-to-br from-amber-400 to-amber-500" : "bg-gradient-to-br from-[#0066CC] to-[#007CFF]"} text-white p-1.5 rounded-full flex-shrink-0 shadow-sm transition-all duration-300`}>{node.icon}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-center mt-16 mb-8">
                    <div className="h-24 flex items-center justify-center">
                      <div className="w-0.5 h-full bg-[#007CFF] opacity-80"></div>
                    </div>
                    <div className="bg-gradient-to-br from-[#001240] to-[#003399] border-2 border-[#007CFF]/80 rounded-2xl px-4 sm:px-8 md:px-12 lg:px-24 py-8 sm:py-12 w-full max-w-[60rem] h-20 mx-auto text-center overflow-hidden shadow-lg relative">
                      {/* Efectos visuales */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-xl"></div>
                      <div className="absolute inset-0 rounded-xl shadow-[0_0_40px_rgba(0,124,255,0.4)] z-[-1]"></div>
                      <div className="absolute inset-0 rounded-xl border border-white/20"></div>
                      
                      {/* Efecto de brillo decorativo */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-radial from-[#007CFF]/40 to-transparent opacity-70 blur-xl"></div>

                      {/* Contenedor de altura fija para mantener dimensiones constantes */}
                      <div className="relative h-full w-full flex items-center justify-center">
                        {currentOutput === "email" && (
                          <div
                            className={`text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 ${getAnimationClass()} whitespace-nowrap font-inter tracking-wide drop-shadow-[0_0_10px_rgba(255,165,0,0.6)]`}
                          >
                            Perfect email
                          </div>
                        )}

                        {currentOutput === "followup" && (
                          <div
                            className={`text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-500 ${getAnimationClass()} whitespace-nowrap font-inter tracking-wide drop-shadow-[0_0_10px_rgba(0,124,255,0.6)]`}
                          >
                            Follow-up
                          </div>
                        )}

                        {currentOutput === "objection" && (
                          <div
                            className={`text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-500 ${getAnimationClass()} whitespace-nowrap font-inter tracking-wide drop-shadow-[0_0_10px_rgba(0,124,255,0.6)]`}
                          >
                            Objection handling
                          </div>
                        )}
                      </div>
                    </div>
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
