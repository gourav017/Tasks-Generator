import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, Database, Cpu, Zap, 
  CheckCircle, XCircle, ArrowLeft, RefreshCw 
} from 'lucide-react';
import { healthAPI } from '../services/api';

const Status = () => {
  const navigate = useNavigate();
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await healthAPI.check();
      setHealth(response);
      setLastChecked(new Date());
    } catch (error) {
      setHealth({
        status: 'error',
        services: {
          backend: { status: 'unhealthy', error: error.message },
          database: { status: 'unhealthy' },
          ai: { status: 'unhealthy' }
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
      case 'operational':
        return 'text-green-600';
      case 'degraded':
        return 'text-yellow-600';
      case 'unhealthy':
      case 'error':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'healthy':
      case 'operational':
        return 'bg-green-100 border-green-300';
      case 'degraded':
        return 'bg-yellow-100 border-yellow-300';
      case 'unhealthy':
      case 'error':
        return 'bg-red-100 border-red-300';
      default:
        return 'bg-slate-100 border-slate-300';
    }
  };

  const StatusIcon = ({ status }) => {
    if (status === 'healthy' || status === 'operational') {
      return <CheckCircle className="w-6 h-6 text-green-600" />;
    }
    return <XCircle className="w-6 h-6 text-red-600" />;
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <button
            onClick={checkHealth}
            disabled={loading}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Overall Status */}
        <div className={`card mb-8 border-2 ${
          health ? getStatusBg(health.status) : 'bg-slate-100 border-slate-300'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Activity className={`w-12 h-12 ${
                health ? getStatusColor(health.status) : 'text-slate-600'
              }`} />
              <div>
                <h1 className="text-3xl font-bold font-display text-slate-800">
                  System Status
                </h1>
                <p className={`text-lg font-semibold ${
                  health ? getStatusColor(health.status) : 'text-slate-600'
                }`}>
                  {loading ? 'Checking...' : (health?.status || 'Unknown').toUpperCase()}
                </p>
              </div>
            </div>
            {health && !loading && <StatusIcon status={health.status} />}
          </div>
          {lastChecked && (
            <p className="text-sm text-slate-600 mt-4">
              Last checked: {lastChecked.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Service Status Cards */}
        {health && health.services && (
          <div className="space-y-4">
            {/* Backend Service */}
            <div className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Cpu className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-800 mb-1">
                      Backend Server
                    </h3>
                    <p className="text-slate-600 text-sm mb-3">
                      Express.js API server handling requests
                    </p>
                    
                    {health.services.backend && (
                      <div className="space-y-2 text-sm">
                        {health.services.backend.uptime !== undefined && (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-600">Uptime:</span>
                            <span className="font-medium text-slate-800">
                              {Math.floor(health.services.backend.uptime / 60)} minutes
                            </span>
                          </div>
                        )}
                        {health.services.backend.error && (
                          <div className="text-red-600">
                            Error: {health.services.backend.error}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon status={health.services.backend?.status} />
                  <span className={`font-semibold ${
                    getStatusColor(health.services.backend?.status)
                  }`}>
                    {health.services.backend?.status || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>

            {/* Database Service */}
            <div className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Database className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-800 mb-1">
                      Database
                    </h3>
                    <p className="text-slate-600 text-sm mb-3">
                      MongoDB database for storing specifications
                    </p>
                    
                    {health.services.database && (
                      <div className="space-y-2 text-sm">
                        {health.services.database.connection && (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-600">Connection:</span>
                            <span className="font-medium text-slate-800">
                              {health.services.database.connection}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon status={health.services.database?.status} />
                  <span className={`font-semibold ${
                    getStatusColor(health.services.database?.status)
                  }`}>
                    {health.services.database?.status || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Service */}
            <div className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-800 mb-1">
                      AI Service
                    </h3>
                    <p className="text-slate-600 text-sm mb-3">
                      {health.services.ai?.provider || 'AI provider'} for generating tasks
                    </p>
                    
                    {health.services.ai && (
                      <div className="space-y-2 text-sm">
                        {health.services.ai.model && (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-600">Model:</span>
                            <span className="font-medium text-slate-800">
                              {health.services.ai.model}
                            </span>
                          </div>
                        )}
                        {health.services.ai.provider && (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-600">Provider:</span>
                            <span className="font-medium text-slate-800">
                              {health.services.ai.provider}
                            </span>
                          </div>
                        )}
                        {health.services.ai.error && (
                          <div className="text-red-600">
                            Error: {health.services.ai.error}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon status={health.services.ai?.status} />
                  <span className={`font-semibold ${
                    getStatusColor(health.services.ai?.status)
                  }`}>
                    {health.services.ai?.status || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="card mt-8 bg-blue-50 border border-blue-200">
          <h3 className="font-semibold text-slate-800 mb-2">About Status Monitoring</h3>
          <p className="text-sm text-slate-600">
            This page shows the real-time health status of all system components. 
            The backend server handles API requests, MongoDB stores your specifications, 
            and the Anthropic Claude API generates intelligent task breakdowns. All services 
            must be operational for the application to function correctly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Status;