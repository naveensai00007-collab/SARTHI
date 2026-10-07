import React, { useState, useEffect } from 'react';
import { Certificate } from '../types';
import { findCertificateInRegistry } from '../utils/storage';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Building2,
  ChevronLeft,
} from 'lucide-react';

interface RTOVerificationPortalProps {
  initialCertId?: string;
  onBack?: () => void;
}

export const RTOVerificationPortal: React.FC<RTOVerificationPortalProps> = ({
  initialCertId = '',
  onBack,
}) => {
  const [certIdInput, setCertIdInput] = useState(initialCertId);
  const [searchedCert, setSearchedCert] = useState<Certificate | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (initialCertId) {
      handleVerify(initialCertId);
    }
  }, [initialCertId]);

  const handleVerify = (idToVerify?: string) => {
    const targetId = (idToVerify || certIdInput).trim();
    if (!targetId) return;

    setIsVerifying(true);
    setHasSearched(false);

    // Realistic verification latency simulation
    setTimeout(() => {
      const match = findCertificateInRegistry(targetId);
      setSearchedCert(match);
      setHasSearched(true);
      setIsVerifying(false);
    }, 400);
  };

  const sampleIds = ['SAR-2026-K9P4X2'];

  return (
    <div className="max-w-lg mx-auto p-4 pb-24 space-y-5 select-none">
      {/* Portal Top Bar */}
      <div className="flex items-center justify-between">
        {onBack ? (
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white dark:bg-[#1C1F24] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to App</span>
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-900 text-emerald-400 rounded-full text-xs font-mono font-bold">
          <Building2 className="w-3.5 h-3.5" />
          <span>RTO Officer Portal</span>
        </div>
      </div>

      {/* Official Government Verification Header */}
      <div className="bg-white dark:bg-[#1C1F24] rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm text-center space-y-2">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-[#1B5E20] dark:text-emerald-400 flex items-center justify-center font-bold text-2xl border border-emerald-100 dark:border-emerald-900 shadow-2xs">
          🏛️
        </div>
        <h2 className="text-xl font-black text-[#1A1A1A] dark:text-white tracking-tight">
          Sarthi RTO Certificate Verification
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
          National portal for Motor Vehicle Inspectors to authenticate road competency and pre-licence testing certificates.
        </p>
      </div>

      {/* Verification Input Box */}
      <div className="bg-white dark:bg-[#1C1F24] rounded-3xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider block mb-1.5">
            Enter Certificate ID
          </label>
          <div className="relative">
            <input
              type="text"
              value={certIdInput}
              onChange={(e) => setCertIdInput(e.target.value)}
              placeholder="e.g. SAR-2026-K9P4X2"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-mono uppercase tracking-wider text-[#1A1A1A] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:bg-white dark:focus:bg-gray-800 transition-all shadow-inner"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleVerify();
              }}
            />
          </div>
        </div>

        <button
          disabled={!certIdInput.trim() || isVerifying}
          onClick={() => handleVerify()}
          className="w-full py-3.5 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] hover:from-[#144718] hover:to-[#1B5E20] text-white font-extrabold text-sm rounded-2xl shadow-md shadow-emerald-700/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Search className="w-4 h-4" />
          <span>{isVerifying ? 'Verifying Registry...' : 'Verify Certificate'}</span>
        </button>

        {/* Quick Demo Test Buttons */}
        <div className="pt-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Quick test ID:</span>
          {sampleIds.map((id) => (
            <button
              key={id}
              onClick={() => {
                setCertIdInput(id);
                handleVerify(id);
              }}
              className="font-mono text-[#FF6B35] font-bold underline hover:text-[#E85D04] cursor-pointer"
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Result Card */}
      {hasSearched && (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          {searchedCert ? (
            <div className="bg-white dark:bg-[#1C1F24] rounded-3xl p-6 border-2 border-emerald-500 shadow-lg space-y-4">
              {/* Green Verified Status Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-6 h-6 fill-emerald-500 text-white" />
                  <div>
                    <h3 className="font-black text-base leading-tight">
                      AUTHENTIC & VERIFIED
                    </h3>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                      Official Sarthi Database Match
                    </p>
                  </div>
                </div>

                <span className="font-mono text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
                  {searchedCert.id}
                </span>
              </div>

              {/* Record Details */}
              <div className="space-y-3 pt-1">
                <div className="p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-2xl">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">
                    Candidate Legal Name
                  </span>
                  <div className="text-base font-black text-[#1A1A1A] dark:text-white">
                    {searchedCert.candidateName}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-left">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-2xl">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">
                      State / RTO
                    </span>
                    <div className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      {searchedCert.state}
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-2xl">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">
                      Vehicle Class
                    </span>
                    <div className="text-xs font-bold text-gray-800 dark:text-gray-200 capitalize">
                      {searchedCert.vehicleType} LMV
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-2xl">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">
                      Examination Score
                    </span>
                    <div className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                      {searchedCert.score} / {searchedCert.totalQuestions} ({searchedCert.percentage}%)
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-2xl">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">
                      Issue Date
                    </span>
                    <div className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      {searchedCert.issuedAt}
                    </div>
                  </div>
                </div>
              </div>

              {/* Official Endorsement Callout */}
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/80 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-300 leading-normal flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Candidate meets statutory knowledge standards for the Learner's Licence under Central Motor Vehicles Rules.
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1C1F24] rounded-3xl p-6 border-2 border-rose-300 dark:border-rose-800 shadow-md text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-rose-900 dark:text-rose-300">
                Certificate Not Found
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                No active certificate matching ID <span className="font-mono font-bold text-gray-700 dark:text-gray-300">"{certIdInput}"</span> was found in the Sarthi verification registry. Please re-check the entered characters.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
