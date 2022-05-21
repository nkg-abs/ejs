set -e
cd "$(dirname "$0")"

rm -rf ../trial/

node "index.js" '../source'
