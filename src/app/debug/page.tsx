'use client';

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/components/providers/AuthProvider';

export default function DebugPage() {
  const { user, session, loading } = useAuthContext();
  const [apiResult, setApiResult] = useState<any>(null);

  useEffect(() => {
    // Test the API endpoint
    fetch('/api/debug/auth')
      .then(res => res.json())
      .then(data => setApiResult(data))
      .catch(err => setApiResult({ error: err.message }));
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Authentication Debug</h1>
      
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Client-side Auth State:</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify({ 
            user: user ? { id: user.id, email: user.email } : null,
            hasSession: !!session,
            loading 
          }, null, 2)}
        </pre>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Server-side Auth Check:</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(apiResult, null, 2)}
        </pre>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Projects API Test:</h2>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => {
            fetch('/api/projects')
              .then(res => res.json())
              .then(data => console.log('Projects API:', data))
              .catch(err => console.error('Projects API Error:', err));
          }}
        >
          Test Projects API
        </button>
      </div>
    </div>
  );
}