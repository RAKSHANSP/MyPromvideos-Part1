import { useEffect, useState } from 'react';

import {
  ArrowLeft,
  Download,
  Users
} from 'lucide-react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ReportDashboardProps {
  reportId: string;
  onBack: () => void;
}

const ReportDashboard: React.FC<ReportDashboardProps> = ({
  reportId,
  onBack
}) => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/report/${reportId}`
        );

        if (!res.ok) {
          throw new Error('Failed to fetch report');
        }

        const data = await res.json();

        setReport(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />

          <p className="text-lg font-medium text-slate-600">
            Loading intelligence data...
          </p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-medium">
            {error || 'Report not found'}
          </p>

          <button
            onClick={onBack}
            className="text-blue-600 font-medium hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const competitors = report.competitors.filter(
    (c: any) => c.channelData
  );

  const chartData = competitors.map((c: any) => ({
    name: c.name,
    subscribers: c.channelData.subscribers,
    views: Number(c.channelData.totalViews),
    engagement: parseFloat(
      c.channelData.engagementRate.toFixed(2)
    )
  }));

  const handleDownloadPPT = () => {
    window.open(
      `${import.meta.env.VITE_API_URL}/api/ppt/${reportId}`,
      '_blank'
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <h1 className="text-xl font-bold text-slate-900">
              Intelligence Report: {report.companyName}
            </h1>
          </div>

          <button
            onClick={handleDownloadPPT}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export PPT
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">

        {/* KPI SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 text-blue-600 mb-2">
              <Users className="w-5 h-5" />

              <h3 className="font-semibold text-slate-700">
                Total Analyzed
              </h3>
            </div>

            <p className="text-3xl font-bold text-slate-900">
              {competitors.length} Channels
            </p>
          </div>
        </section>

        {/* CHARTS */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Subscribers */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">
              Audience Size (Subscribers)
            </h3>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E2E8F0"
                  />

                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) =>
                      `${(value / 1000000).toFixed(1)}M`
                    }
                  />

                  <Tooltip cursor={{ fill: '#F1F5F9' }} />

                  <Bar
                    dataKey="subscribers"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Engagement */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">
              Engagement Rate (%)
            </h3>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E2E8F0"
                  />

                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip cursor={{ fill: '#F1F5F9' }} />

                  <Bar
                    dataKey="engagement"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* TABLE */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
            <h3 className="text-lg font-bold text-slate-900">
              Channel Performance Breakdown
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                  <th className="px-6 py-4 font-semibold">
                    Company Channel
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Subscribers
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Total Views
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Videos
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Engagement
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Uploads/Wk
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {competitors.map((c: any, i: number) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {c.name}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {c.channelData.subscribers.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {Number(
                        c.channelData.totalViews
                      ).toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {c.channelData.videoCount.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-emerald-600 font-medium">
                      {c.channelData.engagementRate.toFixed(2)}%
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {c.channelData.uploadFrequency.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ReportDashboard;