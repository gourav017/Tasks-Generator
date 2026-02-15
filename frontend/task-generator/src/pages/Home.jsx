import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, Zap, FileText, Activity } from 'lucide-react';
import { specificationsAPI } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [recentSpecs, setRecentSpecs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecentSpecs();
  }, []);

  const fetchRecentSpecs = async () => {
    try {
      const response = await specificationsAPI.getRecent();
      if (response.success) {
        setRecentSpecs(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch recent specs:', error);
    }
  };

  const handleGetStarted = () => {
    navigate('/create');
  };

  const handleViewSpec = (id) => {
    navigate(`/spec/${id}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)'
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                <Sparkles className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold font-display mb-6 animate-fade-in">
              Tasks Generator
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto animate-slide-up">
              Transform your feature ideas into actionable user stories and engineering tasks with AI-powered intelligence
            </p>
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 duration-200"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold font-display text-center mb-4 text-slate-800">
          How It Works
        </h2>
        <p className="text-center text-slate-600 mb-16 text-lg">
          Simple steps to transform your ideas into structured plans
        </p>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              icon: <FileText className="w-8 h-8" />,
              step: '1',
              title: 'Fill the Form',
              description: 'Describe your feature goal, target users, and any constraints'
            },
            {
              icon: <Sparkles className="w-8 h-8" />,
              step: '2',
              title: 'AI Generation',
              description: 'Our AI analyzes your input and generates comprehensive tasks'
            },
            {
              icon: <Zap className="w-8 h-8" />,
              step: '3',
              title: 'Edit & Organize',
              description: 'Customize, reorder, and group tasks to match your workflow'
            },
            {
              icon: <CheckCircle2 className="w-8 h-8" />,
              step: '4',
              title: 'Export & Use',
              description: 'Download as markdown or copy to your project management tool'
            }
          ].map((item, index) => (
            <div key={index} className="relative group">
              <div className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white mb-4 mx-auto group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2 text-center">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-center">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Specifications Section */}
      {recentSpecs.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-slate-50 rounded-3xl mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold font-display text-slate-800">
              Recent Specifications
            </h2>
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentSpecs.map((spec) => (
              <div
                key={spec._id}
                onClick={() => handleViewSpec(spec._id)}
                className="card cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {spec.featureName}
                  </h3>
                  <span className="badge bg-blue-100 text-blue-700 text-xs shrink-0 ml-2">
                    {spec.template || 'custom'}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {spec.goal}
                </p>
                <div className="text-xs text-slate-500">
                  {new Date(spec.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="card bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
          <h2 className="text-3xl font-bold font-display mb-4">
            Ready to streamline your planning?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Start generating structured tasks from your ideas in minutes
          </p>
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 duration-200"
          >
            Create Your First Spec
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;