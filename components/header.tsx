import Link from "next/link"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold text-[#007CFF]">chrm.ai</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-sm font-medium hover:text-[#007CFF]">
            Home
          </Link>
          <Link href="#features" className="text-sm font-medium hover:text-[#007CFF]">
            Features
          </Link>
          <Link href="#roi-calculator" className="text-sm font-medium hover:text-[#007CFF]">
            ROI Calculator
          </Link>
          <Link href="#about" className="text-sm font-medium hover:text-[#007CFF]">
            About
          </Link>
        </nav>
        <div>
          <Link
            href="#demo"
            className="bg-[#007CFF] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#0065cc] transition-colors"
          >
            Book a Demo
          </Link>
        </div>
      </div>
    </header>
  )
}

