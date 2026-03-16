// Use shared API base URL from api.js when loaded; otherwise fallback
const API_BASE_URL = (window.VitaFitAPI && window.VitaFitAPI.baseUrl) ? window.VitaFitAPI.baseUrl : 'http://localhost:4000/api';

// Check if user is logged in (from localStorage, after a successful API login/register)
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        showDashboard(JSON.parse(user));
    }
}

// Switch between login and register tabs
function switchTab(tab) {
    const loginTab = document.querySelector('.auth-tab:first-child');
    const registerTab = document.querySelector('.auth-tab:last-child');
    const loginContent = document.getElementById('loginContent');
    const registerContent = document.getElementById('registerContent');

    if (tab === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginContent.classList.add('active');
        registerContent.classList.remove('active');
    } else {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerContent.classList.add('active');
        loginContent.classList.remove('active');
    }
}

// Handle login (uses backend /api/users)
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) {
            throw new Error('Eroare la conectarea la server.');
        }
        const users = await response.json();
        // In this simple example, password is stored as plain text in password_hash
        const user = users.find(u => u.email === email && u.password_hash === password);

        if (user) {
            const currentUser = {
                id: user.id,
                name: user.full_name || user.username,
                email: user.email
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showDashboard(currentUser);
            alert('Te-ai conectat cu succes!');
        } else {
            alert('Email sau parolă incorectă!');
        }
    } catch (error) {
        console.error(error);
        alert('A apărut o eroare la conectare. Încearcă din nou mai târziu.');
    }
}

// Handle register (uses backend /api/users)
async function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;

    // Validate passwords match
    if (password !== passwordConfirm) {
        alert('Parolele nu se potrivesc!');
        return;
    }

    // Very simple username based on name/email
    const username =
        name.trim().toLowerCase().replace(/\s+/g, '.') ||
        email.split('@')[0];

    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                role_id: 1, // presupunem că există un rol de bază cu id=1
                username: username,
                email: email,
                password_hash: password,
                full_name: name
            })
        });

        if (response.status === 409) {
            alert('Acest email sau nume de utilizator este deja înregistrat!');
            return;
        }

        if (!response.ok) {
            throw new Error('Eroare la înregistrare.');
        }

        const user = await response.json();
        const currentUser = {
            id: user.id,
            name: user.full_name || user.username,
            email: user.email
        };

        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showDashboard(currentUser);
        alert('Contul tău a fost creat cu succes!');
    } catch (error) {
        console.error(error);
        alert('A apărut o eroare la înregistrare. Încearcă din nou mai târziu.');
    }
}

// Show user dashboard
function showDashboard(user) {
    document.getElementById('loginContent').style.display = 'none';
    document.getElementById('registerContent').style.display = 'none';
    document.querySelector('.auth-tabs').style.display = 'none';
    document.getElementById('userDashboard').style.display = 'block';
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('currentUser');
    location.reload();
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', function() {
    checkAuth();
});

