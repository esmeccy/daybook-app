import { NavLink } from "react-router-dom";

//create a function to add the active class to the nav item if the link is active
const navClass = ({ isActive }) => "nav-item" + (isActive ? " active" : "");

export default function BottomNav() {
  return (
    //create the bottom nav
    <nav className="bottom-nav" aria-label="Main">

      {/* home link */}
      <NavLink to="/" end className={navClass}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H18a2 2 0 0 1 2 2v13a3 3 0 0 1-3 3H6.5A2.5 2.5 0 0 1 4 18.5v-13Z" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <path d="M8 3v18" stroke="currentColor" strokeWidth="1.7" />
        </svg>
        Moments
      </NavLink>

      {/* new moment link */}
      <NavLink to="/new" className={navClass}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <path d="M12 8.5v7M8.5 12h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        New
      </NavLink>
    </nav>
  );
}
