import { useState } from 'react';

import LandingPage from './components/LandingPage';
import ReportDashboard from './components/ReportDashboard';

function App() {
  const [reportId, setReportId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {reportId ? (
        <ReportDashboard
          reportId={reportId}
          onBack={() => setReportId(null)}
        />
      ) : (
        <LandingPage
          onReportGenerated={(id) => setReportId(id)}
        />
      )}
    </div>
  );
}

export default App;