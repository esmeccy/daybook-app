import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignIn({handleSignIn}) {
    //get the navigate function
    const navigate = useNavigate();
    //get the form data
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    //handle change to update the form data
    const handleChange = (e) =>{
        const { name, value } = e.target;
        setFormData({...formData, [name]: value });
    }

    //handle submit to sign in
    const handleSubmit = (e) => {
        e.preventDefault();

        //fetch the data from the server
        fetch("http://localhost:3000/user/sign-in",{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            //send the form data to the server
            body: JSON.stringify({
                email:formData.email,
                password: formData.password,
            }),
        })
        //get the response from the server
        .then((response) => response.json())
        //if there is an error, print the error
        .then ((data) => {
            if (data.errors){
                //print the error
                alert(data.errors[0].msg);
                return;
            }
            //if there is no token, print the error
            if (!data.token){
                alert(data.message || "Invalid email or password");
                return;
            }

            //keep the token so every later request can send it
            localStorage.setItem('token', data.token);
            //and the name and email, for the greeting and the profile page
            localStorage.setItem('username', data.username || '');
            localStorage.setItem('email', data.email || '');
            //navigate to the home page
            handleSignIn();
        })
        .catch(() => alert("Couldn't sign in. SERVER ERROR"));
    }

    return (
        //create the main container
        <main className='auth'>
            {/* app name */}
            <div className='brand'>Daybook</div>

            {/* Page header */}
            <header className='page-header'>
                <h1>Welcome back</h1>
                <p className='tagline'>Sign in to see your moments.</p>
            </header>

            {/* create the form — the button lives outside it, linked back by id */}
            <form
            id='sign-in-form'
            className='entry-form'
            onSubmit={handleSubmit}
            >
                {/* create the email field */}
                <label htmlFor='email'>Email</label>
                <input
                    type='email'
                    id='email'
                    name='email'
                    placeholder='you@example.com'
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete='email'
                    required
                />

                <label htmlFor='password'>Password</label>
                <input
                    type='password'
                    id='password'
                    name='password'
                    placeholder='Your password'
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete='current-password'
                    required
                />

            </form>

            {/* link to the sign up page for people who don't have an account yet */}
            <p className='form-switch'>
                New here? <Link to='/sign-up'>Create an account</Link>
            </p>

            {/* Sign in button — sits at the bottom of the screen, still submits the form above */}
            <div className='auth-actions'>
                <button type='submit' form='sign-in-form' className='button primary'>
                    Sign in
                </button>
            </div>
        </main>
    );
}

export default SignIn;
