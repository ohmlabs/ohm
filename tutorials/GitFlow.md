#### create new local branch
```sh
git branch -b newfeature
```
#### push branch to remote
```sh
git push origin newfeature
```
#### copy a remote branch locally
```sh
git co -b newfeature origin/newfeature
```
####  merge a feature branch (close a pull request)
```sh
git co master
git merge --no-ff newfeature # use no-ff to be sage
git mergetool -t opendiff    #best to use a diff tool for resolving conflicts
```
At This point you will need to fix and merge conflicts and exit

```sh
git clean -f 
git push origin master
```

#### delete a branch
```sh
git branch -d feature
```
#### delete remote branch:
```sh
git push origin :newfeature
```
