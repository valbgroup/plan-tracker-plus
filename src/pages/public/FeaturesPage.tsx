import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight,
  LayoutDashboard,
  GitCompare,
  Users,
  DollarSign,
  Calendar,
  AlertTriangle,
  FileText,
  Shield,
  Check,
  X,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { mockFeatures, mockCompetitors } from '@/lib/public-mock-data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const iconMap: { [key: string]: React.ElementType } = {
  LayoutDashboard,
  GitCompare,
  Users,
  DollarSign,
  Calendar,
  AlertTriangle,
  FileText,
  Shield,
};

const featureDetails = [
  {
    id: 1,
    title: 'Real-Time Dashboards',
    description: 'Get instant visibility into project health with customizable dashboards that update in real-time.',
    details: [
      'Drag-and-drop dashboard builder',
      'Pre-built templates for PMOs',
      'Role-based dashboard views',
      'Mobile-responsive design',
      'Export to PDF and PowerPoint',
    ],
    icon: 'LayoutDashboard',
  },
  {
    id: 2,
    title: 'Baseline Management',
    description: 'Track changes against your original plan with powerful baseline versioning and variance analysis.',
    details: [
      'Unlimited baseline snapshots',
      'Side-by-side comparison views',
      'Automatic variance calculations',
      'Change impact visualization',
      'Baseline approval workflows',
    ],
    icon: 'GitCompare',
  },
  {
    id: 3,
    title: 'Stakeholder Management',
    description: 'Keep all stakeholders aligned with role-based access and automated status reports.',
    details: [
      'Stakeholder influence matrix',
      'Automated weekly reports',
      'Communication log tracking',
      'RACI matrix integration',
      'Engagement scoring',
    ],
    icon: 'Users',
  },
  {
    id: 4,
    title: 'Budget Tracking',
    description: 'Monitor budgets in real-time with earned value management and forecasting.',
    details: [
      'Earned value management (EVM)',
      'Forecast at completion (FAC)',
      'Cost variance tracking',
      'Budget vs actual reports',
      'Multi-currency support',
    ],
    icon: 'DollarSign',
  },
  {
    id: 5,
    title: 'Resource Planning',
    description: 'Optimize resource allocation with capacity planning and availability tracking.',
    details: [
      'Resource capacity heatmaps',
      'Availability calendar',
      'Skill-based matching',
      'Utilization reports',
      'Conflict detection',
    ],
    icon: 'Calendar',
  },
  {
    id: 6,
    title: 'Risk Management',
    description: 'Identify, assess, and mitigate risks with our comprehensive risk register.',
    details: [
      'Risk probability/impact matrix',
      'Mitigation action tracking',
      'Risk trend analysis',
      'Issue escalation workflows',
      'Audit trail for all changes',
    ],
    icon: 'AlertTriangle',
  },
  {
    id: 7,
    title: 'Automated Reports',
    description: 'Generate professional reports with one click. Schedule weekly updates to stakeholders.',
    details: [
      'One-click report generation',
      'Customizable report templates',
      'Scheduled email delivery',
      'PDF and Excel exports',
      'Executive summary builder',
    ],
    icon: 'FileText',
  },
  {
    id: 8,
    title: 'Audit Trail',
    description: 'Complete audit history of all changes for compliance and accountability.',
    details: [
      'Full change history',
      'User action logging',
      'Compliance reports',
      'Data retention policies',
      'GDPR compliant exports',
    ],
    icon: 'Shield',
  },
];

export const FeaturesPage = () => {
  return (
    <div className="light">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className="mb-6 px-4 py-1 text-sm bg-primary/5 border-primary/20 text-primary">
                Enterprise-Ready Features
              </Badge>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight"
            >
              Everything You Need for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Professional Project Reporting
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-slate-600 max-w-3xl mx-auto"
            >
              A complete platform designed by PMO professionals, for PMO professionals. 
              Track, analyze, and report on your projects with confidence.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockFeatures.map((feature, index) => {
              const Icon = iconMap[feature.icon] || Shield;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-lg hover:border-primary/20 transition-all group"
                >
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Details Accordion */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Deep Dive into Features</h2>
            <p className="mt-4 text-lg text-slate-600">
              Click on each feature to learn more about what it includes.
            </p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {featureDetails.map((feature) => {
              const Icon = iconMap[feature.icon] || Shield;
              return (
                <AccordionItem 
                  key={feature.id} 
                  value={feature.id.toString()}
                  className="border border-slate-200 rounded-lg bg-white overflow-hidden"
                >
                  <AccordionTrigger className="px-6 hover:no-underline hover:bg-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-slate-900">{feature.title}</div>
                        <div className="text-sm text-slate-500">{feature.description}</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="pt-4 pl-14">
                      <ul className="space-y-3">
                        {feature.details.map((detail, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <Check className="h-4 w-4 text-success shrink-0" />
                            <span className="text-sm text-slate-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </section>

      {/* Competitor Comparison */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">How We Compare</h2>
            <p className="mt-4 text-lg text-slate-600">
              See how LightPro stacks up against other project management tools.
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="py-4 px-4 text-left text-sm font-semibold text-slate-900">Feature</th>
                  <th className="py-4 px-4 text-center">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-1">
                        <span className="text-white text-xs font-bold">LP</span>
                      </div>
                      <span className="text-sm font-semibold text-primary">LightPro</span>
                    </div>
                  </th>
                  <th className="py-4 px-4 text-center text-sm font-semibold text-slate-600">MS Project</th>
                  <th className="py-4 px-4 text-center text-sm font-semibold text-slate-600">Jira</th>
                  <th className="py-4 px-4 text-center text-sm font-semibold text-slate-600">Asana</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {mockCompetitors.map((row) => (
                  <tr key={row.feature} className="hover:bg-slate-50">
                    <td className="py-4 px-4 text-sm text-slate-700">{row.feature}</td>
                    <td className="py-4 px-4 text-center bg-primary/5">
                      {row.lightpro ? (
                        <Check className="h-5 w-5 text-success mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.msProject ? (
                        <Check className="h-5 w-5 text-slate-400 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.jira ? (
                        <Check className="h-5 w-5 text-slate-400 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {row.asana ? (
                        <Check className="h-5 w-5 text-slate-400 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-slate-300 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Experience These Features?
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
              Start your 14-day free trial today. No credit card required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                <Link to="/public/auth/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                <Link to="/public/pricing">
                  View Pricing
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
