const db = require("../config/database");

exports.getDashboardStats = async (req, res) => {
  try {
    // Get total users count
    const [usersResult] = await db
      .promise()
      .query("SELECT COUNT(*) as total FROM users");
    const totalUsers = usersResult[0].total;

    // Get total blog posts count
    const [postsResult] = await db
      .promise()
      .query("SELECT COUNT(*) as total FROM events");
    const totalPosts = postsResult[0].total;

    // Get recent posts
    const [recentPosts] = await db
      .promise()
      .query(
        "SELECT id, title, school as instansi, event as tipe_acara, date, status FROM events ORDER BY created_at DESC LIMIT 5"
      );

    // Calculate month-over-month changes (mock data for now)
    // In the future, you can implement proper date-based queries
    const userChange = Math.floor(totalUsers * 0.1); // 10% as sample growth
    const postChange = Math.floor(totalPosts * 0.05); // 5% as sample growth

    res.status(200).json({
      stats: {
        users: {
          total: totalUsers,
          change: userChange,
          percentChange: (
            (userChange / (totalUsers - userChange)) *
            100
          ).toFixed(1),
        },
        posts: {
          total: totalPosts,
          change: postChange,
          percentChange: (
            (postChange / (totalPosts - postChange)) *
            100
          ).toFixed(1),
        },
        visitors: {
          total: 5845, // Mock data for now
          change: 781,
          percentChange: "2.6",
        },
      },
      recentPosts,
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ message: err.message });
  }
};
