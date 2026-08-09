import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Archive from "./pages/Archive";
import Entry from "./pages/Entry";
import NewEntry from "./pages/NewEntry";
import EditEntry from "./pages/EditEntry";
import BottomNav from "./components/BottomNav";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
// Home isn't routed yet — re-import it when it is

export default function App() {
  //get the navigate function
  const navigate = useNavigate();
  //start from the token so a returning user never flashes the sign-in page
	const [ isAuthenticated, setIsAuthenticated ] = useState(() => !!localStorage.getItem("token"));

  //handle sign in
	const handleSignIn = () =>{
		setIsAuthenticated(true);
		navigate("/");
	};

  //handle sign out
	const handleSignOut = () =>{
		localStorage.removeItem('token');
		localStorage.removeItem('username');
		localStorage.removeItem('email');
    setIsAuthenticated(false);
    navigate("/sign-in");
	};

  //signed out: sign-in is the only way in, and no nav to escape it with
	if(!isAuthenticated){
		return (
			<Routes>
				<Route path="/sign-up" element={<SignUp/>} />
				<Route path="*" element={<SignIn handleSignIn={handleSignIn} />} />
			</Routes>
		);
	}

  return (
    <>
      <Routes>
        <Route path="/" element={<Archive />} />
        <Route path="/entry/:id" element={<Entry />} />
        <Route path="/new" element={<NewEntry />} />
        <Route path="/edit/:id" element={<EditEntry />} />
        <Route path="/profile" element={<Profile isAuthenticated={isAuthenticated} handleSignOut={handleSignOut} />} />
      </Routes>
      <BottomNav />
    </>
  );
}
