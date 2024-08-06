#!/bin/bash
set -e

cd dist
git init
git remote add origin https://github.com/radashi-org/radashi-org.github.io
git add -A
git commit -m "chore: update docs"
git push origin $(git rev-parse --abbrev-ref HEAD):gh-pages -f
