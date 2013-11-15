# Designers Guide to Github
### Series: [Frontend Designer Boilerplate](readme.md)
Here are some commands that I use often, It's not the most thorough but a good start, I would suggest checking out this:
#### [Interactive Cheat Sheet](http://www.ndpsoftware.com/git-cheatsheet.html)
#### [Github Bootcamp](https://help.github.com/articles/set-up-git)
## Clone or Initiate a Repository
Congratulations, you have decided to code, and better still you've chosen to learn git first... a wise choice. 
```sh
git config --global user.name "Your Name Here"
# Sets the default name for git to use when you commit
git config --global user.email "your_email@example.com"
# Sets the default email for git to use when you commit
```
At the core of github's service is the basic object, the github repository. In version-control software like Git, a repository is simply a collection of files, typically stored on a server that allows users to contribute collaboratively by "committing" work. This may sound fairly obtuse if you have no idea how revision control works, and I would recommend you do what most people do and start at [Wikipedia](http://en.wikipedia.org/wiki/Revision_control).
There are two ways to get started: clone a git repo
```sh
git clone git@github.com:cdrake757/boilerplate.git
```
or initiate a new git repository (then push to the server)
```sh
mkdir newrepo
cd newrepo
git init
#initiates a new git repository in the current directory
touch readme.md
git add readme.md
# "stages" this file for commit
git commit -m 'initial commit'
# commits the staged file, ready to be pushed
git remote add origin https://github.com/username/newrepo.git
# Creates a remote named "origin" pointing at your GitHub repository
git push origin master
# Sends your commits in the "master" branch to GitHub

```
## Adding, Committing and Pushing
After you've altered files you will need to commit these changes before pushing them to the server. The process is fairly simple, so here's an abbreviated walk-through:
```sh
git status        # should show you all of the changes you've made
git add .         # add all of the files that have been altered
git ci -m 'detailed message describing exactly what these changes mean'
git push origin master
```
Only push once you are absolutely sure that your commits are stable (unless you are on an experimental branch).
## Branching
The best thing about git is that it truly makes branching easy, and allows multiple developers to work together on a project with stable code and processes. There is a very renowned model that is based on this [blog post](http://nvie.com/posts/a-successful-git-branching-model/) and it very thoroughly describes a very efficent method for git branching.
Here is an extrememly abbreviated list of important branching commands and this:
#### [Cheat Sheet](http://danielkummer.github.io/git-flow-cheatsheet/)

Create new local branch
```sh
git branch -b newfeature
```
Push branch to remote
```sh
git push origin newfeature
```
Copy a remote branch locally
```sh
git checkout -b newfeature origin/newfeature
```
Merge a feature branch (close a pull request)
```sh
git checkout master
git merge --no-ff newfeature # use no-ff to be sage
git mergetool -t opendiff    #best to use a diff tool for resolving conflicts
```
At this point you will need to fix and merge conflicts and exit

```sh
git clean -f 
git push origin master
```

Delete a branch
```sh
git branch -d feature
```
Delete remote branch:
```sh
git push origin :newfeature
```
## Stashing and Switching between branches
Suppose you're working on a new feature branch and you want to swich to a different branch to see changes that were just pushed. If you have a lot of unstaged changes that are not ready to be committed, you need to switch branches without losing your working state. You will use the [git stash](http://git-scm.com/book/en/Git-Tools-Stashing) command. Here's how:
```sh
git stash               # message 'Saved working directory... HEAD is now...'
git status              # 'On branch... Nothing to commit...'
git co otherfeature
git pull
```
To re-apply those changes:
```sh
git co master             # or whatever branch you were on
git stash list            # show all stashed you have made
git stash apply stash@{0} # apply the most recently stashed changes
git status                # should show your unstaged changes from before
```

Undo a commit and redo:
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

## Git Submodules
Sometimes you want to include another repository within a repository. For example, you can include this boilerplate in your project and use parts of it to speed up development. How? Here's git [submodules](http://git-scm.com/book/en/Git-Tools-Submodules) in a few easy steps:
Create your own git repository.
```sh
git init
```
Install Submodule
```sh
git submodule add git@github.com:cdrake757/boilerplate.git bp
```
Copy and update server.coffee
```sh
cp bp/boilerplate.coffee .
emacs myapp.coffee
# near the top, change 'app/config/config.js' to 'bp/app/config/config.js'
# save and close
```
Copy and update the boilerplate gruntfile
```sh
cp bp/gruntfile.coffee .
cp bp/package.json .
emacs gruntfile.coffee
# find the compass task and change app/config.rb to bp/app/config.rb for dev and prod
# also find the forever task and change boilerplate.js to myapp.js (whatever you renamed it above)
# save and close
```
Create Sass for project with boilerplate included
```sh
cd client/sass
emacs stlye.sass
#type this at the top to include boilerplate
@import "../bp/sass/base"
# save and exit
```

### Miscellaneous

Stop tracking files

For individual files:
```sh
git rm --cached <file>
```
For the build/ directory:
```sh
git rm -r --cached <dir>
