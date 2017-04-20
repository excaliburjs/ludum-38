#!/bin/bash

echo "Running deployment script..."

CURRENT_COMMIT=`git rev-parse HEAD`

npm install typescript@2.2.2 -g

echo "Cloning master branch..."

git clone -b master "https://${GH_TOKEN}@${GH_REF}" out > /dev/null 2>&1 || exit 1

cd out
git fetch origin gh-pages

echo "Compiling TSC"

npm run build

echo "Setting commit number ${CURRENT_COMMIT}"
sed -i "s/COMMIT_NUMBER/${CURRENT_COMMIT}/g" ./index.html

echo "Building new .gitignore"
rm .gitignore
echo "node_modules/" > .gitignore
echo "**.ts" >> .gitignore
echo "**.yml" >> .gitignore
cat .gitignore

echo "Committing and pushing to GH"
git config user.name "Travis-CI"
git config user.email "travis@excaliburjs.com"
git add -A
git commit --allow-empty -m "Deploying game for $CURRENT_COMMIT" || exit 1
git checkout gh-pages
git merge master --squash 
git push origin gh-pages > /dev/null 2>&1 || exit 1

echo "Pushed deployment successfully"
exit 0