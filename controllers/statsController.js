const db = require("../config/database");

exports.getDashboardStats = async (req, res) => {
  try {
    // Get current month's data
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Get previous month's data
    const previousDate = new Date(currentDate);
    previousDate.setMonth(previousDate.getMonth() - 1);
    const previousMonth = previousDate.getMonth() + 1;
    const previousYear = previousDate.getFullYear();

    const [totalUsersResult] = await db
      .promise()
      .query("SELECT COUNT(*) as total FROM users");
    const totalUsers = totalUsersResult[0].total;

    // Get users count for current month
    const [currentUsersResult] = await db
      .promise()
      .query(
        "SELECT COUNT(*) as total FROM users WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?",
        [currentMonth, currentYear]
      );
    const currentMonthUsers = currentUsersResult[0].total;

    // Get users count for previous month
    const [previousUsersResult] = await db
      .promise()
      .query(
        "SELECT COUNT(*) as total FROM users WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?",
        [previousMonth, previousYear]
      );
    const previousMonthUsers = previousUsersResult[0].total;

    // Get total posts count (all time)
    const [totalPostsResult] = await db
      .promise()
      .query("SELECT COUNT(*) as total FROM events");
    const totalPosts = totalPostsResult[0].total;

    // Get posts count for current month
    const [currentPostsResult] = await db
      .promise()
      .query(
        "SELECT COUNT(*) as total FROM events WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?",
        [currentMonth, currentYear]
      );
    const currentMonthPosts = currentPostsResult[0].total;

    // Get posts count for previous month
    const [previousPostsResult] = await db
      .promise()
      .query(
        "SELECT COUNT(*) as total FROM events WHERE MONTH(created_at) = ? AND YEAR(created_at) = ?",
        [previousMonth, previousYear]
      );
    const previousMonthPosts = previousPostsResult[0].total;

    // Get recent posts
    const [recentPosts] = await db
      .promise()
      .query(
        "SELECT id, title, school as instansi, event as tipe_acara, date, status FROM events ORDER BY created_at DESC LIMIT 5"
      );

    // Calculate changes
    const userChange = currentMonthUsers - previousMonthUsers;
    const postChange = currentMonthPosts - previousMonthPosts;

    // Calculate percentage changes
    const userPercentChange =
      previousMonthUsers === 0
        ? 100
        : ((userChange / previousMonthUsers) * 100).toFixed(1);

    const postPercentChange =
      previousMonthPosts === 0
        ? 100
        : ((postChange / previousMonthPosts) * 100).toFixed(1);

    const responseData = {
      stats: {
        users: {
          total: totalUsers,
          change: userChange,
          percentChange: userPercentChange,
          isPositive: userChange >= 0,
        },
        posts: {
          total: totalPosts,
          change: postChange,
          percentChange: postPercentChange,
          isPositive: postChange >= 0,
        },
      },
      recentPosts,
    };

    res.status(200).json(responseData);
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ message: err.message });
  }
};
