import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Carousel from 'react-bootstrap/Carousel';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BlogRequest.css';

const BlogRequest = () => {
    const [blogs, setBlogs] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [formData, setFormData] = useState({});
    const [uploadedImages, setUploadedImages] = useState([]); 
    const [existingImages, setExistingImages] = useState([]); 
    const [removedImages, setRemovedImages] = useState([]); 

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const imageBaseURL = 'http://localhost:5000/public/assets/BlogImages/';

    const fetchBlogs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/PendingBlogs', {
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

    const handleEdit = (blog) => {
        setSelectedBlog(blog);
        setFormData({
            blog_id: blog.blog_id,
            blog_title: blog.blog_title,
            blog_desc: blog.blog_desc,
            blog_category: blog.blog_category,
        });
        setExistingImages(JSON.parse(blog.blog_images));
        setUploadedImages([]);
        setRemovedImages([]);
        setShowEditModal(true);
    };

    const handleDelete = async (blogId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/DeleteBlog/${blogId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                toast.success('Blog deleted successfully!');
                fetchBlogs(); 
            } else {
                toast.error('Failed to delete the blog. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
            toast.error('Failed to delete the blog. Please try again.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        const files = e.target.files;
        setUploadedImages(Array.from(files));
    };

    const handleRemoveImage = (index) => {
        const imageToRemove = existingImages[index];
        setRemovedImages([...removedImages, imageToRemove]);
        setExistingImages(existingImages.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataWithImages = new FormData();
            formDataWithImages.append('blog_id', formData.blog_id);
            formDataWithImages.append('blog_title', formData.blog_title);
            formDataWithImages.append('blog_desc', formData.blog_desc);
            formDataWithImages.append('blog_category', formData.blog_category);

            const allImages = [...existingImages, ...uploadedImages.map(file => file.name)];
            formDataWithImages.append('blog_images', JSON.stringify(allImages));

            formDataWithImages.append('removed_images', JSON.stringify(removedImages));

            uploadedImages.forEach((file) => {
                formDataWithImages.append('blog_images', file);
            });

            const response = await axios.put('http://localhost:5000/UpdateBlogs', formDataWithImages, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                toast.success('Blog updated successfully!');
                setShowEditModal(false); 
                fetchBlogs(); 
            } else {
                toast.error('Failed to update the blog. Please try again.');
            }
        } catch (error) {
            console.error('Error updating blog:', error);
            toast.error('Failed to update the blog. Please try again.');
        }
    };

    const handleCancel = () => {
        setShowEditModal(false); 
    };

    return (
        <div className="d-flex flex-wrap justify-content-center p-5 m-3">
            {blogs.length === 0 ? (
                <div>No Blog/Blogs Request Found</div>
            ) : (
                blogs.map((blog, index) => (
                    <Card key={index} style={{ width: '20rem', position: 'relative' }} className="p-3 m-4">
                        <Dropdown align="end" style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                            <Dropdown.Toggle as="button" style={{ background: 'none', border: 'none', padding: 0 }}>
                                <span style={{ fontSize: '1.5rem', lineHeight: '1', color: '#000' }}>⋮</span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleEdit(blog)}>Edit</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleDelete(blog.blog_id)}>Delete</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

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

            <Modal show={showEditModal} onHide={handleCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Blog</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="blog_title" className="form-label">Blog Title:</label>
                            <input type="text" id="blog_title" name="blog_title" className="form-control" value={formData.blog_title} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="blog_desc" className="form-label">Blog Description:</label>
                            <textarea id="blog_desc" name="blog_desc" className="form-control" value={formData.blog_desc} onChange={handleChange} required />
                        </div>
                        <div class="mb-3">
                            <label for="blog_category" class="form-label">Blog Category:</label>
                            <input type="text" id="blog_category" name="blog_category" class="form-control" value={formData.blog_category} onChange={handleChange} required />
                        </div>
                        <div class="mb-3">
                            <label for="blog_images" class="form-label">Blog Images:</label>
                            <div class="existing-images-container">
                                {existingImages.map((image, index) => (
                                    <div key={index} class="image-item">
                                        <img src={`${imageBaseURL}${image}`} alt={`ExistingImage ${index + 1}`} style={{ width: '100px', height: '100px' }} />
                                        <button class="btn btn-danger btn-sm" onClick={() => handleRemoveImage(index)}>
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <input type="file" id="blog_images" name="blog_images" class="form-control" multiple onChange={handleImageChange} />
                        </div>
                        <div class="d-flex justify-content-end">
                            <button type="button" class="btn btn-secondary me-2" onClick={handleCancel}>
                                Cancel
                            </button>
                            <button type="submit" class="btn btn-primary">
                                Update
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default BlogRequest;