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

Taken from a great [StackOverflow answer](http://stackoverflow.com/questions/927358/how-to-undo-the-last-git-commit):

[Git Reset}(http://git-scm.com/docs/git-reset)

Undo a commit and redo
```sh
$ git commit ...              (1)
$ git reset --soft "HEAD^"    (2)
$ edit                        (3)
$ git add ....                (4)
$ git commit -c ORIG_HEAD     (5)
```
1. This is what you want to undo

2. This is most often done when you remembered what you just committed is incomplete, or you misspelled your commit message, or both. Leaves working tree as it was before "reset". (The quotes are required if you use zsh)

3. Make corrections to working tree files.

4. Stage changes for commit.

4. "reset" copies the old head to .git/ORIG_HEAD; redo the commit by starting with its log message. If you do not need to edit the message further, you can give -C option instead.
