// components/HowItWorks.tsx
export default function HowItWorks() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <FeatureCard
            icon="📝"
            title="Smart Summaries"
            description="Get concise summaries of lengthy PDF documents"
          />
          <FeatureCard
            icon="🎴"
            title="Flashcards"
            description="Create study flashcards automatically"
          />
          <FeatureCard
            icon="❓"
            title="Q&A Generator"
            description="Generate practice questions and answers"
          />
          <FeatureCard
            icon="•"
            title="Key Points"
            description="Extract important bullet points"
          />
        </div>

        {/* How It Works */}
        <div className="bg-gray-50 rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Step
              number={1}
              title="Upload PDF"
              description="Upload your educational PDF document"
            />
            <Step
              number={2}
              title="AI Processing"
              description="Our AI analyzes and processes your content"
            />
            <Step
              number={3}
              title="Get Results"
              description="Download your learning materials"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Feature Card Sub-component
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
        <span className="text-indigo-600 font-bold">{icon}</span>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// Step Sub-component
interface StepProps {
  number: number;
  title: string;
  description: string;
}

function Step({ number, title, description }: StepProps) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">{number}</span>
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}