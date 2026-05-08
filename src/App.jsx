import React, { useState } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    mobileNo: "",
    githubUsername: "",
    rollNo: "",
    accessCode: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle API call
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://4.224.186.213/evaluation-service/register",
        formData
      );

      console.log(response.data);

      alert("Registration Successful!");
    } catch (error) {
      console.log(error);

      alert("Error while registering");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Registration Form</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="mobileNo"
          placeholder="Mobile Number"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="githubUsername"
          placeholder="GitHub Username"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="rollNo"
          placeholder="Roll Number"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="accessCode"
          placeholder="Access Code"
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default App;
