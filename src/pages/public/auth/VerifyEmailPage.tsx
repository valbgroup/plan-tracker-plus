import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight,
  Mail,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useMockAuth } from '@/hooks/useMockAuth';
import { useToast } from '@/hooks/use-toast';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

export const VerifyEmailPage = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  
  const { pendingEmail, verifyEmail, resendVerification } = useMockAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Auto-submit when 6 digits entered
  useEffect(() => {
    if (code.length === 6) {
      handleVerify();
    }
  }, [code]);

  const handleVerify = async () => {
    if (code.length !== 6) return;
    
    setIsLoading(true);
    
    const result = await verifyEmail(code);
    
    if (result.success) {
      setIsVerified(true);
      toast({
        title: 'Email verified!',
        description: 'Your account is now active.',
      });
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/app/dashboard/operational');
      }, 2000);
    } else {
      toast({
        title: 'Verification failed',
        description: result.error || 'Invalid verification code',
        variant: 'destructive',
      });
      setCode('');
    }
    
    setIsLoading(false);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    setIsResending(true);
    
    const result = await resendVerification();
    
    if (result.success) {
      toast({
        title: 'Code resent!',
        description: 'Check your inbox for the new verification code.',
      });
      setResendCooldown(60);
    } else {
      toast({
        title: 'Failed to resend',
        description: result.error || 'Please try again later',
        variant: 'destructive',
      });
    }
    
    setIsResending(false);
  };

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 light">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="h-20 w-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Email Verified!
          </h1>
          <p className="text-slate-600 mb-8">
            Redirecting you to your dashboard...
          </p>
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 light px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/public" className="flex items-center gap-2 justify-center mb-8">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white font-bold">LP</span>
          </div>
          <span className="text-2xl font-bold text-slate-900">LightPro</span>
        </Link>
        
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Check your email
          </h1>
          <p className="text-slate-600 mb-2">
            We've sent a 6-digit verification code to
          </p>
          <p className="font-medium text-slate-900 mb-8">
            {pendingEmail || 'your email address'}
          </p>
          
          <div className="mb-6">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={setCode}
              disabled={isLoading}
            >
              <InputOTPGroup className="gap-2 justify-center">
                <InputOTPSlot index={0} className="h-12 w-12 text-lg border-slate-200 text-slate-900" />
                <InputOTPSlot index={1} className="h-12 w-12 text-lg border-slate-200 text-slate-900" />
                <InputOTPSlot index={2} className="h-12 w-12 text-lg border-slate-200 text-slate-900" />
                <InputOTPSlot index={3} className="h-12 w-12 text-lg border-slate-200 text-slate-900" />
                <InputOTPSlot index={4} className="h-12 w-12 text-lg border-slate-200 text-slate-900" />
                <InputOTPSlot index={5} className="h-12 w-12 text-lg border-slate-200 text-slate-900" />
              </InputOTPGroup>
            </InputOTP>
            
            <p className="text-sm text-slate-500 mt-4">
              Enter any 6-digit code for demo purposes
            </p>
          </div>
          
          <Button
            onClick={handleVerify}
            className="w-full h-12 bg-primary hover:bg-primary/90 mb-4"
            disabled={code.length !== 6 || isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0 || isResending}
            className="flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 disabled:text-slate-400 mx-auto"
          >
            <RefreshCw className={`h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
            {resendCooldown > 0 
              ? `Resend code in ${resendCooldown}s`
              : 'Resend verification code'
            }
          </button>
        </div>
        
        <p className="mt-8 text-center text-sm text-slate-600">
          Wrong email?{' '}
          <Link to="/public/auth/signup" className="text-primary hover:text-primary/80 font-medium">
            Go back to signup
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
