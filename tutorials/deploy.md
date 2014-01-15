Most of the projects that I work on are single repo projects, and so I like to use github to deploy my sites. Here is my technique

# Deploy Keys

A deploy key is an SSH key that is stored on the server and grants access to a single repository on GitHub. This key is attached directly to the repository instead of to a user account. This can be added on the repository’s settings page.

For details on how to add deploy keys [read this](https://help.github.com/articles/managing-deploy-keys#deploy-keys).

# Git Server & Hooks

#### [Git on a Server](http://git-scm.com/book/ch4-2.html)
TODO: write a synopsis of this

```sh
# on yo machine
mkdir ~/git
mkdir ~/git/boilerplate.git && cd ~/git/boilerplate.git
git —bare init
git --bare fetch git@github.com:username/boilerplate.git prod:prod

# update /etc/init.d/boilerplate with service commands
# install hooks in ~/git/boilerplate.git/hooks
```

# Hooks

#### Pre-Receive Hook:

script that fires before you push to the server

```
#!/bin/sh
echo "Stop Your service"
service boilerplate stop%
```
## Post-Receive Hook

script that fires after you have pushed

```
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

```
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

TODO: Don’t forget to edit .git/config to add the remote server to the refs, there’s a command line for this, I don’t care for it.

