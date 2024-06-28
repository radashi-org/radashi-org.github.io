set -e

git clone https://github.com/radashi-org/radashi --depth 1
mkdir -p src/content/docs/reference/

cd radashi/docs
cp -r * ../../src/content/docs/reference

cd ../..
rm -rf radashi
