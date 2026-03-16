// Posts loaded from API (database)
let postsFromApi = [];

function stripHtml(html) {
  if (!html) return '';
  var div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

function excerpt(text, maxLen) {
  var t = stripHtml(text);
  if (t.length <= maxLen) return t;
  return t.slice(0, maxLen) + '…';
}

function renderPosts(posts, containerId, isGrid) {
  var container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  if (!posts.length) {
    container.innerHTML = '<p>Momentan nu există articole publicate.</p>';
    return;
  }
  var defaultImg = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop';
  posts.forEach(function (p) {
    var card = document.createElement('div');
    card.className = isGrid ? 'recipe-card' : 'article-card';
    card.setAttribute('data-post-id', p.id);
    if (isGrid) {
      card.innerHTML =
        '<img src="' + defaultImg + '" alt="' + (p.title || '').replace(/"/g, '&quot;') + '">' +
        '<div class="recipe-card-content">' +
        '<h4>' + (p.title || '') + '</h4>' +
        '<p>' + excerpt(p.content, 100) + '</p>' +
        '<a href="#" class="recipe-link">Vezi mai mult</a>' +
        '</div>';
      card.querySelector('.recipe-link').addEventListener('click', function (e) {
        e.preventDefault();
        showRecipe(p.id);
      });
    } else {
      card.innerHTML =
        '<h3>' + (p.title || '') + '</h3>' +
        '<p>' + excerpt(p.content, 150) + '</p>' +
        '<a href="#" class="recipe-link">Citește mai mult</a>';
      card.querySelector('.recipe-link').addEventListener('click', function (e) {
        e.preventDefault();
        showRecipe(p.id);
      });
    }
    container.appendChild(card);
  });
}

function showRecipe(postId) {
  var post = postsFromApi.find(function (p) { return p.id === postId; });
  if (!post) return;

  var recipeDetail = document.getElementById('recipeDetail');
  var recipeImage = document.getElementById('recipeImage');
  var recipeTitle = document.getElementById('recipeTitle');
  var recipeContent = document.getElementById('recipeContent');
  var recipesGrid = document.getElementById('recipesGrid');
  var articlesGrid = document.getElementById('articlesGrid');

  recipeImage.src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&h=600&fit=crop';
  recipeImage.alt = post.title || '';
  recipeTitle.textContent = post.title || '';
  recipeContent.innerHTML = post.content || '';

  if (recipesGrid) recipesGrid.style.display = 'none';
  if (articlesGrid) articlesGrid.style.display = 'none';
  recipeDetail.classList.add('show');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update URL without reload
  var url = new URL(window.location.href);
  url.searchParams.set('post', post.slug || post.id);
  window.history.pushState({}, '', url);
}

function hideRecipe() {
  var recipeDetail = document.getElementById('recipeDetail');
  var recipesGrid = document.getElementById('recipesGrid');
  var articlesGrid = document.getElementById('articlesGrid');

  recipeDetail.classList.remove('show');
  if (recipesGrid) recipesGrid.style.display = 'grid';
  if (articlesGrid) articlesGrid.style.display = 'grid';
  window.history.pushState({}, '', window.location.pathname);
}

document.addEventListener('DOMContentLoaded', function () {
  var articlesGrid = document.getElementById('articlesGrid');
  var recipesGrid = document.getElementById('recipesGrid');

  if (!window.VitaFitAPI) {
    if (articlesGrid) articlesGrid.innerHTML = '<p>Eroare: API negăsit. Încarcă api.js.</p>';
    if (recipesGrid) recipesGrid.innerHTML = '<p>Eroare: API negăsit.</p>';
    return;
  }

  VitaFitAPI.getPosts({ status: 'published' })
    .then(function (posts) {
      postsFromApi = posts || [];
      if (articlesGrid) {
        articlesGrid.innerHTML = '';
        renderPosts(postsFromApi, 'articlesGrid', false);
      }
      if (recipesGrid) {
        recipesGrid.innerHTML = '';
        renderPosts(postsFromApi, 'recipesGrid', true);
      }
      // Open post from URL ?post=slug
      var params = new URLSearchParams(window.location.search);
      var slug = params.get('post');
      if (slug) {
        var post = postsFromApi.find(function (p) { return p.slug === slug || String(p.id) === slug; });
        if (post) showRecipe(post.id);
      }
    })
    .catch(function () {
      if (articlesGrid) articlesGrid.innerHTML = '<p>Nu s-au putut încărca articolele. Verifică conexiunea la server.</p>';
      if (recipesGrid) recipesGrid.innerHTML = '<p>Nu s-au putut încărca datele.</p>';
    });
});
