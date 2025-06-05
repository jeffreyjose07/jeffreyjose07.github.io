# Website Tests

This directory contains tests for the personal website. The tests are organized into different categories to ensure the website's functionality, styling, and accessibility.

## Test Categories

1. **Main Functionality Tests** (`main.test.js`)
   - Theme toggle functionality
   - Navigation
   - Contact form validation
   - Responsive design
   - Accessibility

2. **Style and Layout Tests** (`style.test.js`)
   - Color scheme consistency
   - Layout spacing
   - Animations and transitions
   - Responsive design
   - Component styles

## Running Tests

To run the tests, you'll need to:

1. Install the required dependencies:
   ```bash
   npm install --save-dev jest @testing-library/jest-dom
   ```

2. Add the following to your `package.json`:
   ```json
   {
     "scripts": {
       "test": "jest"
     },
     "jest": {
       "setupFilesAfterEnv": ["./tests/setup.js"]
     }
   }
   ```

3. Run the tests:
   ```bash
   npm test
   ```

## Test Structure

- `setup.js`: Contains test environment setup and mocks
- `main.test.js`: Tests for main website functionality
- `style.test.js`: Tests for styling and layout

## Writing New Tests

When adding new tests:

1. Follow the existing test structure
2. Use descriptive test names
3. Group related tests using `describe` blocks
4. Include both positive and negative test cases
5. Test for accessibility and responsive design

## Best Practices

- Keep tests focused and atomic
- Use meaningful assertions
- Clean up after tests
- Mock external dependencies
- Test both success and failure cases 
