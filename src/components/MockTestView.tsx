import React, { useState, useEffect, useRef } from 'react';
import { QuizQuestion, UserProfile, Certificate, StateThreshold } from '../types';
import { INDIAN_STATES } from '../data/translations';
import { TrafficSignSvg } from './TrafficSignSvg';
import { createNewCertificate } from '../utils/storage';
import {
  Clock,
  Camera,
  CameraOff,
  CheckCircle2,
  XCircle,
  Award,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  MapPin,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MockTestViewProps {
  profile: UserProfile;
  allQuestions: QuizQuestion[];
  onCompleteTest: (cert: Certificate | null, score: number, total: number) => void;
  onBack: () => void;
  onViewCertificate: (cert: Certificate) => void;
}

export const MockTestView: React.FC<MockTestViewProps> = ({
  profile,
  allQuestions,
  onCompleteTest,
  onBack,
  onViewCertificate,
}) => {
  const [testQuestions, setTestQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(
    Array(15).fill(null)
  );
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15:00
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [generatedCert, setGeneratedCert] = useState<Certificate | null>(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [selectedState, setSelectedState] = useState(profile.selectedState || 'Karnataka');

  // AI-Proctored Camera simulation state
  const [isProctored, setIsProctored] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // State passing threshold (default 9/15, or state specific e.g. 10 or 12)
  const stateConfig: StateThreshold =
    INDIAN_STATES.find((s) => s.name.toLowerCase() === selectedState.toLowerCase()) || {
      stateCode: 'KA',
      name: selectedState,
      passingScore: 9,
      totalQuestions: 15,
    };

  const passingScore = stateConfig.passingScore;

  // Initialize randomized 15 questions on mount or retake
  const initQuestions = () => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    setTestQuestions(shuffled.slice(0, 15));
    setUserAnswers(Array(15).fill(null));
    setCurrentIndex(0);
    setTimeLeft(15 * 60);
    setIsSubmitted(false);
    setFinalScore(0);
    setGeneratedCert(null);
    setReviewMode(false);
  };

  useEffect(() => {
    initQuestions();
  }, []);

  const handleSelectAnswer = (optionIdx: number) => {
    if (isSubmitted) return;
    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = optionIdx;
    setUserAnswers(newAnswers);
  };

  const handleSubmitTest = () => {
    if (isSubmitted || testQuestions.length === 0) return;

    let score = 0;
    testQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        score++;
      }
    });

    setFinalScore(score);
    setIsSubmitted(true);

    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }

    const passed = score >= passingScore;
    let cert: Certificate | null = null;

    if (passed) {
      cert = createNewCertificate(
        profile.name,
        selectedState,
        profile.vehicleType,
        score,
        15
      );
      setGeneratedCert(cert);

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch {
        // ignore
      }
    }

    onCompleteTest(cert, score, 15);
  };

  // Keep reference to latest submit function
  const submitRef = useRef<() => void>(handleSubmitTest);
  submitRef.current = handleSubmitTest;

  // Timer countdown (stable 1-second ticker)
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          submitRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Toggle Camera Proctoring
  const toggleCameraProctoring = async () => {
    if (isProctored) {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
      }
      setIsProctored(false);
    } else {
      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 240, height: 180 },
        });
        setCameraStream(stream);
        setIsProctored(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setCameraError('Camera access required for AI-Proctor simulation.');
      }
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = userAnswers.filter((a) => a !== null).length;
  const currentQ = testQuestions[currentIndex] || testQuestions[0];
  const isTimerLow = timeLeft <= 5 * 60;

  // Render Post-Test Result & Certificate View
  if (isSubmitted) {
    const passed = finalScore >= passingScore;
    const percentage = Math.round((finalScore / 15) * 100);

    return (
      <div className="max-w-md mx-auto p-4 pb-24 space-y-5 select-none animate-in fade-in duration-300">
        {/* Result Header Card */}
        <div
          className={`p-6 rounded-3xl text-center space-y-4 border ${
            passed
              ? 'bg-gradient-to-b from-emerald-50 via-white to-white dark:from-emerald-950/40 dark:via-[#1C1F24] dark:to-[#1C1F24] border-emerald-200 dark:border-emerald-800'
              : 'bg-gradient-to-b from-orange-50 via-white to-white dark:from-orange-950/40 dark:via-[#1C1F24] dark:to-[#1C1F24] border-orange-200 dark:border-orange-900'
          }`}
        >
          <div className="w-20 h-20 mx-auto rounded-3xl bg-white dark:bg-[#1C1F24] shadow-md flex items-center justify-center text-4xl border border-gray-100 dark:border-gray-800">
            {passed ? '🏆' : '📚'}
          </div>

          <div className="space-y-1">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                passed
                  ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200'
                  : 'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200'
              }`}
            >
              {passed ? 'Official STALL Qualified' : 'Review & Retake'}
            </span>
            <h2 className="text-2xl font-black text-[#1A1A1A] dark:text-white">
              {passed
                ? `You Passed! ${finalScore}/15 (${percentage}%)`
                : `Score: ${finalScore}/15 (${percentage}%)`}
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-300 max-w-xs mx-auto">
              {passed
                ? `Congratulations! You met the ${passingScore}/15 passing threshold for ${selectedState}.`
                : `You needed ${passingScore}/15 to pass in ${selectedState}. You are very close! Review the explanations below.`}
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 py-2 border-t border-b border-gray-100 dark:border-gray-800">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Correct</div>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{finalScore}</div>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-800" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Incorrect</div>
              <div className="text-xl font-black text-rose-500">{15 - finalScore}</div>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-800" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Threshold</div>
              <div className="text-xl font-black text-gray-700 dark:text-gray-300">{passingScore}/15</div>
            </div>
          </div>

          {passed && generatedCert && (
            <button
              onClick={() => onViewCertificate(generatedCert)}
              className="w-full py-4 bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Award className="w-5 h-5" />
              <span>View Official Sarthi Certificate</span>
            </button>
          )}

          {/* Action Buttons: Retake, Review, Back */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={initQuestions}
              className="py-3 bg-[#FF6B35] hover:bg-[#E85D04] text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Test</span>
            </button>
            <button
              onClick={() => setReviewMode(!reviewMode)}
              className="py-3 bg-white dark:bg-[#1C1F24] border border-gray-200 dark:border-gray-700 hover:border-gray-400 text-xs font-bold text-gray-700 dark:text-gray-200 rounded-2xl transition-colors cursor-pointer"
            >
              {reviewMode ? 'Hide Review' : 'See What You Missed'}
            </button>
          </div>

          <button
            onClick={onBack}
            className="w-full py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-bold text-gray-800 dark:text-white rounded-2xl transition-colors cursor-pointer"
          >
            Back to Home Dashboard
          </button>
        </div>

        {/* Detailed Question Review Mode */}
        {reviewMode && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <h3 className="font-extrabold text-sm text-[#1A1A1A] dark:text-white px-1">
              Detailed Question Review (15 Questions)
            </h3>

            {testQuestions.map((q, idx) => {
              const userAns = userAnswers[idx];
              const isCorrect = userAns === q.correctIndex;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border text-left space-y-2 ${
                    isCorrect
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                      Q{idx + 1}
                    </span>
                    <span
                      className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isCorrect
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                          : 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Correct
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" /> Missed
                        </>
                      )}
                    </span>
                  </div>

                  {q.signSvgKey && (
                    <div className="flex justify-center py-1">
                      <TrafficSignSvg svgKey={q.signSvgKey} size={70} />
                    </div>
                  )}

                  <p className="text-xs sm:text-sm font-bold text-[#1A1A1A] dark:text-white">
                    {q.question}
                  </p>

                  <div className="text-xs space-y-1 pt-1">
                    <div className="text-emerald-800 dark:text-emerald-300 font-semibold">
                      ✓ Correct Answer: {q.options[q.correctIndex]}
                    </div>
                    {!isCorrect && userAns !== null && (
                      <div className="text-rose-700 dark:text-rose-400">
                        ✗ Your Selection: {q.options[userAns]}
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-600 dark:text-gray-300 pt-1 border-t border-gray-200/60 dark:border-gray-800 leading-relaxed">
                    <span className="font-bold text-gray-800 dark:text-white">Why: </span>
                    {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Active Exam Interface (Mirroring official STALL / Parivahan layout)
  return (
    <div className="max-w-md mx-auto min-h-[90vh] flex flex-col justify-between p-4 pb-20 select-none bg-white dark:bg-[#1C1F24] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
      {/* Official Exam Header */}
      <div className="space-y-3 pb-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <span>MoRTH • STALL</span>
              <span>•</span>
              <span>{selectedState} RTO</span>
            </div>
            <h2 className="text-base font-black text-[#1A1A1A] dark:text-white">
              Learner Licence Mock Test
            </h2>
          </div>

          {/* Official 15-Minute Countdown Timer */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black shadow-xs transition-colors ${
              isTimerLow
                ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(timeLeft)}</span>
          </div>
        </div>

        {/* AI Proctor Mode Toggle & State Selection */}
        <div className="flex items-center justify-between text-xs pt-1">
          <button
            onClick={toggleCameraProctoring}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
              isProctored
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            {isProctored ? (
              <Camera className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <CameraOff className="w-3.5 h-3.5 text-gray-400" />
            )}
            <span>AI Proctor {isProctored ? 'Active' : 'Off'}</span>
          </button>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
            <MapPin className="w-3 h-3 text-[#FF6B35]" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-transparent border-b border-gray-300 dark:border-gray-700 font-bold text-gray-700 dark:text-gray-200 focus:outline-none cursor-pointer"
            >
              {INDIAN_STATES.map((s) => (
                <option key={s.stateCode} value={s.name} className="dark:bg-[#1C1F24]">
                  {s.name} ({s.passingScore}/15)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Proctored Video Picture-in-Picture */}
        {isProctored && (
          <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="w-20 h-16 rounded-xl overflow-hidden bg-black shrink-0 relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
              />
              <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <div className="text-[11px] text-gray-600 dark:text-gray-300">
              <span className="font-bold text-[#1A1A1A] dark:text-white block">
                Face Detection Active
              </span>
              Simulates Karnataka SmartLock / AI vigilance during online test.
            </div>
          </div>
        )}

        {cameraError && (
          <div className="text-[11px] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-xl">
            {cameraError}
          </div>
        )}
      </div>

      {/* Main Question Display */}
      {currentQ && (
        <div className="my-auto py-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-semibold">
            <span>Question {currentIndex + 1} of 15</span>
            <span>{answeredCount} answered</span>
          </div>

          {currentQ.signSvgKey && (
            <div className="flex justify-center py-2 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
              <TrafficSignSvg svgKey={currentQ.signSvgKey} size={110} />
            </div>
          )}

          <h3 className="text-base sm:text-lg font-extrabold text-[#1A1A1A] dark:text-white leading-snug">
            {currentQ.question}
          </h3>

          {/* Radio Button Options (Official STALL test format) */}
          <div className="space-y-2 pt-1">
            {currentQ.options.map((opt, oIdx) => {
              const isChecked = userAnswers[currentIndex] === oIdx;

              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectAnswer(oIdx)}
                  className={`w-full p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3 text-left cursor-pointer ${
                    isChecked
                      ? 'border-[#FF6B35] bg-orange-50/60 dark:bg-orange-950/30 font-semibold text-[#1A1A1A] dark:text-white shadow-xs'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1C1F24] text-gray-700 dark:text-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isChecked
                        ? 'border-[#FF6B35] bg-[#FF6B35]'
                        : 'border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800'
                    }`}
                  >
                    {isChecked && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-xs sm:text-sm leading-normal flex-1">
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation & Question Circle Grid */}
      <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-800">
        {/* Numbered Circles Grid (1 to 15) */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto py-1">
          {Array.from({ length: 15 }, (_, i) => {
            const isAnswered = userAnswers[i] !== null;
            const isCurrent = currentIndex === i;

            let circleStyle = 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700';
            if (isAnswered) {
              circleStyle = 'bg-[#10B981] text-white font-bold border-[#10B981]';
            }
            if (isCurrent) {
              circleStyle = 'ring-2 ring-[#FF6B35] ring-offset-1 font-black';
            }

            return (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-7 h-7 rounded-full text-[11px] shrink-0 flex items-center justify-center transition-all cursor-pointer ${circleStyle}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        {/* Prev / Next & Submit Controls */}
        <div className="flex items-center gap-2">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="p-3.5 bg-gray-100 dark:bg-gray-800 disabled:opacity-40 text-gray-700 dark:text-gray-300 font-bold rounded-2xl transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {currentIndex < 14 ? (
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(14, prev + 1))}
              className="flex-1 py-3.5 bg-[#FF6B35] hover:bg-[#E85D04] text-white font-extrabold text-xs sm:text-sm rounded-2xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer"
            >
              <span>Next Question</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmitTest}
              className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-2xl transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Test ({answeredCount}/15)</span>
            </button>
          )}

          <button
            onClick={handleSubmitTest}
            className="py-3.5 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-bold text-xs rounded-2xl transition-colors cursor-pointer"
            title="Submit now"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
