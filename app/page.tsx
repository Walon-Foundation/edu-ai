// components/HomeContent.tsx
export default function HomeContent() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Your PDFs into
            <span className="text-indigo-600"> Learning Tools</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Upload your educational PDFs and instantly generate summaries, flashcards, 
            Q&A sessions, and bullet points with AI-powered precision.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg">
              Upload Your First PDF
            </button>
            <button className="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}