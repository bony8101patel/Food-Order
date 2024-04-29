import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminBlogRejected.css';

const AdminBlogReject = () => {
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const imageBaseURL = 'http://localhost:5000/public/assets/BlogImages/';

    const fetchBlogs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/RejectedBlogs', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setBlogs(response.data);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            toast.error('Error fetching blogs. Please try again.');
        }
    };

    useEffect(() => {
        if (!token) {
            toast.error("Unauthorized access! Please log in.");
            navigate("/LogIn");
            return;
        }

        fetchBlogs();
    }, [token, navigate]);

    return (
        <div className="d-flex flex-wrap justify-content-center p-5 m-3">
            {blogs.length === 0 ? (
                <div>No Blog/Blogs Request Found</div>
            ) : (
                blogs.map((blog, index) => (
                    <Card key={index} style={{ width: '20rem', position: 'relative' }} className="p-3 m-4">
                        <Card.Body>
                            <Card.Title>{blog.blog_title}</Card.Title>
                        </Card.Body>
                        <Carousel className="custom-carousel">
                            {blog.blog_images && JSON.parse(blog.blog_images).map((image, imageIndex) => (
                                <Carousel.Item key={imageIndex}>
                                    <img src={`${imageBaseURL}${image}`} alt={`BlogImage ${imageIndex + 1}`} style={{ width: '100%' }} />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                        <Card.Body>
                            <Card.Text>{blog.blog_desc}</Card.Text>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroup.Item><strong>Category:</strong> {blog.blog_category}</ListGroup.Item>
                            <ListGroup.Item><strong>Author:</strong> {blog.user_name}</ListGroup.Item>
                            <ListGroup.Item><strong>Status:</strong> {blog.blog_status}</ListGroup.Item>
                            <ListGroup.Item><strong>Published Date:</strong> {blog.published_date}</ListGroup.Item>
                        </ListGroup>
                    </Card>
                ))
            )}
        </div>
    );
};

export default AdminBlogReject;
