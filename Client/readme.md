# DoodlLab Front-end Client Code

Code within the Client directory corresponds to the front-end website code. This is code that handles displaying the website to players and also handles interacting with the game on the client side.

## Running the front-end website
1. Download the repo.
2. Run a web server in the Client directory.
    1. Running `python -m http.server` is fine for testing. Apache or nginx are more robust and should be used instead for more sophisticated deployment.
3. Go to the webserver's URL in your browser to test/view the app.
        
User instructions will be shown on the main page of the app when run correctly.

Note: url and port used to communicate with the back-end server may have to be changed if the back-end server is on a different url. Modify the line `const ws = new WebSocket("url:port", "echo-protocol");` within networking.js to change this. See the README within the Server directory for details on running the back-end server.
