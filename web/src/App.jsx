import { Routes, Route } from "react-router-dom";
import Archive from "./pages/Archive";
import Entry from "./pages/Entry";
import NewEntry from "./pages/NewEntry";
import EditEntry from "./pages/EditEntry";
import BottomNav from "./components/BottomNav";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
// Home isn't routed yet — re-import it when it is

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Archive />} />
        <Route path="/entry/:id" element={<Entry />} />
        <Route path="/new" element={<NewEntry />} />
        <Route path="/edit/:id" element={<EditEntry />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
      <BottomNav />
    </>
  );
}
