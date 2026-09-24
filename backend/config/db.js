const mysql = require("mysql2");

const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "ecommerce",
    waitForConnections: true,
    connectionLimit: 10,
    idleTimeout: 60000
});

db.getConnection((err, connection) => {
    if (err) {
        console.error("❌ MySQL connection failed:", err.message);
        return;
    }
    console.log("✅ MySQL connected successfully");
    connection.release();
});

module.exports = db;
