import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
    //useNavigate to navigate to the home page
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
}

export default SignUp;