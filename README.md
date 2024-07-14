# download git bash and go to git/etc/bash.bashrc and add following line and save it

    eval "$(fnm env --use-on-cd)"

# Open cmd and run -> fnm use 18.20.3 and if cmd show "Do you want to install it? answer [y/N]: y" press y and enter

# Go to the folder that you want to put project and run the following command in that folder's cmd

# You can open cmd in that folder by righ click and choose -> open in terminal

    git clone https://github.com/Aung662001/webtel-api-express
# Testing code----
 # Run the following command in cmd that already open by previous step
	node index.js 
   # If "Server listening on port : 8800" is show, continue the following steps

# Press win+r and type shell:startup and press enter

# Create a file name with nameasyoulike.vbs and paste the following three line and save it 

    Set WshShell = CreateObject("WScript.Shell")
	WshShell.Run "cmd /c cd C:\Users\setan\Documents\projects\webtel-api && node index.js", 0
	Set WshShell = Nothing
# Double click on that file
# Now serve is running....