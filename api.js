// Shared API client — use this so the frontend talks to the backend (MySQL)
window.VitaFitAPI = {
  baseUrl: 'http://localhost:4000/api',

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

  async getPosts(params = {}) {
    const q = new URLSearchParams();
    if (params.status) q.set('status', params.status);
    if (params.category_slug) q.set('category_slug', params.category_slug);
    const query = q.toString();
    return this.get('/posts' + (query ? '?' + query : ''));
  },

  async getCategories() {
    return this.get('/categories');
  },

  async getPostsByCategoryId(categoryId) {
    return this.get('/categories/' + categoryId + '/posts');
  },

  async sendContactMessage(data) {
    return this.post('/contact-messages', data);
  },

  async getProgress(userId) {
    return this.get('/progress?user_id=' + encodeURIComponent(userId));
  },

  async postProgress(data) {
    return this.post('/progress', data);
  },

  /** Post progress with FormData (multipart) for file uploads. */
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

  /** Base URL for content (uploaded images). e.g. http://localhost:4000 */
  get contentBaseUrl() {
    return this.baseUrl.replace(/\/api\/?$/, '');
  }
};
