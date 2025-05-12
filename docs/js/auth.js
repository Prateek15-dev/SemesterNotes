import { supabase } from './supabase.js';

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = e.target.querySelector('button');
    button.disabled = true;

    try {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const isAdmin = document.getElementById('isAdmin').checked;

        // Query user_profiles with username
        const { data: user, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('username', username)
            .eq('password_hash', password) // In production, use proper hashing
            .single();

        if (error || !user) {
            throw new Error('Invalid username or password');
        }

        if (isAdmin && user.role !== 'admin') {
            throw new Error('Not authorized as admin');
        }

        // Set auth state
        if (isAdmin) {
            localStorage.setItem('adminLoggedIn', 'true');
            window.location.href = '/docs/admin/dashboard.html';
        } else {
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('userId', user.id);
            sessionStorage.setItem('username', username);
            window.location.href = '/docs/index.html';
        }
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

        // Create new user profile
        const { data, error } = await supabase
            .from('user_profiles')
            .insert([
                {
                    username,
                    password_hash: password, // In production, use proper hashing
                    full_name: fullName,
                    role: 'user'
                }
            ])
            .select()
            .single();

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

// Handle tab switching
document.querySelectorAll('[data-toggle="tab"]').forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        
        // Remove active class from all tabs and panes
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('show', 'active');
        });
        
        // Add active class to clicked tab and its pane
        e.target.classList.add('active');
        target.classList.add('show', 'active');
    });
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
