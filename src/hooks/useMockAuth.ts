// Mock Authentication Hook
// Simulates auth flow with localStorage - NO real backend

import { useState, useEffect, useCallback } from 'react';

export interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  companySize?: string;
  industry?: string;
  country?: string;
  plan: string;
  verified: boolean;
  createdAt: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  company?: string;
  companySize?: string;
  industry?: string;
  country?: string;
  plan?: string;
  newsletter?: boolean;
}

const MOCK_USER_KEY = 'lightpro_mock_user';
const MOCK_PENDING_EMAIL_KEY = 'lightpro_pending_email';

export const useMockAuth = () => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(MOCK_USER_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(MOCK_USER_KEY);
      }
    }
    
    const storedEmail = localStorage.getItem(MOCK_PENDING_EMAIL_KEY);
    if (storedEmail) {
      setPendingEmail(storedEmail);
    }
    
    setIsLoading(false);
  }, []);

  // Simulate login
  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock validation
    if (!email || !password) {
      setIsLoading(false);
      return { success: false, error: 'Email and password are required' };
    }
    
    // Simulate successful login
    const mockUser: MockUser = {
      id: 'user-' + Date.now(),
      firstName: email.split('@')[0],
      lastName: 'User',
      email,
      plan: 'professional',
      verified: true,
      createdAt: new Date().toISOString(),
    };
    
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
    setIsLoading(false);
    
    return { success: true };
  }, []);

  // Simulate signup
  const signup = useCallback(async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (!data.email || !data.password || !data.firstName || !data.lastName) {
      setIsLoading(false);
      return { success: false, error: 'All required fields must be filled' };
    }
    
    // Create mock user (not verified yet)
    const mockUser: MockUser = {
      id: 'user-' + Date.now(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      company: data.company,
      companySize: data.companySize,
      industry: data.industry,
      country: data.country,
      plan: data.plan || 'starter',
      verified: false,
      createdAt: new Date().toISOString(),
    };
    
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
    localStorage.setItem(MOCK_PENDING_EMAIL_KEY, data.email);
    setUser(mockUser);
    setPendingEmail(data.email);
    setIsLoading(false);
    
    return { success: true };
  }, []);

  // Simulate email verification
  const verifyEmail = useCallback(async (code: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Accept any 6-digit code for demo purposes
    if (code.length !== 6 || !/^\d+$/.test(code)) {
      setIsLoading(false);
      return { success: false, error: 'Please enter a valid 6-digit code' };
    }
    
    // Update user as verified
    if (user) {
      const verifiedUser = { ...user, verified: true };
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(verifiedUser));
      localStorage.removeItem(MOCK_PENDING_EMAIL_KEY);
      setUser(verifiedUser);
      setPendingEmail(null);
    }
    
    setIsLoading(false);
    return { success: true };
  }, [user]);

  // Simulate resend verification email
  const resendVerification = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Always succeed in mock mode
    return { success: true };
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem(MOCK_USER_KEY);
    localStorage.removeItem(MOCK_PENDING_EMAIL_KEY);
    setUser(null);
    setPendingEmail(null);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user && user.verified,
    pendingEmail,
    login,
    signup,
    verifyEmail,
    resendVerification,
    logout,
  };
};

// Helper to save email leads
export const saveEmailLead = (email: string, source: string = 'homepage') => {
  const leads = JSON.parse(localStorage.getItem('lightpro_leads') || '[]');
  leads.push({
    email,
    source,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem('lightpro_leads', JSON.stringify(leads));
};

// Helper to save contact form submissions
export const saveContactSubmission = (data: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
}) => {
  const submissions = JSON.parse(localStorage.getItem('lightpro_contacts') || '[]');
  submissions.push({
    ...data,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem('lightpro_contacts', JSON.stringify(submissions));
};
