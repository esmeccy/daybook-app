//higher order componment -> make routes only be seen by sign-in user
import { Navigate } from "react-router-dom";

//check if a user sign-in, if it loads the component that was passed in
const protectRoute = (Component) =>{
    const ProtectedComponent = (props) =>{
        //check for JWT token
        const token = localStorage.getItem("token");
        //if no token, redirect to home
        if(!token){
            return <Navigate to='/' />;
        }
        //if token exist, render the component (route)
        return <Component{...props} />;
    };
    return ProtectedComponent;
}
export default protectRoute;