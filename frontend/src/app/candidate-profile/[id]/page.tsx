'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function CandidateProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    dob: '',
    gender: '',
    nationality: '',
    photo: '',
    idProof: '',
    qualification: '',
    specialization: '',
    college: '',
    graduationYear: '',
    cgpa: '',
    resume: '',
    position: '',
    experience: '',
    expectedSalary: '',
    location: '',
    noticePeriod: '',
    interviewStatus: '',
    interviewRound: '',
    interviewDate: '',
    interviewMode: '',
    interviewFeedback: '',
    interviewScore: '',
    joiningDate: '',
    additionalDocs: '',
    emergencyContact: '',
    linkedin: '',
    certification: '',
    agree: false,
    selectionStatus: '', // 'selected', 'failed', ''
    documentsUploaded: false,
    offerLetter: '',
    signedOfferLetter: '',
    idCard: '',
  });
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    // Fetch candidate details from backend
    axios.get(`/api/candidate/${params.id}`).then(res => {
      setForm(res.data);
    });
  }, [params.id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name, value, type } = target;
    
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (target as HTMLInputElement).checked : value,
    }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, files } = e.target;
    if (files && files[0]) {
      setForm(prev => ({
        ...prev,
        [name]: files[0].name, // For demo, just store filename
      }));
    }
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // Save logic here (API call)
    router.push(`/candidate-dashboard/${params.id}`);
  }

  function handleLogout() {
    // Clear session logic here
    router.push('/');
  }

  function handlePass() {
    setForm(prev => ({ ...prev, selectionStatus: 'selected' }));
  }

  function handleFail() {
    setForm(prev => ({ ...prev, selectionStatus: 'failed' }));
  }

  function handleDocumentsUpload(e: React.FormEvent) {
    e.preventDefault();
    setForm(prev => ({ ...prev, documentsUploaded: true }));
    // Upload logic here (API call)
  }

  function handleSignedOfferUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const { files } = e.target;
    if (files && files[0]) {
      setForm(prev => ({
        ...prev,
        signedOfferLetter: files[0].name,
        idCard: 'virtual_id_card.pdf', // Simulate ID card generation
      }));
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl mb-4 flex justify-end items-center">
        <button
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div className="bg-slate-800 rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Candidate Profile</h2>
        <form className="space-y-4" onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* All fields are editable by default */}
            <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" className="input" />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email Address" className="input" />
            <input name="mobile" value={form.mobile} onChange={handleChange} placeholder="Mobile Number" className="input" />
            <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" className="input" />
            <input name="dob" value={form.dob} onChange={handleChange} placeholder="Date of Birth" type="date" className="input" />
            <select name="gender" value={form.gender} onChange={handleChange} className="input">
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input name="nationality" value={form.nationality} onChange={handleChange} placeholder="Nationality" className="input" />
            <div>
              <label className="block text-slate-300 mb-1">Photo Upload</label>
              <input name="photo" type="file" accept="image/*" onChange={handleFileChange} className="input" />
              {form.photo && <span className="text-xs text-slate-400">{form.photo}</span>}
            </div>
            <div>
              <label className="block text-slate-300 mb-1">ID Proof Upload</label>
              <input name="idProof" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="input" />
              {form.idProof && <span className="text-xs text-slate-400">{form.idProof}</span>}
            </div>
            <input name="qualification" value={form.qualification} onChange={handleChange} placeholder="Highest Qualification" className="input" />
            <input name="specialization" value={form.specialization} onChange={handleChange} placeholder="Specialization" className="input" />
            <input name="college" value={form.college} onChange={handleChange} placeholder="College/University Name" className="input" />
            <input name="graduationYear" value={form.graduationYear} onChange={handleChange} placeholder="Year of Graduation" className="input" />
            <input name="cgpa" value={form.cgpa} onChange={handleChange} placeholder="CGPA / Percentage" className="input" />
            <div>
              <label className="block text-slate-300 mb-1">Resume Upload (PDF)</label>
              <input name="resume" type="file" accept=".pdf" onChange={handleFileChange} className="input" />
              {form.resume && <span className="text-xs text-slate-400">{form.resume}</span>}
            </div>
            <input name="position" value={form.position} onChange={handleChange} placeholder="Position Applied For" className="input" />
            <input name="experience" value={form.experience} onChange={handleChange} placeholder="Years of Experience" className="input" />
            <input name="expectedSalary" value={form.expectedSalary} onChange={handleChange} placeholder="Expected Salary" className="input" />
            <input name="location" value={form.location} onChange={handleChange} placeholder="Preferred Location" className="input" />
            <input name="noticePeriod" value={form.noticePeriod} onChange={handleChange} placeholder="Notice Period" className="input" />
            <input name="interviewStatus" value={form.interviewStatus} onChange={handleChange} placeholder="Interview Status" className="input" />
            <input name="interviewRound" value={form.interviewRound} onChange={handleChange} placeholder="Interview Round" className="input" />
            <input name="interviewDate" value={form.interviewDate} onChange={handleChange} placeholder="Interview Date & Time" type="datetime-local" className="input" />
            <select name="interviewMode" value={form.interviewMode} onChange={handleChange} className="input">
              <option value="">Interview Mode</option>
              <option value="online">Online</option>
              <option value="in-person">In-person</option>
            </select>
            <textarea name="interviewFeedback" value={form.interviewFeedback} onChange={handleChange} placeholder="Interview Feedback" className="input" />
            <input name="interviewScore" value={form.interviewScore} onChange={handleChange} placeholder="Interview Score" className="input" />
            <input name="joiningDate" value={form.joiningDate} onChange={handleChange} placeholder="Joining Date" type="date" className="input" />
            <div>
              <label className="block text-slate-300 mb-1">Additional Document Uploads</label>
              <input name="additionalDocs" type="file" multiple onChange={handleFileChange} className="input" />
              {form.additionalDocs && <span className="text-xs text-slate-400">{form.additionalDocs}</span>}
            </div>
            <input name="emergencyContact" value={form.emergencyContact} onChange={handleChange} placeholder="Emergency Contact (optional)" className="input" />
            <input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="LinkedIn or GitHub Link (optional)" className="input" />
            <input name="certification" value={form.certification} onChange={handleChange} placeholder="Certification Details (optional)" className="input" />
          </div>
          <label
            className="flex items-center gap-2 text-slate-300 mt-4 cursor-pointer"
            onClick={() => setShowTermsModal(true)}
          >
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              className="accent-cyan-500"
              disabled={!termsAccepted}
            />
            Agree to Terms & Conditions
          </label>
          <div className="flex justify-end gap-4 mt-6">
            <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold">
              Submit
            </button>
          </div>
        </form>
        {/* Document Upload if selected */}
        {form.selectionStatus === 'selected' && !form.documentsUploaded && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-white mb-2">Upload Documents</h3>
            <form onSubmit={handleDocumentsUpload} className="space-y-3">
              <input type="file" name="photo" accept="image/*" className="input" />
              <input type="file" name="aadhar" accept=".pdf,.jpg,.jpeg,.png" className="input" />
              <input type="file" name="marks10" accept=".pdf" className="input" />
              <input type="file" name="marks12" accept=".pdf" className="input" />
              <input type="file" name="bachelors" accept=".pdf" className="input" />
              <input type="file" name="masters" accept=".pdf" className="input" />
              {/* ...other necessary fields... */}
              <button type="submit" className="px-6 py-2 rounded-lg bg-cyan-600 text-white font-semibold">Submit Documents</button>
            </form>
          </div>
        )}
        {/* Offer Letter Download/Upload if uploaded by admin */}
        {form.selectionStatus === 'selected' && form.documentsUploaded && form.offerLetter && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-white mb-2">Offer Letter</h3>
            <a href={`/uploads/${form.offerLetter}`} className="px-4 py-2 bg-blue-600 text-white rounded">Download Offer Letter</a>
            <div className="mt-4">
              <label className="block text-slate-300 mb-1">Upload Signed Offer Letter</label>
              <input type="file" name="signedOfferLetter" accept=".pdf" className="input" onChange={handleSignedOfferUpload} />
            </div>
          </div>
        )}
        {/* Virtual ID Card if signed offer letter uploaded */}
        {form.selectionStatus === 'selected' && form.signedOfferLetter && form.idCard && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-white mb-2">Virtual ID Card</h3>
            <div className="bg-white rounded-lg p-4 flex flex-col items-center w-64 mx-auto">
              {form.photo && <img src={form.photo} alt="Photo" className="w-20 h-20 rounded-full mb-2" />}
              <div className="font-bold text-lg">{form.fullName}</div>
              <div className="text-sm text-slate-700">{form.mobile}</div>
              <div className="text-sm text-slate-700">{form.position}</div>
              <div className="text-sm text-slate-700">{form.joiningDate}</div>
              <div className="text-sm text-slate-700">{form.nationality}</div>
            </div>
            <a href={`/uploads/${form.idCard}`} className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded">Download ID Card</a>
          </div>
        )}
      </div>
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-center">Terms & Conditions</h3>
            <div className="text-slate-700 mb-6" style={{ maxHeight: 200, overflowY: 'auto' }}>
              {/* Add your terms and conditions text here */}
              By proceeding, you agree to provide accurate information and comply with all requirements for the hiring process. Uploaded documents must be genuine. Any false information may result in disqualification.
            </div>
            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2 rounded-lg bg-cyan-600 text-white font-semibold"
                onClick={() => {
                  setTermsAccepted(true);
                  setShowTermsModal(false);
                }}
              >
                Agree
              </button>
              <button
                className="px-6 py-2 rounded-lg bg-slate-400 text-white font-semibold"
                onClick={() => setShowTermsModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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