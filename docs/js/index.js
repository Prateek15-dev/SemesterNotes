/*
*********************************************************************************************
* File: index.js
* Author: Madhurima Rawat
* Date: January 09, 2025
* Description: JavaScript file for study materials website, providing
*              functionality to dynamically change color schemes based on user-selected seasons.
* Version: 1.0
* GitHub Repository: https://github.com/madhurimarawat/Semester-Notes
* Issues/Bugs: For any issues or bugs, please visit the GitHub repository issues section.
* Comments: This JS file defines functions to update the primary color variable of the root
*           element based on the provided season. It enhances user experience by allowing
*           dynamic customization of the color scheme. It also handles mouse navigation 
*           for suggestions dropdowns.
* Dependencies: None
*********************************************************************************************
*/

/**
 * The JavaScript code includes functions to center align content using Flexbox, change colors based on
 * a parameter, and handle smooth scrolling for dropdown items using jQuery.
 * @param Color - The `Color` parameter in the `changeColor` function is used to determine the color
 * scheme for the page based on different seasons. The function sets the primary color and button color
 * variables in the CSS root element based on the provided color parameter.
 */

// Run when DOM content is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Array of contentRow IDs to center align
  var rowIds = ["centerRow_1", "centerRow_2"];

  // Loop through each ID and add the Flexbox classes if the element exists
  for (var i = 0; i < rowIds.length; i++) {
    var contentRow = document.getElementById(rowIds[i]);
    if (contentRow) {
      // Add Flexbox classes to center align the content
      contentRow.classList.add("d-flex", "justify-content-center");
    }
  }
});


// Function to change colors based on the Color parameter
function changeColor(Color) {
  let color;
  let button;

  // Determine the color based on the provided Color parameter
  switch (Color) {
    case 'autumn':
      color = 'coral'; // Autumn: Coral
      button = '#BA68C8'; // Button color: Purple
      break;
    case 'summer':
      color = '#ffc107'; // Summer: Gold
      button = '#4D94FF'; // Button color: Blue
      break;
    case 'rainy':
      color = '#00CED1'; // Rainy: Dark Turquoise
      button = '#c65b5b'; // Button color: Red
      break;
    case 'winter':
      color = 'rgb(242, 82, 175)'; // Winter: Deep Pink
      button = '#4CAF50'; // Button color: Dark Green
      break;
    default:
      color = '#28a745'; // Default color (Green)
      button = '#ffc107'; // Default button color: Gold
  }

  // Set the '--primary-color' CSS variable of the root element to the determined color
  document.documentElement.style.setProperty('--primary-color', color);

  // Set the '--button-color' CSS variable of the root element to the determined button color
  document.documentElement.style.setProperty('--button-color', button);
}

