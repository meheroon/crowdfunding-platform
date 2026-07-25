const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Campaign = require("./models/Campaign");
const Contribution = require("./models/Contribution");
const Withdrawal = require("./models/Withdrawal");
const Payment = require("./models/Payment");
const Notification = require("./models/Notification");
const Report = require("./models/Report");

const HASHED_PASS_SUPPORTER = bcrypt.hashSync("Supporter@123", 12);
const HASHED_PASS_CREATOR = bcrypt.hashSync("Creator@123", 12);

const dummyUsers = [
  {
    display_name: "Sarah Johnson",
    user_email: "supporter@test.com",
    photo_url: "https://randomuser.me/api/portraits/women/44.jpg",
    password: HASHED_PASS_SUPPORTER,
    role: "supporter",
    credits: 320,
  },
  {
    display_name: "Mike Chen",
    user_email: "supporter2@test.com",
    photo_url: "https://randomuser.me/api/portraits/men/32.jpg",
    password: HASHED_PASS_SUPPORTER,
    role: "supporter",
    credits: 150,
  },
  {
    display_name: "Emily Rivera",
    user_email: "creator@test.com",
    photo_url: "https://randomuser.me/api/portraits/women/68.jpg",
    password: HASHED_PASS_CREATOR,
    role: "creator",
    credits: 20,
  },
  {
    display_name: "James Park",
    user_email: "creator2@test.com",
    photo_url: "https://randomuser.me/api/portraits/men/75.jpg",
    password: HASHED_PASS_CREATOR,
    role: "creator",
    credits: 20,
  },
];

