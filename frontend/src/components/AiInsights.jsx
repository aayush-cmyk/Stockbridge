import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const AiInsights = () => {
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchInsights = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/ai/inventory-insights', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInsights(res.data.insight);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || 'Failed to fetch AI insights. Make sure your API key is set.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="ai-insights-container">
      <div className="ai-header">
        <div className="ai-title">
          <span className="sparkle">✨</span>
          <h3>AI Inventory Assistant</h3>
        </div>
        <button 
          onClick={fetchInsights} 
          disabled={loading}
          className="refresh-btn"
        >
          {loading ? 'Analyzing...' : 'Refresh Insights'}
        </button>
      </div>

      <div className="ai-content">
        {loading ? (
          <div className="loading-shimmer">
            <div className="shimmer-line"></div>
            <div className="shimmer-line"></div>
            <div className="shimmer-line"></div>
          </div>
        ) : error ? (
          <div className="error-box">
            <p>{error}</p>
          </div>
        ) : (
          <div className="markdown-content">
            <ReactMarkdown>{insights}</ReactMarkdown>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .ai-insights-container {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          color: #fff;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }

        .ai-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 12px;
        }

        .ai-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ai-title h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          background: linear-gradient(90deg, #fff, #a5b4fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sparkle {
          font-size: 1.5rem;
          animation: float 3s ease-in-out infinite;
        }

        .refresh-btn {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .refresh-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }

        .refresh-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .markdown-content {
          font-size: 0.95rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
        }

        .markdown-content h1, .markdown-content h2, .markdown-content h3 {
          color: #a5b4fc;
          margin-top: 16px;
          margin-bottom: 8px;
        }

        .markdown-content ul {
          padding-left: 20px;
        }

        .markdown-content li {
          margin-bottom: 6px;
        }

        .error-box {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          padding: 12px;
          border-radius: 8px;
          color: #f87171;
        }

        .loading-shimmer {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .shimmer-line {
          height: 15px;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
          border-radius: 4px;
        }

        .shimmer-line:nth-child(2) { width: 80%; }
        .shimmer-line:nth-child(3) { width: 60%; }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}} />
    </div>
  );
};

export default AiInsights;
