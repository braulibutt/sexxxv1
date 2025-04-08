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

  // Nodos del lado izquierdo (Account Information)
  const accountNodes = [
    { id: "Follow-up Templates", label: "Follow-up Templates", icon: <User className="w-4 h-4" /> },
    { id: "Competitor Analysis", label: "Competitor Analysis", icon: <FileText className="w-4 h-4" /> },
    { id: "Technical Details", label: "Technical Details", icon: <Mail className="w-4 h-4" /> },
    { id: "FAQ", label: "FAQ number", icon: <Phone className="w-4 h-4" /> },
    { id: "Relevant Case Studies", label: "Relevant Case Studies", icon: <Briefcase className="w-4 h-4" /> },
    { id: "Company Research", label: "Company Research", icon: <MapPin className="w-4 h-4" /> },
    { id: "Contracts", label: "Contracts", icon: <DollarSign className="w-4 h-4" /> },
    { id: "White Papers", label: "White Papers", icon: <Clock className="w-4 h-4" /> },
  ]

  // Nodos del lado derecho (Company Information)
  const companyNodes = [
    { id: "Meeting Transcripts", label: "Meeting Transcripts", icon: <FileCheck className="w-4 h-4" /> },
    { id: "Objection", label: "Objection", icon: <Shield className="w-4 h-4" /> },
    { id: "Email Transcripts", label: "Email Transcripts", icon: <DollarSign className="w-4 h-4" /> },
    { id: "BANT", label: "BANT", icon: <FileText className="w-4 h-4" /> },
    { id: "MEDPIC", label: "MEDPIC", icon: <Calendar className="w-4 h-4" /> },
    { id: "Stakeholder Mapping", label: "Stakeholder Mapping", icon: <ShieldCheck className="w-4 h-4" /> },
    { id: "Personal Information", label: "Personal Information", icon: <HeartPulse className="w-4 h-4" /> },
    { id: "Follow-up Cycles", label: "Follow-up Cycles", icon: <Award className="w-4 h-4" /> },
  ]

  // Posiciones para los nodos del lado izquierdo (ajustadas para más separación)
  const leftPositions = [
    { x: 0, y: 100 }, // Follow-up Templates
    { x: 0, y: 86 }, // Competitor Analysis
    { x: 5, y: 72 }, // Technical Details
    { x: 10, y: 58 }, // FAQ
    { x: 15, y: 44 }, // Relevant Case Studies
    { x: 20, y: 30 }, // Company Research
    { x: 25, y: 16 }, // Contracts
    { x: 30, y: 2 }, // White Papers
  ]

  // Posiciones para los nodos del lado derecho (ajustadas para más separación)
  const rightPositions = [
    { x: 70, y: 2 }, // Meeting Transcripts
    { x: 75, y: 16 }, // Objection
    { x: 80, y: 30 }, // Email Transcripts
    { x: 85, y: 44 }, // BANT
    { x: 90, y: 58 }, // MEDPIC
    { x: 92, y: 72 }, // Stakeholder Mapping
    { x: 90, y: 86 }, // Personal Information
    { x: 85, y: 100 }, // Follow-up Cycles
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

  // Animación secuencial de los outputs
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
        return 300
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
        return 300
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
        return 300
      },
      () => {
        // Reiniciar la secuencia después de un tiempo
        outputAnimationRef.current = setTimeout(animateOutputsSequentially, 2000)
        return 0
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
    <section className="py-10 md:py-10 lg:py-10">
      <div className="container px-4 sm:px-6 md:px-8 lg:px-12 mx-auto max-w-[120rem]">
        <div className="bg-white rounded-3xl shadow-lg px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 border border-[#e6e6e6]">
          <div className="flex flex-col lg:flex-row gap-20 md:gap-32 max-w-full">
            {/* Texto principal a la izquierda */}
            <div className="lg:w-[45%] flex flex-col justify-center pl-4 md:pl-8">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl relative z-10">
                <span className="text-gray-900">Transform Sales Communication</span>
                <br />
                <span className="text-[#007CFF]">Into Strategic Advantage</span>
              </h1>
              <p className="mt-4 text-gray-600 max-w-[600px]">
                Our AI assistant analyzes conversations and delivers perfect follow-ups, increasing close rates by 25%
                and boosting productivity by 50%
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link
                  href="#demo"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-[#007CFF] px-8 text-sm font-medium text-white shadow transition-colors hover:bg-[#0065cc]"
                >
                  Request a consultation
                </Link>
                <Link
                  href="#waitlist"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100"
                >
                  Join waitlist
                </Link>
              </div>
            </div>

            {/* Diagrama radial a la derecha */}
            <div className="lg:w-[60%]">
              <div className="relative scale-110">
                <div className="flex justify-center gap-12 mb-6">
                  <div className="border-2 border-[#007CFF] rounded-xl px-8 py-3 text-center bg-white shadow-md hover:shadow-lg transition-shadow">
                    <span className="text-[#007CFF] font-medium text-lg">ACCOUNT INFORMATION</span>
                  </div>
                  <div className="border-2 border-[#007CFF] rounded-xl px-8 py-3 text-center bg-white shadow-md hover:shadow-lg transition-shadow">
                    <span className="text-[#007CFF] font-medium text-lg">COMPANY INFORMATION</span>
                  </div>
                </div>

                {/* Desktop Mind Map */}
                <div className="hidden md:block relative">
                  <div className="w-full h-[450px] relative overflow-visible">
                    {/* Central Node */}
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                      <div className="bg-white border-2 border-[#007CFF] rounded-2xl p-6 w-52 text-center relative shadow-lg overflow-hidden">
                        {/* Fondo base */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-radial from-[#007CFF]/30 via-white to-white opacity-90"></div>
                        <div className="absolute inset-0 rounded-xl shadow-[0_0_40px_rgba(0,124,255,0.4)] z-[-1]"></div>

                        {/* Efecto de brillo neón centrado */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-48 h-48 rounded-full bg-gradient-radial from-[#007CFF] via-[#007CFF]/40 to-transparent opacity-80 blur-lg animate-pulse-slow"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-40 h-40 rounded-full bg-gradient-radial from-[#FFA500] via-[#FFA500]/30 to-transparent opacity-70 blur-lg animate-pulse-fast"></div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-3 relative z-10 font-inter tracking-wider drop-shadow-lg">AI AGENT</h3>
                        <h2 className="text-5xl font-bold text-[#FFA500] relative z-10 font-inter drop-shadow-[0_0_10px_rgba(255,165,0,0.3)]">CHRM</h2>
                      </div>
                    </div>

                    {/* SVG for all radial lines */}
                    <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                      {/* Left side lines */}
                      {accountNodes.map((node, index) => {
                        if (!node || !node.id) return null
                        const centerX = 50
                        const centerY = 50
                        const position = leftPositions[index]

                        // Solo mostrar líneas para nodos visibles
                        if (!isNodeVisible(node.id)) return null

                        return (
                          <line
                            key={`line-${node.id}`}
                            x1={`${centerX}%`}
                            y1={`${centerY}%`}
                            x2={`${position.x}%`}
                            y2={`${position.y}%`}
                            stroke={hoveredNode === node.id ? "#B87333" : "#007CFF"}
                            strokeWidth={hoveredNode === node.id ? "2" : "1.5"}
                            strokeOpacity="0.7"
                            className="animate-fadeIn"
                          />
                        )
                      })}

                      {/* Right side lines */}
                      {companyNodes.map((node, index) => {
                        if (!node || !node.id) return null
                        const centerX = 50
                        const centerY = 50
                        const position = rightPositions[index]

                        // Solo mostrar líneas para nodos visibles
                        if (!isNodeVisible(node.id)) return null

                        return (
                          <line
                            key={`line-${node.id}`}
                            x1={`${centerX}%`}
                            y1={`${centerY}%`}
                            x2={`${position.x}%`}
                            y2={`${position.y}%`}
                            stroke={hoveredNode === node.id ? "#B87333" : "#007CFF"}
                            strokeWidth={hoveredNode === node.id ? "2" : "1.5"}
                            strokeOpacity="0.7"
                            className="animate-fadeIn"
                          />
                        )
                      })}

                      {/* Bottom arrow - Solo mostrar cuando la animación está completa */}
                      {animationComplete && (
                        <>
                          <line
                            x1="50%"
                            y1="50%"
                            x2="50%"
                            y2="85%"
                            stroke={hoveredNode === "output" ? "#B87333" : "#007CFF"}
                            strokeWidth="2"
                            strokeOpacity="0.7"
                            className="animate-fadeIn"
                          />
                          <polygon
                            points="0,0 5,-10 10,0"
                            transform="translate(50%, 85%) translate(-5, 0)"
                            fill={hoveredNode === "output" ? "#B87333" : "#007CFF"}
                            fillOpacity="0.7"
                            className="animate-fadeIn"
                          />
                        </>
                      )}
                    </svg>

                    {/* Left Side Nodes - Account Information */}
                    {accountNodes.map((node, index) => {
                      if (!node || !node.id) return null
                      const position = leftPositions[index]

                      // Solo mostrar nodos visibles
                      if (!isNodeVisible(node.id)) return null

                      return (
                        <div
                          key={node.id}
                          className={`absolute flex items-center gap-2 bg-white border border-[#007CFF] rounded-full py-2 px-4 transition-all cursor-pointer ${
                            hoveredNode === node.id ? "border-[#b87333]" : ""
                          }`}
                          style={{
                            left: `${position.x}%`,
                            top: `${position.y}%`,
                            transform: "translate(-50%, -50%)",
                            animation: "scaleIn 0.8s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards",
                          }}
                          onMouseEnter={() => setHoveredNode(node.id)}
                          onMouseLeave={() => setHoveredNode(null)}
                        >
                          <div className="bg-[#007CFF] text-white p-1.5 rounded-full">{node.icon}</div>
                          <span className="text-sm whitespace-nowrap text-[#1A1A1A] font-inter">{node.label}</span>
                        </div>
                      )
                    })}

                    {/* Right Side Nodes - Company Information */}
                    {companyNodes.map((node, index) => {
                      if (!node || !node.id) return null
                      const position = rightPositions[index]

                      // Solo mostrar nodos visibles
                      if (!isNodeVisible(node.id)) return null

                      return (
                        <div
                          key={node.id}
                          className={`absolute flex items-center justify-end gap-2 bg-white border border-[#007CFF] rounded-full py-2 px-4 transition-all cursor-pointer ${
                            hoveredNode === node.id ? "border-[#b87333]" : ""
                          }`}
                          style={{
                            left: `${position.x}%`,
                            top: `${position.y}%`,
                            transform: "translate(-50%, -50%)",
                            animation: "scaleIn 0.8s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards",
                          }}
                          onMouseEnter={() => setHoveredNode(node.id)}
                          onMouseLeave={() => setHoveredNode(null)}
                        >
                          <span className="text-sm whitespace-nowrap text-[#1A1A1A] font-inter">{node.label}</span>
                          <div className="bg-[#007CFF] text-white p-1.5 rounded-full">{node.icon}</div>
                        </div>
                      )
                    })}

                    {/* Bottom Outputs - Static Box with Changing Text - Solo mostrar cuando la animación está completa */}
                    {animationComplete && (
                      <div
                        className="absolute bottom-7 left-1/2 transform -translate-x-1/2 text-center animate-fadeIn"
                        onMouseEnter={() => setHoveredNode("output")}
                        onMouseLeave={() => setHoveredNode(null)}
                      >
                        <div className="bg-white border border-[#007CFF] rounded-lg p-4 w-64 h-16 text-center overflow-hidden flex items-center justify-center shadow-md mt-4">
                          {currentOutput === "email" && (
                            <div
                              className={`text-2xl text-[#B87333] font-bold ${getAnimationClass()} whitespace-nowrap font-inter`}
                            >
                              Perfect email
                            </div>
                          )}

                          {currentOutput === "followup" && (
                            <div
                              className={`text-2xl text-[#007CFF] font-bold ${getAnimationClass()} whitespace-nowrap font-inter`}
                            >
                              Follow-up
                            </div>
                          )}

                          {currentOutput === "objection" && (
                            <div
                              className={`text-2xl text-[#007CFF] font-bold ${getAnimationClass()} whitespace-nowrap font-inter`}
                            >
                              Objection handling
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden mt-8">
                  <div className="relative">
                    <div className="bg-white border border-[#007CFF] rounded-lg p-6 text-center mb-8 relative shadow-lg overflow-hidden">
                      {/* Fondo base */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-radial from-[#007CFF]/20 via-white to-white opacity-80"></div>
                      <div className="absolute inset-0 rounded-lg shadow-[0_0_30px_rgba(0,124,255,0.3)] z-[-1]"></div>

                      {/* Efecto de brillo neón centrado */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full bg-gradient-radial from-[#007CFF] via-[#007CFF]/30 to-transparent opacity-60 blur-md animate-pulse-slow"></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-radial from-[#FF6B00] via-[#FF6B00]/20 to-transparent opacity-50 blur-md animate-pulse-fast"></div>
                      </div>

                      <h3 className="text-lg font-bold text-[#007CFF] mb-3 relative z-10 font-inter">AI AGENT</h3>
                      <h2 className="text-3xl font-bold text-[#B87333] relative z-10 font-inter">CHRM</h2>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <h3 className="text-sm font-medium text-[#007CFF] mb-2 font-inter">Account Information</h3>
                    <div className="flex flex-col gap-2">
                      {accountNodes.map((node) => (
                        <div
                          key={node.id}
                          className="flex items-center gap-2 bg-white border border-[#007CFF] rounded-full py-2 px-4 transition-all cursor-pointer"
                          onMouseEnter={() => setHoveredNode(`${node.id}-m`)}
                          onMouseLeave={() => setHoveredNode(null)}
                        >
                          <div className="bg-[#007CFF] text-white p-1.5 rounded-full">{node.icon}</div>
                          <span className="text-sm whitespace-nowrap text-[#1A1A1A] font-inter">{node.label}</span>
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
                          className="flex items-center justify-end gap-2 bg-white border border-[#007CFF] rounded-full py-1.5 px-3 transition-all cursor-pointer hover:shadow-md"
                          onMouseEnter={() => setHoveredNode(`${node.id}-m`)}
                          onMouseLeave={() => setHoveredNode(null)}
                        >
                          <span className="text-sm whitespace-nowrap text-[#1A1A1A] font-inter">{node.label}</span>
                          <div className="bg-[#007CFF] text-white p-1.5 rounded-full">{node.icon}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-center mt-16 mb-8">
                    <div className="h-24 flex items-center justify-center">
                      <div className="w-0.5 h-full bg-[#007CFF] opacity-80"></div>
                    </div>
                    <div className="bg-[#007CFF] rounded-2xl px-4 sm:px-8 md:px-12 lg:px-24 py-8 sm:py-12 w-full max-w-[60rem] h-auto sm:h-36 mx-auto text-center overflow-hidden flex items-center justify-center shadow-[0_0_30px_rgba(0,124,255,0.3)] relative">
                      <div className="absolute inset-0 bg-[#007CFF]"></div>

                      {currentOutput === "email" && (
                        <div className="relative z-150 w-full">
                          <div
                            className={`text-2xl text-white font-bold ${getAnimationClass()} whitespace-nowrap font-inter tracking-wide drop-shadow-lg`}
                          >
                            Perfect email
                          </div>
                        </div>
                      )}

                      {currentOutput === "followup" && (
                        <div
                          className={`text-2xl text-white font-bold ${getAnimationClass()} whitespace-nowrap font-inter`}
                        >
                          Follow-up
                        </div>
                      )}

                      {currentOutput === "objection" && (
                        <div
                          className={`text-2xl text-white font-bold ${getAnimationClass()} whitespace-nowrap font-inter`}
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
    </section>
  )
}
