import { useState } from 'react';
import { motion } from 'framer-motion';

import {
  BarChart3,
  Plus,
  X,
  Loader2
} from 'lucide-react';

interface LandingPageProps {
  onReportGenerated: (reportId: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onReportGenerated }) => {
  const [companyName, setCompanyName] = useState('');
  const [competitors, setCompetitors] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddCompetitor = () => {
    if (competitors.length < 4) {
      setCompetitors([...competitors, '']);
    }
  };

  const handleRemoveCompetitor = (index: number) => {
    const newCompetitors = [...competitors];
    newCompetitors.splice(index, 1);
    setCompetitors(newCompetitors);
  };

  const handleCompetitorChange = (index: number, value: string) => {
    const newCompetitors = [...competitors];
    newCompetitors[index] = value;
    setCompetitors(newCompetitors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!companyName.trim()) {
      setError('Company name is required');
      return;
    }

    const validCompetitors = competitors.filter(c => c.trim() !== '');

    setLoading(true);
    try {
      const response = await fetch('import.meta.env.VITE_API_URL/api/report/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          competitors: validCompetitors
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const data = await response.json();
      onReportGenerated(data.reportId);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-slate-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full text-center space-y-4 mb-12"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/30">
            <BarChart3 className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
          Video Competitor <span className="text-blue-600">Intelligence</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Analyze YouTube marketing performance against your top competitors and generate consulting-grade PowerPoint reports in seconds.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-100 p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Your Company Name</label>
            <input
              type="text"
              placeholder="e.g.Enter a Company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-slate-700">Competitors (Up to 4)</label>
            </div>

            {competitors.map((comp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder={`Competitor ${idx + 1}`}
                  value={comp}
                  onChange={(e) => handleCompetitorChange(idx, e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                />
                {competitors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCompetitor(idx)}
                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </motion.div>
            ))}

            {competitors.length < 4 && (
              <button
                type="button"
                onClick={handleAddCompetitor}
                className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 mt-2"
              >
                <Plus className="w-4 h-4" /> Add another competitor
              </button>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Analyzing Channels...
              </>
            ) : (
              'Generate Intelligence Report'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LandingPage;
