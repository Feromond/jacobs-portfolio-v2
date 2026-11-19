# Jacob Mish’s portfolio

[![Site Status](https://img.shields.io/website?url=https%3A%2F%2Fjacobmish.com&up_message=live&up_color=brightgreen&down_message=down&down_color=red&label=site&logo=cloudflare)](https://jacobmish.com)

I built this portfolio with React, TypeScript, Vite, and plain CSS. Browse my projects, experience, and research, or try [JacobOS](https://jacobmish.com/os). On the desktop, click the seismic wallpaper to start a quake or type `help` in the terminal.

## Run locally

You’ll need Node.js and pnpm. On macOS, you can get pnpm with `brew install pnpm`.

```sh
git clone https://github.com/feromond/jacobs-portfolio-v2.git
cd jacobs-portfolio-v2
pnpm install
pnpm dev
```

To preview a production build, run `pnpm build` then `pnpm preview`. The build goes in `dist/`. Cloudflare Workers deploys from `main`.

## Update the portfolio

The site and JacobOS share [src/library/data.ts](src/library/data.ts).

- Add jobs to `experienceEntries`. Use `YYYY-MM` dates and `to: null` for a current role. The timeline handles sorting and durations.
- Add app tours to `featuredProjects`. The first gets the largest tile. Choose `fern` or `ledger` for its colour palette.
- Add other projects to `projects` with a year and category. Set `ventra: true` to include one on the Ventra Software card. Put older work in `archivedProjects`.
- Add papers and talks to `publicationEntries` and edit `skillGroups` for the toolkit.
- Import WebP images from `src/assets/img/` in `data.ts`. To update the résumé, replace `src/assets/Jacob_Mish_Resume.pdf`.

## Design history

[See earlier designs and run the 2024 version locally.](docs/design-history/README.md)

## Contact

[Email Jacob](mailto:jacobpmish@gmail.com) · [LinkedIn](https://www.linkedin.com/in/jacob-mish/)

## License

[MIT](LICENSE)
