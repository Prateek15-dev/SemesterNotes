import { supabase } from './supabase.js';

const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const usernameDisplay = document.getElementById('username');

let currentUser = null;

// Initialize chat and check authentication
async function initChat() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const username = sessionStorage.getItem('username');
    const userId = sessionStorage.getItem('userId');

    if (!isLoggedIn || !username || !userId) {
        window.location.href = 'login.html';
        return;
    }

    currentUser = {
        id: userId,
        username: username
    };
    usernameDisplay.textContent = username;

    await loadMessages();
    setupRealtimeSubscription();
}

// Load existing messages
async function loadMessages() {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) throw error;

        chatMessages.innerHTML = '';
        data.forEach(message => {
            appendMessage(message);
        });
        scrollToBottom();
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

// Set up realtime subscription for new messages
function setupRealtimeSubscription() {
    const channel = supabase.channel('messages-channel')
        .on('postgres_changes', 
            { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'messages'
            }, 
            (payload) => {
                appendMessage(payload.new);
                scrollToBottom();
            }
        )
        .subscribe();
}

// Append a message to the chat
function appendMessage(message) {
    const isOwnMessage = message.username === currentUser.username;
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isOwnMessage ? 'message-own' : ''}`;
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <strong>${message.username}</strong>
            <p>${message.content}</p>
            <small>${formatTime(message.created_at)}</small>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
}

// Format timestamp
function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit'
    });
}

// Send a message
async function sendMessage(content) {
    if (!content.trim() || !currentUser) return;

    try {
        const { error } = await supabase
            .from('messages')
            .insert([{
                content: content.trim(),
                user_id: currentUser.id,
                username: currentUser.username,
                created_at: new Date().toISOString()
            }]);

        if (error) throw error;
        
        // Clear input after successful send
        messageInput.value = '';
    } catch (error) {
        console.error('Error sending message:', error);
        if (error.message.includes('auth')) {
            window.location.href = 'login.html';
        }
    }
}

// Auto-scroll to bottom
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Event listeners
sendButton.addEventListener('click', () => {
    sendMessage(messageInput.value);
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(messageInput.value);
    }
});

document.addEventListener('DOMContentLoaded', initChat);