// jQuery function to handle smooth scrolling for dropdown items within the element with ID 'sem'
$(document).ready(function () {
  // Select only the dropdown items within the "Semester" section
  $("#navbarDropdownSemester + .dropdown-menu a.dropdown-item").on('click', function (event) {
    event.preventDefault();

    var target = $(this).attr("href");
    var offset;

    // Check if it's a mobile device
    if ($(window).width() < 992) {
      offset = $(target).offset().top - 75; // Manually adjust for mobile, excluding navbar height
    } else {
      offset = $(target).offset().top - $(".navbar").outerHeight() - 20; // Default offset for larger screens
    }

    // Smooth scroll to the target section
    $('html, body').animate({
      scrollTop: offset
    }, 800);

    // Collapse the navbar menu after clicking a dropdown item
    $(".navbar-collapse").collapse('hide');
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Toggle visibility of the search bar
  document.getElementById("searchButton").addEventListener("click", function () {
    const searchBar = document.getElementById("search-bar");
    searchBar.classList.toggle("hidden");
  });

  const searchInput = document.getElementById('searchInput');
  const suggestions = document.getElementById('suggestions');
  const cards = {

    // 1 Semester Subjects
    'em-1-card': 'Essential Mathematics I',
    'es-card': 'Applied Physics',
    'fee-card': 'Intro to Electronics Engineering',
    'fcb-card': 'Introduction to Internet of Things',
    'lws-card': '1 Credit Courses-1',
    'lpcc-card': 'POP Using C',

    // 2 Semester Subjects
    'dsa-card': 'Introduction to C++',
    'dld-card': 'Intro to Electrical Engineering',
    'em-2-card': 'Essential Mathematics II',
    'entrepreneur-card': '1 Credit Courses-2',
    'oop-card': 'Applied Chemistry',
    'pds-card': 'CAED',

    // 3 Semester Subjects
    'ada-card': 'Data Structure and its Applications',
    'coa-card': 'Computer Organization and Architecture',
    'dbms-card': 'Electives(DMD,Web3,Python)',
    'ds-card': 'Essential Maths 3',
    'ps-card': '1 Credit Courses-3',
    'ipr-card': 'Object Oriented Programming',

    // 4 Semester Subjects
    'ai-card': 'Operating System',
    'cn-card': 'Discrete Maths',
    'dv-card': 'DBMS',
    'os-card': 'Electives(SDS,ADS,EH)',
    'rds-card': 'Design and Analysis of Algorithms',
    'toc-card': '1 Credit Courses-4',

    // 5 Semester Subjects
    'cc-card': 'Automata and Compiler Design',
    'cns-card': 'AI and ML',
    'ida-card': 'Computer Networks',
    'nlp-card': 'Professional Elective 1',
    'prml-card': 'Research Methodology and IPR',
    'vt-card': 'Mobile Application Developement Lab',
    // 'ann-card': 'Artificial Neural Networks',
    // 'pma-card': 'Predictive Modelling and Analytics',
    // 'mp5-card': 'Minor Project 5 Sem',

    // // 6 Semester Subjects
    'cc2-card': ' Software Engineering',
    'cns2-card': 'Cloud Computing',
    'ida2-card': 'Deep Learning',
    'nlp2-card': 'Natural Language Processing+IOT',
    'prml2-card': 'Devops',
    'vt2-card': '1 Credit Courses-6',

    // 7 Semester Subjects
    'agt-card': 'Engineering Economics',
    'bda-card': 'Big Data Analytics',
    'dw-card': 'Cyber Security',
    'bia-card': 'Professional Electives-2',
    'isr-card': 'Course end Requirements',
    'mp7-card': 'Major Project'

  };

  let currentFocus = -1;

  searchButton.addEventListener("click", function () {
    searchBar.classList.toggle("hidden");
  });

  searchInput.addEventListener('input', function () {
    const filter = searchInput.value.toLowerCase();
    suggestions.innerHTML = '';

    if (filter) {
      Object.keys(cards).forEach(id => {
        const text = cards[id].toLowerCase();
        if (text.includes(filter)) {
          const listItem = document.createElement('li');
          listItem.classList.add('list-group-item');
          listItem.textContent = cards[id];
          listItem.setAttribute('data-id', id);
          suggestions.appendChild(listItem);
        }
      });
    }
  });

  searchInput.addEventListener('keydown', function (e) {
    let items = suggestions.getElementsByTagName('li');
    if (e.keyCode === 40) {
      // Arrow Down
      currentFocus++;
      addActive(items);
    } else if (e.keyCode === 38) {
      // Arrow Up
      currentFocus--;
      addActive(items);
    } else if (e.keyCode === 13) {
      // Enter
      e.preventDefault();
      if (currentFocus > -1) {
        if (items) items[currentFocus].click();
      }
    }
  });

  function addActive(items) {
    if (!items) return false;
    removeActive(items);
    if (currentFocus >= items.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = items.length - 1;
    items[currentFocus].classList.add('active');
  }

  function removeActive(items) {
    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove('active');
    }
  }

  suggestions.addEventListener('click', function (e) {
    if (e.target && e.target.matches('li.list-group-item')) {
      const id = e.target.getAttribute('data-id');
      const element = document.getElementById(id);
      if (element) {
        let navbarHeight = document.querySelector('.navbar').offsetHeight;

        // Adjust the navbar height based on device width
        if (window.matchMedia("(max-width: 767.98px)").matches) {
          // Mobile devices
          navbarHeight += 25; // Adjust for mobile
        } else if (window.matchMedia("(min-width: 768px) and (max-width: 1199.98px)").matches) {
          // Tablets and small laptops
          navbarHeight += 30; // Adjust for tablets and small laptops
        } else if (window.matchMedia("(min-width: 1200px)").matches) {
          // Large laptops and desktops
          navbarHeight += 30; // Adjust for large laptops and desktops
        }

        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - navbarHeight;

        // Scroll to the adjusted position
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        suggestions.innerHTML = '';
        searchInput.value = '';
      }
    }
  });
});

import { supabase } from './supabase.js'

async function loadNotesForSemester(semester) {
    try {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('semester', semester)
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        const container = document.querySelector(`[data-semester="${semester}"]`);
        if (!container) return;

        if (data.length === 0) {
            container.innerHTML = '<div class="col-12"><p class="text-muted">No notes available for this semester.</p></div>';
            return;
        }

        container.innerHTML = data.map(note => `
            <div class="col-md-4" id="fee-card">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title"><i class="fas fa-file-pdf"></i> ${note.subject_name}</h5>
                        <p class="card-text">Semester ${note.semester} notes</p>
                        <a href="${note.pdf_url}" target="_blank" class="tool-button">
                        <i class="fas fa-download"></i>View Notes</a>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading notes:', error);
    }
}

// Load notes for all semesters
async function initializeSemesterSections() {
    for (let sem = 1; sem <= 8; sem++) {
        await loadNotesForSemester(sem);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeSemesterSections);

// Handle search functionality if needed
// ...existing search code...



function checkAuthStatus() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const username = sessionStorage.getItem('username');
    const authButton = document.getElementById('authButton');
    
    if (isLoggedIn === 'true') {
        authButton.innerHTML = `
            <i class="fas fa-user"></i> ${username} 
            <i class="fas fa-sign-out-alt ml-2"></i>
        `;
        authButton.addEventListener('click', handleLogout);
    } else {
        authButton.innerHTML = `<i class="fas fa-sign-in-alt"></i> Login`;
        authButton.addEventListener('click', () => window.location.href = 'login.html');
    }
}

function handleLogout() {
    sessionStorage.clear();
    window.location.reload();
}

document.addEventListener('DOMContentLoaded', checkAuthStatus);



async function loadPreviousYearQuestions() {
    try {
        const { data, error } = await supabase
            .from('previous_year_questions')
            .select('*')
            .order('semester', { ascending: true });

        if (error) throw error;

        const container = document.getElementById('previous-year-content');
        container.innerHTML = data.map(question => `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${question.subject_name}</h5>
                        <p class="card-text">Semester ${question.semester}</p>
                        <a href="${question.pdf_url}" target="_blank" class="btn btn-primary" style="background-color: #4CAF50">
                            <i class="fas fa-download"></i> View PYQs
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading previous year questions:', error);
    }
}

async function loadQuestionBank() {
    try {
        const { data, error } = await supabase
            .from('question_bank')
            .select('*')
            .order('semester', { ascending: true });

        if (error) throw error;

        const container = document.getElementById('question-bank-content');
        container.innerHTML = data.map(question => `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${question.subject_name}</h5>
                        <p class="card-text">Semester ${question.semester}</p>
                        <a href="${question.pdf_url}" target="_blank" class="btn btn-primary" style="background-color: #4CAF50">
                            <i class="fas fa-download"></i>View QB
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading question bank:', error);
    }
}

// Add to document.addEventListener('DOMContentLoaded', ...)
document.addEventListener('DOMContentLoaded', () => {
    loadPreviousYearQuestions();
    loadQuestionBank();
    // ...existing code...
});