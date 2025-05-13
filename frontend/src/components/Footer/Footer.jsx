import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt="" />
            <p>From wholesome meals to indulgent bites, our menu is designed to cater to every taste and appetite. We blend quality, flavor, and convenience to bring you an exceptional dining experience every day.</p>
            <div className="footer-social-icons">
  <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
    <img src={assets.facebook_icon} alt="Facebook" />
  </a>
  <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
    <img src={assets.twitter_icon} alt="Twitter" />
  </a>
  <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
    <img src={assets.linkedin_icon} alt="LinkedIn" />
  </a> 
</div>

        </div>
        <div className="footer-content-center">
        
        </div>
        <div className="footer-content-right">
        <h2>GET IN TOUCH</h2>
            <ul>
                <li>+91-98765 43210</li>
                <li>contact@cafems.com</li>
            </ul>    
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2024 © cafems.com - All Right Reserved.</p>
    </div>
  )
}

export default Footer
