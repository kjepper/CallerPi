# CallerPi
This software was developed to help the visually impaired to see who is calling on the landline. A possible setup would be using a Raspberry Pi and an USB modem.

The main part of the program only shows the last 4 callers and if being called the current caller. Everything is setup as big as possible on a fixed 1024x768 resolution with high contrast. The only input used is the scroll-wheel to mark the last called numbers as seen.


INSTALLATION
The program runs on node.js supported by some libraries.

Install node.js
wget http://node-arm.herokuapp.com/node_latest_armhf.deb 
sudo dpkg -i node_latest_armhf.deb

Istall express
npm install express

Install serialport
npm install serialport

Install nedb
npm install nedb --save



SOFTWARE
Node.js
https://nodejs.org/en/
Express
http://expressjs.com/
Node-serialport
https://github.com/voodootikigod/node-serialport
Nedb
https://github.com/louischatriot/nedb
