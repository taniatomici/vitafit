/**
 * Videoclipuri YouTube illustrative (cardio / tonifiere / forță / mobilitate).
 * Înlocuiește cu altele dacă un link nu mai e disponibil.
 */
const exerciseVideos = {
  // Slăbit: HIIT / cardio, ardere calorii, impact redus → intensitate mare
  slabit: {
    beginner: [
      'J8EeluUr4ak', // 20 min HIIT fără sărituri, începători (growingannanas)
      'uhpo1amlLZo', // 10 min HIIT low impact, doar în picioare
      'BnLJ3zU-KVE' // 15 min cardio ușor, fără echipament
    ],
    intermediate: [
      'MQ0fi7wBkfc', // 15 min HIIT full body, fără echipament
      'IQE4_C687xI', // ~30 min cardio HIIT pentru ardere grăsimi
      'Lp4fwuvwRrk' // 30 min HIIT calorie killer, fără repetări
    ],
    advanced: [
      '4nPKyvKmFi0', // 30 min HIIT intens, fără echipament
      '98FRlhwqwKs', // 30 min HIIT bodyweight intens
      '0Z2gic1OWSQ' // antrenament HIIT pentru pierdere grăsime
    ]
  },
  // Tonifiere: corp întreg, rezistență musculară, accesibil acasă
  tonifiere: {
    beginner: [
      'LqW9gdpctKE', // 20 min full body începători, fără echipament (MadFit)
      'k59MxmASBR8', // 22 min low impact, fără sărituri
      'vK7O93Ujd8k' // full body începători, Juice & Toya
    ],
    intermediate: [
      '5xCRFuDeagc', // 20 min tonifiere (gantere opționale / alternative fără)
      'jNzu-iktQ_8', // antrenament acasă fără echipament obligatoriu
      'MQ0fi7wBkfc' // 15 min HIIT tonifiere + cardio ușor
    ],
    advanced: [
      '5xCRFuDeagc', // repetă cu greutăți mai mari pentru intensitate
      'RooFVtPjLzE', // 15 min HIIT intens, full body (Chloe Ting – Summer Shred)
      'jNzu-iktQ_8' // variante mai rapide / mai multe repetări
    ]
  },
  // Masă musculară: forță, hipertrofie, gantere acasă
  'masa-musculara': {
    beginner: [
      'O2onp4Xxu-Y', // 20 min full body cu gantere, începători
      'Gze8oMuj4as', // Fitness Blender – forță & core începători, low impact
      'l9_SoClAO5g' // Caroline Girvan – 20 min full body cu gantere, fără repetări
    ],
    intermediate: [
      '_yTQdEDLcuc', // full body gantere, forță & masă
      'O2onp4Xxu-Y', // consolidare tehnică gantere
      '9xlHilg5FYc' // volum upper/lower hipertrofie
    ],
    advanced: [
      '9xlHilg5FYc', // workout hipertrofie gantere
      '_yTQdEDLcuc', // superserii, intensitate
      'Ag7Dui9Plys' // total body forță (Jeff Cavaliere / Athlean-X – „Perfect Total Body”)

    ]
  },
  // Mobilitate: stretching, mobilitate articulară, recuperare
  mobilitate: {
    beginner: [
      'Ug5acb9j0OE', // 15 min stretching full body zilnic
      'ktdAEu8wnwg', // mobilitate & flexibilitate
      'F4oF_vXjIV8' // flow mobilitate follow-along
    ],
    intermediate: [
      'iX3Ltr3sGbU', // mobilitate & flexibilitate 15 min
      'ktdAEu8wnwg',
      'F4oF_vXjIV8'
    ],
    advanced: [
      'iX3Ltr3sGbU', // ține poziții mai lungi / adâncime mai mare
      'Ug5acb9j0OE',
      'ktdAEu8wnwg'
    ]
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
      beginner: ['J8EeluUr4ak'],
      intermediate: ['MQ0fi7wBkfc'],
      advanced: ['4nPKyvKmFi0']
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
      var videoItem = document.createElement('div');
      videoItem.className = 'video-item';
      var src =
        'https://www.youtube-nocookie.com/embed/' +
        encodeURIComponent(videoId) +
        '?rel=0&modestbranding=1&playsinline=1';
      videoItem.innerHTML =
        '<iframe title="Videoclip exercițiu YouTube" src="' +
        src +
        '" frameborder="0" ' +
        'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
        'allowfullscreen referrerpolicy="strict-origin-when-cross-origin" loading="lazy"></iframe>';
      container.appendChild(videoItem);
    });
  }

  var hintEl = document.getElementById('youtubeEmbedHint');
  if (hintEl && window.location.protocol === 'file:') {
    hintEl.hidden = false;
    hintEl.textContent =
      'Videoclipurile YouTube nu se încarcă corect dacă deschizi pagina direct din fișier (adresa începe cu file://). ' +
      'Folosește „Live Server” în editor (http://localhost) sau publică site-ul pe GitHub Pages. ' +
      'În Brave, poți dezactiva Shields pentru acest site dacă tot apare eroarea.';
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
