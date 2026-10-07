import React, { useEffect, useState, useRef } from 'react';
import { Certificate } from '../types';
import QRCode from 'qrcode';
import {
  Award,
  ShieldCheck,
  Share2,
  Printer,
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
} from 'lucide-react';

interface CertificateCardProps {
  certificate: Certificate;
  onBack: () => void;
  onVerifyInPortal?: (certId: string) => void;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  onBack,
  onVerifyInPortal,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate QR code pointing to verification link
    const verificationLink = `${window.location.origin}?verify=${certificate.id}`;
    QRCode.toDataURL(
      verificationLink,
      {
        width: 200,
        margin: 1,
        color: {
          dark: '#1B5E20',
          light: '#FFFFFF',
        },
      },
      (err, url) => {
        if (!err && url) {
          setQrCodeUrl(url);
        }
      }
    );
  }, [certificate]);

  const handleShareWhatsApp = () => {
    const text = `🎉 I passed my RTO Learner Exam preparation with Sarthi! Scored ${certificate.score}/${certificate.totalQuestions} (${certificate.percentage}%). Certificate ID: ${certificate.id}. Check verification: ${window.location.origin}?verify=${certificate.id}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}?verify=${certificate.id}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-lg mx-auto p-4 pb-24 space-y-5 select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white dark:bg-[#1C1F24] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span className="text-xs font-extrabold text-[#1B5E20] dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1B5E20] dark:text-emerald-400" />
          Verified Certificate
        </span>
      </div>

      {/* The Printable Official Certificate Document Card */}
      <div
        ref={certRef}
        className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-[#1B5E20]/20 shadow-xl relative overflow-hidden print:p-4 print:border-none print:shadow-none"
      >
        {/* Subtle Guilloche / Watermark Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
          <Award className="w-96 h-96 text-black" />
        </div>

        {/* Certificate Decorative Border */}
        <div className="border-2 border-[#1B5E20]/30 rounded-2xl p-5 space-y-5 relative bg-gradient-to-b from-[#FFFDF9] to-white">
          {/* Top National Header */}
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FF6B35] flex items-center justify-center text-white font-black text-xs">
                सा
              </div>
              <span className="text-xs font-black tracking-widest text-[#1A1A1A] uppercase">
                SARTHI NATIONAL LICENSING STANDARD
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1B5E20] uppercase tracking-tight">
              Certificate of Competency
            </h1>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">
              Learner's Licence Qualification • MoRTH STALL Standard
            </p>
          </div>

          {/* Recipient Details */}
          <div className="text-center py-2 space-y-2">
            <p className="text-xs text-gray-500 italic">This certifies that</p>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight border-b-2 border-[#FF6B35]/40 inline-block px-6 pb-1">
              {certificate.candidateName}
            </h2>
            <p className="text-xs text-gray-700 max-w-sm mx-auto leading-relaxed pt-1">
              has thoroughly mastered Indian Road Regulations, Motor Vehicles Act rules, and scored{' '}
              <span className="font-extrabold text-[#1B5E20]">
                {certificate.score}/{certificate.totalQuestions} ({certificate.percentage}%)
              </span>{' '}
              in the official simulated examination.
            </p>
          </div>

          {/* Meta Grid: State, Vehicle, Date */}
          <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-100 text-center">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase block">
                Jurisdiction
              </span>
              <span className="text-xs font-black text-gray-800">
                {certificate.state}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase block">
                Category
              </span>
              <span className="text-xs font-black text-gray-800 capitalize">
                {certificate.vehicleType} LMV
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase block">
                Issue Date
              </span>
              <span className="text-xs font-black text-gray-800">
                {certificate.issuedAt}
              </span>
            </div>
          </div>

          {/* QR Code & Unique ID Footer */}
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">
                Certificate ID
              </span>
              <span className="text-sm font-black font-mono text-[#1A1A1A] tracking-wider bg-gray-100 px-2 py-1 rounded-lg border border-gray-200 block">
                {certificate.id}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3" />
                RTO Pre-test Validated
              </span>
            </div>

            {/* QR Code Image */}
            <div className="flex flex-col items-center">
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="Certificate Verification QR"
                  className="w-16 h-16 rounded-lg border border-emerald-200 p-0.5 shadow-2xs"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-lg animate-pulse" />
              )}
              <span className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">
                Scan to Verify
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sharing & Verification Actions */}
      <div className="space-y-2.5 no-print">
        <button
          onClick={handleShareWhatsApp}
          className="w-full py-4 bg-[#25D366] hover:bg-[#20BA56] text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>Share on WhatsApp & Status</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCopyLink}
            className="py-3 px-4 bg-white dark:bg-[#1C1F24] border border-gray-200 dark:border-gray-700 hover:border-gray-400 text-[#1A1A1A] dark:text-white font-bold text-xs rounded-2xl transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
            <span>{copied ? 'Link Copied!' : 'Copy Verify URL'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="py-3 px-4 bg-white dark:bg-[#1C1F24] border border-gray-200 dark:border-gray-700 hover:border-gray-400 text-[#1A1A1A] dark:text-white font-bold text-xs rounded-2xl transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-gray-500" />
            <span>Print / Save PDF</span>
          </button>
        </div>

        {onVerifyInPortal && (
          <button
            onClick={() => onVerifyInPortal(certificate.id)}
            className="w-full py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs rounded-2xl transition-colors text-center cursor-pointer"
          >
            Test in RTO Officer Verification Portal →
          </button>
        )}
      </div>
    </div>
  );
};
