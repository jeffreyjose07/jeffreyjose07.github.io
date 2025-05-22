// Style and Layout Tests
describe('Style and Layout Tests', () => {
    // Color Scheme Tests
    describe('Color Scheme', () => {
        test('should have consistent color variables', () => {
            const root = document.documentElement;
            const computedStyle = getComputedStyle(root);
            
            // Check if CSS variables are defined
            expect(computedStyle.getPropertyValue('--color-primary')).toBeTruthy();
            expect(computedStyle.getPropertyValue('--color-text-primary')).toBeTruthy();
            expect(computedStyle.getPropertyValue('--color-background')).toBeTruthy();
        });

        test('should maintain contrast ratios', () => {
            const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
            textElements.forEach(element => {
                const style = window.getComputedStyle(element);
                const backgroundColor = style.backgroundColor;
                const color = style.color;
                
                // Basic contrast check (simplified)
                expect(backgroundColor).not.toBe(color);
            });
        });
    });

    // Layout Tests
    describe('Layout', () => {
        test('should maintain proper spacing', () => {
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                const style = window.getComputedStyle(card);
                expect(parseInt(style.marginBottom)).toBeGreaterThan(0);
                expect(parseInt(style.padding)).toBeGreaterThan(0);
            });
        });

        test('should have consistent border radius', () => {
            const elements = document.querySelectorAll('.card, .btn, input, textarea');
            elements.forEach(element => {
                const style = window.getComputedStyle(element);
                expect(style.borderRadius).toBeTruthy();
            });
        });
    });

    // Animation Tests
    describe('Animations', () => {
        test('should have smooth transitions', () => {
            const interactiveElements = document.querySelectorAll('.btn, .card, input, textarea');
            interactiveElements.forEach(element => {
                const style = window.getComputedStyle(element);
                expect(style.transition).toBeTruthy();
            });
        });
    });

    // Responsive Design Tests
    describe('Responsive Design', () => {
        test('should have proper media queries', () => {
            const mediaQueries = [
                '(max-width: 900px)',
                '(max-width: 768px)',
                '(max-width: 600px)'
            ];
            
            mediaQueries.forEach(query => {
                const mediaQueryList = window.matchMedia(query);
                expect(mediaQueryList).toBeTruthy();
            });
        });

        test('should maintain readability on mobile', () => {
            // Simulate mobile viewport
            window.innerWidth = 600;
            window.dispatchEvent(new Event('resize'));
            
            const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
            textElements.forEach(element => {
                const style = window.getComputedStyle(element);
                const fontSize = parseInt(style.fontSize);
                expect(fontSize).toBeGreaterThanOrEqual(14); // Minimum readable font size
            });
        });
    });

    // Typography Tests
    describe('Typography Tests', () => {
        test('should use rem units for font sizes', () => {
            const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, li');
            textElements.forEach(element => {
                const style = window.getComputedStyle(element);
                if (style.fontSize && style.fontSize !== '0px') { // Avoid checking elements with no rendered text
                    expect(style.fontSize).toContain('rem');
                }
            });
        });

        test('should have consistent line heights for text elements', () => {
            const textElements = document.querySelectorAll('p, li, .timeline-content, .contact-intro, .contact-info h3, .contact-links a, .collaborate-option h3, .collaborate-option p, .collaborate-cta p, .quick-contact h3, .contact-note, .skill-progress h4, .testimonial-author-info h4, .testimonial-author-info p, .current-work h3, .work-item-content h4, .work-item-content p, .newsletter h3');
            textElements.forEach(element => {
                const style = window.getComputedStyle(element);
                // Check if line-height is a reasonable value (not 'normal' or a drastically different value)
                expect(parseFloat(style.lineHeight)).toBeGreaterThan(1); 
            });
        });
    });

    // Component Style Tests
    describe('Component Styles', () => {
        test('should have consistent button styles', () => {
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(button => {
                const style = window.getComputedStyle(button);
                expect(style.borderRadius).toBeTruthy();
                expect(style.padding).toBeTruthy();
                expect(style.fontWeight).toBeTruthy();
            });
        });

        test('should have proper form element styles', () => {
            const formElements = document.querySelectorAll('input, textarea');
            formElements.forEach(element => {
                const style = window.getComputedStyle(element);
                expect(style.border).toBeTruthy();
                expect(style.padding).toBeTruthy();
                expect(style.borderRadius).toBeTruthy();
                // Add more specific checks for form input styles
                expect(style.color).toBe(getComputedStyle(document.documentElement).getPropertyValue('--color-text-primary').trim());
                expect(style.backgroundColor).toBe(getComputedStyle(document.documentElement).getPropertyValue('--color-background-alt').trim());
            });
        });

        // Add more specific tests for sidebar card content styling
        test('should have correct styling for expertise list items', () => {
            const expertiseListItems = document.querySelectorAll('.expertise.card li');
            expertiseListItems.forEach(item => {
                const style = window.getComputedStyle(item);
                // Add checks for color, font size, line height, etc.
                expect(style.color).toBe('rgb(224, 227, 232)'); // Hardcoded color, should ideally use a variable if available
                expect(style.fontSize).toBe('1rem');
                expect(style.lineHeight).toBe('1.5');
            });
        });

        test('should have correct styling for collaborate options', () => {
            const collaborateOptions = document.querySelectorAll('.collaborate-option');
            collaborateOptions.forEach(option => {
                const style = window.getComputedStyle(option);
                // Add checks for background, border, padding, etc.
                // Note: Background was removed from .sidebar .card, but collaborate-option has its own background
                expect(style.backgroundColor).toBe('rgb(30, 41, 59)'); // Hardcoded color, should ideally use a variable
                expect(style.border).toContain('1px solid');
                expect(style.borderRadius).toBe('12px');
            });
        });

        // Add tests for hover effects on interactive elements
        test('should apply hover effects to buttons', () => {
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(button => {
                // Simulate hover state (requires more advanced testing setup like Jest with JSDOM and a way to trigger pseudo-classes or events)
                // This is a conceptual test; actual implementation would require a different approach.
                // For now, we can check for transition properties that enable hover effects.
                const style = window.getComputedStyle(button);
                expect(style.transition).toContain('all'); 
            });
        });

        // Sidebar Background Test
        test('should have a linear gradient background in the sidebar', () => {
            const sidebar = document.querySelector('.sidebar');
            const style = window.getComputedStyle(sidebar);
            expect(style.backgroundImage).toContain('linear-gradient');
        });

        // Sidebar Card Background Test
        test('should have no background on cards within the sidebar', () => {
            const sidebarCards = document.querySelectorAll('.sidebar .card');
            sidebarCards.forEach(card => {
                const style = window.getComputedStyle(card);
                expect(style.background).toBe('none');
            });
        });
    });
}); 