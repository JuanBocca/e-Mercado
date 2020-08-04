const previous = document.referrer;

if (!previous.includes('/e-Mercado/')) {
    location.href = 'login.html';
}