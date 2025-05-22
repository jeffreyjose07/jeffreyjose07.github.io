// Main website functionality tests
describe('Website Functionality Tests', () => {
    // Theme Toggle Tests
    describe('Theme Toggle', () => {
        test('should toggle between light and dark themes', () => {
            const themeToggle = document.getElementById('themeToggle');
            const initialTheme = document.documentElement.getAttribute('data-theme');
            
            themeToggle.click();
            const newTheme = document.documentElement.getAttribute('data-theme');
            
            expect(newTheme).not.toBe(initialTheme);
        });
    });

    // Navigation Tests
    describe('Navigation', () => {
        test('should have working navigation links', () => {
            const navLinks = document.querySelectorAll('.hero-nav a');
            navLinks.forEach(link => {
                expect(link.getAttribute('href')).toBeTruthy();
            });
        });
    });

    // Contact Form Tests
    describe('Contact Form', () => {
        test('should validate required fields', () => {
            const form = document.getElementById('quickContactForm');
            const submitButton = form.querySelector('button[type="submit"]');
            
            submitButton.click();
            
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                expect(field.validity.valid).toBeFalsy();
            });
        });

        test('should show success message on valid submission', () => {
            const form = document.getElementById('quickContactForm');
            const nameInput = form.querySelector('#quickName');
            const emailInput = form.querySelector('#quickEmail');
            const messageInput = form.querySelector('#quickMessage');
            
            nameInput.value = 'Test User';
            emailInput.value = 'test@example.com';
            messageInput.value = 'Test message';
            
            form.submit();
            
            const successMessage = document.getElementById('quickSuccessMessage');
            expect(successMessage.style.display).not.toBe('none');
        });
    });

    // Responsive Design Tests
    describe('Responsive Design', () => {
        test('should adapt layout for mobile view', () => {
            // Simulate mobile viewport
            window.innerWidth = 600;
            window.dispatchEvent(new Event('resize'));
            
            const sidebar = document.querySelector('.sidebar');
            expect(sidebar.style.width).toBe('100%');
        });
    });

    // Accessibility Tests
    describe('Accessibility', () => {
        test('should have proper ARIA labels', () => {
            const interactiveElements = document.querySelectorAll('button, a, input');
            interactiveElements.forEach(element => {
                if (!element.getAttribute('aria-label')) {
                    expect(element.textContent).toBeTruthy();
                }
            });
        });

        test('should maintain proper heading hierarchy', () => {
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            let previousLevel = 0;
            
            headings.forEach(heading => {
                const currentLevel = parseInt(heading.tagName[1]);
                expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
                previousLevel = currentLevel;
            });
        });
    });
}); 