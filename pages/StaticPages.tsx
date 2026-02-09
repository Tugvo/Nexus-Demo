
import React, { useState } from 'react';
import { Mail, MapPin, CheckCircle } from 'lucide-react';

export const About: React.FC = () => (
  <div className="min-h-screen bg-theme-bg-sec py-12 px-4 transition-colors">
    <div className="max-w-4xl mx-auto bg-theme-card p-8 md:p-12 rounded-2xl border border-theme-border shadow-sm animate-fade-in">
      <h1 className="text-4xl font-bold text-theme-text mb-6">Empowering the Autonomous Economy</h1>
      <div className="space-y-6 text-theme-text-sec leading-relaxed text-lg">
        <p>
          NexusAI was founded on a simple yet powerful belief: the future of work is collaborative, but not just between humans. 
          We are building the definitive infrastructure for the AI Agent economy, bridging the gap between world-class 
          builders and enterprises seeking reliable, autonomous leverage.
        </p>
        <p>
          Unlike generic script repositories, NexusAI enforces a rigorous verification standard. Every agent on our 
          platform undergoes static analysis, security scanning, and performance benchmarking before it reaches 
          the marketplace. This ensures that when you deploy a Nexus agent, you are deploying production-grade reliability.
        </p>
        <h2 className="text-2xl font-bold text-theme-text mt-8 mb-4">Our Mission</h2>
        <p>
          To create a trustless, transparent, and efficient marketplace where AI agents can be discovered, 
          vetted, and integrated into complex workflows with a single click. We strive to reduce the friction 
          of adopting autonomous technology for businesses of all sizes.
        </p>
      </div>
    </div>
  </div>
);

export const Privacy: React.FC = () => (
  <div className="min-h-screen bg-theme-bg-sec py-12 px-4 transition-colors">
    <div className="max-w-4xl mx-auto bg-theme-card p-8 md:p-12 rounded-2xl border border-theme-border shadow-sm animate-fade-in">
      <h1 className="text-3xl font-bold text-theme-text mb-8">Privacy Policy</h1>
      <div className="space-y-6 text-theme-text-sec text-sm leading-relaxed">
        <p><strong>Effective Date:</strong> October 24, 2023</p>
        
        <h3 className="text-lg font-bold text-theme-text">1. Information Collection</h3>
        <p>
          We collect information that you provide directly to us, such as when you create an account, publish an agent, 
          or communicate with our support team. This may include your name, email address, payment information, and 
          code repositories linked for verification purposes.
        </p>

        <h3 className="text-lg font-bold text-theme-text">2. Usage of Data</h3>
        <p>
          We use your information to operate, maintain, and improve the NexusAI platform. Specifically, we use builder 
          performance data to calculate Trust Scores. This analytical data is aggregated and anonymized where possible 
          to protect individual builder privacy while ensuring marketplace transparency.
        </p>

        <h3 className="text-lg font-bold text-theme-text">3. Data Security</h3>
        <p>
          We employ enterprise-grade security measures, including encryption in transit and at rest, to protect your 
          personal information and proprietary agent code. However, no method of transmission over the Internet is 
          100% secure, and we cannot guarantee absolute security.
        </p>
        
        <h3 className="text-lg font-bold text-theme-text">4. Third-Party Sharing</h3>
        <p>
          We do not sell your personal data. We may share data with service providers who help us operate our business 
          (e.g., payment processing via Stripe, cloud hosting via AWS), subject to confidentiality agreements.
        </p>
      </div>
    </div>
  </div>
);

