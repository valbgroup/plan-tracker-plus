import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowRight,
  Eye,
  EyeOff,
  Check,
  Shield,
  Clock,
  Users,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useMockAuth } from '@/hooks/useMockAuth';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useMockAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    const result = await login(data.email, data.password);
    
    if (result.success) {
      toast({
        title: 'Welcome back!',
        description: 'You have been successfully logged in.',
      });
      navigate('/app/dashboard/operational');
    } else {
      toast({
        title: 'Login failed',
        description: result.error || 'Invalid email or password',
        variant: 'destructive',
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex light">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/public" className="flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold">LP</span>
            </div>
            <span className="text-2xl font-bold text-slate-900">LightPro</span>
          </Link>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back
          </h1>
          <p className="text-slate-600 mb-8">
            Sign in to your account to continue
          </p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-slate-700">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                className="mt-2 h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <Link 
                  to="/public/auth/forgot-password" 
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-2">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox 
                id="rememberMe" 
                {...register('rememberMe')}
              />
              <Label htmlFor="rememberMe" className="text-sm text-slate-600 cursor-pointer">
                Remember me for 30 days
              </Label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
          
          <p className="mt-8 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/public/auth/signup" className="text-primary hover:text-primary/80 font-medium">
              Start your free trial
            </Link>
          </p>
        </motion.div>
      </div>
      
      {/* Right Side - Features */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary to-accent p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md text-white"
        >
          <h2 className="text-3xl font-bold mb-6">
            Trusted by 500+ teams worldwide
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Save 10+ hours weekly</h3>
                <p className="text-white/70 text-sm">
                  Automate your status reports and focus on what matters.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Align stakeholders</h3>
                <p className="text-white/70 text-sm">
                  Keep everyone on the same page with real-time visibility.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Enterprise security</h3>
                <p className="text-white/70 text-sm">
                  SOC 2 certified with bank-level encryption.
                </p>
              </div>
            </div>
          </div>
          
          {/* Testimonial */}
          <div className="mt-12 p-6 rounded-xl bg-white/10 backdrop-blur">
            <p className="text-white/90 italic mb-4">
              "LightPro reduced our reporting time by 70%. It's a game-changer for our PMO."
            </p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-sm font-medium">SJ</span>
              </div>
              <div>
                <div className="font-medium text-sm">Sarah Johnson</div>
                <div className="text-white/60 text-xs">PMO Director, TechCorp</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
