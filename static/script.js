document.addEventListener('DOMContentLoaded', () => {
            const loginSection = document.getElementById('login-section');
            const registerSection = document.getElementById('register-section');
            const showRegisterLink = document.getElementById('show-register-link');
            const showLoginLink = document.getElementById('show-login-link');
            const messageDiv = document.getElementById('message');

            const loginForm = document.getElementById('login-form');
            const registerForm = document.getElementById('register-form');


            const switchForms = (show) => {
                messageDiv.textContent = '';
                messageDiv.className = '';
                if (show === 'register') {
                    loginSection.classList.add('hidden');
                    registerSection.classList.remove('hidden');
                } else {
                    registerSection.classList.add('hidden');
                    loginSection.classList.remove('hidden');
                }
            };

            showRegisterLink.addEventListener('click', (e) => {
                e.preventDefault();
                switchForms('register');
            });

            showLoginLink.addEventListener('click', (e) => {
                e.preventDefault();
                switchForms('login');
            });

                        loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;

                try {
                    const response = await fetch('/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams({
                            email,
                            password
                        })
                    });

                    if (!response.ok) throw new Error("Login failed");

                    const data = await response.json();
                    messageDiv.textContent = 'Login successful! Redirecting...';
                    messageDiv.className = 'success';

                   
                    localStorage.setItem("token", data.access_token);

                    setTimeout(() => {
                        loginForm.reset();
                        window.location.href = "/login_success.html"; 
                    }, 1500);

                } catch (err) {
                    messageDiv.textContent = 'Login failed. Check your credentials.';
                    messageDiv.className = 'error';
                }
            });


            registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;

            messageDiv.className = 'error';
            if (password !== confirmPassword) {
                messageDiv.textContent = 'Passwords do not match.';
                return;
            }

            if (password.length < 8) {
                messageDiv.textContent = 'Password must be at least 8 characters long.';
                return;
            }

            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        username,
                        email,
                        password
                    })
                });

                if (!response.ok) throw new Error("Registration failed");

                messageDiv.textContent = 'Registration successful! Please log in.';
                messageDiv.className = 'success';

                setTimeout(() => {
                    registerForm.reset();
                    switchForms('login');
                }, 1500);
            } catch (err) {
                messageDiv.textContent = 'Registration failed. Try again.';
                messageDiv.className = 'error';
            }

            
            });
    
        });



document.addEventListener('DOMContentLoaded', () => {
    const usernamePlaceholder = document.getElementById('username-placeholder');
    const token = localStorage.getItem("token");

    if (usernamePlaceholder && token) {
        try {
            const payloadBase64 = token.split('.')[1];
            const payload = JSON.parse(atob(payloadBase64));
            const username = payload.sub;
            usernamePlaceholder.textContent = username || 'User';
        } catch (error) {
            console.error("Error decoding token:", error);
            usernamePlaceholder.textContent = 'User';
        }
    }
});