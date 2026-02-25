/* ==========================================================================
   Main Interaction Logic
   ========================================================================== */

// Función para inyectar datos del JSON en el HTML
function renderCVData() {
    // ---- Profile ----
    document.getElementById('profile-name').textContent = cvData.profile.name;
    document.getElementById('footer-name').textContent = cvData.profile.name;
    document.getElementById('profile-role').textContent = cvData.profile.role;
    document.getElementById('profile-focus').textContent = cvData.profile.focus;
    document.getElementById('profile-bio').textContent = cvData.profile.bio;

    const linksContainer = document.getElementById('profile-links');
    linksContainer.innerHTML = `
        <a href="mailto:${cvData.profile.email}" class="btn btn-primary">
            <i class="fa-solid fa-envelope"></i> Contactar
        </a>
        <a href="${cvData.profile.linkedin}" target="_blank" class="btn btn-icon" title="LinkedIn">
            <i class="fa-brands fa-linkedin-in"></i>
        </a>
        <a href="${cvData.profile.github}" target="_blank" class="btn btn-icon" title="GitHub">
            <i class="fa-brands fa-github"></i>
        </a>
    `;

    // ---- Skills ----
    const renderTags = (skills, containerId) => {
        const container = document.getElementById(containerId);
        container.innerHTML = skills.map(skill => `<span class="tech-tag">${skill}</span>`).join('');
    };
    renderTags(cvData.skills.backend, 'skills-backend');
    renderTags(cvData.skills.frontend, 'skills-frontend');

    // ---- Education ----
    const eduContainer = document.getElementById('education-list');
    eduContainer.innerHTML = cvData.education.map(edu => `
        <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <div class="timeline-date">${edu.period}</div>
                <h3 class="timeline-title">${edu.title}</h3>
                <div class="timeline-subtitle">${edu.institution}</div>
                <p class="timeline-text">${edu.description}</p>
            </div>
        </div>
    `).join('');

    // ---- Courses ----
    const coursesContainer = document.getElementById('courses-list');
    coursesContainer.innerHTML = cvData.courses.map(course => `
        <li class="list-card">
            <div class="list-card-icon"><i class="${course.icon}"></i></div>
            <div class="list-card-info">
                <h4>${course.title}</h4>
                <span>${course.institution} • ${course.year}</span>
            </div>
        </li>
    `).join('');

    // ---- Languages ----
    const langContainer = document.getElementById('languages-list');
    langContainer.innerHTML = cvData.languages.map(lang => `
        <div class="lang-item">
            <div class="lang-info">
                <span class="lang-name">${lang.name}</span>
                <span class="lang-level">${lang.level}</span>
            </div>
            <div class="progress-bar"><div class="progress" style="width: ${lang.percentage}%;"></div></div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    // 0. Render CV Data from data.js
    renderCVData();

    // 1. Update Current Year in Footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // 2. Intersection Observer for Scroll Animations
    // Elements with these classes will be animated when they enter the viewport
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up');

    // Observer Options
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the 'visible' class to trigger CSS animations
                entry.target.classList.add('visible');

                // If it's the languages section, animate the progress bars
                if (entry.target.id === 'languages') {
                    animateProgressBars();
                }

                // Unobserve after animating to only play once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => scrollObserver.observe(el));

    // 3. Animate Language Progress Bars
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress');
        progressBars.forEach(bar => {
            // Read the target width from inline style and re-apply to trigger transition
            const targetWidth = bar.style.width;
            bar.style.width = '0%';

            // Force a reflow
            void bar.offsetWidth;

            // Set the transition and final width
            bar.style.transition = 'width 1s cubic-bezier(0.4, 0, 0.2, 1) 0.3s';
            bar.style.width = targetWidth;
        });
    }

    // 4. Smooth Scrolling for Internal Links (if any anchors are added later)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Add Hover Effect to Cards that follows mouse (Optional Premium Effect)
    const cards = document.querySelectorAll('.glass-panel');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});
