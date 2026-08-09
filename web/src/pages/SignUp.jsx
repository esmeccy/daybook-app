import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignUp() {
    const navigate = useNavigate();
    // get the change of data
    const [ formData, setFormData ] = useState({
        username:'',
        email:'',
        password:'',
        confirmPassword:'',
    });

    // change data
    const handleChange = (e) =>{
        const {name, value} = e.target;
        // make a copy of formdata, then change 'name' to 'value'
        setFormData({...formData,[name]:value});
    }

    //submit data
    const handleSubmit = (e) => {
        e.preventDefault();

        if(formData.password !== formData.confirmPassword){
            alert("Passwords do not match");
            return;
        }

        fetch("http://localhost:3000/user/sign-up",{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // the server requires a username as well, so it goes up with the rest
                username: formData.username,
                email:formData.email,
                password: formData.password,
            }),
        })
        .then((response) => response.json())
        .then ((data) => {
            if (data.errors){
                //print the error
                alert(data.errors[0].msg);
                return;
            }
            console.log(data);
            navigate("/sign-in")
        })
        //without this a stopped server leaves the form doing nothing at all
        .catch(() => alert("Couldn't create your account. SERVER ERROR"));
    }

    return (
        //create the main container
        <main className='auth'>
            {/* app name */}
            <div className='brand'>Daybook</div>

            {/* Page header */}
            <header className='page-header'>
                <h1>Create Account</h1>
                <p className='tagline'>Somewhere to keep your moments.</p>
            </header>

            {/* create the form — the button lives outside it, linked back by id */}
            <form id='sign-up-form' className='entry-form' onSubmit={handleSubmit}>
                {/* create the username field */}
                <label htmlFor='username'>Username</label>
                <input
                    type='text'
                    id='username'
                    name='username'
                    placeholder='What should we call you?'
                    value={formData.username}
                    onChange={handleChange}
                    autoComplete='username'
                    required
                />

                {/* create the email field */}
                <label htmlFor='email'>Email</label>
                <input
                    type='email'
                    id='email'
                    name='email'
                    placeholder='signup@example.com'
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
                    placeholder='At least 8 characters'
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete='new-password'
                    required
                    minLength={8}
                />

                <label htmlFor='confirm-password'>Confirm Password</label>
                <input
                    type='password'
                    id='confirm-password'
                    name='confirmPassword'
                    placeholder='Re-enter your password'
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete='new-password'
                    required
                    minLength={8}
                />

            </form>

            {/* link to the sign in page for people who already have an account */}
            <p className='form-switch'>
                Already have an account? <Link to='/sign-in'>Sign in</Link>
            </p>

            {/* Register button — sits at the bottom of the screen, still submits the form above */}
            <div className='auth-actions'>
                <button type='submit' form='sign-up-form' className='button primary'>
                    Register
                </button>
            </div>
        </main>
    );
}

export default SignUp;
