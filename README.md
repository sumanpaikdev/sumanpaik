# Suman Paik — Writer Portfolio

A responsive, static portfolio built with vanilla HTML, CSS, and JavaScript. It can be hosted on GitHub Pages.

## Edit your information

Open `data.js`. This is the main content file.

- `profile`: name, role, location, statement, bio, email, profile image, social links, and rotating `navbarMessages`.
- `projects`: each film's title, type, year, copyright/registration information, poster, logline, genre, themes, and synopsis.

To add a film, copy one project object inside the `projects` array, give it a unique `slug`, and fill in its fields. The homepage card and project detail page are generated automatically.

## Add images

Create an `assets` folder and add your images. Then set paths in `data.js`, for example:

- `avatar: "assets/suman-paik.jpg"`
- `poster: "assets/danavaa-poster.jpg"`

Use JPG, PNG, or WebP. Keep poster images reasonably optimized for the web.

## Test locally

Open `index.html` in a browser. For the most reliable local preview, use a simple local web server or VS Code Live Server.

## Publish on GitHub Pages

1. Create a GitHub repository, for example `suman-paik-portfolio`.
2. Upload all files and folders from this project.
3. Open the repository's **Settings → Pages**.
4. Under build and deployment, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
5. Wait for GitHub Pages to publish the site. The address will appear in Pages settings.

The site uses a query-string project URL (`film.html?slug=danavaa`) so it works on GitHub Pages without server-side routing.

## Important

- This is a static site. Do not put private screenplay pages, passwords, or confidential material in `data.js`; public site files can be viewed by visitors.
- The registration/copyright fields display the information you enter. They do not independently verify legal ownership or registration.


## Navbar message rotation

Edit `profile.navbarMessages` in `data.js` to change the short messages shown one at a time on the left side of the top navbar. The theme icon sits on the right. Social profile buttons remain in the contact section.
