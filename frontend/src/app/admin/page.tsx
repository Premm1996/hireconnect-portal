'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Candidate {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  position: string;
  selectionStatus?: 'selected' | 'failed' | 'in process';
}

export default function AdminDashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    axios.get('/api/candidates').then(res => setCandidates(res.data));
  }, []);

  function handleSelect(id: string) {
    axios.post(`/api/candidate/${id}/select`).then(() => {
      setCandidates(candidates.map(c => c.id === id ? { ...c, selectionStatus: 'selected' } : c));
    });
  }

  function handleFail(id: string) {
    axios.post(`/api/candidate/${id}/fail`).then(() => {
      setCandidates(candidates.map(c => c.id === id ? { ...c, selectionStatus: 'failed' } : c));
    });
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <h2 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {candidates.map(candidate => (
          <div key={candidate.id} className="bg-slate-800 rounded-xl p-6 shadow">
            <div className="font-bold text-lg text-white">{candidate.fullName}</div>
            <div className="text-slate-300">{candidate.email}</div>
            <div className="text-slate-300">{candidate.mobile}</div>
            <div className="text-slate-300">{candidate.position}</div>
            <div className="text-slate-300">Status: {candidate.selectionStatus || 'In Process'}</div>
            <div className="flex gap-2 mt-4">
              <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => handleSelect(candidate.id)}>Select</button>
              <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={() => handleFail(candidate.id)}>Fail</button>
              <a href={`/candidate-profile/${candidate.id}`} className="px-4 py-2 bg-blue-600 text-white rounded">View Profile</a>
            </div>
            <div className="mt-4">
              <label className="block text-slate-300 mb-1">Upload Offer Letter</label>
              <input type="file" accept=".pdf" className="input" />
              {/* Add upload logic */}
            </div>
            <div className="mt-2">
              <button className="px-4 py-2 bg-cyan-600 text-white rounded">Generate ID Card</button>
              {/* Add ID card generation logic */}
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.5rem;
          border-radius: 0.5rem;
          background: #1e293b;
          color: #fff;
          border: 1px solid #334155;
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}