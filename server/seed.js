const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Campaign = require("./models/Campaign");

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
    creator_email: "admin@fundspark.com",
    creator_name: "Admin",
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
    creator_email: "admin@fundspark.com",
    creator_name: "Admin",
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
    creator_email: "user1@mail.com",
    creator_name: "user 1",
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
    creator_email: "admin@fundspark.com",
    creator_name: "Admin",
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
    creator_email: "user1@mail.com",
    creator_name: "user 1",
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
    creator_email: "admin@fundspark.com",
    creator_name: "Admin",
  },
];

const seedData = async () => {
  try {
    // Drop stale indexes that conflict with current schema
    const collection = mongoose.connection.collection("users");
    const indexes = await collection.indexes();
    for (const index of indexes) {
      if (index.name === "email_1") {
        await collection.dropIndex("email_1");
        console.log("Dropped stale index: email_1");
      }
    }

    // Seed admin
    const existingAdmin = await User.findOne({ user_email: "admin@fundspark.com" });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("Admin@123", 12);

      await User.create({
        display_name: "Admin",
        user_email: "admin@fundspark.com",
        photo_url: "https://randomuser.me/api/portraits/lego/1.jpg",
        password: hashedPassword,
        role: "admin",
        credits: 0,
      });

      console.log("Admin user created successfully!");
      console.log("Email: admin@fundspark.com");
      console.log("Password: Admin@123");
    } else {
      console.log("Admin user already exists.");
    }

    // Seed dummy campaigns
    const existingCampaigns = await Campaign.countDocuments();
    if (existingCampaigns === 0) {
      await Campaign.insertMany(dummyCampaigns);
      console.log(`Seeded ${dummyCampaigns.length} dummy campaigns.`);
    } else {
      console.log(`${existingCampaigns} campaigns already exist, skipping seed.`);
    }
  } catch (error) {
    console.error("Failed to seed data:", error.message);
  }
};

module.exports = seedData;
