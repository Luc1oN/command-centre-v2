document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
  }

  // Listings filter (listings.html only)
  const filterForm = document.querySelector('.filter-bar');
  const cards = document.querySelectorAll('[data-listing]');
  const resultsCount = document.querySelector('.results-count');

  function applyFilters() {
    if (!filterForm || !cards.length) return;
    const type = filterForm.querySelector('[name="type"]').value;
    const beds = filterForm.querySelector('[name="beds"]').value;
    const price = filterForm.querySelector('[name="price"]').value;
    const q = filterForm.querySelector('[name="q"]').value.trim().toLowerCase();

    let visible = 0;
    cards.forEach(card => {
      const dType = card.dataset.type;
      const dBeds = Number(card.dataset.beds);
      const dPrice = Number(card.dataset.price);
      const dLoc = card.dataset.location.toLowerCase();

      let match = true;
      if (type && type !== dType) match = false;
      if (beds && dBeds < Number(beds)) match = false;
      if (price && dPrice > Number(price)) match = false;
      if (q && !dLoc.includes(q)) match = false;

      card.style.display = match ? '' : 'none';
      if (match) visible++;
    });

    if (resultsCount) {
      resultsCount.textContent = `${visible} propert${visible === 1 ? 'y' : 'ies'} found`;
    }
  }

  if (filterForm) {
    filterForm.addEventListener('input', applyFilters);
    filterForm.addEventListener('change', applyFilters);
    applyFilters();
  }

  // Contact / search forms: prevent real submit in this static build
  document.querySelectorAll('form[data-static]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = form.querySelector('.form-status');
      if (msg) msg.textContent = 'Thanks — your enquiry has been noted. John will be in touch shortly.';
    });
  });
});
