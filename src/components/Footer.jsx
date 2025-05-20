import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>lipu sona Toki Pona</h3>
            <p>
              A simple, elegant app for learning the minimal language Toki Pona
              and its beautiful writing system.
            </p>
          </div>

          <div className="footer-section">
            <h3>Navigation</h3>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/learn">Learn</Link>
              </li>
              <li>
                <Link to="/symbols">Symbols</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Resources</h3>
            <ul>
              <li>
                <a
                  href="https://tokipona.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Official Toki Pona Site
                </a>
              </li>
              <li>
                <a
                  href="https://en.wikipedia.org/wiki/Toki_Pona"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wikipedia
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="copyright">
          <p>&copy; {currentYear} lipu sona Toki Pona. All rights reserved.</p>
          <p className="toki-pona-text">toki pona li pona.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
