# MediaStrim
---

 A very small, browser-based media viewer built entirely with Vanilla HTML/CSS/JS and PHP.

If you have a collection of videos you want to share across a personal network this has worked well for me. Its implementation is by no means glamourous and not meant for anything more than home use on a local network. It is simple enough to work practically anywhere, all the time without any major dependencies.

--- 

One major limitation is that media support is determined by the browser for now, `.mp4`, `.mkv` etc. <br>
* <i>`.avi` is not supported by any major browser</i>

In order to minimize dependencies the instructions use the PHP built-in web server. If you have another option available, you should probably use that (Apache, IIS)

<b>Requirements: PHP 5.4 or greater</b>

Windows:
```
git clone https://github.com/mcdsebastiano/Mediastrim
cd Mediastrim
mklink /D Videos path/to/collection
php -S 0.0.0.0:80
```
Linux:
```
git clone https://github.com/mcdsebastiano/Mediastrim
cd Mediastrim
ln -s ./Videos path/to/collection
php -S 0.0.0.0:80
```
<b> Note: If you have a firewall, make sure to grant the server permission to access the network.</b>

Once the server is active, to access it from a separate device enter the host device's IPv4 address into a browser. Find it by using `ipconfig | findstr /i "ipv4"` on Windows or `ip -c -4 addr` on Linux

To take full advantage of the browser, try dividing your collection into separate folders for Movies and TV respectively. Afterwards you can set the sidebar navigation links within `js/init.js`

 
