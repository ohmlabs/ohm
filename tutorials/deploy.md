# Deploying with Git
Github is obviously a wonderful tool for developers, but its benefits stretch much further than code collaboration. I use git at the core of my entire development cycle, including using git to deploy my app to production servers. This guide will show you how to take advantage of git's rich features and take all of the stress out of your deployment cycle.

# Deploy Keys

First things first, how do you get your git repo built on a server? Since the dawn of the internet most developers have used FTP or SSH for these purposes, resulting in manual and strenuous deploy processes. You may have had an idea of simply logging onto the server and pulling via HTTPS, which isn't a bad idea. The major concern within pulling your resources from Git's servers to your server is security.

Obviously generating an SSH keypair on the server and uploading the publickey to github is an option, but if your server is compromised so too is your entire Github account. This is where deploy keys come in. A deploy key is an SSH key that is stored on the server and grants access to a single repository on GitHub. This key is attached directly to the repository instead of to a user account. This can be added on the repository’s settings page.

For details on how to add deploy keys [read this](https://help.github.com/articles/managing-deploy-keys#deploy-keys).

# Git Server

You could easily just stop right there and you've got a method of pushing to your server far superior to simply transferring files (as you're still under version control), but even this workflow requires you to log in to the server whenever you want to change things and then go though whatever steps your build process may require (compiling assets, restarting servers, etc.) Luckily, Git has created an awesome convention for accomplishing all of this automatically and without logging into the server: Git Hooks. 

#### [Git on a Server](http://git-scm.com/book/ch4-2.html)

In order to use hooks, you will have to set up a git remote repository on the server, add scripts to be executed whenever you push, and update your refs locally to make sure that you are aware of the new remote. All of that is covered here. Let's begin by logging on to your server to set up the remote repo.

```sh
# on yo machine
mkdir ~/git
mkdir ~/git/boilerplate.git && cd ~/git/boilerplate.git
git —-bare init
# if you want to reference a repository on github
git --bare fetch git@github.com:username/boilerplate.git prod:prod

# update /etc/init.d/boilerplate with service commands
# install hooks in ~/git/boilerplate.git/hooks
```
Note: One thing that may be conceptually a little tough to grapple is that this is not a traditional git repository. It doesn't hold any of your repos code itself nor act like a standard repo. Server repos are there to manage your refs, and actually downloads the files themselves to a "work tree" which contains all of your code, but is not a git repo either.

# Hooks

#### Pre-Receive Hook:
The first hook is the pre-receive hook. Just as it sounds, this script is executed once the user pushes to the remote, but before it receives the objects. This is a good place to stop any processes that you don't want running while you update or clearing out dirs and files:

```sh
#!/bin/sh
echo "Stop Your service"
service boilerplate stop
```
#### Post-Receive Hook
You may have guessed that this script executes once your files have been updated. 

```sh
#!/bin/sh
echo "Checkout Updates"
GIT_WORK_TREE=/var/www/boilerplate git checkout -f
echo "start boilerplate server"
service boilerplate start
```
finally change the permissions on these

```sh
chmod +x /git/boilerplate.git/hooks/pre-receive
chmod +x /git/boilerplate.git/hooks/post-receive
```
# Create Service in Linux
As you can see I did not write a lot for my hooks to do, so how will I accomplish all of the stuff that needs to be done to restart my app? In case you missed it about I actually called a System V init script. These are scripts that are executed in as "predicatable an environment as possible". You call them very simply with the "sudo service boilerplate stop" and if you've been programming Linux for any period of time you are probably very familiar with it. To create one, you will want to create a file like this in /etc/init.d/

```sh
#!/bin/sh
# /etc/init.d/boilerplate
#

NAME=Boilerplate
grunt=/usr/bin/grunt
forever=/usr/bin/forever
npm=/usr/bin/npm
SITEROOT=/var/www/boilerplate.fm    # or some bs like that 
export PATH=$PATH:/usr/local/bin/

case "$1" in
  start)
    echo "Starting $NAME"
    cd $SITEROOT
    pwd
    $npm install
    $grunt prod
    $forever start boilerplate.js -p
    ;;
  stop)
    echo "Stopping script $NAME"
    cd $SITEROOT
    $forever stop boilerplate.js -p

    ;;
  list)
    echo "List"
    $forever list
    ;;
  *)
    echo "Usage: /etc/init.d/boilerplate {start|stop|list}"
    exit 1
    ;;
esac

exit 0
```
# Locally

Finally, don’t forget to add a ref to your local repository for this new git server. You can directly edit .git/config to add the remote server to the refs (which I prefer), Or use commands:
```sh
# add new remote ref to repository
git remote add production ssh://00.00.00.00/home/ubuntu/boilerplate.git
```
To push to the remote you created:
```sh
git push production      # or whatever you named in last step
```



