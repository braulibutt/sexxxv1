import ROICalculator from "@/components/roi-calculator"
import Header from "@/components/header"
import Hero from "@/components/hero"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <ROICalculator />
    </main>
  )
}

