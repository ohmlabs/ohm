# SSH 
SSH is critical to all developers connecting to servers and is the safest most common way to access remote servers. 
To connect to a server using ssh you need to either have a private key whose corresponding public key is in the servers authorized_keys file or a password (if password authentication is used, which is not recommended for many reasons).
## Generate SSH Keys
```sh
cd ~/.ssh
ssh-keygen (follow the prompt choose a passphrase if you like or just press enter twice)
```
This outputs two files, a private and public key (probably id_rsa and id_rsa.pub). You need to copy the contents of the latter and email to your server admin. They will enable access by following the next steps:

## Adding Users
Suppose you want to grant server access to someone else. This is simple:

```sh
# as server administrator
ssh admin@101.0.0.0
sudo adduser newuser newuser
nano /home/newuser/.ssh/authorized_keys
#  paste [id_rsa.pub] into authorized_keys
```
The new user can now connect:
```sh
ssh -i ~/.ssh/id_rsa newuser@101.0.0.0 
``` 
If you can understand what happened there then you have a good handle on how ssh works. 
## Setting up an ssh config file
A great improvement that you can make to your ssh workflow is to use an ssh config file. This basically allows you to create ssh shortcuts that store information such as username and identity file. This files is located at: ~/.ssh/config Here is an example config entry:
```sh
Host dp
     IdentityFile ~/.ssh/id_rsa
     User ubuntu
     Hostname 11.111.111.111
     ForwardAgent yes
     ServerAliveInterval 30
     ServerAliveCountMax 120
```

It is explained in detail in this [blog post](http://nerderati.com/2011/03/simplify-your-life-with-an-ssh-config-file/).