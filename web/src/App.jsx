import { Routes, Route } from "react-router-dom";
import Archive from "./pages/Archive";
import Entry from "./pages/Entry";
import NewEntry from "./pages/NewEntry";
import EditEntry from "./pages/EditEntry";
import BottomNav from "./components/BottomNav";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Archive />} />
        <Route path="/entry/:id" element={<Entry />} />
        <Route path="/new" element={<NewEntry />} />
        <Route path="/edit/:id" element={<EditEntry />} />
      </Routes>
      <BottomNav />
    </>
  );
}
