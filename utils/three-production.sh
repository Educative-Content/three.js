mkdir output
git clone https://github.com/webaverse/three output
npm pack . --pack-destination output
cd output
rm -rf $(find . -type f -name "output*.tgz")
ls -l
tar -xvzf $(find . -type f -name "*.tgz")
cp -r package/* .
rm -rf package 
rm -rf $(find . -type f -name "*.tgz")
output=$(git status --porcelain)
if [ "${#output}" -ge 5 ]; then 
    git config --global user.email "hello@webaverse.com"
    git config --global user.name "Webaverse"
    git checkout -b threejs-bump
    git add .
    git commit -m "Bump webaverse/three.js@latest into three" -a
    git push --set-upstream origin threejs-bump -f
    echo ${{ secrets.GITHUB_TOKEN }} | gh auth login --with-token
    gh pr create --fill
fi
cd ..