npm=/usr/bin/npm
gem=~/.rvm/bin/gem
GIT=~/git/drake.git

mkdir ~/git
mkdir $GIT && cd $GIT
git —-bare init
# if you want to reference a repository on github
git --bare fetch git@github.com:cdrake757/drake.git prod:prod
cd "$(dirname "${BASH_SOURCE}")"
sudo ln -is hooks/pre-receive.sh $GIT/hooks/pre-receive
sudo ln -is hooks/post-receive.sh $GIT/hooks/post-receive
sudo chmod +x $GIT/hooks/pre-receive
sudo chmod +x $GIT/hooks/post-receive
