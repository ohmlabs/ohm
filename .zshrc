export PATH=/usr/local/bin:/usr/local/sbin:~/bin:/usr/local/mysql/bin:/usr/local/share/npm/bin:$PATH
export NODE_PATH=/usr/bin/node
export EDITOR=/usr/local/bin/emacs

#Color table from: http://www.understudy.net/custom.html
fg_black=%{$'\e[0;30m'%}
fg_red=%{$'\e[0;31m'%}
fg_green=%{$'\e[0;32m'%}
fg_brown=%{$'\e[0;33m'%}
fg_blue=%{$'\e[0;34m'%}
fg_purple=%{$'\e[0;35m'%}
fg_cyan=%{$'\e[0;36m'%}
fg_lgray=%{$'\e[0;37m'%}
fg_dgray=%{$'\e[1;30m'%}
fg_lred=%{$'\e[1;31m'%}
fg_lgreen=%{$'\e[1;32m'%}
fg_yellow=%{$'\e[1;33m'%}
fg_lblue=%{$'\e[1;34m'%}
fg_pink=%{$'\e[1;35m'%}
fg_lcyan=%{$'\e[1;36m'%}
fg_white=%{$'\e[1;37m'%}
#Text Background Colors
bg_red=%{$'\e[0;41m'%}
bg_green=%{$'\e[0;42m'%}
bg_brown=%{$'\e[0;43m'%}
bg_blue=%{$'\e[0;44m'%}
bg_purple=%{$'\e[0;45m'%}
bg_cyan=%{$'\e[0;46m'%}
bg_gray=%{$'\e[0;47m'%}
#Attributes
at_normal=%{$'\e[0m'%}
at_bold=%{$'\e[1m'%}
at_italics=%{$'\e[3m'%}
at_underl=%{$'\e[4m'%}
at_blink=%{$'\e[5m'%}
at_outline=%{$'\e[6m'%}
at_reverse=%{$'\e[7m'%}
at_nondisp=%{$'\e[8m'%}
at_strike=%{$'\e[9m'%}
at_boldoff=%{$'\e[22m'%}
at_italicsoff=%{$'\e[23m'%}
at_underloff=%{$'\e[24m'%}
at_blinkoff=%{$'\e[25m'%}
at_reverseoff=%{$'\e[27m'%}
at_strikeoff=%{$'\e[29m'%}

## Make your shell prompt cool and informational do this curl first, just trust me
# curl https://raw.github.com/git/git/master/contrib/completion/git-prompt.sh -o ~/.git-prompt.sh
source ~/.git-prompt.sh
PROMPT="
${fg_lgreen}%n@${at_underl}%m${at_underloff}${fg_white}[${fg_cyan}%~${fg_white}] ${fg_lred}$(__git_ps1)
${fg_white}[${fg_green}%T${fg_white}]:${at_normal}"
 
#Set the auto completion on
autoload -U compinit
compinit
 
#Lets set some options
setopt correctall
setopt autocd
setopt auto_resume
 
## Enables the extgended globbing features
setopt extendedglob
 
#Set some ZSH styles
zstyle ':completion:*:descriptions' format '%U%B%d%b%u'
zstyle ':completion:*:warnings' format '%BSorry, no matches for: %d%b'
 
HISTFILE=~/.zsh-histfile
HISTSIZE=10000
SAVEHIST=10000
 
#Aliases
# Detect which `ls` flavor is in use
if ls --color > /dev/null 2>&1; then # GNU `ls`
  colorflag="--color"
else # OS X `ls`
  colorflag="-G"
fi

#-------------------
# Personnal Aliases
#-------------------
 
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'
# -> Prevents accidentally clobbering files.
alias mkdir='mkdir -p'
alias h='history'
alias j='jobs -l'
alias which='type -a'
 
# Pretty-print of some PATH variables:
alias path='echo -e ${PATH//:/\\n}'
alias libpath='echo -e ${LD_LIBRARY_PATH//:/\\n}'
 
alias du='du -kh'    # Makes a more readable output.
alias df='df -kTh'
 
##ls, the common ones I use a lot shortened for rapid fire usage
alias ls='pwd ; ls -la ${colorflag}'       #I like color
alias l='ls -lFh'         #size,show type,human readable
alias la='ls -lAFh'       #long list,show almost all,show type,human readable
alias lr='ls -tRFh'       #sorted by date,recursive,show type,human readable
alias lt='ls -ltFh'       #long list,sorted by date,show type,human readable
alias ln='ln -is'         #symlink without clobbering
alias ps='ps -efm'        #show all process 
alias grep='grep -irn'    # grep recursively case insisitive with line numbers 
alias tree='tree -I node_modules' # remove annoying node modules 
 
##cd, because typing the backslash is ALOT of work!!
alias .='cd ../'
alias ..='cd ../../'
alias ...='cd ../../../'
alias ....='cd ../../../../'
alias .-='cd -'
 
## SSH Aliases should be in ~/.ssh/config

## Other aliases should be in  ~/.gitconfig
alias gits='git st'
alias brewdoc='brew doctor'

## use alt-s to insert sudo at the beginning
insert_sudo () { zle beginning-of-line; zle -U "sudo " }
zle -N insert-sudo insert_sudo
bindkey "^[s" insert-sudo

PATH=$PATH:$HOME/.rvm/bin # Add RVM to PATH for scripting
