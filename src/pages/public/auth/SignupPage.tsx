import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMockAuth, SignupData } from '@/hooks/useMockAuth';
import { useToast } from '@/hooks/use-toast';
import { industries, companySizes, countries, mockPricingPlans } from '@/lib/public-mock-data';
import { z } from 'zod';
import { cn } from '@/lib/utils';

const step1Schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: 'You must accept the terms' }) }),
});

export const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<SignupData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { signup } = useMockAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateStep1 = () => {
    const result = step1Schema.safeParse({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      acceptTerms: formData.newsletter !== undefined ? true : undefined,
    });

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      
      // Manual check for acceptTerms since it's a boolean
      if (!formData.newsletter) {
        newErrors.acceptTerms = 'You must accept the terms';
      }
      
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    const result = await signup(formData as SignupData);
    
    if (result.success) {
      toast({
        title: 'Account created!',
        description: 'Please check your email to verify your account.',
      });
      navigate('/public/auth/verify-email');
    } else {
      toast({
        title: 'Signup failed',
        description: result.error || 'Something went wrong',
        variant: 'destructive',
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex light">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-white overflow-y-auto">
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
          
          {/* Progress Steps */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                    step >= s
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-slate-400'
                  )}
                >
                  {step > s ? <Check className="h-4 w-4" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={cn(
                      'h-0.5 w-8 mx-2 transition-colors',
                      step > s ? 'bg-primary' : 'bg-slate-200'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          
          <AnimatePresence mode="wait">
            {/* Step 1: Account Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Create your account
                </h1>
                <p className="text-slate-600 mb-8">
                  Start your 14-day free trial. No credit card required.
                </p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-slate-700">First name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        className="mt-2 h-12 bg-white border-slate-200 text-slate-900"
                        value={formData.firstName || ''}
                        onChange={(e) => updateFormData('firstName', e.target.value)}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-destructive">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-slate-700">Last name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        className="mt-2 h-12 bg-white border-slate-200 text-slate-900"
                        value={formData.lastName || ''}
                        onChange={(e) => updateFormData('lastName', e.target.value)}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-destructive">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-slate-700">Work email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      className="mt-2 h-12 bg-white border-slate-200 text-slate-900"
                      value={formData.email || ''}
                      onChange={(e) => updateFormData('email', e.target.value)}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="password" className="text-slate-700">Password</Label>
                    <div className="relative mt-2">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="h-12 bg-white border-slate-200 text-slate-900 pr-10"
                        value={formData.password || ''}
                        onChange={(e) => updateFormData('password', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Must be at least 8 characters
                    </p>
                    {errors.password && (
                      <p className="mt-1 text-sm text-destructive">{errors.password}</p>
                    )}
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Checkbox 
                      id="acceptTerms"
                      checked={!!formData.newsletter}
                      onCheckedChange={(checked) => updateFormData('newsletter', !!checked)}
                      className="mt-1"
                    />
                    <Label htmlFor="acceptTerms" className="text-sm text-slate-600 cursor-pointer">
                      I agree to the{' '}
                      <Link to="#" className="text-primary hover:underline">Terms of Service</Link>
                      {' '}and{' '}
                      <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>
                    </Label>
                  </div>
                  {errors.acceptTerms && (
                    <p className="text-sm text-destructive">{errors.acceptTerms}</p>
                  )}
                  
                  <Button 
                    onClick={handleNext}
                    className="w-full h-12 bg-primary hover:bg-primary/90"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
            
            {/* Step 2: Organization Info */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Tell us about your organization
                </h1>
                <p className="text-slate-600 mb-8">
                  This helps us personalize your experience.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="company" className="text-slate-700">Company name</Label>
                    <Input
                      id="company"
                      placeholder="Acme Corp"
                      className="mt-2 h-12 bg-white border-slate-200 text-slate-900"
                      value={formData.company || ''}
                      onChange={(e) => updateFormData('company', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="companySize" className="text-slate-700">Company size</Label>
                    <Select
                      value={formData.companySize || ''}
                      onValueChange={(value) => updateFormData('companySize', value)}
                    >
                      <SelectTrigger className="mt-2 h-12 bg-white border-slate-200 text-slate-900">
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200">
                        {companySizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="industry" className="text-slate-700">Industry</Label>
                    <Select
                      value={formData.industry || ''}
                      onValueChange={(value) => updateFormData('industry', value)}
                    >
                      <SelectTrigger className="mt-2 h-12 bg-white border-slate-200 text-slate-900">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200">
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="country" className="text-slate-700">Country</Label>
                    <Select
                      value={formData.country || ''}
                      onValueChange={(value) => updateFormData('country', value)}
                    >
                      <SelectTrigger className="mt-2 h-12 bg-white border-slate-200 text-slate-900">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200">
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      variant="outline"
                      onClick={handleBack}
                      className="flex-1 h-12"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button 
                      onClick={handleNext}
                      className="flex-1 h-12 bg-primary hover:bg-primary/90"
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Step 3: Plan Selection */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Choose your plan
                </h1>
                <p className="text-slate-600 mb-8">
                  You can change your plan at any time.
                </p>
                
                <div className="space-y-4 mb-6">
                  {mockPricingPlans.slice(0, 2).map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => updateFormData('plan', plan.id)}
                      className={cn(
                        'p-4 rounded-lg border-2 cursor-pointer transition-all',
                        formData.plan === plan.id
                          ? 'border-primary bg-primary/5'
                          : 'border-slate-200 hover:border-slate-300'
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'h-5 w-5 rounded-full border-2 flex items-center justify-center',
                              formData.plan === plan.id
                                ? 'border-primary bg-primary'
                                : 'border-slate-300'
                            )}
                          >
                            {formData.plan === plan.id && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <span className="font-semibold text-slate-900">{plan.name}</span>
                          {plan.popular && (
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                              Popular
                            </span>
                          )}
                        </div>
                        <span className="font-bold text-slate-900">
                          ${plan.priceAnnual}/mo
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 ml-8">{plan.description}</p>
                    </div>
                  ))}
                  
                  <div
                    onClick={() => updateFormData('plan', 'enterprise')}
                    className={cn(
                      'p-4 rounded-lg border-2 cursor-pointer transition-all',
                      formData.plan === 'enterprise'
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-200 hover:border-slate-300'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'h-5 w-5 rounded-full border-2 flex items-center justify-center',
                            formData.plan === 'enterprise'
                              ? 'border-primary bg-primary'
                              : 'border-slate-300'
                          )}
                        >
                          {formData.plan === 'enterprise' && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <span className="font-semibold text-slate-900">Enterprise</span>
                      </div>
                      <span className="font-bold text-slate-900">Custom</span>
                    </div>
                    <p className="text-sm text-slate-600 ml-8">
                      For large organizations with complex requirements
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 h-12"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    className="flex-1 h-12 bg-primary hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create account'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <p className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/public/auth/login" className="text-primary hover:text-primary/80 font-medium">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
      
      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md text-white text-center"
        >
          <div className="mb-8">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-3xl font-bold">LP</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Join 500+ teams already using LightPro
            </h2>
            <p className="text-slate-400">
              Start your free trial today and transform how you report on projects.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold mb-1">14 days</div>
              <div className="text-sm text-slate-400">Free trial</div>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold mb-1">No CC</div>
              <div className="text-sm text-slate-400">Required</div>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold mb-1">5 min</div>
              <div className="text-sm text-slate-400">Setup time</div>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <div className="text-2xl font-bold mb-1">24/7</div>
              <div className="text-sm text-slate-400">Support</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
