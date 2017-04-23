#!/bin/bash

echo "Running deployment script..."

CURRENT_COMMIT=`git rev-parse HEAD`

npm install typescript@2.2.2 -g

echo "Cloning master branch..."

git clone -b gh-pages "https://${GH_TOKEN}@${GH_REF}" out > /dev/null 2>&1 || exit 1

rm -r out/*

echo "Install excalibur-tiled deps"
cd lib/excalibur-tiled

bower install

cd ..
cd ..

echo "Compiling TSC"

npm run build

echo "Copying built files"
cp -R $(ls | grep -v '^\(out\|lib\|\.vscode\|deploy\.sh\)$') out
mkdir -p out/lib/classnames
mkdir -p out/lib/excalibur-dist
mkdir -p out/lib/excalibur-tiled/dist
mkdir -p out/lib/font-awesome/css
mkdir -p out/lib/font-awesome/fonts
mkdir -p out/lib/storejs
mkdir -p out/lib/zepto

cd lib
cp classnames/ ../out/lib
cp -R excalibur-dist/ ../out/lib
cp -R excalibur-tiled/dist/ ../out/lib/excalibur-tiled
cp font-awesome/css ../out/lib/font-awesome
cp font-awesome/fonts ../out/lib/font-awesome
cp storejs ../out/lib/
cp zepto ../out/lib
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