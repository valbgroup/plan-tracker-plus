import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Check, 
  X, 
  ArrowRight,
  Zap,
  Building2,
  Users,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { mockPricingPlans, mockFAQs } from '@/lib/public-mock-data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const pricingFAQs = mockFAQs.filter(faq => faq.category === 'Pricing & Billing');

  return (
    <div className="light">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight"
            >
              Simple, Transparent Pricing
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto"
            >
              Choose the plan that's right for your team. All plans include a 14-day free trial.
            </motion.p>

            {/* Billing Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-10 flex items-center justify-center gap-4"
            >
              <span className={`text-sm font-medium ${!isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
                Monthly
              </span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
              />
              <span className={`text-sm font-medium ${isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
                Annual
              </span>
              <Badge className="bg-success/10 text-success border-success/20 ml-2">
                Save 20%
              </Badge>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-white -mt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {mockPricingPlans.map((plan, index) => {
              const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;
              const icons = [Zap, Users, Building2];
              const Icon = icons[index];
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative rounded-2xl border-2 p-8 ${
                    plan.popular 
                      ? 'border-primary shadow-xl shadow-primary/10' 
                      : 'border-slate-200'
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white">
                      Most Popular
                    </Badge>
                  )}
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      plan.popular 
                        ? 'bg-primary/10' 
                        : 'bg-slate-100'
                    }`}>
                      <Icon className={`h-5 w-5 ${plan.popular ? 'text-primary' : 'text-slate-600'}`} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-6 min-h-[40px]">
                    {plan.description}
                  </p>
                  
                  <div className="mb-6">
                    {price !== null ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-slate-900">${price}</span>
                        <span className="text-slate-500">/month</span>
                      </div>
                    ) : (
                      <div className="text-3xl font-bold text-slate-900">Custom</div>
                    )}
                    {isAnnual && price !== null && (
                      <p className="text-sm text-slate-500 mt-1">
                        Billed annually (${price * 12}/year)
                      </p>
                    )}
                  </div>
                  
                  <Button 
                    className={`w-full mb-8 ${
                      plan.popular 
                        ? 'bg-primary hover:bg-primary/90' 
                        : 'bg-slate-900 hover:bg-slate-800'
                    }`}
                    size="lg"
                    asChild
                  >
                    <Link to={plan.id === 'enterprise' ? '/public/contact' : '/public/auth/signup'}>
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <div className="space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">{feature}</span>
                      </div>
                    ))}
                    {plan.notIncluded.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <X className="h-5 w-5 text-slate-300 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-400">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Compare Plans</h2>
            <p className="mt-4 text-lg text-slate-600">
              A detailed breakdown of what's included in each plan.
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-4 px-4 text-left text-sm font-semibold text-slate-900">Feature</th>
                  <th className="py-4 px-4 text-center text-sm font-semibold text-slate-900">Starter</th>
                  <th className="py-4 px-4 text-center text-sm font-semibold text-primary">Professional</th>
                  <th className="py-4 px-4 text-center text-sm font-semibold text-slate-900">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {[
                  { feature: 'Projects', starter: '5', pro: 'Unlimited', enterprise: 'Unlimited' },
                  { feature: 'Team Members', starter: '3', pro: '15', enterprise: 'Unlimited' },
                  { feature: 'Storage', starter: '1GB', pro: '10GB', enterprise: 'Unlimited' },
                  { feature: 'Real-time Dashboards', starter: true, pro: true, enterprise: true },
                  { feature: 'Baseline Management', starter: false, pro: true, enterprise: true },
                  { feature: 'Variance Analysis', starter: false, pro: true, enterprise: true },
                  { feature: 'Risk Management', starter: false, pro: true, enterprise: true },
                  { feature: 'API Access', starter: false, pro: false, enterprise: true },
                  { feature: 'Custom Branding', starter: false, pro: false, enterprise: true },
                  { feature: 'SSO/SAML', starter: false, pro: false, enterprise: true },
                  { feature: 'Support', starter: 'Email', pro: 'Priority', enterprise: '24/7 Dedicated' },
                ].map((row) => (
                  <tr key={row.feature} className="hover:bg-slate-100/50">
                    <td className="py-4 px-4 text-sm text-slate-700">{row.feature}</td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.starter === 'boolean' ? (
                        row.starter ? <Check className="h-5 w-5 text-success mx-auto" /> : <X className="h-5 w-5 text-slate-300 mx-auto" />
                      ) : (
                        <span className="text-sm text-slate-600">{row.starter}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center bg-primary/5">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <Check className="h-5 w-5 text-success mx-auto" /> : <X className="h-5 w-5 text-slate-300 mx-auto" />
                      ) : (
                        <span className="text-sm text-slate-900 font-medium">{row.pro}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.enterprise === 'boolean' ? (
                        row.enterprise ? <Check className="h-5 w-5 text-success mx-auto" /> : <X className="h-5 w-5 text-slate-300 mx-auto" />
                      ) : (
                        <span className="text-sm text-slate-600">{row.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Pricing FAQ</h2>
            <p className="mt-4 text-lg text-slate-600">
              Common questions about our pricing and billing.
            </p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {pricingFAQs.map((faq) => (
              <AccordionItem 
                key={faq.id} 
                value={faq.id.toString()}
                className="border border-slate-200 rounded-lg px-4"
              >
                <AccordionTrigger className="text-left text-slate-900 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Still Have Questions?
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
              Our team is happy to help you choose the right plan for your organization.
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
