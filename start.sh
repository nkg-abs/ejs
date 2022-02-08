set -e
cd "$(dirname "$0")"

cd "./dist"
rm -rf trial
cd "../"
node "index.js"
