Developer Manual

    Download repo
  
    Ensure npm and node.js are installed
  
    If node Websockets module is not installed, enter the following in the command line:
    npm install ws
  
    Start the server by entering the following in the command line:
    node index.js
  
  
TODO
  
    Get it working on the internet, rather than a local node server
    Add usernames so users can rejoin sessions when they close a tab
    Add ability to remove users from a session
    Add sessions so that users aren't all connected to the same server, they can join their own sessions that are deleted when they are done
    Possibly will need to secure websockets, https certification, and DDOS preventive measures
