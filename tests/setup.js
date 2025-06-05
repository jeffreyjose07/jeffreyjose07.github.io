// Test setup file
beforeAll(() => {
    // Set up any global test environment
    document.body.innerHTML = `
        <div id="themeToggle"></div>
        <div class="hero-nav">
            <a href="#about">About</a>
            <a href="#experience">Experience</a>
            <a href="#contact">Contact</a>
        </div>
        <form id="quickContactForm">
            <input type="text" id="quickName" required>
            <input type="email" id="quickEmail" required>
            <textarea id="quickMessage" required></textarea>
            <button type="submit">Send</button>
        </form>
        <div id="quickSuccessMessage" style="display: none;"></div>
        <div class="sidebar" style="width:100%;"></div>
    `;
});

afterEach(() => {
    // Reset any changes made during tests
    document.documentElement.setAttribute('data-theme', 'dark');
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
}); 