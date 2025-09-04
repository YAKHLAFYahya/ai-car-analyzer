import React from 'react';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-logo">
          <i className="fas fa-car"></i>
          <span>AI Car Analyzer</span>
        </div>
        
        <div className="footer-info">
          <p>Using advanced AI to analyze and estimate car values from images</p>
          <p className="copyright">© {new Date().getFullYear()} AI Car Analyzer.</p>
        </div>
        
        <div className="footer-links">
          <a href="#features"><i className="fas fa-list-alt"></i> Features</a>
          <a href="#how-it-works"><i className="fas fa-cogs"></i> How It Works</a>
          {/* <a href="#privacy"><i className="fas fa-shield-alt"></i> Privacy</a> */}

          <a href="#contact"><i className="fas fa-envelope"></i> Contact</a>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="social-links">
          <a href="#twitter" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
          <a href="#facebook" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
          <a href="#instagram" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          <a href="#linkedin" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
        </div>
        
        <div className="powered-by">
          Made by <span className="accent">Yahya YAKHLAF</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;