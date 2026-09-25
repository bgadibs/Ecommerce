const db = require("./config/db");
const bcrypt = require("bcryptjs");


// =========================================
// CREATE ADMINS TABLE IF NOT EXISTS
// =========================================

const setupAdmins = () => {

    const createTable = `
        CREATE TABLE IF NOT EXISTS admins (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role ENUM('admin', 'superadmin') DEFAULT 'admin',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    db.query(createTable, async (err) => {

        if (err) {
            console.error("Failed to create admins table:", err.sqlMessage);
            return;
        }

        console.log("Admins table ready");

        // Check if any admins exist
        db.query(
            "SELECT COUNT(*) AS count FROM admins",
            async (err, results) => {

                if (err) {
                    console.error("Error checking admins:", err.sqlMessage);
                    return;
                }

                // Only seed if the table is empty
                if (results[0].count > 0) {
                    console.log("Admins already exist, skipping seed");
                    return;
                }

                try {

                    const superPass = await bcrypt.hash("SuperAdmin@123", 10);
                    const adminPass = await bcrypt.hash("Admin@123", 10);

                    const insertSql = `
                        INSERT INTO admins (name, email, password, role) VALUES
                        (?, ?, ?, 'superadmin'),
                        (?, ?, ?, 'admin')
                    `;

                    db.query(
                        insertSql,
                        [
                            "Super Admin", "superadmin@bgadi.com", superPass,
                            "Admin", "admin@bgadi.com", adminPass
                        ],
                        (err) => {

                            if (err) {
                                console.error("Failed to seed admins:", err.sqlMessage);
                                return;
                            }

                            console.log("Default admin accounts created");
                            console.log("  Super Admin: superadmin@bgadi.com / SuperAdmin@123");
                            console.log("  Admin: admin@bgadi.com / Admin@123");

                        }
                    );

                } catch (error) {
                    console.error("Password hashing error:", error);
                }

            }
        );

    });

};

module.exports = setupAdmins;
