import { Routes, Route } from "react-router-dom";
import Archive from "./pages/Archive";
import Entry from "./pages/Entry";
import NewEntry from "./pages/NewEntry";
import EditEntry from "./pages/EditEntry";
import BottomNav from "./components/BottomNav";
// SignIn/SignUp/Home aren't routed yet — re-import them when they are

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
