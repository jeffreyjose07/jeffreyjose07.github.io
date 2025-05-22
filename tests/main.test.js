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

    // Add Newsletter Form Tests
    describe('Newsletter Form', () => {
        test('should allow input in the email field', () => {
            const emailInput = document.getElementById('newsletterEmail');
            expect(emailInput.disabled).toBeFalsy();
            // You could also test if you can set a value
            emailInput.value = 'test@example.com';
            expect(emailInput.value).toBe('test@example.com');
        });

        test('should show success message on simulated valid submission', async () => {
            const form = document.getElementById('newsletterForm');
            const successMessage = document.getElementById('newsletterSuccessMessage');
            const errorMessage = document.getElementById('newsletterErrorMessage');
            const submitButton = form.querySelector('button[type="submit"]');

            // Mock the fetch request to simulate a successful response
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({})
                })
            );

            // Manually trigger the submit event
            form.dispatchEvent(new Event('submit'));

            // Wait for the async handling to complete
            await new Promise(process.nextTick);

            expect(successMessage.style.display).not.toBe('none');
            expect(errorMessage.style.display).toBe('none');
            expect(submitButton.disabled).toBeFalsy(); // Check if button is re-enabled
        });

        test('should show error message on simulated failed submission', async () => {
            const form = document.getElementById('newsletterForm');
            const successMessage = document.getElementById('newsletterSuccessMessage');
            const errorMessage = document.getElementById('newsletterErrorMessage');
            const submitButton = form.querySelector('button[type="submit"]');

            // Mock the fetch request to simulate a failed response
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 400,
                    json: () => Promise.resolve({})
                })
            );

            // Manually trigger the submit event
            form.dispatchEvent(new Event('submit'));

            // Wait for the async handling to complete
            await new Promise(process.nextTick);

            expect(successMessage.style.display).toBe('none');
            expect(errorMessage.style.display).not.toBe('none');
            expect(submitButton.disabled).toBeFalsy(); // Check if button is re-enabled
        });

        test('should show loading state during submission', () => {
            const form = document.getElementById('newsletterForm');
            const submitButton = form.querySelector('button[type="submit"]');
            const btnText = form.querySelector('.btn-text');
            const btnLoader = form.querySelector('.btn-loader');

            // Manually trigger the submit event (will be caught by the event listener)
            form.dispatchEvent(new Event('submit', { cancelable: true }));

            // At this point, the setLoadingState should have been called
            expect(submitButton.disabled).toBe(true);
            // Depending on your implementation, you might check display styles
            // expect(btnText.style.display).toBe('none');
            // expect(btnLoader.style.display).toBe('inline-block');
        });
    });

    // Add Main Contact Form Tests (similar to Quick Contact Form Tests)
    describe('Main Contact Form', () => {
        test('should validate required fields', () => {
            const form = document.getElementById('contactForm');
            const submitButton = form.querySelector('button[type="submit"]');
            
            submitButton.click();
            
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                expect(field.validity.valid).toBeFalsy();
            });
        });

        test('should show success message on simulated valid submission', async () => {
            const form = document.getElementById('contactForm');
            const nameInput = form.querySelector('#name');
            const emailInput = form.querySelector('#email');
            const subjectInput = form.querySelector('#subject');
            const messageInput = form.querySelector('#message');
            
            nameInput.value = 'Test User';
            emailInput.value = 'test@example.com';
            subjectInput.value = 'Test Subject';
            messageInput.value = 'Test message';

            const successMessage = document.getElementById('successMessage');
            const errorMessage = document.getElementById('errorMessage');
            const submitButton = form.querySelector('button[type="submit"]');

            // Mock the fetch request
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({})
                })
            );

            // Manually trigger the submit event
            form.dispatchEvent(new Event('submit'));

            // Wait for the async handling to complete
            await new Promise(process.nextTick);

            expect(successMessage.style.display).not.toBe('none');
            expect(errorMessage.style.display).toBe('none');
            expect(submitButton.disabled).toBeFalsy();
        });

        test('should show error message on simulated failed submission', async () => {
            const form = document.getElementById('contactForm');
            const nameInput = form.querySelector('#name');
            const emailInput = form.querySelector('#email');
            const subjectInput = form.querySelector('#subject');
            const messageInput = form.querySelector('#message');
            
            nameInput.value = 'Test User';
            emailInput.value = 'test@example.com';
            subjectInput.value = 'Test Subject';
            messageInput.value = 'Test message';

            const successMessage = document.getElementById('successMessage');
            const errorMessage = document.getElementById('errorMessage');
            const submitButton = form.querySelector('button[type="submit"]');

            // Mock the fetch request
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 400,
                    json: () => Promise.resolve({})
                })
            );

            // Manually trigger the submit event
            form.dispatchEvent(new Event('submit'));

            // Wait for the async handling to complete
            await new Promise(process.nextTick);

            expect(successMessage.style.display).toBe('none');
            expect(errorMessage.style.display).not.toBe('none');
            expect(submitButton.disabled).toBeFalsy();
        });

        test('should show loading state during submission', () => {
            const form = document.getElementById('contactForm');
            const submitButton = form.querySelector('button[type="submit"]');
            const btnText = form.querySelector('.btn-text');
            const btnLoader = form.querySelector('.btn-loader');

            // Manually trigger the submit event
            form.dispatchEvent(new Event('submit', { cancelable: true }));

            // At this point, the setLoadingState should have been called
            expect(submitButton.disabled).toBe(true);
            // Depending on your implementation, you might check display styles
            // expect(btnText.style.display).toBe('none');
            // expect(btnLoader.style.display).toBe('inline-block');
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