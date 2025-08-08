export const sampleCampaigns = [
    {
      id: 1,
      name: "Welcome Series - New Users",
      subject: "Welcome to SmartJourney! 🚀",
      content: {
        subject: "Welcome to SmartJourney! 🚀",
        body: "Hi there! Welcome to SmartJourney AI Platform. We're excited to help you create amazing campaigns that convert!"
      },
      status: "active",
      audience: "new",
      metrics: { sent: 1250, opened: 875, clicked: 234, converted: 45 },
      created_at: "2024-01-15T10:00:00Z"
    },
    {
      id: 2,
      name: "Product Launch - AI Features",
      subject: "🤖 New AI Features Are Here!",
      content: {
        subject: "🤖 New AI Features Are Here!",
        body: "Discover our latest AI-powered features that will revolutionize your campaign management experience."
      },
      status: "sent",
      audience: "active",
      metrics: { sent: 3200, opened: 2240, clicked: 672, converted: 128 },
      created_at: "2024-01-10T14:30:00Z"
    },
    {
      id: 3,
      name: "Monthly Newsletter - January",
      subject: "Your January Success Report 📊",
      content: {
        subject: "Your January Success Report 📊",
        body: "Here's what happened in January and what's coming next month..."
      },
      status: "draft",
      audience: "all",
      metrics: { sent: 0, opened: 0, clicked: 0, converted: 0 },
      created_at: "2024-01-20T16:45:00Z"
    }
  ];