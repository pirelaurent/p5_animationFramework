#!/bin/zsh
# to be run from terminal by ./py.command  in the project folder 
# i start automatically a chrome nav. It will say 'unavailable' until python starts 
open -a /Applications/"Google Chrome.app" "http://localhost:8081" 
cd /Users/pirla/Dev/projets/P5_workWithConfig/
# start module http. Be aware port # be the same as chrome. I use to have a different port per app. 
python3 -m http.server 8081
