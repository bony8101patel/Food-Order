const { QueryTypes } = require('sequelize');
const sequelize = require("../config/dbConfig");
const blogImagesMulter = require('../middleware/BlogImageMiddlewareAuthenication')


const AddBlog = async (req, res) => {
    try {
        await blogImagesMulter(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ error: err });
            }

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: "Error: No images selected!" });
            }

            const userId = req.user.user_id

            const { blog_title, blog_desc, blog_category } = req.body;
            let blog_images = req.files.map((file) => file.filename);

            if (!blog_title || !blog_desc || !blog_category || !blog_images) {
                return res.status(400).json({ error: "Missing required fields." });
            }

            const [existingCategory] = await sequelize.query(
                `SELECT * FROM categories WHERE category_name = ?`,
                {
                    replacements: [blog_category],
                    type: QueryTypes.SELECT
                }
            );

            let categoryId;

            if (!existingCategory) {
                const [result] = await sequelize.query(
                    `INSERT INTO categories (category_name) VALUES (?)`,
                    {
                        replacements: [blog_category],
                        type: QueryTypes.INSERT
                    }
                );

                categoryId = result.lastInsertId;
            } else {
                categoryId = existingCategory.category_id;
            }

            const images = await JSON.stringify(blog_images)

            await sequelize.query(
                `INSERT INTO blogs (blog_title, blog_desc, blog_images, blog_category, user_id, is_active) 
                 VALUES (?, ?, ?, ?, ?, 1)`,
                {
                    replacements: [blog_title, blog_desc, images, categoryId, userId],
                    type: QueryTypes.INSERT
                }
            );

            res.status(201).json({ message: "Blog post created successfully" });
        });
    } catch (error) {
        console.error("Error creating blog post:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};




const fetchAllCategories = async (req, res) => {
    try {
        console.log("Fetching all categories");

        const categories = await sequelize.query(
            `SELECT category_id, category_name FROM categories`,
            { type: QueryTypes.SELECT }
        );

        if (categories.length === 0) {
            return res.status(404).json({ message: "No categories found" });
        }

        res.status(200).json(categories);
    } catch (err) {
        if (err.name === 'SequelizeDatabaseError') {
            console.error("Database Error:", err.message);
            return res.status(500).json({ error: "Database Error" });
        }

        console.error("Error fetching categories:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



const fetchAllBlogs = async (req, res) => {
    try {
        console.log("Fetching Blogs");
        const createdBy = req.user.user_id;
        const userRole = req.user.user_role;
        let blogData;

        // Determine the query based on user role
        if (userRole === 1) {
            // Admin: fetch all blogs
            blogData = await sequelize.query(
                `SELECT b.blog_id, b.blog_title, b.blog_desc, b.blog_images, b.published_date, bs.blog_status, c.category_name AS blog_category, u.user_name 
                FROM blogs AS b
                LEFT JOIN blog_status AS bs ON b.blog_status = bs.blog_status_id
                LEFT JOIN categories AS c ON b.blog_category = c.category_id
                LEFT JOIN users AS u ON b.user_id = u.user_id`,
                { type: QueryTypes.SELECT }
            );
        } else {
            // Regular user: fetch blogs created by the user
            blogData = await sequelize.query(
                `SELECT b.blog_id, b.blog_title, b.blog_desc, b.blog_images, b.published_date, bs.blog_status, c.category_name AS blog_category, u.user_name 
                FROM blogs AS b
                LEFT JOIN blog_status AS bs ON b.blog_status = bs.blog_status_id
                LEFT JOIN categories AS c ON b.blog_category = c.category_id
                LEFT JOIN users AS u ON b.user_id = u.user_id
                WHERE b.user_id = ? AND b.is_active = 2`,
                {
                    replacements: [createdBy],
                    type: QueryTypes.SELECT
                }
            );
        }

        // Check if any blogs were found
        if (blogData.length === 0) {
            return res.status(404).json({ message: "No blogs found" });
        }

        // Return the fetched blog data
        res.status(200).json(blogData);
    } catch (err) {
        // Handle database error
        if (err.name === 'SequelizeDatabaseError') {
            console.error("Database Error:", err.message);
            return res.status(500).json({ error: "Database Error" });
        }

        // Handle other types of errors
        console.error("Error fetching blogs:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



const fetchBlogByTitle = async (req, res) => {
    try {
        console.log("Fetching Blog by Title");
        const { blog_title } = req.body; 
        const createdBy = req.user.user_id;
        const userRole = req.user.user_role;
        let blogData;

        if (userRole === 1) {
            blogData = await sequelize.query(
                `SELECT b.blog_id, b.blog_title, b.blog_desc, b.blog_images, b.published_date, bs.blog_status, c.category_name AS blog_category, u.user_name
                FROM blogs AS b
                LEFT JOIN blog_status AS bs ON b.blog_status = bs.blog_status_id
                LEFT JOIN categories AS c ON b.blog_category = c.category_id
                LEFT JOIN users AS u ON b.user_id = u.user_id
                WHERE b.blog_title = ?`,
                {
                    replacements: [blog_title],
                    type: QueryTypes.SELECT
                }
            );
        } else {
            blogData = await sequelize.query(
                `SELECT b.blog_id, b.blog_title, b.blog_desc, b.blog_images, b.published_date, bs.blog_status, c.category_name AS blog_category, u.user_name
                FROM blogs AS b
                LEFT JOIN blog_status AS bs ON b.blog_status = bs.blog_status_id
                LEFT JOIN categories AS c ON b.blog_category = c.category_id
                LEFT JOIN users AS u ON b.user_id = u.user_id
                WHERE b.blog_title = ? AND b.user_id = ? AND b.is_active = 2`,
                {
                    replacements: [blog_title, createdBy],
                    type: QueryTypes.SELECT
                }
            );
        }

        if (blogData.length === 0) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json(blogData[0]); 
    } catch (err) {
        if (err.name === 'SequelizeDatabaseError') {
            console.error("Database Error:", err.message);
            return res.status(500).json({ error: "Database Error" });
        }

        console.error("Error fetching blog by title:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



const fetchPendingBlogs = async (req, res) => {
    try {
        console.log("Fetching Pending Blogs");
        const createdBy = req.user.user_id;
        const userRole = req.user.user_role;
        let blogData;

        if (userRole === 1) {
            blogData = await sequelize.query(
                `SELECT b.blog_id, b.blog_title, b.blog_desc, b.blog_images, b.published_date, bs.blog_status, c.category_name AS blog_category, u.user_name
                FROM blogs AS b
                LEFT JOIN blog_status AS bs ON b.blog_status = bs.blog_status_id
                LEFT JOIN categories AS c ON b.blog_category = c.category_id
                LEFT JOIN users AS u ON b.user_id = u.user_id
                WHERE bs.blog_status = 'pending' AND b.is_active = 1`,
                { type: QueryTypes.SELECT }
            );
        } else {
            blogData = await sequelize.query(
                `SELECT b.blog_id, b.blog_title, b.blog_desc, b.blog_images, b.published_date, bs.blog_status, c.category_name AS blog_category, u.user_name
                FROM blogs AS b
                LEFT JOIN blog_status AS bs ON b.blog_status = bs.blog_status_id
                LEFT JOIN categories AS c ON b.blog_category = c.category_id
                LEFT JOIN users AS u ON b.user_id = u.user_id
                WHERE bs.blog_status = 'pending' AND b.user_id = ? AND b.is_active = 1`,
                {
                    replacements: [createdBy],
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

        console.error("Error fetching pending blogs:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



const fetchPublishedBlogs = async (req, res) => {
    try {
        console.log("Fetching Published Blogs");
        const createdBy = req.user.user_id;
        const userRole = req.user.user_role;
        let blogData;

        if (userRole === 1) {
            blogData = await sequelize.query(
                `SELECT b.blog_id, b.blog_title, b.blog_desc, b.blog_images, b.published_date, bs.blog_status, b.is_active,c.category_name AS blog_category, u.user_name
                FROM blogs AS b
                LEFT JOIN blog_status AS bs ON b.blog_status = bs.blog_status_id
                LEFT JOIN categories AS c ON b.blog_category = c.category_id
                LEFT JOIN users AS u ON b.user_id = u.user_id
                WHERE bs.blog_status = 'published' AND b.is_active = 2`,
                { type: QueryTypes.SELECT }
            );
        } else {
            blogData = await sequelize.query(
                `SELECT b.blog_id, b.blog_title, b.blog_desc, b.blog_images, b.published_date, bs.blog_status, b.is_active, c.category_name AS blog_category, u.user_name
                FROM blogs AS b
                LEFT JOIN blog_status AS bs ON b.blog_status = bs.blog_status_id
                LEFT JOIN categories AS c ON b.blog_category = c.category_id
                LEFT JOIN users AS u ON b.user_id = u.user_id
                WHERE bs.blog_status = 'published' AND b.user_id = ? AND b.is_active = 2`,
                {
                    replacements: [createdBy],
                    type: QueryTypes.SELECT
                }
            );
        }

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
};



const fetchRejectedBlogs = async (req, res) => {
    try {
        console.log("Fetching Rejected Blogs");
        const createdBy = req.user.user_id;
        const userRole = req.user.user_role;
        let blogData;

        if (userRole === 1) {
            blogData = await sequelize.query(
                `SELECT b.blog_id, b.blog_title, b.blog_desc, b.blog_images, b.published_date, bs.blog_status, c.category_name AS blog_category, u.user_name
                FROM blogs AS b
                LEFT JOIN blog_status AS bs ON b.blog_status = bs.blog_status_id
                LEFT JOIN categories AS c ON b.blog_category = c.category_id
                LEFT JOIN users AS u ON b.user_id = u.user_id
                WHERE bs.blog_status = 'rejected' AND b.is_active = 1`,
                { type: QueryTypes.SELECT }
            );
        } else {
            blogData = await sequelize.query(
                `SELECT b.blog_id, b.blog_title, b.blog_desc, b.blog_images, b.published_date, bs.blog_status, c.category_name AS blog_category, u.user_name
                FROM blogs AS b
                LEFT JOIN blog_status AS bs ON b.blog_status = bs.blog_status_id
                LEFT JOIN categories AS c ON b.blog_category = c.category_id
                LEFT JOIN users AS u ON b.user_id = u.user_id
                WHERE bs.blog_status = 'rejected' AND b.is_active = 1 AND b.user_id = ?`,
                {
                    replacements: [createdBy],
                    type: QueryTypes.SELECT
                }
            );
        }

        if (blogData.length === 0) {
            return res.status(404).json({ message: "No rejected blogs found" });
        }

        res.status(200).json(blogData);
    } catch (err) {
        if (err.name === 'SequelizeDatabaseError') {
            console.error("Database Error:", err.message);
            return res.status(500).json({ error: "Database Error" });
        }

        console.error("Error fetching rejected blogs:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



const updateBlog = async (req, res) => {
    try {
        blogImagesMulter(req, res, async function (err) {
            if (err) {
                console.error("File upload error:", err);
                return res.status(400).json({ error: err.message || err });
            }

            const { blog_id, blog_title, blog_desc, blog_category, removed_images } = req.body;

            if (!blog_id || !blog_title || !blog_desc || !blog_category) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            const createdBy = req.user.user_id;
            const userRole = req.user.user_role;

            const [blog] = await sequelize.query(
                `SELECT * FROM blogs WHERE blog_id = ?`,
                { replacements: [blog_id], type: QueryTypes.SELECT }
            );

            if (!blog) {
                return res.status(404).json({ error: "Blog not found" });
            }

            if (userRole !== 1 && blog.user_id !== createdBy) {
                return res.status(403).json({ error: "Not authorized" });
            }

            let [category] = await sequelize.query(
                `SELECT * FROM categories WHERE category_name = ?`,
                { replacements: [blog_category], type: QueryTypes.SELECT }
            );

            if (!category) {
                const [result] = await sequelize.query(
                    `INSERT INTO categories (category_name) VALUES (?)`,
                    { replacements: [blog_category], type: QueryTypes.INSERT }
                );
                category = {
                    category_id: result.insertId,
                    category_name: blog_category,
                };
            }

            let blog_images;
            if (req.files && req.files.length > 0) {
                const uploadedImages = req.files.map((file) => file.filename);
                blog_images = JSON.stringify([
                    ...JSON.parse(blog.blog_images || '[]'),
                    ...uploadedImages,
                ]);
            } else {
                blog_images = blog.blog_images;
            }

            if (removed_images) {
                const removedImagesList = JSON.parse(removed_images);
                blog_images = JSON.parse(blog_images || '[]');
                blog_images = blog_images.filter((image) => !removedImagesList.includes(image));
                blog_images = JSON.stringify(blog_images);
            }

            await sequelize.query(
                `UPDATE blogs SET blog_title = ?, blog_desc = ?, blog_images = ?, blog_category = ?, blog_status = 1, is_active = 1 WHERE blog_id = ? AND user_id = ?`,
                {
                    replacements: [
                        blog_title,
                        blog_desc,
                        blog_images,
                        category.category_id,
                        blog_id,
                        createdBy
                    ],
                    type: QueryTypes.UPDATE
                }
            );

            res.status(200).json({ message: "Blog updated successfully" });
        });
    } catch (error) {
        console.error("Error updating blog:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



const deleteBlog = async (req, res) => {
    const { blog_id } = req.body; 
    const userId = req.user.user_id; 
    const userRole = req.user.user_role; 


    console.log("User Id : " , userId + "\nUser Role : ", userRole)


    try {
        const blog = await sequelize.query(
            `SELECT blog_id, user_role FROM blogs WHERE blog_id = ?`, 
            { replacements: [blog_id], type: QueryTypes.SELECT }
        );

        if (blog.length === 0) {
            return res.status(404).json({ error: "Blog not found" });
        }

        console.log(blog[0].created_by); 

        if (userRole !== 1 && blog[0].user_role !== userRole) {
            return res.status(403).json({ error: "Not authorized" });
        }

        await sequelize.query(
            `DELETE FROM blogs WHERE blog_id = ? AND user_id = ?`,
            { replacements: [blog_id, userId], type: QueryTypes.DELETE }
        );

        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        console.error("Error deleting blog:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



module.exports = {
    AddBlog,
    fetchAllCategories,
    fetchAllBlogs,
    fetchBlogByTitle,
    fetchPendingBlogs,
    fetchPublishedBlogs,
    fetchRejectedBlogs,
    updateBlog,
    deleteBlog
}