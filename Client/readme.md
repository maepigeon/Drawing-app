Developer Manual

    Download the repo.
    All code is in the canvas.js, style.css, and index.html files.
    A web server must be running, as the code uses modules. 
        python -m http.server should be fine. When we set up a website, that will be using a server anyway.

Forwarding localhost client
    Download and install ngrok: https://ngrok.com/
    Run the local server as described above
    run ngrok.exe http 8000
    Give the ngrok link to people to share the page with
    If it gives an error, you may need to set up your authtoken: https://dashboard.ngrok.com/get-started/your-authtoken

User Manual

    Download the repo and open the index.html file in your browser.
    commands:
        use mouse to draw (click to start drawing, release to stop)
        press E to toggle eraser mode on/off
        CTRL+Z and CTRL+Y to undo/redo respectively
        press r, g, or b to select a red, green, or blue brush, respectively
        ALT+N to create a new layer, up and down arrows to select a layer
