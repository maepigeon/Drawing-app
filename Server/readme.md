# DoodlLab Back-end Server Code

Code within the Server directory corresponds to the back-end website code. This is code that handles sending messages and syncing game state with all connected players.

## Running the back-end server
1. Download repo
2. Ensure npm and node.js are installed
3. If node Websockets module is not installed, enter the following in the command line: `npm install ws`
4. Start the server by executing the following in the server directory: `node index.js`
5. (Optional) Use tmux to keep the server running without having to keep the terminal window open
Instructions here: https://askubuntu.com/a/220880

Note: network port used for communicating with front-end can be found in index.js. By default, it is 8082. Feel free to change it as necessary.
