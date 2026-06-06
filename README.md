# Jacob's Portfolio Website

[![Site Status](https://img.shields.io/website?url=https%3A%2F%2Fjacobmish.com&up_message=live&up_color=brightgreen&down_message=down&down_color=red&label=site&logo=cloudflare)](https://jacobmish.com)

## Description

A modern, responsive portfolio website built with React, TypeScript, and Vite. This website showcases my projects, experience, and skills as a developer.

## Features

- **Home**: Introduction and welcome section
- **About**: Personal bio and background information
- **Experience**: Professional work history and skills
- **Projects**: Showcase of past and current projects
- **Publications**: List of published works
- **Contact**: Ways to get in touch
- **Responsive Design**: Optimized for all device sizes

## Technologies Used

- React 18
- TypeScript
- Vite
- Framer Motion (for animations)
- React Icons

## Getting Started

### Prerequisites

- Node.js (latest stable version recommended)
- [pnpm](https://pnpm.io/) (used for dependency management for better safety and performance)

If you don't have pnpm installed, you can install it with Homebrew:

```bash
brew install pnpm
```

### Installation

1. Clone the repository

```bash
git clone https://github.com/feromond/jacobs-portfolio-v2.git
cd jacobs-portfolio-v2
```

2. Install dependencies

```bash
pnpm install
```

3. Start the development server

```bash
pnpm dev
```

### Building for Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

## Deployment

This website is deployed on Cloudflare Workers (Static Assets) with continuous deployment from the main branch.

## Project Structure

```
jacobs-portfolio-v2/
├── public/             # Static assets and favicon
├── src/
│   ├── assets/         # Images and other assets
│   ├── components/     # React components
│   │   ├── core/       # Core UI components
│   │   └── features/   # Feature components (navbar, home, about, etc.)
│   ├── library/        # Utility functions and helpers
│   ├── App.tsx         # Main application component
│   ├── global.css      # Global styles
│   └── main.tsx        # Application entry point
├── index.html          # HTML template
└── package.json        # Project dependencies and scripts
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Jacob Mish

- 🌐 Portfolio: [jacobmish.com](https://jacobmish.com)
- 📧 Email: [jacobpmish@gmail.com](mailto:jacobpmish@gmail.com)
- 💼 LinkedIn: [Jacob Mish](https://www.linkedin.com/in/jacob-mish/)
