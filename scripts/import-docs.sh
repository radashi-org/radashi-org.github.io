set -e
export PATH="$PWD/scripts/node_modules/sucrase/bin:$PATH"

if [ -d radashi ]; then
  rm -rf radashi
fi

git clone https://github.com/radashi-org/radashi --depth 1
mkdir -p src/content/docs/reference/

# Find all scripts in ./scripts/ that start with "render-"
render_scripts=$(find ./scripts -name "render-*.ts")

# Run each script
for script in $render_scripts; do
  echo "Running $script"
  sucrase-node "$script"
done

cd radashi/docs
cp -r * ../../src/content/docs/reference

cd ../..
rm -rf radashi
