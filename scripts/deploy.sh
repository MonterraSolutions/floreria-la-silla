#!/bin/sh
# Compila y publica dist/ en la rama gh-pages (GitHub Pages).
set -e
npm run build
cd dist
touch .nojekyll
git init -q -b gh-pages
git add -A
git commit -q -m "Publicar sitio"
git push -q -f "$(cd .. && git remote get-url origin)" gh-pages
rm -rf .git
echo "Publicado: https://monterrasolutions.github.io/floreria-la-silla/"
