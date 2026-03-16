// Default YouTube video IDs per category slug (when no videos in DB)
const exerciseVideos = {
  slabit: {
    beginner: ['dQw4w9WgXcQ', 'jNQXAC9IVRw', 'kJQP7kiw5Fk'],
    intermediate: ['dQw4w9WgXcQ', 'jNQXAC9IVRw', 'kJQP7kiw5Fk'],
    advanced: ['dQw4w9WgXcQ', 'jNQXAC9IVRw', 'kJQP7kiw5Fk']
  },
  tonifiere: {
    beginner: ['dQw4w9WgXcQ', 'jNQXAC9IVRw', 'kJQP7kiw5Fk'],
    intermediate: ['dQw4w9WgXcQ', 'jNQXAC9IVRw', 'kJQP7kiw5Fk'],
    advanced: ['dQw4w9WgXcQ', 'jNQXAC9IVRw', 'kJQP7kiw5Fk']
  },
  'masa-musculara': {
    beginner: ['dQw4w9WgXcQ', 'jNQXAC9IVRw', 'kJQP7kiw5Fk'],
    intermediate: ['dQw4w9WgXcQ', 'jNQXAC9IVRw', 'kJQP7kiw5Fk'],
    advanced: ['dQw4w9WgXcQ', 'jNQXAC9IVRw', 'kJQP7kiw5Fk']
  },
  mobilitate: {
    beginner: ['dQw4w9WgXcQ', 'jNQXAC9IVRw', 'kJQP7kiw5Fk'],
    intermediate: ['dQw4w9WgXcQ', 'jNQXAC9IVRw', 'kJQP7kiw5Fk'],
    advanced: ['dQw4w9WgXcQ', 'jNQXAC9IVRw', 'kJQP7kiw5Fk']
  }
};

const categoryImages = {
  slabit: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
  tonifiere: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop',
  'masa-musculara': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
  mobilitate: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop'
};
const defaultImage = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop';

document.addEventListener('DOMContentLoaded', function () {
  const categoriesGrid = document.getElementById('categoriesGrid');
  const videosSection = document.getElementById('videosSection');
  const backButton = document.getElementById('backButton');
  const categoryTitle = document.getElementById('categoryTitle');
  const beginnerVideos = document.getElementById('beginnerVideos');
  const intermediateVideos = document.getElementById('intermediateVideos');
  const advancedVideos = document.getElementById('advancedVideos');

  function renderCategories(categories) {
    if (!categoriesGrid) return;
    categoriesGrid.innerHTML = '';
    if (!categories || !categories.length) {
      categoriesGrid.innerHTML = '<p>Nu există categorii. Verifică serverul și baza de date.</p>';
      return;
    }
    categories.forEach(function (cat) {
      const card = document.createElement('div');
      card.className = 'exercise-card';
      card.setAttribute('data-category', cat.slug || cat.id);
      const img = categoryImages[cat.slug] || defaultImage;
      card.innerHTML =
        '<img src="' + img + '" alt="' + (cat.name || '').replace(/"/g, '&quot;') + '">' +
        '<h3>' + (cat.name || '') + '</h3>';
      card.addEventListener('click', function () {
        showVideos(cat.slug || String(cat.id), cat.name);
      });
      categoriesGrid.appendChild(card);
    });
  }

  function showVideos(categorySlug, categoryName) {
    const videos = exerciseVideos[categorySlug] || {
      beginner: ['dQw4w9WgXcQ'],
      intermediate: ['dQw4w9WgXcQ'],
      advanced: ['dQw4w9WgXcQ']
    };

    categoryTitle.textContent = categoryName || categorySlug;
    categoriesGrid.style.display = 'none';
    videosSection.classList.add('show');

    loadVideos(beginnerVideos, videos.beginner);
    loadVideos(intermediateVideos, videos.intermediate);
    loadVideos(advancedVideos, videos.advanced);
    window.history.pushState({}, '', 'exercitii.html?category=' + encodeURIComponent(categorySlug));
  }

  function loadVideos(container, videoIds) {
    if (!container) return;
    container.innerHTML = '';
    (videoIds || []).forEach(function (videoId) {
      const videoItem = document.createElement('div');
      videoItem.className = 'video-item';
      videoItem.innerHTML = '<iframe src="https://www.youtube.com/embed/' + videoId + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      container.appendChild(videoItem);
    });
  }

  if (window.VitaFitAPI) {
    VitaFitAPI.getCategories()
      .then(function (categories) {
        renderCategories(categories);
        var urlParams = new URLSearchParams(window.location.search);
        var categoryParam = urlParams.get('category');
        if (categoryParam) {
          var cat = categories.find(function (c) { return c.slug === categoryParam || String(c.id) === categoryParam; });
          if (cat) showVideos(cat.slug || String(cat.id), cat.name);
        }
      })
      .catch(function () {
        if (categoriesGrid) categoriesGrid.innerHTML = '<p>Nu s-au putut încărca categoriile. Verifică dacă serverul rulează.</p>';
      });
  } else {
    if (categoriesGrid) categoriesGrid.innerHTML = '<p>Eroare: API negăsit.</p>';
  }

  if (backButton) {
    backButton.addEventListener('click', function () {
      categoriesGrid.style.display = 'grid';
      videosSection.classList.remove('show');
      window.history.pushState({}, '', 'exercitii.html');
    });
  }
});
