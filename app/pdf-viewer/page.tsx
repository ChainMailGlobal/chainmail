"use client"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PDFViewer() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to MailboxHero
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">The MailboxHero of Neo-Kyoto</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-[80vh]">
            <iframe
              src="/neo-kyoto-story.html"
              className="w-full h-full border-0"
              title="The MailboxHero of Neo-Kyoto Story"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Experience MailboxHero?</h3>
          <p className="text-gray-600 mb-6">
            Transform your compliance process from weeks to minutes with our AI-powered solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demo-v31"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Try Interactive Demo
            </Link>
            <Link
              href="/"
              className="bg-gray-100 text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
