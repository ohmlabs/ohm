# Designers Guide to Github
### Series: [Frontend Designer Boilerplate](readme.md)
## Branching
The best thing about git is that it truly makes branching easy, and allows multiple developers to work together on a project with stable code and processes. There is a very renowned model that is based on this [blog post](http://nvie.com/posts/a-successful-git-branching-model/) and it very thoroughly describes a very efficent method for git branching.
Here is an extrememly abbreviated list of important branching commands and this [cheat sheet](http://danielkummer.github.io/git-flow-cheatsheet/):
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
## Stashing and Switching between branches
Suppose you're working on a new feature branch and you want to swich to a different branch to see changes that were just pushed. If you have a lot of unstaged changes that are not ready to be committed, switching branches without losing this is important. You will use the [git stash](http://git-scm.com/book/en/Git-Tools-Stashing) commandHere's how:
```sh
git stash apply         # message 'Saved working directory... HEAD is now...'
git status              # 'On branch... Nothing to commit...'
git co otherfeature
git pull
```
To re-apply those changes:
```sh
git co master           # or whatever branch you were on
git stash list          # show all stashed you have made
git apply stash@{0}     # apply the most recently stashed changes
git status              # should show your unstaged changes from before
```

## Adding, Committing and Pusing
After you've altered files you will need to commit these changes before pushing them to the server. The process is fairly simple, so here's an abbreviated walk-through:
```sh
git status        # should show you all of the changes you've made
git add .         # add all of the files that have been altered
git ci -m 'detailed message describing exactly what these changes mean'
git push origin master
```
Only push once you are absolutely sure that your commits are stable (unless you are on an experimental branch).
#### Undo a commit and redo:
```sh
$ git commit ...              # (1)
$ git reset --soft "HEAD^"    # (2)
$ edit                        # (3)
$ git add ....                # (4)
$ git commit -c ORIG_HEAD     # (5)
```

1. This is what you want to undo

2. This is most often done when you remembered what you just committed is incomplete, or you misspelled your commit message, or both. Leaves working tree as it was before "reset". (The quotes are required if you use zsh)

3. Make corrections to working tree files.

4. Stage changes for commit.

5. "reset" copies the old head to .git/ORIG_HEAD; redo the commit by starting with its log message. If you do not need to edit the message further, you can give -C option instead.

[Git Reset](http://git-scm.com/docs/git-reset): Taken from a great [StackOverflow answer](http://stackoverflow.com/questions/927358/how-to-undo-the-last-git-commit):

# Git Submodules
Sometimes you want to include another repository within a repository. For example, you can include this boilerplate in your project and use parts of it to speed up development. How? Here's git [submodules](http://git-scm.com/book/en/Git-Tools-Submodules) in a few easy steps:
#### Create your own git repository.
```sh
git init
```
I recommend the following structure, but there are many that will suffice:

#### Install Submodule
```sh
git submodule add git@github.com:cdrake757/boilerplate.git bp
```


