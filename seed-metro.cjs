const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🎧 Seeding a premium, full-featured user...");

  // 1. Delete existing user if exists to avoid duplication
  try {
    const existing = await prisma.user.findFirst({
      where: { email: "metro@creator.hub" }
    });
    if (existing) {
      await prisma.user.delete({
        where: { id: existing.id }
      });
      console.log("Deleted pre-existing 'metro@creator.hub' user.");
    }
  } catch (e) {
    // ignore
  }

  // 2. Create User with Profile and Payments in one query!
  const user = await prisma.user.create({
    data: {
      email: "metro@creator.hub",
      username: "metro",
      clerkUserId: "user_mock_metro123",
      plan: "CREATOR",
      role: "ADMIN",
      isBanned: false,
      profile: {
        create: {
          theme: "neon-purple",
          bio: "Metro Boomin want some more! Official trap beats, production presets, and sample packs.",
          customDomain: "links.metroboomin.com",
          seoTitle: "Metro Boomin | Official Hub & Beats",
          seoDescription: "Stream official trap beats, download premium preset expansion packs, and discover Metro's production studio.",
          seoKeywords: "metro boomin, trap beats, hiphop presets, drumkit, fl studio"
        }
      },
      links: {
        create: [
          {
            title: "🔥 Metro Boomin Shop (Drumkits & Presets)",
            url: "https://metroboomin.net/shop",
            order: 0,
            isActive: true
          },
          {
            title: "🎵 Spotify - HEROES & VILLAINS",
            url: "https://open.spotify.com/album/1xuHUXR0Y3B7Vv3yqV1s0N",
            order: 1,
            isActive: true
          },
          {
            title: "🎹 Soundcloud Beats Portfolio",
            url: "https://soundcloud.com/metroboomin",
            order: 2,
            isActive: true
          },
          {
            title: "📺 YouTube - Official Visualizers",
            url: "https://youtube.com/metroboomin",
            order: 3,
            isActive: true
          }
        ]
      },
      payments: {
        create: [
          {
            amount: 99,
            status: "SUCCESS",
            package: "STARTER",
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          },
          {
            amount: 249,
            status: "SUCCESS",
            package: "CREATOR",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    },
    include: {
      links: true
    }
  });

  console.log(`Successfully created User: @${user.username} (ID: ${user.id})`);

  // 3. Pre-generate realistic visitor and link click history
  console.log("Generating 30 days of high-fidelity visitor traffic logs...");
  const devices = ["Mobile", "Desktop", "Tablet"];
  const deviceProbs = [0.70, 0.25, 0.05];

  const browsers = ["Chrome", "Safari", "Firefox", "Edge"];
  const browserProbs = [0.55, 0.30, 0.10, 0.05];

  const countries = ["TR", "US", "DE", "GB", "NL", "AZ"];
  const countryProbs = [0.75, 0.10, 0.06, 0.04, 0.03, 0.02];

  const referrers = ["Instagram", "Direct", "Twitter", "YouTube", "TikTok", "LinkedIn"];
  const referrerProbs = [0.45, 0.20, 0.15, 0.10, 0.07, 0.03];

  const selectRandom = (items, probabilities) => {
    const r = Math.random();
    let sum = 0;
    for (let i = 0; i < items.length; i++) {
      sum += probabilities[i];
      if (r <= sum) return items[i];
    }
    return items[items.length - 1];
  };

  const now = new Date();
  const pageViewsData = [];
  const linkClicksData = [];

  for (let dayOffset = 30; dayOffset >= 0; dayOffset--) {
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() - dayOffset);

    // Generate random views per day (between 25 and 110 for premium vibe!)
    const viewsCount = Math.floor(25 + Math.random() * 85);

    for (let j = 0; j < viewsCount; j++) {
      const pvTime = new Date(targetDate);
      pvTime.setHours(Math.floor(Math.random() * 24));
      pvTime.setMinutes(Math.floor(Math.random() * 60));

      const device = selectRandom(devices, deviceProbs);
      const browser = selectRandom(browsers, browserProbs);
      const country = selectRandom(countries, countryProbs);
      const referrer = selectRandom(referrers, referrerProbs);

      pageViewsData.push({
        userId: user.id,
        device,
        browser,
        country,
        referrer,
        createdAt: pvTime,
      });

      // 45% conversion to click
      if (Math.random() < 0.45) {
        const clickCount = Math.random() < 0.85 ? 1 : 2;
        for (let c = 0; c < clickCount; c++) {
          const randomLink = user.links[Math.floor(Math.random() * user.links.length)];
          const clickTime = new Date(pvTime);
          clickTime.setSeconds(clickTime.getSeconds() + Math.floor(Math.random() * 90));

          linkClicksData.push({
            linkId: randomLink.id,
            createdAt: clickTime,
          });
        }
      }
    }
  }

  // SQLite insert batch loops
  console.log(`Writing ${pageViewsData.length} page view entries...`);
  for (const pv of pageViewsData) {
    await prisma.pageView.create({ data: pv });
  }

  console.log(`Writing ${linkClicksData.length} link click entries...`);
  for (const lc of linkClicksData) {
    await prisma.linkClick.create({ data: lc });
  }

  console.log("Successfully completed seeding Metro Boomin full-featured creator profile! 🎧🔥");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
