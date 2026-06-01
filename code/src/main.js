import './assets/style.css';
import './views/FlightView.js';

import './components/FlightTable.js';
import './components/FlightTableRow.js';
import './components/FlightAlert.js';
import './components/FlightSelection.js';
import './components/FlightPagination.js';
import './components/FlightHeader.js';
import './components/FlightMarquee.js';

window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');
  if (!window.location.hash) {
    window.location.hash = '#/departure';
  }

  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = '<flight-view></flight-view>';
  }
});
