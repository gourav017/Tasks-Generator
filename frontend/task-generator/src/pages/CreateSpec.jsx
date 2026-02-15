import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import { specificationsAPI } from '../services/api';

const CreateSpec = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    featureName: '',
    goal: '',
    targetUsers: '',
    constraints: '',
    template: 'custom'
  });

  const templates = [
    { value: 'custom', label: 'Custom', desc: 'No specific template' },
    { value: 'mobile', label: 'Mobile App', desc: 'iOS/Android considerations' },
    { value: 'web', label: 'Web App', desc: 'Browser-based application' },
    { value: 'internal-tool', label: 'Internal Tool', desc: 'For company use' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.featureName.trim()) {
      setError('Feature name is required');
      return false;
    }
    if (!formData.goal.trim()) {
      setError('Goal is required');
      return false;
    }
    if (!formData.targetUsers.trim()) {
      setError('Target users is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await specificationsAPI.generate(formData);
      if (response.success) {
        navigate(`/spec/${response.data._id}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to generate specification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="card">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display text-slate-800">
                Create New Specification
              </h1>
              <p className="text-slate-600 mt-1">
                Fill in the details and let AI generate your tasks
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Feature Name */}
            <div>
              <label htmlFor="featureName" className="label">
                Feature Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="featureName"
                name="featureName"
                value={formData.featureName}
                onChange={handleChange}
                placeholder="e.g., User Authentication System"
                className="input-field"
                disabled={loading}
              />
            </div>

            {/* Template Selection */}
            <div>
              <label className="label">
                Template Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, template: template.value }))}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      formData.template === template.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                    disabled={loading}
                  >
                    <div className="font-semibold text-slate-800 mb-1">
                      {template.label}
                    </div>
                    <div className="text-xs text-slate-600">
                      {template.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div>
              <label htmlFor="goal" className="label">
                Goal <span className="text-red-500">*</span>
              </label>
              <textarea
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                placeholder="What problem does this feature solve? What value does it provide?"
                rows="4"
                className="input-field resize-none"
                disabled={loading}
              />
              <p className="text-sm text-slate-500 mt-1">
                Describe the main objective and expected outcomes
              </p>
            </div>

            {/* Target Users */}
            <div>
              <label htmlFor="targetUsers" className="label">
                Target Users <span className="text-red-500">*</span>
              </label>
              <textarea
                id="targetUsers"
                name="targetUsers"
                value={formData.targetUsers}
                onChange={handleChange}
                placeholder="Who will use this feature? What are their characteristics and needs?"
                rows="3"
                className="input-field resize-none"
                disabled={loading}
              />
            </div>

            {/* Constraints */}
            <div>
              <label htmlFor="constraints" className="label">
                Constraints (Optional)
              </label>
              <textarea
                id="constraints"
                name="constraints"
                value={formData.constraints}
                onChange={handleChange}
                placeholder="Technical limitations, budget constraints, timeline, dependencies, etc."
                rows="3"
                className="input-field resize-none"
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Tasks
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                disabled={loading}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>

          {loading && (
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="loading-spinner"></div>
                <div>
                  <p className="font-semibold text-blue-900">
                    AI is analyzing your feature...
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    This may take 20-30 seconds. We're generating user stories, engineering tasks, and identifying potential risks.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateSpec;