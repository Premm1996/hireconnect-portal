'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const documentFields = [
  { title: "10th Mark Sheet / Certificate", name: "marks10", accept: ".pdf,.jpg,.jpeg,.png" },
  { title: "12th Mark Sheet / Certificate", name: "marks12", accept: ".pdf,.jpg,.jpeg,.png" },
  { title: "Diploma (if applicable)", name: "diploma", accept: ".pdf,.jpg,.jpeg,.png" },
  { title: "All Semester Mark Sheets (Bachelor's / Master's)", name: "semMarks", accept: ".pdf,.jpg,.jpeg,.png" },
  { title: "Degree Certificate / Provisional Degree Certificate", name: "degreeCert", accept: ".pdf,.jpg,.jpeg,.png" },
  { title: "Aadhaar Card", name: "aadhaar", accept: ".pdf,.jpg,.jpeg,.png" },
  { title: "PAN Card", name: "pan", accept: ".pdf,.jpg,.jpeg,.png" },
  { title: "Passport / Voter ID / Driving License", name: "secondaryId", accept: ".pdf,.jpg,.jpeg,.png" },
  { title: "Passport-size Photograph", name: "photo", accept: ".jpg,.jpeg,.png" },
  { title: "Updated Resume (PDF)", name: "resume", accept: ".pdf" },
  { title: "Previous Company Offer Letter(s)", name: "offerLetter", accept: ".pdf" },
  { title: "Relieving Letter(s)", name: "relievingLetter", accept: ".pdf" },
  { title: "Last 3 Months' Salary Slips", name: "salarySlips", accept: ".pdf" },
  { title: "Experience Certificate(s)", name: "experienceCert", accept: ".pdf" },
  { title: "Canceled Cheque / Bank Passbook", name: "bankProof", accept: ".pdf,.jpg,.jpeg,.png" },
];

