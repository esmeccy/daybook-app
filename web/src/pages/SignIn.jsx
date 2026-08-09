import { useState } from "react";

function SignIn() {{ handleSignIn}
const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
});

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
}
}