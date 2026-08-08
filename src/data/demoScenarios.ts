import { DemoScenario } from '../types';

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'scam',
    title: '“Someone wants my OTP”',
    shortDesc: 'Prize winning SMS requiring a processing fee and security code.',
    category: 'DIGITAL SAFETY',
    inputType: 'text',
    sampleInput: 'Congratulations! You have won ₦250,000 in the National Tech Sweepstakes. To process your prize delivery, pay ₦5,000 processing fee today and reply with your bank OTP code.',
    sampleContext: 'Received this unprompted message on WhatsApp from an unknown contact.',
    iconName: 'ShieldAlert'
  },
  {
    id: 'rental',
    title: '“My landlord sent me this agreement”',
    shortDesc: 'Draft residential lease with unexpected non-refundable charges.',
    category: 'HOUSING',
    inputType: 'document',
    sampleInput: 'LEASE AGREEMENT EXCERPT:\nClause 14(b): Tenant agrees to pay a mandatory monthly non-refundable administrative maintenance fee of ₦45,000 in addition to base rent.\nClause 18: Landlord reserves the right to terminate tenancy with 3 days written notice without refund of security deposit.',
    sampleContext: 'Reviewing a draft tenancy contract before making payment.',
    iconName: 'FileText'
  },
  {
    id: 'electrical',
    title: '“This electrical installation looks strange”',
    shortDesc: 'Exposed high-voltage panel with hanging wiring.',
    category: 'ENERGY',
    inputType: 'image',
    sampleInput: 'Exposed electrical wiring box with uninsulated wire ends hanging outdoors near walkway.',
    sampleContext: 'Spotted on the exterior wall near a residential apartment entrance.',
    sampleImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    iconName: 'Zap'
  },
  {
    id: 'flood',
    title: '“This road looks dangerous”',
    shortDesc: 'Submerged street after heavy rainfall with hidden hazards.',
    category: 'PUBLIC SAFETY',
    inputType: 'image',
    sampleInput: 'Submerged road with standing muddy flood water covering both lanes.',
    sampleContext: 'Main access road during flash storm rain.',
    sampleLocation: 'Expressway Flyover Junction',
    sampleImage: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
    iconName: 'Waves'
  },
  {
    id: 'job',
    title: '“This job offer asks for payment”',
    shortDesc: 'Work-from-home position demanding upfront equipment purchase.',
    category: 'FINANCE',
    inputType: 'text',
    sampleInput: 'JOB OFFER: Remote Executive Data Assistant - $45/hr. Congratulations, you are hired! Prior to starting, you must wire $350 via crypto or wire to our vendor for your company laptop configuration kit.',
    sampleContext: 'Offer received via unsolicited Telegram message without interview.',
    iconName: 'Briefcase'
  },
  {
    id: 'agriculture',
    title: '“My crops have these spots”',
    shortDesc: 'Foliar leaf spot symptoms spreading across crop foliage.',
    category: 'AGRICULTURE',
    inputType: 'image',
    sampleInput: 'Maize crop leaves showing brown necrotic spots with yellow halo rings.',
    sampleContext: 'Observed spreading in lower plot leaves after humid period.',
    sampleImage: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80',
    iconName: 'Sprout'
  },
  {
    id: 'business',
    title: '“My business is losing profit”',
    shortDesc: 'Monthly revenue grew 25% while net profit dropped 40%.',
    category: 'BUSINESS',
    inputType: 'text',
    sampleInput: 'BUSINESS DATA:\nQ1 Revenue: $120,000 | Net Profit: $24,000\nQ2 Revenue: $150,000 | Net Profit: $14,400\nCost of Goods Sold rose by 38% and unexplained operating overhead increased by 52%.',
    sampleContext: 'Quarterly financial summary analysis.',
    iconName: 'TrendingDown'
  }
];
