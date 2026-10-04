#!/bin/zsh
cd "$(dirname "$0")"
export PATH="$HOME/.local/node22/bin:$PATH"
[ -d node_modules ] || npm install
(sleep 2 && open http://localhost:5180) &
npx vite --port 5180
