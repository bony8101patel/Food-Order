import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminPublishedBlog.css';
import { Form, InputGroup, Dropdown, Modal, Button } from 'react-bootstrap';

const AdminPublishedBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showDateRangeModal, setShowDateRangeModal] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchTitle, setSearchTitle] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const imageBaseURL = 'http://localhost:5000/public/assets/BlogImages/';

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!token) {
                    toast.error("Unauthorized access! Please log in.");
                    navigate("/LogIn");
                    return;
                }
                const [blogsResponse, categoriesResponse] = await Promise.all([
                    axios.get('http://localhost:5000/PublishedBlogs', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }),
                    axios.get('http://localhost:5000/FetchCategories')
                ]);
                setBlogs(blogsResponse.data);
                setCategories(categoriesResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Error fetching data. Please try again.');
            }
        };

        fetchData();
    }, [token, navigate]);

    useEffect(() => {
        const fetchFilteredData = async () => {
            try {
                const response = await axios.post(
                    'http://localhost:5000/SearchFilter',
                    {
                        category: selectedCategory,
                        startDate: startDate,
                        endDate: endDate,
                        title: searchTitle
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data.length === 0) {
                    setBlogs([]);
                } else {
                    console.log(response.data)
                    setBlogs(response.data);
                }
            } catch (error) {
                console.error('Error fetching filtered blogs:', error);
                if (error.response) {
                    console.error('Server responded with status code:', error.response.status);
                    console.error('Response data:', error.response.data);
                } else if (error.request) {
                    console.error('No response received:', error.request);
                } else {
                    console.error('Request setup error:', error.message);
                }
                toast.error('Error fetching filtered blogs. Please try again.');
            }
        };

        fetchFilteredData();
    }, [selectedCategory, startDate, endDate, searchTitle, token]);

    const handleDateRangeSubmit = () => {
        console.log('Start Date:', startDate);
        console.log('End Date:', endDate);
        setShowDateRangeModal(false);
    };

    return (
        <div className='main-blog_container p-5 m-5'>
            <div className='search-container p-2'>
                <Form className="search-form">
                    <InputGroup className="custom-input-group">
                        <InputGroup.Text className="input-group-text" id="inputGroup-sizing-default">Search</InputGroup.Text>
                        <Form.Control
                            type="text"
                            name="title"
                            value={searchTitle}
                            placeholder="Enter Blog Title"
                            aria-label="Email"
                            aria-describedby="inputGroup-sizing-default"
                            onChange={(e) => setSearchTitle(e.target.value)}
                        />
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                Filter
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {categories.map((category, index) => (
                                    <Dropdown.Item key={index} onClick={() => setSelectedCategory(category.category_name)}>{category.category_name}</Dropdown.Item>
                                ))}
                                <Dropdown.Item onClick={() => setShowDateRangeModal(true)}>Date Range</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </InputGroup>
                </Form>
            </div>

            <div className="d-flex flex-wrap justify-content-center p-2 m-3">
                {blogs.length === 0 ? (
                    <div className="no-blogs-message">
                        No Blogs Found
                    </div>
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

            <Modal show={showDateRangeModal} onHide={() => setShowDateRangeModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Date Range</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="startDate">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="endDate">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDateRangeModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleDateRangeSubmit}>
                        Apply
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminPublishedBlog;
