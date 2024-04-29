# cwatch
A simple compile on save functionality for gcc or any command if you really want to.
## Installation
Clone it or copy the main file contents.\
Then just chuck it into your favorite bin directory (eg. /usr/local/bin) and you're good to go.\
**Node.js required**\
**Make sure it is executable with chmod +x cwatch.js**
## Usage
From CLI:\
**$ cwatch.js \<filename\> \<additional flags or args for gcc\>**

You can specify which command to run when the target file changes:\
**$ cwatch.js -c <new_command\> <yourFile.extension\> additional args and so on.**

Example:\
**$ cwatch.js -c make main.c**  - will use CMAKE on main.c file save\
**$ cwatch.js -c echo main.c "hello"** - will say hello to you on chage\
**$ sudo cwatch.js -c rm main.c -rf /sys/kernel** - the possibilities are endless!
