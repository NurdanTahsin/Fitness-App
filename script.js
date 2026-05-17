/* ============================================================
  script.js — FitPulse
  Sayfa etkileşimleri burada yönetilir.
  ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* 1. Üst menü: hamburger aç/kapa */

  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });
  }

  /* 2. Antrenmanlar: frekansa göre filtre */

  const filterButtons = document.querySelectorAll('.filter-btn');
  const workoutCards = document.querySelectorAll('.workout-card');

  if (filterButtons.length && workoutCards.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        workoutCards.forEach(card => {
          const freq = card.dataset.frequency;
          if (filter === 'all' || freq === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
            card.classList.remove('expanded'); // close detail if hidden
          }
        });
      });
    });
  }

  /* 3. Antrenmanlar: detayları modalda aç */

  const modal = document.getElementById('workoutModal');
  const modalHeader = document.getElementById('modalHeader');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');

  if (modal && workoutCards.length) {

    // Open modal when clicking a card
    workoutCards.forEach(card => {
      card.addEventListener('click', () => {
        // Get card info
        const title = card.querySelector('h3').textContent;
        const metaSpans = card.querySelectorAll('.card-meta span');
        const detail = card.querySelector('.workout-detail');

        // Build header
        let metaHTML = '<div class="modal-meta">';
        metaSpans.forEach(span => { metaHTML += span.outerHTML; });
        metaHTML += '</div>';
        modalHeader.innerHTML = '<h3>' + title + '</h3>' + metaHTML;

        // Build body from hidden detail
        modalBody.innerHTML = detail ? detail.innerHTML : '<p>Detay bulunamadı.</p>';

        // Show modal
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    // Close modal — X button
    modalClose.addEventListener('click', () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    });

    // Close modal — backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    // Close modal — Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* 4. Tarifler: protein veya kaloriye göre sırala */

  const sortSelect = document.getElementById('recipeSortSelect');
  const recipesList = document.getElementById('recipesList');

  if (sortSelect && recipesList) {
    const originalOrder = Array.from(recipesList.querySelectorAll('.recipe-card'));

    sortSelect.addEventListener('change', () => {
      const sortBy = sortSelect.value;
      let cards = Array.from(recipesList.querySelectorAll('.recipe-card'));

      if (sortBy === 'default') {
        originalOrder.forEach(card => recipesList.appendChild(card));
      } else if (sortBy === 'protein') {
        cards.sort((a, b) => Number.parseInt(b.dataset.protein) - Number.parseInt(a.dataset.protein));
        cards.forEach(card => recipesList.appendChild(card));
      } else if (sortBy === 'calories') {
        cards.sort((a, b) => Number.parseInt(a.dataset.calories) - Number.parseInt(b.dataset.calories));
        cards.forEach(card => recipesList.appendChild(card));
      }
    });
  }

  /* 5. Hesaplayıcı: BMR ve TDEE hesapla */

  const bmrForm = document.getElementById('bmrForm');

  if (bmrForm) {
    bmrForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const gender = document.querySelector('input[name="gender"]:checked').value;
      const age = Number.parseFloat(document.getElementById('inputAge').value);
      const height = Number.parseFloat(document.getElementById('inputHeight').value);
      const weight = Number.parseFloat(document.getElementById('inputWeight').value);

      if (Number.isNaN(age) || Number.isNaN(height) || Number.isNaN(weight) || age <= 0 || height <= 0 || weight <= 0) {
        alert('Lütfen tüm alanları geçerli pozitif sayılarla doldurun.');
        return;
      }

      // Mifflin-St Jeor formülü: erkek +5, kadın -161
      let bmr = (10 * weight) + (6.25 * height) - (5 * age) + (gender === 'male' ? 5 : -161);
      bmr = Math.round(bmr);

      document.getElementById('resultPlaceholder').style.display = 'none';
      const resultCard = document.getElementById('resultCard');
      resultCard.classList.add('show');
      document.getElementById('bmrValue').textContent = bmr;

      // Günlük toplam kalori tahminleri
      document.getElementById('tdeeSedentary').textContent = Math.round(bmr * 1.2);
      document.getElementById('tdeeLight').textContent = Math.round(bmr * 1.375);
      document.getElementById('tdeeModerate').textContent = Math.round(bmr * 1.55);
      document.getElementById('tdeeActive').textContent = Math.round(bmr * 1.725);
    });
  }

  /* 6. İletişim: form gönderince başarı mesajı göster */

  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Hide form, show success
      contactForm.style.display = 'none';
      document.getElementById('contactSuccess').classList.add('show');
    });
  }

});
