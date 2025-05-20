import { NavLink } from "react-router-dom";

const Navigation = ({ mobileMenuOpen }) => {
  return (
    <nav className={`main-nav ${mobileMenuOpen ? "mobile-open" : ""}`}>
      <ul>
        <li>
          <NavLink to="/" end>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/learn">Learn</NavLink>
        </li>
        <li>
          <NavLink to="/symbols">Symbols</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
