// ============================================================
// REFERRAL PROGRAM
// "Share the Gorgeous" - Client referral system
// ============================================================

export interface ReferralConfig {
  programName: string;
  referrerReward: ReferralReward;
  refereeReward: ReferralReward;
  maxReferralsPerMonth: number;
  requirePurchase: boolean;
  minPurchaseAmount: number;
}

export interface ReferralReward {
  type: 'credit' | 'discount' | 'points' | 'service';
  value: number;
  description: string;
}

export const REFERRAL_CONFIG: ReferralConfig = {
  programName: 'Share the Gorgeous',
  referrerReward: {
    type: 'credit',
    value: 50,
    description: '$50 account credit',
  },
  refereeReward: {
    type: 'discount',
    value: 25,
    description: '$25 off first treatment',
  },
  maxReferralsPerMonth: 10,
  requirePurchase: true,
  minPurchaseAmount: 100,
};

export interface Referral {
  id: string;
  referrerId: string;
  referrerName: string;
  refereeId?: string;
  refereeName: string;
  refereeEmail: string;
  refereePhone?: string;
  code: string;
  status: 'pending' | 'signed_up' | 'converted' | 'rewarded' | 'expired';
  createdAt: Date;
  convertedAt?: Date;
  rewardedAt?: Date;
}

// Generate unique referral code
export function generateReferralCode(clientName: string): string {
  const namePart = clientName.split(' ')[0].toUpperCase().substring(0, 4);
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${namePart}${randomPart}`;
}

// Generate referral link
export function generateReferralLink(code: string, baseUrl: string = 'https://hellogorgeousmedspa.com'): string {
  return `${baseUrl}/ref/${code}`;
}

// Generate share message
export function generateShareMessage(referrerName: string, code: string): {
  sms: string;
  email: { subject: string; body: string };
  social: string;
} {
  const firstName = referrerName.split(' ')[0];
  const link = generateReferralLink(code);
  
  return {
    sms: `Hey! I love Hello Gorgeous Med Spa and thought you would too. Use my code ${code} to get $25 off your first treatment! ${link}`,
    email: {
      subject: `${firstName} thinks you'd love Hello Gorgeous Med Spa`,
      body: `Hi!\n\nI've been going to Hello Gorgeous Med Spa and I absolutely love it. The treatments are amazing and the staff is so professional.\n\nI wanted to share my referral code with you - use code ${code} to get $25 off your first treatment!\n\nBook here: ${link}\n\nYou'll love it!\n${firstName}`,
    },
    social: `Just had the most amazing experience at @hellogorgeousmedspa! 💕 Use my code ${code} for $25 off your first treatment. Trust me, you'll thank me later! ✨ #HelloGorgeous #MedSpa #Oswego`,
  };
}
