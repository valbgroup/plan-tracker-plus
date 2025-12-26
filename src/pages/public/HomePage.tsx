import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Check, 
  Clock, 
  AlertCircle, 
  FileSpreadsheet, 
  Users,
  LayoutDashboard,
  GitCompare,
  DollarSign,
  Shield,
  Star,
  Play,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { mockTestimonials, mockStats, mockPainPoints, mockFeatures } from '@/lib/public-mock-data';
import { saveEmailLead } from '@/hooks/useMockAuth';
import { useToast } from '@/hooks/use-toast';

const iconMap: { [key: string]: React.ElementType } = {
  Clock,
  AlertCircle,
  FileSpreadsheet,
  Users,
  LayoutDashboard,
  GitCompare,
  DollarSign,
  Shield,
};

export const HomePage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    saveEmailLead(email, 'homepage-hero');
    toast({
      title: "You're on the list!",
      description: "We'll be in touch soon with your free trial access.",
    });
    
    setEmail('');
    setIsSubmitting(false);
  };

  return (
    <div className="light">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20 lg:py-32">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className="mb-6 px-4 py-1 text-sm bg-primary/5 border-primary/20 text-primary">
                🚀 Now in Public Beta
              </Badge>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight"
            >
              Project Reporting
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Without the Headache
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto"
            >
              Stop spending hours on status reports. LightPro gives you real-time visibility 
              into project health, budgets, and timelines — so you can focus on delivering results.
            </motion.p>
            
            {/* Email Capture Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onSubmit={handleEmailSubmit}
              className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                required
              />
              <Button 
                type="submit" 
                size="lg" 
                className="h-12 px-8 bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Joining...' : 'Start Free Trial'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.form>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-4 text-sm text-slate-500"
            >
              14-day free trial • No credit card required • Cancel anytime
            </motion.p>
            
            {/* Video/Demo Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-16 relative"
            >
              <div className="relative mx-auto max-w-5xl rounded-xl shadow-2xl overflow-hidden border border-slate-200">
                <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <button className="flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-colors">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                      <Play className="h-5 w-5 text-white ml-1" />
                    </div>
                    <span className="font-medium text-slate-900">Watch Demo (2 min)</span>
                  </button>
                </div>
              </div>
              
              {/* Floating stats */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                <div className="px-4 py-2 bg-white rounded-full shadow-lg border border-slate-100 flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium text-slate-700">500+ Teams</span>
                </div>
                <div className="px-4 py-2 bg-white rounded-full shadow-lg border border-slate-100 flex items-center gap-2">
                  <Star className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium text-slate-700">4.9/5 Rating</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Sound Familiar?
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              If you're nodding your head, you're not alone. 87% of PMOs struggle with these exact problems.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockPainPoints.map((pain, index) => {
              const Icon = iconMap[pain.icon] || AlertCircle;
              return (
                <motion.div
                  key={pain.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-xl border border-red-100 bg-red-50/50 hover:shadow-lg transition-shadow"
                >
                  <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{pain.title}</h3>
                  <p className="text-sm text-slate-600">{pain.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Preview Section */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Everything You Need to Deliver Projects On Time
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              A complete project reporting platform built for PMOs who want to work smarter, not harder.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockFeatures.slice(0, 4).map((feature, index) => {
              const Icon = iconMap[feature.icon] || Shield;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-xl bg-white border border-slate-200 hover:shadow-lg hover:border-primary/20 transition-all"
                >
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
          
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link to="/public/features">
                See All Features
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {mockStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-lg text-white/80">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Loved by PMOs Worldwide
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Join thousands of project managers who have transformed their reporting workflow.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 text-sm leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 text-sm">{testimonial.name}</div>
                    <div className="text-xs text-slate-500">{testimonial.title}, {testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              Start free, scale as you grow. No hidden fees. No surprises.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 text-slate-600">
                <Check className="h-5 w-5 text-success" />
                <span>Starting at $49/month</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Check className="h-5 w-5 text-success" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Check className="h-5 w-5 text-success" />
                <span>Cancel anytime</span>
              </div>
            </div>
            
            <div className="mt-10">
              <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                <Link to="/public/pricing">
                  View Pricing Plans
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Project Reporting?
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
              Join 500+ teams who have already made the switch. Start your free trial today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100" asChild>
                <Link to="/public/auth/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800" asChild>
                <Link to="/public/contact">
                  Contact Sales
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
