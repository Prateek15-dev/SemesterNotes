import { supabase } from './supabase.js';

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = e.target.querySelector('button');
    button.disabled = true;

    try {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

         if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('adminLoggedIn', 'true');
        window.location.href = '/docs/admin/dashboard.html';
    }


        // Query user_profiles with username and password_hash
        const { data: user, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('username', username)
            .eq('password_hash', password) // In production, use proper password hashing
            .single();

        if (error || !user) {
            throw new Error('Invalid username or password');
        }

        // Set auth state
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userId', user.id);
        sessionStorage.setItem('username', username);
        window.location.href = 'index.html';
    } catch (error) {
        showAlert(error.message, 'danger');
    } finally {
        button.disabled = false;
    }
});

document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = e.target.querySelector('button');
    button.disabled = true;

    try {
        const username = document.getElementById('signupUsername').value;
        const password = document.getElementById('signupPassword').value;
        const fullName = document.getElementById('fullName').value;

        // Check if username exists
        const { data: existingUser } = await supabase
            .from('user_profiles')
            .select('username')
            .eq('username', username)
            .single();

        if (existingUser) {
            throw new Error('Username already taken');
        }

        // Create new user profile with password_hash
        const { error } = await supabase
            .from('user_profiles')
            .insert([{
                username,
                password_hash: password, // In production, use proper password hashing
                full_name: fullName,
                role: 'user'
            }]);

        if (error) throw error;

        showAlert('Account created successfully! Please login.', 'success');
        setTimeout(() => {
            document.querySelector('[data-toggle="tab"][href="#login"]').click();
        }, 1500);
    } catch (error) {
        showAlert(error.message, 'danger');
    } finally {
        button.disabled = false;
    }
});

function showAlert(message, type) {
    const alertBox = document.getElementById('alertBox');
    alertBox.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show">
            ${message}
            <button type="button" class="close" data-dismiss="alert">&times;</button>
        </div>
    `;
}
