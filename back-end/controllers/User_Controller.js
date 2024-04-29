const { QueryTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const bcrypt = require("bcrypt");
const moment = require("moment");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "blogging";

const Registration = async (req, res) => {
    console.log(req.body);
    try {
        const {
            user_firstname,
            user_lastname,
            user_email,
            password,
            user_contact_no,
            user_name,
            user_dob,
        } = req.body;

        if (!user_firstname || !user_lastname || !user_email || !password || !user_contact_no || !user_name || !user_dob) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const dobMySQLFormat = moment(user_dob, "YYYY-MM-DD").format("YYYY-MM-DD");

        if (!moment(dobMySQLFormat, "YYYY-MM-DD", true).isValid()) {
            return res.status(400).json({ error: "Invalid date format for user_dob" });
        }

        const minimumBirthdate = moment().subtract(18, "years").format("YYYY-MM-DD");

        if (dobMySQLFormat > minimumBirthdate) {
            return res.status(400).json({ error: "User must be at least 18 years old to register" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await sequelize.query(
            `INSERT INTO users (user_firstname, user_lastname, user_email, password, user_contact_no, user_name, user_dob) 
             VALUES ('${user_firstname}', '${user_lastname}', '${user_email}', '${hashedPassword}', '${user_contact_no}', '${user_name}', '${dobMySQLFormat}')`,
            { type: QueryTypes.INSERT }
        );

        res.status(200).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const LogIn = async (req, res) => {
    const { user_email, password } = req.body;

    try {
        if (!user_email || !password) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const existingUser = await sequelize.query(
            `SELECT user_id,user_email,password,user_role FROM users WHERE user_email = '${user_email}'`,
            { type: QueryTypes.SELECT }
        );

        if (existingUser.length === 0) {
            return res.status(400).json({ error: "Email not found" });
        }

        const userId = existingUser[0].user_id;

        const isActive = await sequelize.query(
            `SELECT user_id, user_email, password, user_role from users WHERE user_id = ${userId} AND is_active = 2`,
            { type: QueryTypes.SELECT }
        )

        if (isActive.length === 0) {
            return res.status(401).json({ error: "User Is Inactive!" });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            existingUser[0].password
        );

        if (!passwordMatch) {
            return res.status(400).json({ error: "Incorrect password" });
        }

        if (passwordMatch) {
            const token = jwt.sign(
                {
                    user_id: existingUser[0].user_id,
                    user_email: existingUser[0].user_email,
                    user_role: existingUser[0].user_role
                },
                SECRET_KEY
            );
            res.cookie("jwt", token, {
                httpOnly: true,
                secure: true,
                maxAge: 3600000,
            });

            console.log("Token : ", token)

            return res.status(200).json({
                message: "Login successful",
                token: token,
                userRole: existingUser[0].user_role
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const fetchActiveUserData = async (req, res) => {
    try {
        const userRole = req.user.user_role;
        if (userRole !== 1) {
            return res.status(403).json({ message: "Forbidden: You are not authorized to access this resource" });
        }

        const userData = await sequelize.query(
            `SELECT user_id, user_name, user_email, user_contact_no, user_dob
            FROM users
            WHERE is_active = 2 AND user_role = 2`,
            { type: QueryTypes.SELECT }
        );

        if (userData.length === 0) {
            return res.status(404).json({ message: "No active users found" });
        }

        res.status(200).json(userData);
    } catch (err) {
        if (err.name === 'SequelizeDatabaseError') {
            console.error("Database Error:", err.message);
            return res.status(500).json({ error: "Database Error" });
        }

        console.error("Error fetching user data:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



const fetchInactiveUserData = async (req, res) => {
    try {
        const userRole = req.user.user_role;
        if (userRole !== 1) {
            return res.status(403).json({ message: "Forbidden: You are not authorized to access this resource" });
        }

        const userData = await sequelize.query(
            `SELECT user_id, user_name, user_email, user_contact_no, user_dob
            FROM users
            WHERE is_active = 1`,
            { type: QueryTypes.SELECT }
        );

        if (userData.length === 0) {
            return res.status(404).json({ message: "No active users found" });
        }

        res.status(200).json(userData);
    } catch (err) {
        if (err.name === 'SequelizeDatabaseError') {
            console.error("Database Error:", err.message);
            return res.status(500).json({ error: "Database Error" });
        }

        console.error("Error fetching user data:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



const AdminActiveUser = async (req, res) => {
    try {

        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const userRole = req.user.user_role;

        const [user] = await sequelize.query(
            `SELECT * FROM users WHERE user_id = ?`,
            { replacements: [user_id], type: QueryTypes.SELECT }
        );

        console.log(user.user_email);


        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (userRole !== 1 && blog.user_id !== createdBy) {
            return res.status(403).json({ error: "Not authorized" });
        }

    
        await sequelize.query(
            `UPDATE users SET is_active = 2 WHERE user_id = ?`,
            {
                replacements: [
                    user_id,
                ],
                type: QueryTypes.UPDATE
            }
        );


        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'vedangipatel.netclues@gmail.com',
                pass: 'vbah lvmx avqk ulno'
            }
        });

        const mailOptions = {
            from: 'vedangipatel.netclues@gmail.com',
            to: `${user.user_email}`,
            subject: `${user.uer_name} Account Activated`,
            text: `${user.user_name} Your acccount is Active Now`
        };

        await transporter.sendMail(mailOptions);

        console.log(`Mail Sent To ${user.user_email}`)

        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    };
};



const AdminInactiveUser = async (req, res) => {
    try {

        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const userRole = req.user.user_role;

        const [user] = await sequelize.query(
            `SELECT * FROM users WHERE user_id = ?`,
            { replacements: [user_id], type: QueryTypes.SELECT }
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (userRole !== 1 && blog.user_id !== createdBy) {
            return res.status(403).json({ error: "Not authorized" });
        }

    
        await sequelize.query(
            `UPDATE users SET is_active = 1 WHERE user_id = ?`,
            {
                replacements: [
                    user_id,
                ],
                type: QueryTypes.UPDATE
            }
        );

        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    };
};




module.exports = {
    Registration,
    LogIn,
    fetchActiveUserData,
    fetchInactiveUserData,
    AdminActiveUser,
    AdminInactiveUser
};
