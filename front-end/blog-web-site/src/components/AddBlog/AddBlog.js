// import React, { useState, useEffect } from 'react';
// import { Form, Button, InputGroup } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './AddBlog.css';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// export const AddBlog = () => {
//     const token = localStorage.getItem('token');
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (!token) {
//             toast.error("Unauthorized access! Please log in.");
//             navigate("/LogIn");
//         }
//     }, [token, navigate]);

//     const [formData, setFormData] = useState({
//         blog_title: '',
//         blog_desc: '',
//         blog_category: '',
//         custom_category: '',
//         blog_images: [],
//     });

//     const [categories, setCategories] = useState([]); 

//     const [errors, setErrors] = useState({});

//     const fetchCategories = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/FetchCategories', {
//                 headers: {
//                     'Authorization': `Bearer ${token}` 
//                 }
//             });
//             if(response.status === 200) {
//                 console.log(formData)
//                 setCategories(response.data)
//             }
//         } catch (error) {
//             console.error('Error fetching categories:', error);
//             toast.error('Error fetching categories. Please try again.');
//         }
//     };

//     useEffect(() => {
//         fetchCategories();
//     }, [token]);

//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         const formErrors = validateForm(formData);

//         if (Object.keys(formErrors).length > 0) {
//             setErrors(formErrors);
//             return;
//         }

//         const formDataToSend = new FormData();
//         formDataToSend.append('blog_title', formData.blog_title);
//         formDataToSend.append('blog_desc', formData.blog_desc);

//         let category = formData.blog_category;
//         if (formData.blog_category === 'Other' && formData.custom_category) {
//             category = formData.custom_category;
//         }
//         formDataToSend.append('blog_category', category);

//         formData.blog_images.forEach((image, index) => {
//             formDataToSend.append('blog_images', image);
//         });

//         try {
//             const response = await axios.post('http://localhost:5000/AddBlog', formDataToSend, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`, 
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             if (response.status === 201) {
//                 toast.success('Blog post created successfully!');
//                 setFormData({
//                     blog_title: '',
//                     blog_desc: '',
//                     blog_category: '',
//                     custom_category: '',
//                     blog_images: [],
//                 });
//             } else {
//                 toast.error('Error creating blog post. Please try again.');
//             }
//         } catch (error) {
//             console.error('Error creating blog post:', error);
//             toast.error('Error creating blog post. Please try again.');
//         }
//     };

//     const validateForm = (formData) => {
//         const errors = {};

//         if (!formData.blog_title) {
//             errors.blog_title = 'Blog title is required.';
//         }

//         if (!formData.blog_desc) {
//             errors.blog_desc = 'Blog description is required.';
//         }

//         if (!formData.blog_category) {
//             errors.blog_category = 'Blog category is required.';
//         } else if (formData.blog_category === 'Other' && !formData.custom_category) {
//             errors.custom_category = 'Custom category is required when "Other" is selected.';
//         }

//         if (formData.blog_images.length === 0) {
//             errors.blog_images = 'At least one blog image is required.';
//         }

//         return errors;
//     };

//     const handleChange = (event) => {
//         const { name, value } = event.target;
//         setFormData({
//             ...formData,
//             [name]: value,
//         });
//     };

//     const handleFileChange = (event) => {
//         const files = event.target.files;
//         setFormData({
//             ...formData,
//             blog_images: Array.from(files),
//         });
//     };

//     return (
//         <div className="add-blog-container">
//             <h2 className="add-blog-heading">Add Blog</h2>
//             <Form onSubmit={handleSubmit} className="add-blog-form">
//                 <InputGroup className="mb-3 custom-input-group">
//                     <InputGroup.Text id="blogTitle-label" className="input-group-text">Blog Title</InputGroup.Text>
//                     <Form.Control
//                         type="text"
//                         name="blog_title"
//                         placeholder="Enter blog title"
//                         value={formData.blog_title}
//                         onChange={handleChange}
//                         aria-label="Blog Title"
//                         aria-describedby="blogTitle-label"
//                         isInvalid={!!errors.blog_title}
//                     />
//                     <Form.Control.Feedback type="invalid">
//                         {errors.blog_title}
//                     </Form.Control.Feedback>
//                 </InputGroup>

//                 <InputGroup className="mb-3 custom-input-group">
//                     <InputGroup.Text id="blogDescription-label">Blog Description</InputGroup.Text>
//                     <Form.Control
//                         as="textarea"
//                         rows={3}
//                         name="blog_desc"
//                         placeholder="Enter blog description"
//                         value={formData.blog_desc}
//                         onChange={handleChange}
//                         aria-label="Blog Description"
//                         aria-describedby="blogDescription-label"
//                         isInvalid={!!errors.blog_desc}
//                     />
//                     <Form.Control.Feedback type="invalid">
//                         {errors.blog_desc}
//                     </Form.Control.Feedback>
//                 </InputGroup>

//                 <InputGroup className="mb-3 custom-input-group">
//                     <InputGroup.Text id="blogCategory-label">Blog Category</InputGroup.Text>
//                     <Form.Control
//                         as="select"
//                         name="blog_category"
//                         value={formData.blog_category}
//                         onChange={handleChange}
//                         aria-label="Blog Category"
//                         aria-describedby="blogCategory-label"
//                         isInvalid={!!errors.blog_category}
//                     >
//                         <option value="">Select a category</option>
//                         {categories.map((category) => (
//                             <option key={category.category_id} value={category.category_name}>
//                                 {category.category_name}
//                             </option>
//                         ))}
//                         <option value="Other">Other</option>
//                     </Form.Control>
//                     <Form.Control.Feedback type="invalid">
//                         {errors.blog_category}
//                     </Form.Control.Feedback>
//                 </InputGroup>

//                 {formData.blog_category === 'Other' && (
//                     <InputGroup className="mb-3 custom-input-group">
//                         <InputGroup.Text id="customCategory-label">Custom Category</InputGroup.Text>
//                         <Form.Control
//                             type="text"
//                             name="blog_category"
//                             placeholder="Specify custom category"
//                             value={formData.custom_category}
//                             onChange={handleChange}
//                             aria-label="Custom Category"
//                             aria-describedby="customCategory-label"
//                             isInvalid={!!errors.custom_category}
//                         />
//                         <Form.Control.Feedback type="invalid">
//                             {errors.custom_category}
//                         </Form.Control.Feedback>
//                     </InputGroup>
//                 )}

//                 <InputGroup className="mb-3 custom-input-group">
//                     <InputGroup.Text id="blogImages-label">Blog Images</InputGroup.Text>
//                     <Form.Control
//                         type="file"
//                         name="blog_images"
//                         onChange={handleFileChange}
//                         multiple
//                         aria-label="Blog Images"
//                         aria-describedby="blogImages-label"
//                         isInvalid={!!errors.blog_images}
//                     />
//                     <Form.Control.Feedback type="invalid">
//                         {errors.blog_images}
//                     </Form.Control.Feedback>
//                 </InputGroup>

//                 <Button variant="primary" type="submit">
//                     Submit
//                 </Button>
//             </Form>
//         </div>
//     );
// };


import React, { useState, useEffect } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AddBlog.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AddBlog = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            toast.error("Unauthorized access! Please log in.");
            navigate("/LogIn");
        }
    }, [token, navigate]);

    const [formData, setFormData] = useState({
        blog_title: '',
        blog_desc: '',
        blog_category: '',
        custom_category: '',
        blog_images: [],
    });

    const [categories, setCategories] = useState([]); 

    const [errors, setErrors] = useState({});

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/FetchCategories', {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });
            if(response.status === 200) {
                console.log(formData)
                setCategories(response.data)
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Error fetching categories. Please try again.');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [token]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formErrors = validateForm(formData);

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('blog_title', formData.blog_title);
        formDataToSend.append('blog_desc', formData.blog_desc);

        let category = formData.blog_category;
        if (formData.blog_category === 'Other' && formData.custom_category) {
            category = formData.custom_category;
        }
        formDataToSend.append('blog_category', category);

        formData.blog_images.forEach((image, index) => {
            formDataToSend.append('blog_images', image);
        });

        try {
            const response = await axios.post('http://localhost:5000/AddBlog', formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                toast.success('Blog post created successfully!');
                setFormData({
                    blog_title: '',
                    blog_desc: '',
                    blog_category: '',
                    custom_category: '',
                    blog_images: [],
                });
            } else {
                toast.error('Error creating blog post. Please try again.');
            }
        } catch (error) {
            console.error('Error creating blog post:', error);
            toast.error('Error creating blog post. Please try again.');
        }
    };

    const validateForm = (formData) => {
        const errors = {};

        if (!formData.blog_title) {
            errors.blog_title = 'Blog title is required.';
        }

        if (!formData.blog_desc) {
            errors.blog_desc = 'Blog description is required.';
        }

        if (!formData.blog_category) {
            errors.blog_category = 'Blog category is required.';
        } else if (formData.blog_category === 'Other' && !formData.custom_category) {
            errors.custom_category = 'Custom category is required when "Other" is selected.';
        }

        if (formData.blog_images.length === 0) {
            errors.blog_images = 'At least one blog image is required.';
        }

        return errors;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === "blog_category") {
            // Check if the selected category is "Other"
            if (value === "Other") {
                // If "Other" is selected, reset the custom category
                setFormData({
                    ...formData,
                    blog_category: value,
                    custom_category: "", // Reset custom category when "Other" is selected
                });
            } else {
                // If any other category is selected, update normally
                setFormData({
                    ...formData,
                    [name]: value,
                });
            }
        } else {
            // For all other fields, update normally
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        setFormData({
            ...formData,
            blog_images: Array.from(files),
        });
    };

    return (
        <div className="add-blog-container">
            <h2 className="add-blog-heading">Add Blog</h2>
            <Form onSubmit={handleSubmit} className="add-blog-form">
                <InputGroup className="mb-3 custom-input-group">
                    <InputGroup.Text id="blogTitle-label" className="input-group-text">Blog Title</InputGroup.Text>
                    <Form.Control
                        type="text"
                        name="blog_title"
                        placeholder="Enter blog title"
                        value={formData.blog_title}
                        onChange={handleChange}
                        aria-label="Blog Title"
                        aria-describedby="blogTitle-label"
                        isInvalid={!!errors.blog_title}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.blog_title}
                    </Form.Control.Feedback>
                </InputGroup>

                <InputGroup className="mb-3 custom-input-group">
                    <InputGroup.Text id="blogDescription-label">Blog Description</InputGroup.Text>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="blog_desc"
                        placeholder="Enter blog description"
                        value={formData.blog_desc}
                        onChange={handleChange}
                        aria-label="Blog Description"
                        aria-describedby="blogDescription-label"
                        isInvalid={!!errors.blog_desc}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.blog_desc}
                    </Form.Control.Feedback>
                </InputGroup>

                <InputGroup className="mb-3 custom-input-group">
                    <InputGroup.Text id="blogCategory-label">Blog Category</InputGroup.Text>
                    <Form.Control
                        as="select"
                        name="blog_category"
                        value={formData.blog_category}
                        onChange={handleChange}
                        aria-label="Blog Category"
                        aria-describedby="blogCategory-label"
                        isInvalid={!!errors.blog_category}
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.category_id} value={category.category_name}>
                                {category.category_name}
                            </option>
                        ))}
                        <option value="Other">Other</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {errors.blog_category}
                    </Form.Control.Feedback>
                </InputGroup>

                {formData.blog_category === 'Other' && (
                    <InputGroup className="mb-3 custom-input-group">
                        <InputGroup.Text id="customCategory-label">Custom Category</InputGroup.Text>
                        <Form.Control
                            type="text"
                            name="custom_category"
                            placeholder="Specify custom category"
                            value={formData.custom_category}
                            onChange={handleChange}
                            aria-label="Custom Category"
                            aria-describedby="customCategory-label"
                            isInvalid={!!errors.custom_category}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.custom_category}
                        </Form.Control.Feedback>
                    </InputGroup>
                )}

                <InputGroup className="mb-3 custom-input-group">
                    <InputGroup.Text id="blogImages-label">Blog Images</InputGroup.Text>
                    <Form.Control
                        type="file"
                        name="blog_images"
                        onChange={handleFileChange}
                        multiple
                        aria-label="Blog Images"
                        aria-describedby="blogImages-label"
                        isInvalid={!!errors.blog_images}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.blog_images}
                    </Form.Control.Feedback>
                </InputGroup>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
};
