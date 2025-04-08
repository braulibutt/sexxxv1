"use client"

import Link from "next/link"
import { Twitter, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col space-y-8">
          {/* Logo y descripción */}
          <div>
            <Link href="/" className="text-[#007CFF] font-medium">
              chrm.ai
            </Link>
            <p className="text-sm text-gray-600 mt-1">
              AI-powered sales intelligence that increases revenue opportunities and conversation win rates
            </p>
            <div className="flex items-center gap-2 mt-4">
              <Link href="https://twitter.com" className="text-gray-400 hover:text-gray-500">
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href="https://linkedin.com" className="text-gray-400 hover:text-gray-500">
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Enlaces principales */}
          <div className="grid grid-cols-3 gap-8">
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Product</h3>
              <div className="flex flex-col space-y-2">
                <Link href="/features" className="text-gray-600 hover:text-gray-900">Features</Link>
                <Link href="/roi-calculator" className="text-gray-600 hover:text-gray-900">ROI Calculator</Link>
                <Link href="/request-demo" className="text-gray-600 hover:text-gray-900">Request Demo</Link>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-4">Company</h3>
              <div className="flex flex-col space-y-2">
                <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
                <Link href="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link>
                <Link href="/careers" className="text-gray-600 hover:text-gray-900">Careers</Link>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-4">Resources</h3>
              <div className="flex flex-col space-y-2">
                <Link href="/documentation" className="text-gray-600 hover:text-gray-900">Documentation</Link>
                <Link href="/support" className="text-gray-600 hover:text-gray-900">Support</Link>
                <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900">Privacy Policy</Link>
              </div>
            </div>
          </div>

          {/* Copyright y enlaces legales */}
          <div className="border-t border-gray-200 pt-8 flex flex-wrap justify-between items-center">
            <p className="text-sm text-gray-500">&copy; 2023 chrm.ai. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900">Terms</Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">Privacy</Link>
              <Link href="/cookies" className="text-sm text-gray-500 hover:text-gray-900">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
