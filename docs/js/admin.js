import { supabase } from './supabase.js';

// Check if user is authenticated
function checkAuth() {
    if (!localStorage.getItem('adminLoggedIn') && !window.location.href.includes('login.html')) {
        window.location.href = '/docs/login.html';
    } else if (localStorage.getItem('adminLoggedIn') && window.location.href.includes('login.html')) {
        window.location.href = '/docs/admin/dashboard.html';
    }
}

// Handle login form
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('adminLoggedIn', 'true');
        window.location.href = '/docs/admin/dashboard.html';
    } else {
        sessionStorage.setItem('isLoggedIn', 'true');
        window.location.href = '/docs/index.html';
    }
});

// Handle logout
document.getElementById('logoutBtn')?.addEventListener('click', function() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = '/docs/login.html';
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
    
    try {
        const semester = document.getElementById('semester').value;
        const subject = document.getElementById('subject').value;
        const contentType = document.getElementById('contentType').value;
        const pdfFile = document.getElementById('pdfFile').files[0];
        
        // Upload file to Supabase Storage
        const fileName = `${contentType}/${Date.now()}_${pdfFile.name}`;
        const { data: fileData, error: uploadError } = await supabase.storage
            .from('notes')
            .upload(fileName, pdfFile);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('notes')
            .getPublicUrl(fileName);

        // Insert into database
        const { error: dbError } = await supabase
            .from(contentType === 'notes' ? 'notes' : contentType === 'previous-year' ? 'previous_year_questions' : 'question_bank')
            .insert([{
                semester: parseInt(semester),
                subject_name: subject,
                pdf_url: publicUrl,
                content_type: contentType
            }]);

        if (dbError) throw dbError;

        showAlert(`${contentType.replace('-', ' ')} uploaded successfully!`, 'success');
        uploadForm.reset();
        loadRecentUploads();
    } catch (error) {
        console.error('Upload error:', error);
        showAlert('Upload failed: ' + error.message, 'danger');
    }
});


async function loadRecentUploads() {
    if (!recentUploads) return;
    
    try {
        // Fetch recent uploads from all content types
        const [notes, prevYear, questionBank] = await Promise.all([
            supabase.from('notes')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(2),
            supabase.from('previous_year_questions')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(2),
            supabase.from('question_bank')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(2)
        ]);

        if (notes.error) throw notes.error;
        if (prevYear.error) throw prevYear.error;
        if (questionBank.error) throw questionBank.error;

        // Combine and sort all uploads by date
        const allUploads = [
            ...notes.data.map(item => ({...item, type: 'Notes'})),
            ...prevYear.data.map(item => ({...item, type: 'Previous Year Question'})),
            ...questionBank.data.map(item => ({...item, type: 'Question Bank'}))
        ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        recentUploads.innerHTML = allUploads.map(item => `
            <div class="pdf-preview">
                <div class="pdf-preview-header">
                    <div>
                        <h6>${item.subject_name}</h6>
                        <small class="text-muted">
                            Semester ${item.semester} | ${item.type}
                        </small>
                    </div>
                    <div>
                        <a href="${item.pdf_url}" target="_blank" class="btn btn-sm btn-primary">
                            <i class="fas fa-download"></i>
                        </a>
                    </div>
                </div>
                <small class="text-muted d-block">
                    Uploaded: ${new Date(item.created_at).toLocaleDateString()}
                </small>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading uploads:', error);
        showAlert('Failed to load recent uploads', 'danger');
    }
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
    loadRecentUploads();
});

// uploadForm?.addEventListener('submit', async (e) => {
//     e.preventDefault();
    
//     try {
//         const semester = document.getElementById('semester').value;
//         const subject = document.getElementById('subject').value;
//         const contentType = document.getElementById('contentType').value;
//         const pdfFile = document.getElementById('pdfFile').files[0];
        
//         // Upload file to Supabase Storage
//         const fileName = `${contentType}/${Date.now()}_${pdfFile.name}`;
//         const { data: fileData, error: uploadError } = await supabase.storage
//             .from('notes')
//             .upload(fileName, pdfFile);

//         if (uploadError) throw uploadError;

//         // Get public URL
//         const { data: { publicUrl } } = supabase.storage
//             .from('notes')
//             .getPublicUrl(fileName);

//         // Insert into database
//         const { error: dbError } = await supabase
//             .from(contentType === 'notes' ? 'notes' : contentType === 'previous-year' ? 'previous_year_questions' : 'question_bank')
//             .insert([{
//                 semester: parseInt(semester),
//                 subject_name: subject,
//                 pdf_url: publicUrl,
//                 content_type: contentType
//             }]);

//         if (dbError) throw dbError;

//         showAlert(`${contentType.replace('-', ' ')} uploaded successfully!`, 'success');
//         uploadForm.reset();
//         loadRecentUploads();
//     } catch (error) {
//         console.error('Upload error:', error);
//         showAlert('Upload failed: ' + error.message, 'danger');
//     }
// });