const dummyCampaigns = [
  {
    campaign_title: "SolarPulse: Portable Solar Charger for Everyone",
    campaign_story: "SolarPulse is a compact, foldable solar panel that can charge any USB device in direct sunlight. Designed for hikers, travelers, and anyone off the grid. Our prototype has been tested in 3 countries and charges an iPhone in under 2 hours. With your support, we'll bring manufacturing costs down and ship to backers worldwide.",
    category: "Technology",
    funding_goal: 25000,
    minimum_Contribution: 10,
    deadline: new Date("2026-09-30"),
    reward_info: "$10+ : Early bird unit at 30% off | $50+ : Charger + carry case | $100+ : 2 chargers + lifetime warranty",
    campaign_image_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
    amount_raised: 18750,
    supporter_count: 342,
    status: "approved",
    creator_email: "creator@test.com",
    creator_name: "Emily Rivera",
  },
  {
    campaign_title: "BrushStroke: AI-Powered Art Tutorial App",
    campaign_story: "BrushStroke uses computer vision to analyze your paintings in real-time and give personalized feedback — just like having a private art instructor. We've trained our model on 50,000+ artworks. Your funding will help us launch on iOS and Android with 200+ guided lessons across watercolor, acrylic, and oil.",
    category: "Art",
    funding_goal: 15000,
    minimum_Contribution: 5,
    deadline: new Date("2026-10-15"),
    reward_info: "$5+ : Beta access for 6 months | $25+ : Lifetime premium access | $75+ : Lifetime + signed print from our lead artist",
    campaign_image_url: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800",
    amount_raised: 9200,
    supporter_count: 189,
    status: "approved",
    creator_email: "creator@test.com",
    creator_name: "Emily Rivera",
  },
  {
    campaign_title: "GreenBlock: Community Urban Gardens",
    campaign_story: "We're converting 5 abandoned lots in downtown Brooklyn into thriving community gardens. Each garden will feature raised beds, rainwater collection, composting stations, and free weekly gardening workshops. Our team of landscape architects and local volunteers is ready — we just need funding for materials and irrigation.",
    category: "Community",
    funding_goal: 30000,
    minimum_Contribution: 15,
    deadline: new Date("2026-11-01"),
    reward_info: "$15+ : Thank-you postcard from the team | $50+ : Name engraved on a garden plaque | $200+ : Private garden tour + fresh produce box",
    campaign_image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
    amount_raised: 22100,
    supporter_count: 415,
    status: "approved",
    creator_email: "creator2@test.com",
    creator_name: "James Park",
  },
  {
    campaign_title: "MediReach: Telehealth Kits for Rural Clinics",
    campaign_story: "Rural clinics in Southeast Asia lack basic diagnostic equipment. MediReach provides pre-assembled telehealth kits — a digital stethoscope, pulse oximeter, thermometer, and a tablet with our telemedicine app — so remote patients can consult with city specialists. We've piloted in 3 villages and helped 1,200+ patients.",
    category: "Health",
    funding_goal: 50000,
    minimum_Contribution: 20,
    deadline: new Date("2026-12-01"),
    reward_info: "$20+ : Donate one kit to a clinic | $100+ : 5 kits + video from the village you helped | $500+ : Visit a clinic with our team",
    campaign_image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
    amount_raised: 34800,
    supporter_count: 678,
    status: "approved",
    creator_email: "creator@test.com",
    creator_name: "Emily Rivera",
  },
  {
    campaign_title: "CodeSpark: Free Coding Bootcamp for Teens",
    campaign_story: "CodeSpark offers a 12-week coding bootcamp for underserved teens aged 14-18. Students learn web development, Python, and problem-solving — completely free. Last year we graduated 85 students, and 40% landed internships. Help us double our intake and provide laptops to students who need them.",
    category: "Education",
    funding_goal: 20000,
    minimum_Contribution: 10,
    deadline: new Date("2026-09-15"),
    reward_info: "$10+ : Sponsor one student's meals for a week | $50+ : Sponsor a laptop donation | $200+ : Mentor a student for one session",
    campaign_image_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
    amount_raised: 12600,
    supporter_count: 234,
    status: "approved",
    creator_email: "creator2@test.com",
    creator_name: "James Park",
  },
  {
    campaign_title: "OceanGuard: Smart Beach Cleanup Drone",
    campaign_story: "OceanGuard is an autonomous drone that patrols beaches, identifies plastic debris using AI vision, and scoops it up before it reaches the ocean. Our prototype has cleaned 2 miles of coastline in beta tests. We need funding for production-grade shells, improved battery packs, and a fleet of 10 drones for coastal cities.",
    category: "Environment",
    funding_goal: 40000,
    minimum_Contribution: 25,
    deadline: new Date("2026-10-30"),
    reward_info: "$25+ : Real-time beach cleanup dashboard access | $100+ : Adopt a drone (name it!) | $500+ : Full day with the engineering team",
    campaign_image_url: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=800",
    amount_raised: 27400,
    supporter_count: 521,
    status: "approved",
    creator_email: "creator@test.com",
    creator_name: "Emily Rivera",
  },
  // Pending campaigns (for admin approval testing)
  {
    campaign_title: "RoboGarden: Automated Indoor Herb Garden",
    campaign_story: "RoboGarden is a sleek countertop device that grows fresh herbs year-round with automated watering, lighting, and nutrient delivery. Perfect for apartment dwellers who want fresh basil, cilantro, and mint without any gardening experience.",
    category: "Technology",
    funding_goal: 12000,
    minimum_Contribution: 10,
    deadline: new Date("2026-11-15"),
    reward_info: "$10+ : Starter seed pack | $50+ : RoboGarden unit at 40% off | $100+ : Unit + 1 year of seed refills",
    campaign_image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
    amount_raised: 0,
    supporter_count: 0,
    status: "pending",
    creator_email: "creator2@test.com",
    creator_name: "James Park",
  },
  {
    campaign_title: "SoundBridge: Portable Translation Device",
    campaign_story: "SoundBridge is a pocket-sized device that provides real-time speech-to-speech translation in 40+ languages. Designed for travelers, diplomats, and anyone who wants to break language barriers.",
    category: "Technology",
    funding_goal: 35000,
    minimum_Contribution: 15,
    deadline: new Date("2027-01-20"),
    reward_info: "$15+ : Early bird access to the app | $75+ : Device at 50% off | $200+ : Device + lifetime premium translation",
    campaign_image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
    amount_raised: 0,
    supporter_count: 0,
    status: "pending",
    creator_email: "creator@test.com",
    creator_name: "Emily Rivera",
  },
];

