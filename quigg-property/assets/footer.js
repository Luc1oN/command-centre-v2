document.getElementById('site-footer').innerHTML = `
  <div class="container">
    <div class="footer-grid">
      <div>
        <div class="footer-brand">
          <img src="assets/logo-mark-plate.jpg" alt="Quigg Property">
          <strong>QUIGG PROPERTY</strong>
        </div>
        <p style="max-width:320px;">Trusted locally, connected globally, powered by Keller Williams. Guiding Cork Harbour buyers, sellers and renters home since day one.</p>
        <div class="social-row">
          <a href="#" aria-label="Facebook">f</a>
          <a href="#" aria-label="Instagram">ig</a>
          <a href="#" aria-label="LinkedIn">in</a>
        </div>
      </div>
      <div>
        <h4>Explore</h4>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="listings.html">Listings</a></li>
          <li><a href="about.html">About Us</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4>Services</h4>
        <ul>
          <li><a href="contact.html">Free Valuation</a></li>
          <li><a href="listings.html?type=sale">Buying a Home</a></li>
          <li><a href="listings.html?type=rent">Renting</a></li>
          <li><a href="contact.html">Property Management</a></li>
        </ul>
      </div>
      <div>
        <h4>Contact</h4>
        <ul>
          <li>021 242 5111</li>
          <li>info@quiggproperty.ie</li>
          <li>Cork, Ireland</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; ${new Date().getFullYear()} Quigg Property. All rights reserved. Licensed by the PSRA.</span>
      <span class="tagline">Guiding You Home. Moving Cork Forward. Experience You Can Trust.</span>
    </div>
  </div>
`;
