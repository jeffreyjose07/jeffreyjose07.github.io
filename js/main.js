// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    once: true
});

// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
        });
    }

    // Form Submission Handling
    const contactForm = document.getElementById('quickContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const successMessage = document.getElementById('quickSuccessMessage');
            const errorMessage = document.getElementById('quickErrorMessage');

            try {
                submitButton.disabled = true;
                submitButton.querySelector('.btn-text').style.display = 'none';
                submitButton.querySelector('.btn-loader').style.display = 'block';

                // Simulate form submission (replace with actual form submission)
                await new Promise(resolve => setTimeout(resolve, 1000));

                successMessage.style.display = 'block';
                errorMessage.style.display = 'none';
                contactForm.reset();
            } catch (error) {
                successMessage.style.display = 'none';
                errorMessage.style.display = 'block';
            } finally {
                submitButton.disabled = false;
                submitButton.querySelector('.btn-text').style.display = 'block';
                submitButton.querySelector('.btn-loader').style.display = 'none';
            }
        });
    }
});

// Theme Management
const ThemeManager = {
    init() {
        this.themeToggle = document.getElementById('themeToggle');
        this.html = document.documentElement;
        this.setupEventListeners();
        this.loadSavedTheme();
    },

    setupEventListeners() {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    },

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.html.setAttribute('data-theme', savedTheme);
        }
    },

    toggleTheme() {
        const currentTheme = this.html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }
};

// Form Handling
const FormManager = {
    init() {
        this.initQuickContactForm();
        this.initMainContactForm();
    },

    initQuickContactForm() {
        const form = document.getElementById('quickContactForm');
        if (!form) return;

        const elements = {
            form,
            successMessage: document.getElementById('quickSuccessMessage'),
            errorMessage: document.getElementById('quickErrorMessage'),
            submitButton: form.querySelector('button[type="submit"]'),
            btnText: form.querySelector('.btn-text'),
            btnLoader: form.querySelector('.btn-loader')
        };

        form.addEventListener('submit', (e) => this.handleFormSubmit(e, elements));
    },

    initMainContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const elements = {
            form,
            successMessage: document.getElementById('successMessage'),
            errorMessage: document.getElementById('errorMessage'),
            submitButton: form.querySelector('button[type="submit"]'),
            btnText: form.querySelector('.btn-text'),
            btnLoader: form.querySelector('.btn-loader')
        };

        form.addEventListener('submit', (e) => this.handleFormSubmit(e, elements));
    },

    async handleFormSubmit(e, elements) {
        e.preventDefault();
        const { form, successMessage, errorMessage, submitButton, btnText, btnLoader } = elements;

        try {
            this.setLoadingState(submitButton, btnText, btnLoader);
            const response = await this.submitForm(form);
            this.handleSuccess(form, successMessage, errorMessage);
        } catch (error) {
            this.handleError(successMessage, errorMessage);
        } finally {
            this.resetLoadingState(submitButton, btnText, btnLoader);
        }
    },

    setLoadingState(submitButton, btnText, btnLoader) {
        submitButton.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
    },

    resetLoadingState(submitButton, btnText, btnLoader) {
        submitButton.disabled = false;
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
    },

    async submitForm(form) {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Form submission failed');
        }

        return response;
    },

    handleSuccess(form, successMessage, errorMessage) {
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        form.reset();
    },

    handleError(successMessage, errorMessage) {
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
    }
};

// Scroll Management
const ScrollManager = {
    init() {
        this.setupSmoothScroll();
        this.setupScrollAnimations();
    },

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleSmoothScroll(e, anchor));
        });
    },

    handleSmoothScroll(e, anchor) {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    setupScrollAnimations() {
        const cards = document.querySelectorAll('.card');
        const observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            { threshold: 0.1 }
        );

        cards.forEach(card => observer.observe(card));
    },

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                entry.target.observer?.unobserve(entry.target);
            }
        });
    }
};

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    FormManager.init();
    ScrollManager.init();
}); 