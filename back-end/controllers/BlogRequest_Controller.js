const { QueryTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const nodemailer = require('nodemailer');


const MakeBlog_Publish = async (req, res) => {
    try {
        const userRole = req.user.user_role;
        const userId = req.user.user_id;
        const { blog_id } = req.body;

        if (userRole !== 1) {
            return res.status(401).json({ error: "Not Authorised" })
        }

        if (!blog_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const currentDate = new Date().toISOString().split('T')[0];

        const existingBlog = await sequelize.query(`SELECT * FROM blogs where blog_id = ${blog_id}`);

        if (existingBlog.legnth == 0) {
            return res.status(404).json({ error: "Blog not found" });
        }

        await sequelize.query(`UPDATE blogs SET published_date = '${currentDate}', is_active = 2, blog_status = 2  WHERE blog_id = ${blog_id}`);

        const User_Id = existingBlog[0][0].user_id;

        const EmailTo = await sequelize.query(`SELECT user_email from users where user_id = ${User_Id}`)

        console.log('Email Sent To : ' ,EmailTo)

        res.status(200).json({ message: "Blog updated successfully" });


        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'vedangipatel.netclues@gmail.com',
                pass: 'vbah lvmx avqk ulno'
            }
        });

        const mailOptions = {
            from: 'vedangipatel.netclues@gmail.com',
            to: `${EmailTo[0][0].user_email}`,
            subject: `${existingBlog[0][0].blog_title} published successfully`,
            text: `${existingBlog[0][0].blog_title} published successfully`
        };

        await transporter.sendMail(mailOptions);

        console.log(`Email Sent to : ${EmailTo[0][0].user_email}`);


    } catch (err) {
        console.log("Error Detected", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}




const MakeBlog_Reject = async (req, res) => {       
    try {
        const userRole = req.user.user_role;
        const { blog_id } = req.body;
        const userId = req.user.user_id

        if (userRole !== 1) {
            return res.status(401).json({ error: "Not Authorised" })
        }

        if (!blog_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const existingBlog = await sequelize.query(`SELECT * FROM blogs where blog_id = ${blog_id}`);

        console.log(existingBlog)


        if (existingBlog.legnth == 0) {
            return res.status(404).json({ error: "Blog not found" });
        }

        await sequelize.query(`UPDATE blogs SET is_active = 1, blog_status = 3  WHERE blog_id = ${blog_id}`);


        const User_Id = existingBlog[0][0].user_id;


        const EmailTo = await sequelize.query(`SELECT user_email from users where user_id = ${User_Id}`)


        console.log('Email Sent To : ' ,EmailTo)


        res.status(200).json({ message: "Blog updated successfully" });


        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'vedangipatel.netclues@gmail.com',
                pass: 'vbah lvmx avqk ulno'
            }
        });

        console.log(EmailTo[0][0].user_email)

        const mailOptions = {
            from: 'vedangipatel.netclues@gmail.com',
            to: `${EmailTo[0][0].user_email}`,
            subject: `${existingBlog[0][0].blog_title} rejected`,
            text: `${existingBlog[0][0].blog_title} Rejuected`
        };

        await transporter.sendMail(mailOptions);

        console.log(`Email Sent to : ${EmailTo[0][0].user_email}`);


    } catch (err) {
        console.log("Error Detected", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}




const MakeBlog_Active = async (req, res) => {

    try {
        const userRole = req.user.user_role;
        const { blog_id } = req.body;

        if (userRole !== 1) {
            return res.status(401).json({ error: "Not Authorised" })
        }

        if (!blog_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const existingBlog = await sequelize.query(`SELECT * FROM blogs where blog_id = ${blog_id}`);

        if (existingBlog.legnth == 0) {
            return res.status(404).json({ error: "Blog not found" });
        }

        await sequelize.query(`UPDATE blogs SET is_active = 2 WHERE blog_id = ${blog_id}`)

        res.status(200).json({ message: "Blog updated successfully" });

    } catch (err) {
        console.log("Error Detected", err);
    }

}




const MakeBlog_Inactive = async (req, res) => {

    try {
        const userRole = req.user.user_role;
        const { blog_id } = req.body;

        if (userRole !== 1) {
            return res.status(401).json({ error: "Not Authorised" })
        }


        if (!blog_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const existingBlog = await sequelize.query(`SELECT * FROM blogs where blog_id = ${blog_id}`);

        if (existingBlog.legnth == 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        await sequelize.query(`UPDATE blogs SET is_active = 2 WHERE blog_id = ${blog_id}`)

        res.status(200).json({ message: "Product updated successfully" });

    } catch (err) {
        console.log("Error Detected", err);
    }

}




const AdminActiveBlog = async (req, res) => {
    try {
        console.log("Fetching Active Blogs");
        const userRole = req.user.user_role;
        let blogData;

        if (userRole !== 1) {

            res.status(401).json({ error: "Not Authorised" })

        } else {
            blogData = await sequelize.query(
                `SELECT b.blog_id, b.blog_title, b.blog_desc, b.blog_images, b.published_date, bs.blog_status, c.category_name AS blog_category, u.user_name
                FROM blogs AS b
                LEFT JOIN blog_status AS bs ON b.blog_status = bs.blog_status_id
                LEFT JOIN categories AS c ON b.blog_category = c.category_id
                LEFT JOIN users AS u ON b.user_id = u.user_id
                WHERE bs.blog_status = 'published' AND b.is_active = 2`,
                {
                    type: QueryTypes.SELECT
                }
            );
        }

        if (blogData.length === 0) {
            return res.status(404).json({ message: "No pending blogs found" });
        }

        res.status(200).json(blogData);
    } catch (err) {
        if (err.name === 'SequelizeDatabaseError') {
            console.error("Database Error:", err.message);
            return res.status(500).json({ error: "Database Error" });
        }

        console.error("Error fetching blogs:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};




const AdminInactiveBlog = async (req, res) => {
    try {
        console.log("Fetching Active Blogs");
        const userRole = req.user.user_role;
        let blogData;

        if (userRole !== 1) {

            res.status(401).json({ error: "Not Authorised" })

        } else {
            blogData = await sequelize.query(
                `SELECT b.blog_id, b.blog_title, b.blog_desc, b.blog_images, b.published_date, bs.blog_status, c.category_name AS blog_category, u.user_name
                FROM blogs AS b
                LEFT JOIN blog_status AS bs ON b.blog_status = bs.blog_status_id
                LEFT JOIN categories AS c ON b.blog_category = c.category_id
                LEFT JOIN users AS u ON b.user_id = u.user_id
                WHERE b.is_active = 1`,
                {
                    type: QueryTypes.SELECT
                }
            );
        }

        if (blogData.length === 0) {
            return res.status(404).json({ message: "No blogs found" });
        }

        res.status(200).json(blogData);
    } catch (err) {
        if (err.name === 'SequelizeDatabaseError') {
            console.error("Database Error:", err.message);
            return res.status(500).json({ error: "Database Error" });
        }

        console.error("Error fetching blogs:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



module.exports = {
    MakeBlog_Active,
    MakeBlog_Inactive,
    MakeBlog_Publish,
    MakeBlog_Reject,
    AdminActiveBlog,
    AdminInactiveBlog
}