// Check if user is authenticated
function checkAuth() {
    if (!localStorage.getItem('adminLoggedIn') && !window.location.href.includes('login.html')) {
        window.location.href = 'login.html';
    } else if (localStorage.getItem('adminLoggedIn') && window.location.href.includes('login.html')) {
        window.location.href = 'dashboard.html';
    }
}

// Handle login form
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('adminLoggedIn', 'true');
        window.location.href = '/Semester-Notes-QB-repository-Project/Semester-Notes/docs/admin/dashboard.html';
    } else {
        window.location.href="index.html"
    }
});

// Handle logout
document.getElementById('logoutBtn')?.addEventListener('click', function() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
});

// Check authentication on page load
document.addEventListener('DOMContentLoaded', checkAuth);

// Handle file uploads and local storage
const uploadForm = document.getElementById('uploadForm');
const recentUploads = document.getElementById('recentUploads');

// Load existing notes from localStorage
let notes = JSON.parse(localStorage.getItem('notes') || '[]');

uploadForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const semester = document.getElementById('semester').value;
    const subject = document.getElementById('subject').value;
    const pdfFile = document.getElementById('pdfFile').files[0];

    // Convert PDF to base64
    const reader = new FileReader();
    reader.readAsDataURL(pdfFile);
    
    reader.onload = () => {
        const newNote = {
            id: Date.now(),
            semester,
            subject,
            pdfData: reader.result,
            uploadDate: new Date().toISOString()
        };

        // Add to notes array
        notes.unshift(newNote);
        
        // Store in localStorage
        localStorage.setItem('notes', JSON.stringify(notes));
        
        // Update UI
        updateRecentUploads();
        
        // Reset form
        uploadForm.reset();
        
        showAlert('Notes uploaded successfully!', 'success');
    };
});

function updateRecentUploads() {
    if (!recentUploads) return;
    
    recentUploads.innerHTML = notes.slice(0, 5).map(note => `
        <div class="pdf-preview">
            <div class="pdf-preview-header">
                <div>
                    <h6>${note.subject}</h6>
                    <small class="text-muted">Semester ${note.semester}</small>
                </div>
                <div>
                    <button class="btn btn-sm btn-danger" onclick="deleteNote(${note.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <small class="text-muted d-block">
                Uploaded: ${new Date(note.uploadDate).toLocaleDateString()}
            </small>
        </div>
    `).join('');
}

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    localStorage.setItem('notes', JSON.stringify(notes));
    updateRecentUploads();
    showAlert('Notes deleted successfully!', 'success');
}

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="close" data-dismiss="alert">&times;</button>
    `;
    document.querySelector('.main-content').insertAdjacentElement('afterbegin', alert);
    
    setTimeout(() => alert.remove(), 3000);
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    updateRecentUploads();
});

// Handle logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
});
