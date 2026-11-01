# sixharmony.net

- `site/` is the live website. Netlify publishes this folder (see `netlify.toml`).
- `builder/` holds the Python scripts that generate the pages in `site/`. Run `bash builder/build.sh` after editing them.
- Secrets (like the Lumina token) never go in this repo. They live in Netlify's environment variables.
