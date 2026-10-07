import { UserProfile, Certificate, VehicleType } from '../types';

const STORAGE_KEY = 'sarthi_user_profile_v1';
const VERIFIED_CERTS_REGISTRY_KEY = 'sarthi_public_verified_certificates_v1';

// Seed initial default certificate for RTO demo / preview verification
const SEED_CERTIFICATE: Certificate = {
  id: 'SAR-2026-K9P4X2',
  candidateName: 'Aarav Sharma',
  state: 'Karnataka',
  vehicleType: 'both',
  score: 14,
  totalQuestions: 15,
  percentage: 93,
  issuedAt: '15 Jan 2026',
  timestamp: Date.now() - 86400000 * 10,
  verificationUrl: 'https://sarthi.app/verify/SAR-2026-K9P4X2',
};

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Learner Driver',
  language: 'en',
  vehicleType: 'both',
  goal: 'both',
  selectedState: 'Karnataka',
  streakDays: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessonIds: ['lesson-1', 'lesson-2', 'lesson-3'],
  completedQuizIds: ['lesson-1', 'lesson-2'],
  mockTestsTaken: 1,
  bestMockScore: 13,
  certificates: [SEED_CERTIFICATE],
  lives: 5,
  lastLifeRegen: Date.now(),
  xp: 350,
  darkMode: false,
  audioNarration: true,
  isOnboarded: false, // will show onboarding if false
};

export const loadUserProfile = (): UserProfile => {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw) as UserProfile;
    // Regenerate lives if time passed (1 life every 30 mins)
    const now = Date.now();
    const elapsedMinutes = (now - (parsed.lastLifeRegen || now)) / (1000 * 60);
    const livesToAdd = Math.floor(elapsedMinutes / 30);
    if (livesToAdd > 0 && parsed.lives < 5) {
      parsed.lives = Math.min(5, parsed.lives + livesToAdd);
      parsed.lastLifeRegen = now;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to load user profile from storage', e);
    return DEFAULT_PROFILE;
  }
};

export const saveUserProfile = (profile: UserProfile): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save user profile', e);
  }
};

// Certificate registry for the RTO verification portal (local-first mock db)
export const saveCertificateToRegistry = (cert: Certificate): void => {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(VERIFIED_CERTS_REGISTRY_KEY);
    const certs: Record<string, Certificate> = raw ? JSON.parse(raw) : {};
    certs[cert.id.toUpperCase().trim()] = cert;
    // ensure seed is always there too
    certs[SEED_CERTIFICATE.id] = SEED_CERTIFICATE;
    localStorage.setItem(VERIFIED_CERTS_REGISTRY_KEY, JSON.stringify(certs));
  } catch (e) {
    console.error('Failed to register certificate', e);
  }
};

export const findCertificateInRegistry = (certId: string): Certificate | null => {
  if (typeof window === 'undefined') return null;
  const normalized = certId.toUpperCase().trim();
  if (normalized === SEED_CERTIFICATE.id) return SEED_CERTIFICATE;

  try {
    const raw = localStorage.getItem(VERIFIED_CERTS_REGISTRY_KEY);
    if (raw) {
      const certs: Record<string, Certificate> = JSON.parse(raw);
      if (certs[normalized]) return certs[normalized];
    }
    // Also check current user's profile
    const profile = loadUserProfile();
    const userCert = profile.certificates.find((c) => c.id.toUpperCase() === normalized);
    if (userCert) return userCert;
    return null;
  } catch {
    return null;
  }
};

export const generateCertificateId = (): string => {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 6; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SAR-${year}-${rand}`;
};

export const createNewCertificate = (
  name: string,
  state: string,
  vehicleType: VehicleType,
  score: number,
  totalQuestions: number
): Certificate => {
  const id = generateCertificateId();
  const percentage = Math.round((score / totalQuestions) * 100);
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  const issuedAt = now.toLocaleDateString('en-IN', options);

  const cert: Certificate = {
    id,
    candidateName: name.trim() || 'Indian Driver',
    state,
    vehicleType,
    score,
    totalQuestions,
    percentage,
    issuedAt,
    timestamp: Date.now(),
    verificationUrl: `https://sarthi.app/verify/${id}`,
  };

  saveCertificateToRegistry(cert);
  return cert;
};
