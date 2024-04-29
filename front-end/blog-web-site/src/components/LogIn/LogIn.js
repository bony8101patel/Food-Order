import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './LogIn.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    user_email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateForm = () => {
    const newErrors = {};


    const emailRegex = /^[^\s@]+@gmail\.com$/; 
    if (!formData.user_email.trim()) {
      newErrors.user_email = 'Email is required.';
    } else if (!emailRegex.test(formData.user_email)) {
      newErrors.user_email = 'Email must end with "@gmail.com".';
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)_\+\-=\{\}\[\]\|\\:;\"'<>,.?\/]).+$/; // Password regex
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one digit, and one special character.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/LogIn', formData);

      if(response.status === 401) {
        alert('Inactive user !');
      }

      if (response.status === 200) {
        alert('Log In Successful!');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.userRole);

        if (response.data.userRole === 1) {
          window.location.replace('/Admin/PublishedBlog'); 
        } else {
          window.location.replace('/User/PublishedBlog');
        }
      } else {
        alert('Unable to Log In!');
      }
    } catch (error) {
      console.error(error);
      alert('Unable to Log In!');
    }
  };




  return (
    <div className="login-container">
      <h2 className="login-heading">Log In</h2>
      <Form onSubmit={handleSubmit} className="login-form">
        <InputGroup className="mb-3 custom-input-group">
          <InputGroup.Text className="input-group-text" id="inputGroup-sizing-default">Email</InputGroup.Text>
          <Form.Control
            type="email"
            name="user_email"
            placeholder="Enter email"
            value={formData.user_email}
            onChange={handleChange}
            aria-label="Email"
            aria-describedby="inputGroup-sizing-default"
            isInvalid={!!errors.user_email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.user_email}
          </Form.Control.Feedback>
        </InputGroup>

        <InputGroup className="mb-3 custom-input-group">
          <InputGroup.Text className="input-group-text" id="inputGroup-sizing-default">Password</InputGroup.Text>
          <Form.Control
            type={passwordVisible ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            aria-label="Password"
            aria-describedby="inputGroup-sizing-default"
            isInvalid={!!errors.password}
          />
          <InputGroup.Text
            className="input-group-text"
            style={{ cursor: 'pointer' }}
            onClick={togglePasswordVisibility}
          >
            <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
          </InputGroup.Text>
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        </InputGroup>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default LoginForm;
