import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './Registration.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Registration = () => {
  const [formData, setFormData] = useState({
    user_firstname: '',
    user_lastname: '',
    user_email: '',
    password: '',
    user_contact_no: '',
    user_name: '',
    user_dob: ''
  });

  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevVisibility) => !prevVisibility);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.user_firstname.trim()) {
      newErrors.user_firstname = 'First name is required.';
    }

    if (!formData.user_lastname.trim()) {
      newErrors.user_lastname = 'Last name is required.';
    }

    const emailRegex = /^[^\s@]+@gmail\.com$/;
    if (!formData.user_email.trim()) {
      newErrors.user_email = 'Email is required.';
    } else if (!emailRegex.test(formData.user_email)) {
      newErrors.user_email = 'Email must end with "@gmail.com".';
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)_\+\-=\{\}\[\]\|\\:;\"'<>,.?\/]).+$/; // Password regex
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required.';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.';
    }

    const phoneRegex = /^\d{10}$/;
    if (!formData.user_contact_no.trim()) {
      newErrors.user_contact_no = 'Contact number is required.';
    } else if (!phoneRegex.test(formData.user_contact_no)) {
      newErrors.user_contact_no = 'Contact number must be 10 digits.';
    }

    if (!formData.user_name.trim()) {
      newErrors.user_name = 'Username is required.';
    }

    if (!formData.user_dob.trim()) {
      newErrors.user_dob = 'Date of Birth is required.';
    }

    const userDob = new Date(formData.user_dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - userDob.getFullYear();

    const birthdayPassed = currentDate < new Date(currentDate.getFullYear(), userDob.getMonth(), userDob.getDate());

    const actualAge = birthdayPassed ? age - 1 : age;

    if (actualAge < 18) {
      newErrors.user_dob = 'You must be 18 years of age or older to register.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/Registration', formData);

      if (response.status === 200) {
        alert('Registration Successful!');
        window.location.replace('/LogIn');
      } else {
        alert('Unable to Register!');
      }
    } catch (error) {
      console.error(error);
      alert('Unable to Register!');
    }
  };

  return (
    <div className="registration-container">
      <h2 className="registration-heading">Registration</h2>
      <Form onSubmit={handleSubmit} className="registration-form">
        <InputGroup className="mb-3 custom-input-group">
          <InputGroup.Text id="inputGroup-sizing-default">First Name</InputGroup.Text>
          <Form.Control
            type="text"
            name="user_firstname"
            placeholder="Enter first name"
            value={formData.user_firstname}
            onChange={handleChange}
            aria-label="First Name"
            aria-describedby="inputGroup-sizing-default"
            isInvalid={!!errors.user_firstname}
          />
          <Form.Control.Feedback type="invalid">
            {errors.user_firstname}
          </Form.Control.Feedback>
        </InputGroup>

        <InputGroup className="mb-3 custom-input-group">
          <InputGroup.Text id="inputGroup-sizing-default">Last Name</InputGroup.Text>
          <Form.Control
            type="text"
            name="user_lastname"
            placeholder="Enter last name"
            value={formData.user_lastname}
            onChange={handleChange}
            aria-label="Last Name"
            aria-describedby="inputGroup-sizing-default"
            isInvalid={!!errors.user_lastname}
          />
          <Form.Control.Feedback type="invalid">
            {errors.user_lastname}
          </Form.Control.Feedback>
        </InputGroup>

        <InputGroup className="mb-3 custom-input-group">
          <InputGroup.Text id="inputGroup-sizing-default">Email</InputGroup.Text>
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
          <InputGroup.Text id="inputGroup-sizing-default">Password</InputGroup.Text>
          <Form.Control
            type={passwordVisible ? 'text' : 'password'}
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            aria-label="Password"
            aria-describedby="inputGroup-sizing-default"
            isInvalid={!!errors.password}
          />
          <InputGroup.Text onClick={togglePasswordVisibility} className="password-visibility-toggle" style={{ cursor: 'pointer' }}>
            <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
          </InputGroup.Text>
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        </InputGroup>

        <InputGroup className="mb-3 custom-input-group">
          <InputGroup.Text id="inputGroup-sizing-default">Contact No</InputGroup.Text>
          <Form.Control
            type="text"
            name="user_contact_no"
            placeholder="Enter contact number"
            value={formData.user_contact_no}
            onChange={handleChange}
            aria-label="Contact Number"
            aria-describedby="inputGroup-sizing-default"
            isInvalid={!!errors.user_contact_no}
          />
          <Form.Control.Feedback type="invalid">
            {errors.user_contact_no}
          </Form.Control.Feedback>
        </InputGroup>

        <InputGroup className="mb-3 custom-input-group">
          <InputGroup.Text id="inputGroup-sizing-default">Username</InputGroup.Text>
          <Form.Control
            type="text"
            name="user_name"
            placeholder="Enter username"
            value={formData.user_name}
            onChange={handleChange}
            aria-label="Username"
            aria-describedby="inputGroup-sizing-default"
            isInvalid={!!errors.user_name}
          />
          <Form.Control.Feedback type="invalid">
            {errors.user_name}
          </Form.Control.Feedback>
        </InputGroup>

        <InputGroup className="mb-3 custom-input-group">
          <InputGroup.Text id="inputGroup-sizing-default">Date of Birth</InputGroup.Text>
          <Form.Control
            type="date"
            name="user_dob"
            value={formData.user_dob}
            onChange={handleChange}
            aria-label="Date of Birth"
            aria-describedby="inputGroup-sizing-default"
            isInvalid={!!errors.user_dob}
          />
          <Form.Control.Feedback type="invalid">
            {errors.user_dob}
          </Form.Control.Feedback>
        </InputGroup>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default Registration;
