import "dotenv/config";

import { db } from "./index";
import { applications, type NewApplication } from "./schema";

/**
 * Seed sample applications for a Clerk user.
 * Usage: SEED_USER_ID=user_xxx npm run db:seed
 */
async function seed() {
  const userId = process.env.SEED_USER_ID;
  if (!userId) {
    console.error(
      "Set SEED_USER_ID to your Clerk user id, e.g. SEED_USER_ID=user_123 npm run db:seed"
    );
    process.exit(1);
  }

  const now = new Date();
  const monthsAgo = (n: number, day = 15) =>
    new Date(now.getFullYear(), now.getMonth() - n, day);

  const samples: Omit<NewApplication, "userId">[] = [
    { companyName: "Vercel", role: "Frontend Engineer", status: "interview", location: "Remote", salary: "$160k", jobUrl: "https://vercel.com/careers", appliedDate: monthsAgo(0, 4) },
    { companyName: "Stripe", role: "Full Stack Engineer", status: "oa", location: "Bengaluru", salary: "₹45 LPA", appliedDate: monthsAgo(0, 9) },
    { companyName: "Linear", role: "Product Engineer", status: "applied", location: "Remote", appliedDate: monthsAgo(0, 12) },
    { companyName: "Figma", role: "Software Engineer", status: "hr_round", location: "San Francisco", salary: "$175k", appliedDate: monthsAgo(1, 6) },
    { companyName: "Notion", role: "Frontend Engineer", status: "rejected", location: "Remote", appliedDate: monthsAgo(1, 20) },
    { companyName: "Razorpay", role: "SDE II", status: "offer", location: "Bengaluru", salary: "₹38 LPA", appliedDate: monthsAgo(2, 3) },
    { companyName: "Zerodha", role: "Frontend Developer", status: "accepted", location: "Bengaluru", salary: "₹30 LPA", appliedDate: monthsAgo(2, 18) },
    { companyName: "Cloudflare", role: "Systems Engineer", status: "rejected", location: "Remote", appliedDate: monthsAgo(3, 10) },
    { companyName: "Supabase", role: "Developer Advocate", status: "interview", location: "Remote", appliedDate: monthsAgo(3, 25) },
    { companyName: "PostHog", role: "Full Stack Engineer", status: "applied", location: "Remote", appliedDate: monthsAgo(4, 8) },
    { companyName: "Atlassian", role: "Senior Frontend Engineer", status: "oa", location: "Sydney", salary: "A$180k", appliedDate: monthsAgo(4, 22) },
    { companyName: "Swiggy", role: "SDE III", status: "rejected", location: "Bengaluru", appliedDate: monthsAgo(5, 14) },
  ];

  await db
    .insert(applications)
    .values(samples.map((s) => ({ ...s, userId })));

  console.log(`Seeded ${samples.length} applications for ${userId}.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
