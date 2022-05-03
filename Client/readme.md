Developer Manual

    Download the repo.
    A web server must be working in the directory the repo is in.
        Running python -m http.server is fine for testing. Apache or nginx are more robust and should be used instead for more sophisticated deployment.
        Go to the webserver's URL in your browser to test/view the app.
        
User instructions will be shown on the main page of the app when run correctly.

Note: url and port used to communicate with the server may have to be changed if the server is on a different url.
Modify the line const ws = new WebSocket("url:port", "echo-protocol"); to change this.
