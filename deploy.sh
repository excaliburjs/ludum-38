#!/bin/bash

echo "Running deployment script..."

CURRENT_COMMIT=`git rev-parse HEAD`

npm install typescript@2.2.2 -g

echo "Cloning master branch..."

git clone -b gh-pages "https://${GH_TOKEN}@${GH_REF}" out > /dev/null 2>&1 || exit 1

rm -r out/*

echo "Compiling TSC"

npm run build

echo "Install excalibur-tiled deps"
cd lib/excalibur-tiled

bower install

cd ..
cd ..

echo "Copying built files"
cp -R $(ls | grep -v '^\(out\|lib\|\.vscode\|deploy\.sh\)$') out
mkdir out/lib
cd lib
cp -R excalibur-dist/ ../out/lib
cp -R excalibur-tiled/dist/ ../out/lib
cd ..
cd out

echo "Setting commit number ${CURRENT_COMMIT}"
sed -i "s/COMMIT_NUMBER/${CURRENT_COMMIT}/g" ./index.html

echo "Committing and pushing to GH"
git config user.name "Travis-CI"
git config user.email "travis@excaliburjs.com"
git add -A
git commit --allow-empty -m "Deploying game for $CURRENT_COMMIT" || exit 1
git push origin gh-pages > /dev/null 2>&1 || exit 1

echo "Pushed deployment successfully"
exit 0