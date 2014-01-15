Most of the products that I work on are single repo projects, and so I like to use github to deploy my sites. Here is my technique

## Deploy Keys

A deploy key is an SSH key that is stored on the server and grants access to a single repository on GitHub. This key is attached directly to the repository instead of to a user account. This can be added on the repository’s settings page.

For details on how to add deploy keys [read this](https://help.github.com/articles/managing-deploy-keys#deploy-keys).

## Hooks

#### Pre-Receive Hook:

script that fires before you push to the server

```sh
#!/bin/sh
echo "Stop Jukebox service"
service jukeboxx stop%
```
#### Post-Receive Hook

script that fires after you have pushed

```sh
#!/bin/sh
echo "Checkout Updates"
GIT_WORK_TREE=/home/ubuntu/dev/ git checkout -f
echo "start Jukebox server"
service jukeboxx start
```
finally change the permissions on these

```sh
chmod +x /opt/git/jukebox.git/hooks/pre-receive
```
## Create the Service in Linux

open /etc/init.d and create a new file:

```sh
#! /bin/sh
# /etc/init.d/jukebox
#

NAME=Jukebox
grunt=/usr/bin/grunt
forever=/usr/bin/forever
SITEROOT=/home/ubuntu/dev
export PATH=$PATH:/usr/local/bin/

case "$1" in
  start)
    echo "Starting $NAME"
    cd $SITEROOT
    pwd
    $grunt
    $forever start jukeboxx.js --stage
    ;;
  stop)
    echo "Stopping script $NAME"
    cd $SITEROOT
    $forever stop jukeboxx.js --stage

    ;;
  list)
    echo "List"
    $forever list
    ;;
  *)
    echo "Usage: /etc/init.d/jukebox {start|stop|list}"
    exit 1
    ;;
esac

exit 0
```