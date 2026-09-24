const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ======================================================
// CUSTOMER REGISTER
// ======================================================

const register = async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        // Check required fields
        if (!name || !email || !password) {

            return res.status(400).json({
                message: "Name, email and password are required"
            });

        }


        // Check whether email already exists
        const checkSql = `
            SELECT id
            FROM users
            WHERE email = ?
        `;


        db.query(
            checkSql,
            [email],
            async (err, results) => {

                if (err) {

                    console.error(
                        "Check user error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Database error",
                        error: err.sqlMessage
                    });

                }


                // Email already exists
                if (results.length > 0) {

                    return res.status(409).json({
                        message: "Email already registered"
                    });

                }


                try {

                    // Hash password
                    const hashedPassword =
                        await bcrypt.hash(password, 10);


                    // Insert user
                    const insertSql = `
                        INSERT INTO users
                        (name, email, password, role)
                        VALUES (?, ?, ?, ?)
                    `;


                    db.query(
                        insertSql,
                        [
                            name,
                            email,
                            hashedPassword,
                            "customer"
                        ],
                        (err, result) => {

                            if (err) {

                                console.error(
                                    "INSERT USER ERROR:",
                                    err
                                );

                                console.error(
                                    "SQL MESSAGE:",
                                    err.sqlMessage
                                );

                                return res.status(500).json({

                                    message:
                                        "Unable to register user",

                                    error:
                                        err.sqlMessage

                                });

                            }


                            console.log(
                                "User registered:",
                                email
                            );


                            return res.status(201).json({

                                message:
                                    "Registration successful",

                                userId:
                                    result.insertId

                            });

                        }
                    );

                } catch (error) {

                    console.error(
                        "Password hashing error:",
                        error
                    );

                    return res.status(500).json({
                        message: "Password hashing failed"
                    });

                }

            }
        );

    } catch (error) {

        console.error(
            "Register error:",
            error
        );

        return res.status(500).json({
            message: "Server error"
        });

    }

};


// ======================================================
// CUSTOMER LOGIN
// ======================================================

const login = (req, res) => {

    const {
        email,
        password
    } = req.body;


    if (!email || !password) {

        return res.status(400).json({
            message:
                "Email and password are required"
        });

    }


    const sql = `
        SELECT
            id,
            name,
            email,
            password,
            role
        FROM users
        WHERE email = ?
    `;


    db.query(
        sql,
        [email],
        async (err, results) => {

            if (err) {

                console.error(
                    "Customer login database error:",
                    err
                );

                return res.status(500).json({
                    message: "Database error"
                });

            }


            if (results.length === 0) {

                return res.status(401).json({
                    message:
                        "Invalid email or password"
                });

            }


            const user = results[0];


            try {

                const passwordMatch =
                    await bcrypt.compare(
                        password,
                        user.password
                    );


                if (!passwordMatch) {

                    return res.status(401).json({
                        message:
                            "Invalid email or password"
                    });

                }


                if (!process.env.JWT_SECRET) {

                    console.error(
                        "JWT_SECRET is missing"
                    );

                    return res.status(500).json({
                        message:
                            "JWT secret is not configured"
                    });

                }


                const token = jwt.sign(

                    {
                        id: user.id,
                        email: user.email,
                        role: user.role
                    },

                    process.env.JWT_SECRET,

                    {
                        expiresIn: "1d"
                    }

                );


                return res.json({

                    message:
                        "Login successful",

                    token,

                    user: {

                        id: user.id,

                        name: user.name,

                        email: user.email,

                        role: user.role

                    }

                });

            } catch (error) {

                console.error(
                    "Customer login error:",
                    error
                );

                return res.status(500).json({
                    message: "Login failed"
                });

            }

        }
    );

};


// ======================================================
// ADMIN + SUPER ADMIN LOGIN
// ======================================================

const adminLogin = (req, res) => {

    const {
        email,
        password
    } = req.body;


    console.log(
        "Admin login request:",
        email
    );


    if (!email || !password) {

        return res.status(400).json({
            message:
                "Email and password are required"
        });

    }


    const sql = `
        SELECT
            id,
            name,
            email,
            password,
            role
        FROM admins
        WHERE email = ?
    `;


    db.query(
        sql,
        [email],
        async (err, results) => {

            if (err) {

                console.error(
                    "Admin database error:",
                    err
                );

                return res.status(500).json({
                    message: "Database error",
                    error: err.sqlMessage
                });

            }


            console.log(
                "Admin records found:",
                results.length
            );


            if (results.length === 0) {

                return res.status(401).json({
                    message:
                        "Invalid email or password"
                });

            }


            const admin = results[0];


            console.log(
                "Admin found:",
                admin.email,
                admin.role
            );


            try {

                const passwordMatch =
                    await bcrypt.compare(
                        password,
                        admin.password
                    );


                console.log(
                    "Password match:",
                    passwordMatch
                );


                if (!passwordMatch) {

                    return res.status(401).json({
                        message:
                            "Invalid email or password"
                    });

                }


                // Only admin and superadmin
                if (
                    admin.role !== "admin" &&
                    admin.role !== "superadmin"
                ) {

                    return res.status(403).json({
                        message:
                            "Invalid admin role"
                    });

                }


                if (!process.env.JWT_SECRET) {

                    console.error(
                        "JWT_SECRET is missing"
                    );

                    return res.status(500).json({
                        message:
                            "JWT secret is not configured"
                    });

                }


                const token = jwt.sign(

                    {
                        id: admin.id,
                        email: admin.email,
                        role: admin.role
                    },

                    process.env.JWT_SECRET,

                    {
                        expiresIn: "1d"
                    }

                );


                console.log(
                    "Admin login successful:",
                    admin.email,
                    admin.role
                );


                return res.json({

                    message:
                        "Admin login successful",

                    token,

                    admin: {

                        id: admin.id,

                        name: admin.name,

                        email: admin.email,

                        role: admin.role

                    }

                });

            } catch (error) {

                console.error(
                    "Admin login error:",
                    error
                );

                return res.status(500).json({
                    message: "Login failed"
                });

            }

        }
    );

};


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    register,
    login,
    adminLogin

};