export default function CandidateDashboardPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [candidate, setCandidate] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    photo: '',
    position: 'Software Engineer',
    selectionStatus: 'selected', // or 'failed'
    idCard: '',
    documentsUploaded: false,
    documentUploads: {} as Record<string, string>,
    interviewRounds: [
      { round: 1, status: 'passed', link: 'https://meet.google.com/abc-round1' },
      { round: 2, status: 'passed', link: 'https://meet.google.com/abc-round2' },
      { round: 3, status: 'passed', link: 'https://meet.google.com/abc-round3' },
    ],
  });

  function handleLogout() {
    router.push('/');
  }

  function handleBack() {
    router.back();
  }

  function handleUploadDocuments() {
    router.push(`/candidate-dashboard/${params.id}/upload-documents`);
  }

  function handleDocumentChange(e: React.ChangeEvent<HTMLInputElement>, fieldName: string) {
    if (e.target.files && e.target.files[0]) {
      setCandidate(prev => ({
        ...prev,
        documentUploads: {
          ...prev.documentUploads,
          [fieldName]: e.target.files![0].name
        }
      }));
    }
  }

  function handleSubmitDocuments(e: React.FormEvent) {
    e.preventDefault();
    setCandidate(prev => ({ ...prev, documentsUploaded: true }));
  }

  function handleOriginalsConfirm() {
    setCandidate(prev => ({ ...prev, idCard: `id-card-${params.id}.pdf` }));
  }

  // Only show ID card if generated
  if (candidate.idCard) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-2xl mb-4 flex justify-between items-center">
          <button
            className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600"
            onClick={handleBack}
          >
            &#8592; Back
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center border-4 border-white">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Virtual ID Card</h2>
          <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center mb-4 overflow-hidden border-4 border-cyan-400 shadow-lg">
            {candidate.photo ? (
              <img src={candidate.photo} alt="Photo" className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="text-slate-400">No Photo</span>
            )}
          </div>
          <div className="font-bold text-xl text-white mb-2">{candidate.fullName}</div>
          <div className="text-base text-white mb-1">{candidate.position}</div>
          <div className="text-base text-white mb-1">{candidate.email}</div>
          <div className="text-base text-white mb-1">{new Date().toLocaleDateString()}</div>
          <div className="text-base text-white mb-1">ID: {params.id}</div>
          <div className="text-base text-white mb-1">Designation: {candidate.position}</div>
          <div className="text-base text-white mb-1">Date of Joining: {new Date().toLocaleDateString()}</div>
          <div className="text-base text-white mb-1">Nationality: India</div>
          <div className="text-base text-white mb-1">Mobile: +91-XXXXXXXXXX</div>
          <div className="text-base text-white mb-1">Address: Bangalore, India</div>
          <a
            href={`/uploads/${candidate.idCard}`}
            className="mt-6 inline-block px-6 py-3 bg-white text-blue-600 font-bold rounded-lg shadow-lg hover:bg-blue-100 transition"
            download
          >
            Download ID Card
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl mb-4 flex justify-between items-center">
        <button
          className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600"
          onClick={handleBack}
        >
          &#8592; Back
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div className="bg-slate-800 rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Candidate Dashboard</h2>
        <div className="flex flex-col items-center mb-6">
          {candidate.photo ? (
            <img src={candidate.photo} alt="Candidate" className="w-32 h-32 rounded-full object-cover mb-2" />
          ) : (
            <div className="w-32 h-32 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 mb-2">
              No Photo
            </div>
          )}
          <div className="font-bold text-lg text-white">{candidate.fullName}</div>
          <div className="text-slate-300">{candidate.email}</div>
          <div className="text-slate-300">{candidate.position}</div>
        </div>
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-2">Interview Rounds</h3>
          <ul className="space-y-2">
            {candidate.interviewRounds.map((round, idx) => (
              <li key={idx} className="flex items-center gap-4">
                <span className="font-semibold text-white">Round {round.round}:</span>
                <a href={round.link} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">Attend</a>
                <span className={`px-2 py-1 rounded ${round.status === 'passed' ? 'bg-green-600' : round.status === 'failed' ? 'bg-red-600' : 'bg-yellow-600'} text-white`}>
                  {round.status.charAt(0).toUpperCase() + round.status.slice(1)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Document upload form */}
        {candidate.selectionStatus === 'selected' &&
          candidate.interviewRounds.every(r => r.status === 'passed') && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-white mb-4">Upload Required Documents</h3>
            <form onSubmit={handleSubmitDocuments}>
              {documentFields.map((field, index) => (
                <div key={index} className="mb-4">
                  <label className="text-slate-300 font-medium w-64">{field.title}</label>
                  <input
                    type="file"
                    name={field.name}
                    accept={field.accept}
                    className="input"
                    onChange={e => handleDocumentChange(e, field.name)}
                  />
                  {candidate.documentUploads[field.name] && (
                    <span className="text-xs text-green-400">{candidate.documentUploads[field.name]}</span>
                  )}
                </div>
              ))}
              <button type="submit" className="px-6 py-2 rounded-lg bg-cyan-600 text-white font-semibold w-full">Submit All Documents</button>
            </form>
          </div>
        )}

        {/* Confirm originals and generate ID card */}
        {candidate.selectionStatus === 'selected' &&
          candidate.interviewRounds.every(r => r.status === 'passed') &&
          candidate.documentsUploaded &&
          !candidate.idCard && (
          <div className="mt-8 flex flex-col items-center">
            <h3 className="text-xl font-semibold text-white mb-2">Are all uploaded documents original?</h3>
            <button
              className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold"
              onClick={handleOriginalsConfirm}
            >
              Yes, Generate Virtual ID Card
            </button>
          </div>
        )}

        {/* Show message if not selected */}
        {candidate.selectionStatus === 'failed' && (
          <div className="mt-4 px-4 py-2 rounded bg-red-600 text-white font-semibold text-center">Not Selected - Try after 30 days</div>
        )}
      </div>
      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.5rem;
          background: #1e293b;
          color: #fff;
          border: 1px solid #334155;
          margin-bottom: 0.5rem;
        }
        .input:disabled {
          background: #334155;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}