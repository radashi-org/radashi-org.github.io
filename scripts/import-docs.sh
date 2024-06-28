set -e
export PATH="$PWD/node_modules/sucrase/bin:$PATH"

if [ -d radashi ]; then
  rm -rf radashi
fi

git clone https://github.com/radashi-org/radashi --depth 1
mkdir -p src/content/docs/reference/

sucrase-node scripts/generate-big-page.ts

cd radashi/docs
cp -r * ../../src/content/docs/reference

cd ../..
rm -rf radashi
