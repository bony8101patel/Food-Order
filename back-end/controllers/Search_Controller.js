const { QueryTypes } = require('sequelize');
const sequelize = require("../config/dbConfig");


const SearchAllPublishedBlog = async (req, res) => {
    try {
        let blogData;

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

        if (blogData.length === 0) {
            return res.status(404).json({ message: "No published blogs found" });
        }

        res.status(200).json(blogData);
    } catch (err) {
        if (err.name === 'SequelizeDatabaseError') {
            console.error("Database Error:", err.message);
            return res.status(500).json({ error: "Database Error" });
        }

        console.error("Error fetching published blogs:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }

}




const SearchFilter = async (req, res) => {
    console.log("Inside SearchFilter API");

    try {
        const { title, category, startDate, endDate } = req.body;
        const { user_id, user_role } = req.user;

        let query = `
            SELECT b.blog_id, b.blog_title, b.blog_desc, b.blog_images, b.published_date, bs.blog_status, c.category_name AS blog_category, u.user_name
            FROM blogs AS b 
            LEFT JOIN blog_status AS bs ON b.blog_status = bs.blog_status_id
            LEFT JOIN categories AS c ON b.blog_category = c.category_id
            LEFT JOIN users AS u ON b.user_id = u.user_id
            WHERE bs.blog_status = 'published' AND b.is_active = 2`;

        if (user_role !== 1) {
            query += ` AND b.user_id = ${user_id}`;
        }

        if (title) {
            query += ` AND b.blog_title LIKE '%${title}%'`;
        }

        if (category) {
            query += ` AND c.category_name = '${category}'`;
        }

        if (startDate && endDate) {
            query += ` AND DATE(b.published_date) BETWEEN '${startDate}' AND '${endDate}'`;
        }

        const blogData = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });

        if (blogData.length === 0) {
            return res.status(404).json({ message: "No published blogs found" });
        }

        res.status(200).json(blogData);
    } catch (err) {
        console.error("Error fetching published blogs:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = {
    SearchAllPublishedBlog,
    SearchFilter
}


