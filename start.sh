set -e
cd "$(dirname "$0")"

rm -rf ./dist/trial/

node "index.js" '../source'