const seedData = async () => {
  try {
    // Drop stale indexes
    const collection = mongoose.connection.collection("users");
    const indexes = await collection.indexes();
    for (const index of indexes) {
      if (index.name === "email_1") {
        await collection.dropIndex("email_1");
        console.log("Dropped stale index: email_1");
      }
    }

    // ── Seed Users ──
    const existingAdmin = await User.findOne({ user_email: "admin@fundspark.com" });
    if (!existingAdmin) {
      await User.create({
        display_name: "Admin",
        user_email: "admin@fundspark.com",
        photo_url: "https://randomuser.me/api/portraits/lego/1.jpg",
        password: HASHED_PASS_SUPPORTER.replace("Supporter@123", "Admin@123"),
        role: "admin",
        credits: 0,
      });
      // Re-hash with proper password
      await User.findOneAndUpdate(
        { user_email: "admin@fundspark.com" },
        { $set: { password: await bcrypt.hash("Admin@123", 12) } }
      );
      console.log("Admin user created. Email: admin@fundspark.com | Password: Admin@123");
    } else {
      console.log("Admin user already exists.");
    }

    for (const u of dummyUsers) {
      const exists = await User.findOne({ user_email: u.user_email });
      if (!exists) {
        await User.create(u);
        console.log(`Created user: ${u.display_name} (${u.role}) — ${u.user_email} / ${u.role === "supporter" ? "Supporter@123" : "Creator@123"}`);
      }
    }

    // ── Seed Campaigns ──
    const existingCampaigns = await Campaign.countDocuments();
    if (existingCampaigns === 0) {
      const createdCampaigns = await Campaign.insertMany(dummyCampaigns);
      console.log(`Seeded ${createdCampaigns.length} campaigns (6 approved + 2 pending).`);
    } else {
      console.log(`${existingCampaigns} campaigns already exist, skipping seed.`);
    }

    // ── Seed Contributions ──
    const existingContributions = await Contribution.countDocuments();
    if (existingContributions === 0) {
      const campaigns = await Campaign.find({ status: "approved" });
      const supporters = await User.find({ role: "supporter" });

      if (campaigns.length > 0 && supporters.length > 0) {
        const contributions = [
          // Pending contributions (for creator to approve/reject)
          {
            campaign_id: campaigns[0]._id,
            campaign_title: campaigns[0].campaign_title,
            Contribution_amount: 100,
            Supporter_email: supporters[0].user_email,
            Supporter_name: supporters[0].display_name,
            creator_name: campaigns[0].creator_name,
            creator_email: campaigns[0].creator_email,
            current_date: new Date("2026-07-20"),
            status: "pending",
          },
          {
            campaign_id: campaigns[0]._id,
            campaign_title: campaigns[0].campaign_title,
            Contribution_amount: 50,
            Supporter_email: supporters[1].user_email,
            Supporter_name: supporters[1].display_name,
            creator_name: campaigns[0].creator_name,
            creator_email: campaigns[0].creator_email,
            current_date: new Date("2026-07-21"),
            status: "pending",
          },
          {
            campaign_id: campaigns[2]._id,
            campaign_title: campaigns[2].campaign_title,
            Contribution_amount: 200,
            Supporter_email: supporters[0].user_email,
            Supporter_name: supporters[0].display_name,
            creator_name: campaigns[2].creator_name,
            creator_email: campaigns[2].creator_email,
            current_date: new Date("2026-07-22"),
            status: "pending",
          },
          // Approved contributions
          {
            campaign_id: campaigns[1]._id,
            campaign_title: campaigns[1].campaign_title,
            Contribution_amount: 75,
            Supporter_email: supporters[0].user_email,
            Supporter_name: supporters[0].display_name,
            creator_name: campaigns[1].creator_name,
            creator_email: campaigns[1].creator_email,
            current_date: new Date("2026-07-10"),
            status: "approved",
          },
          {
            campaign_id: campaigns[3]._id,
            campaign_title: campaigns[3].campaign_title,
            Contribution_amount: 150,
            Supporter_email: supporters[1].user_email,
            Supporter_name: supporters[1].display_name,
            creator_name: campaigns[3].creator_name,
            creator_email: campaigns[3].creator_email,
            current_date: new Date("2026-07-12"),
            status: "approved",
          },
          // Rejected contribution (refunded)
          {
            campaign_id: campaigns[4]._id,
            campaign_title: campaigns[4].campaign_title,
            Contribution_amount: 60,
            Supporter_email: supporters[0].user_email,
            Supporter_name: supporters[0].display_name,
            creator_name: campaigns[4].creator_name,
            creator_email: campaigns[4].creator_email,
            current_date: new Date("2026-07-08"),
            status: "rejected",
          },
        ];
        await Contribution.insertMany(contributions);
        console.log(`Seeded ${contributions.length} contributions (3 pending, 2 approved, 1 rejected).`);
      }
    } else {
      console.log(`${existingContributions} contributions already exist, skipping seed.`);
    }

    // ── Seed Withdrawals ──
    const existingWithdrawals = await Withdrawal.countDocuments();
    if (existingWithdrawals === 0) {
      const withdrawals = [
        {
          creator_email: "creator@test.com",
          creator_name: "Emily Rivera",
          withdrawal_credit: 200,
          withdrawal_amount: 10,
          payment_system: "Bkash",
          account_number: "01712345678",
          withdraw_date: new Date("2026-07-15"),
          status: "pending",
        },
        {
          creator_email: "creator2@test.com",
          creator_name: "James Park",
          withdrawal_credit: 400,
          withdrawal_amount: 20,
          payment_system: "Stripe",
          account_number: "acct_1234567890",
          withdraw_date: new Date("2026-07-18"),
          status: "pending",
        },
        {
          creator_email: "creator@test.com",
          creator_name: "Emily Rivera",
          withdrawal_credit: 300,
          withdrawal_amount: 15,
          payment_system: "Rocket",
          account_number: "01812345678",
          withdraw_date: new Date("2026-07-01"),
          status: "approved",
        },
      ];
      await Withdrawal.insertMany(withdrawals);
      console.log(`Seeded ${withdrawals.length} withdrawals (2 pending, 1 approved).`);
    } else {
      console.log(`${existingWithdrawals} withdrawals already exist, skipping seed.`);
    }

    // ── Seed Payments ──
    const existingPayments = await Payment.countDocuments();
    if (existingPayments === 0) {
      const payments = [
        {
          user_email: "supporter@test.com",
          user_name: "Sarah Johnson",
          amount: 10,
          credits_purchased: 100,
          package_name: "Starter Pack",
          payment_date: new Date("2026-07-05"),
          status: "completed",
        },
        {
          user_email: "supporter@test.com",
          user_name: "Sarah Johnson",
          amount: 25,
          credits_purchased: 300,
          package_name: "Popular Pack",
          payment_date: new Date("2026-07-10"),
          status: "completed",
        },
        {
          user_email: "supporter2@test.com",
          user_name: "Mike Chen",
          amount: 10,
          credits_purchased: 100,
          package_name: "Starter Pack",
          payment_date: new Date("2026-07-08"),
          status: "completed",
        },
      ];
      await Payment.insertMany(payments);
      console.log(`Seeded ${payments.length} payments.`);
    } else {
      console.log(`${existingPayments} payments already exist, skipping seed.`);
    }

    // ── Seed Notifications ──
    const existingNotifications = await Notification.countDocuments();
    if (existingNotifications === 0) {
      const notifications = [
        {
          message: "Your Contribution of 75 credits to BrushStroke: AI-Powered Art Tutorial App was approved by Emily Rivera",
          toEmail: "supporter@test.com",
          actionRoute: "/dashboard/supporter",
          read: true,
        },
        {
          message: "Your Contribution of 60 credits to CodeSpark: Free Coding Bootcamp for Teens was rejected by Emily Rivera",
          toEmail: "supporter@test.com",
          actionRoute: "/dashboard/supporter",
          read: false,
        },
        {
          message: "Your withdrawal of $15 has been processed successfully!",
          toEmail: "creator@test.com",
          actionRoute: "/dashboard/creator/withdrawals",
          read: true,
        },
        {
          message: "New contribution of 100 credits to SolarPulse: Portable Solar Charger for Everyone by Sarah Johnson",
          toEmail: "creator@test.com",
          actionRoute: "/dashboard/creator",
          read: false,
        },
        {
          message: "New contribution of 50 credits to SolarPulse: Portable Solar Charger for Everyone by Mike Chen",
          toEmail: "creator@test.com",
          actionRoute: "/dashboard/creator",
          read: false,
        },
      ];
      await Notification.insertMany(notifications);
      console.log(`Seeded ${notifications.length} notifications.`);
    } else {
      console.log(`${existingNotifications} notifications already exist, skipping seed.`);
    }

    // ── Seed Reports ──
    const existingReports = await Report.countDocuments();
    if (existingReports === 0) {
      const pendingCampaign = await Campaign.findOne({ status: "pending" });
      if (pendingCampaign) {
        const reports = [
          {
            campaign_id: pendingCampaign._id,
            campaign_title: pendingCampaign.campaign_title,
            reporter_name: "Sarah Johnson",
            reporter_email: "supporter@test.com",
            reason: "This campaign seems to have a copied description from another platform. The product images look like stock photos.",
            report_date: new Date("2026-07-22"),
            status: "pending",
          },
        ];
        await Report.insertMany(reports);
        console.log(`Seeded ${reports.length} report.`);
      }
    } else {
      console.log(`${existingReports} reports already exist, skipping seed.`);
    }

  } catch (error) {
    console.error("Failed to seed data:", error.message);
  }
};

module.exports = seedData;
