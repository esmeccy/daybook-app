import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
    const navigate = useNavigate();

    //use state to store the email and password
    const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    });
    
    //handle change to update the form data
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    //handle submit to sign up
    const handleSubmit = (e) => {
        e.preventDefault();
        //if the password and confirm password do not match, set message
        if (formData.password !== formData.confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }
    }

    fetch("http://localhost:3000/user/",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email:formData.email, 
            password:formData.password,
        }),
    })
    .then ((response) => response.json())
    .then ((data) => {
        if (data.error) {
            alert(data.error[0].msg);
            return;
        }
        console.log(data);
        navigate("/sign-in");
    });

  return (
    //create the main container
    <main>
      <h1>Create Account</h1>

      {/* create the form */}
      <form onSubmit={handleSubmit}>
        {/* create the email field */}
        <div>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            name="email"
            placeholder="signup@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
          />
        </div>

        <div>
          <label htmlFor="confirm-password">Confirm Password</label>

          <input
            id="confirm-password"
            type="password"
            name="confirmPassword"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={8}
          />
        </div>

        <input 
        type="submit" 
        value="Register"
        onClick={handleSubmit} />
      </form>

      {message && <p>{message}</p>}
    </main>
  );
}
export default SignUp;