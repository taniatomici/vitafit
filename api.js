// Shared API client — frontend ↔ backend (MySQL). Încarcă mock-data.js înainte pentru date de rezervă.
window.VitaFitAPI = {
  baseUrl: 'https://vitafit3.vercel.app/api',

  /** True dacă ultima operație de citire a folosit date mock (backend indisponibil). */
  lastUsedMockData: false,

  async get(path) {
    const res = await fetch(this.baseUrl + path);
    if (!res.ok) throw new Error(res.statusText || 'Request failed');
    return res.json();
  },

  async post(path, body) {
    const res = await fetch(this.baseUrl + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.status === 204) return null;
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || res.statusText || 'Request failed');
    }
    return res.json();
  },

  _mockPostsFiltered(params) {
    const m = window.VitaFitMock;
    if (!m || !m.posts) return [];
    let list = m.posts.slice();
    if (params.status) {
      list = list.filter(function (p) { return p.status === params.status; });
    }
    if (params.category_slug) {
      list = list.filter(function (p) {
        return (p.categories || []).some(function (c) {
          return c.slug === params.category_slug;
        });
      });
    }
    return list;
  },

  async getPosts(params) {
    this.lastUsedMockData = false;
    try {
      const q = new URLSearchParams();
      if (params.status) q.set('status', params.status);
      if (params.category_slug) q.set('category_slug', params.category_slug);
      const query = q.toString();
      return await this.get('/posts' + (query ? '?' + query : ''));
    } catch (e) {
      console.warn('[VitaFit] Backend indisponibil — se folosesc articole mock.', e);
      this.lastUsedMockData = true;
      return this._mockPostsFiltered(params || {});
    }
  },

  async getCategories() {
    this.lastUsedMockData = false;
    try {
      return await this.get('/categories');
    } catch (e) {
      console.warn('[VitaFit] Backend indisponibil — se folosesc categorii mock.', e);
      this.lastUsedMockData = true;
      const m = window.VitaFitMock;
      return m && m.categories ? m.categories.slice() : [];
    }
  },

  async getPostsByCategoryId(categoryId) {
    try {
      return await this.get('/categories/' + categoryId + '/posts');
    } catch (e) {
      const m = window.VitaFitMock;
      if (!m || !m.posts) return [];
      var id = Number(categoryId);
      return m.posts.filter(function (p) {
        return (p.categories || []).some(function (c) {
          return Number(c.id) === id || c.id === categoryId;
        });
      });
    }
  },

  async sendContactMessage(data) {
    return this.post('/contact-messages', data);
  },

  async getProgress(userId) {
    try {
      return await this.get('/progress?user_id=' + encodeURIComponent(userId));
    } catch (e) {
      console.warn('[VitaFit] Istoric progres indisponibil (backend).', e);
      return [];
    }
  },

  async postProgress(data) {
    return this.post('/progress', data);
  },

  async postProgressFormData(formData) {
    const base = this.baseUrl.replace(/\/api\/?$/, '');
    const res = await fetch(base + '/api/progress', {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(function () { return {}; });
      throw new Error(err.error || res.statusText || 'Request failed');
    }
    return res.json();
  },

  get contentBaseUrl() {
    return this.baseUrl.replace(/\/api\/?$/, '');
  }
};
