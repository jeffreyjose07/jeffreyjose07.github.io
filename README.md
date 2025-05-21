# Jeffrey Jose — Personal Website

This is a simple, modern personal website for Jeffrey Jose, built as a static site for easy deployment on GitHub Pages.

## Features
- Responsive design
- Sections: About, Experience, Education, Skills, Contact

## How to Deploy to GitHub Pages

1. **Create a new GitHub repository** (e.g., `jeffrey-jose.github.io`).
2. **Push your site files** (all contents of this folder) to the repository.
3. On GitHub, go to Settings → Pages, and set the source branch to `main` (or `master`) and the root folder (`/`).
4. Your site will be live at `https://<your-github-username>.github.io/`.

## Customization
- Update `index.html` with your real experience, education, and contact details.
- Update `style.css` for further styling tweaks.

## License
MIT License.

## Further Improvements and Configuration

*   **Activate Contact Forms:** The contact forms in `index.html` (Quick Contact and Main Contact) use Formspree. To make them functional, you need to:
    1.  Create an account on [Formspree.io](https://formspree.io/).
    2.  Create new forms for your website in your Formspree dashboard.
    3.  Replace the placeholder `YOUR_FORM_ID` in the `action` attribute of the `<form>` tags in `index.html` with your actual Formspree form IDs. Look for the `<!-- TODO: ... -->` comments in `index.html` for guidance.
*   **Upload Your Resume:** The "Download Resume" button currently links to a placeholder. To make it work:
    1.  Add your resume file (e.g., `resume.pdf`) to the root directory of this repository.
    2.  If your file is named differently, update the `href` attribute in the link `<a href="#resume-placeholder" class="btn btn-secondary">Download Resume</a>` in `index.html` to point to the correct file name (e.g., `href="your-resume-filename.pdf"`). You might also want to re-add the `download` attribute to the link if you are linking directly to a PDF file.
*   **Optimize Images:** Review the images in the `images/` directory. Consider optimizing them (compressing without significant quality loss) to improve website loading speed. Tools like TinyPNG or ImageOptim can be helpful.
*   **Review Semantic HTML:** The `index.html` file uses various HTML5 tags. For continued best practice, periodically review if more specific semantic tags (e.g., `<article>`, `<nav>`, `<figure>`, `<figcaption>`) could be used to further improve the structure and accessibility of your content.
*   **Newsletter Form:** The newsletter subscription form in `index.html` is a basic HTML structure. To make it functional, you'll need to integrate it with a newsletter service (e.g., Mailchimp, Sendinblue, or even a custom backend/Formspree if it supports it). Update the `<form>` tag's `action` attribute and input field names accordingly.