export const Terms: React.FC = () => (
  <div className="min-h-screen bg-theme-bg-sec py-12 px-4 transition-colors">
    <div className="max-w-4xl mx-auto bg-theme-card p-8 md:p-12 rounded-2xl border border-theme-border shadow-sm animate-fade-in">
      <h1 className="text-3xl font-bold text-theme-text mb-8">Terms & Conditions</h1>
      <div className="space-y-6 text-theme-text-sec text-sm leading-relaxed">
        <h3 className="text-lg font-bold text-theme-text">1. Acceptance of Terms</h3>
        <p>
          By accessing or using the NexusAI platform, you agree to be bound by these Terms. If you disagree with any 
          part of the terms, you may not access the service.
        </p>

        <h3 className="text-lg font-bold text-theme-text">2. Marketplace Model</h3>
        <p>
          NexusAI acts as an intermediary marketplace. While we perform security scans and verification checks, 
          agents are provided "as is" by their respective builders. NexusAI does not guarantee that any specific 
          agent will meet your requirements or be error-free.
        </p>

        <h3 className="text-lg font-bold text-theme-text">3. Intellectual Property</h3>
        <p>
          Builders retain ownership of the intellectual property rights in the agents they publish. By publishing 
          on NexusAI, builders grant NexusAI a license to distribute, display, and facilitate the sale of these agents. 
          Buyers receive a license to use the agent as specified in the purchase agreement (e.g., Monthly vs. Lifetime).
        </p>

        <h3 className="text-lg font-bold text-theme-text">4. Limitation of Liability</h3>
        <p>
          In no event shall NexusAI, nor its directors, employees, or partners, be liable for any indirect, 
          incidental, special, consequential, or punitive damages, including without limitation, loss of profits, 
          data, use, goodwill, or other intangible losses.
        </p>
      </div>
    </div>
  </div>
);

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate network request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-theme-bg-sec py-12 px-4 transition-colors">
      <div className="max-w-3xl mx-auto bg-theme-card p-8 md:p-12 rounded-2xl border border-theme-border shadow-sm animate-slide-up">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-theme-text mb-4">Contact Support</h1>
          <p className="text-theme-text-sec">
            Have a question about an integration? Found a bug? Our team monitors this inbox 24/7.
          </p>
        </div>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center animate-fade-in">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ticket #4921 Created</h3>
            <p className="text-gray-600">
              Thank you for reaching out. A support engineer will review your request and respond to your email within 4 hours.
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="mt-6 text-indigo-600 font-medium hover:underline"
            >
              Submit another ticket
            </button>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-theme-text mb-2">Name</label>
                <input required type="text" className="w-full p-3 border border-theme-border rounded-lg bg-theme-bg-sec text-theme-text focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-theme-text mb-2">Email</label>
                <input required type="email" className="w-full p-3 border border-theme-border rounded-lg bg-theme-bg-sec text-theme-text focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors" placeholder="jane@company.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-theme-text mb-2">Subject</label>
              <select className="w-full p-3 border border-theme-border rounded-lg bg-theme-bg-sec text-theme-text focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors">
                <option>Technical Support</option>
                <option>Billing Inquiry</option>
                <option>Report a Policy Violation</option>
                <option>Partnership Opportunity</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-theme-text mb-2">Message</label>
              <textarea required rows={5} className="w-full p-3 border border-theme-border rounded-lg bg-theme-bg-sec text-theme-text focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors" placeholder="Describe the issue..."></textarea>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 text-white px-6 py-3.5 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center"
            >
              {loading ? 'Creating Ticket...' : 'Create Support Ticket'}
            </button>
          </form>
        )}
        
        <div className="mt-12 pt-8 border-t border-theme-border flex flex-col md:flex-row justify-center gap-8 text-sm text-theme-text-sec">
           <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2" /> support@nexus.ai
           </div>
           <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" /> 100 Pine St, San Francisco, CA
           </div>
        </div>
      </div>
    </div>
  );
};

export const Careers: React.FC = () => (
  <div className="min-h-screen bg-theme-bg-sec py-12 px-4 transition-colors">
    <div className="max-w-4xl mx-auto animate-slide-up">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-theme-text mb-4">Join the Nexus</h1>
        <p className="text-xl text-theme-text-sec">We are building the operating system for the agentic future.</p>
      </div>

      <div className="grid gap-6">
        {['Senior Frontend Engineer', 'AI Research Scientist', 'Platform Security Lead', 'Developer Advocate'].map((role) => (
          <div key={role} className="bg-theme-card p-6 rounded-xl border border-theme-border shadow-sm flex justify-between items-center group hover:border-indigo-500/50 transition-colors cursor-pointer">
            <div>
              <h3 className="text-lg font-bold text-theme-text group-hover:text-indigo-600 transition-colors">{role}</h3>
              <p className="text-sm text-theme-text-sec mt-1">Remote • Full-time</p>
            </div>
            <button className="px-4 py-2 border border-theme-border rounded-lg text-sm font-medium text-theme-text hover:bg-theme-bg-sec transition-colors">
              View Role
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-theme-text-sec">Don't see a fit? <a href="#" className="text-indigo-600 hover:underline">Email us</a> your resume anyway.</p>
      </div>
    </div>
  </div>
);
