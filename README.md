# raspi-party-boom

## INSTALLATION GUIDE

### PREREQUISITES

* This installation guide is using a fresh install of the `Raspberry Pi OS (lite and 32bit)` as well as WiFi preconfigured through the `Raspberry Pi Imager`.

* Read every example config and look out for usernames and paths to replace. The default user in this guide is `partypi`.

* Update your system with `sudo apt -y update && sudo apt upgrade`.

* Install WiFi drivers for the second WiFi interface if needed.

  
### CONFIGURING THE GUEST WIFI

1. Install needed packages.  
```Bash
sudo apt -y install dnsmasq hostapd iptables
```  

2. Edit WiFi interfaces with `sudo nano /etc/dhcpcd.conf` so it looks like the example. `wlan0` is the interface that connects to your home WiFi and `wlan1` opens the guest wlan hotspot. In this guide all the guest devices will end up in the `172.16/12` subnet.  
```
interface wlan0
    dhcp

interface wlan1
    static ip_address=172.16.0.1/12
    ipv4only
    nohook wpa_supplicant
```

3. Restart `dhcpcd`.
```Bash
sudo systemctl restart dhcpcd
```

4. Check wether both WiFi interfaces are set up correctly.
```Bash
ip l
```

5. Backup default config of `dnsmasq`.
```Bash
sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.baq
```

6. Edit `dnsmasq` config with `sudo nano /etc/dnsmasq.conf` so it looks like the example. It uses the AdGuard Family DNS to protect guests and creates `.boom` domains for each device.
```
interface=wlan1

# AdGuard Family DNS
no-resolv
server=94.140.14.15
server=94.140.15.16

# .boom Network
domain-needed
bogus-priv
local=/boom/
domain=boom

no-dhcp-interface=wlan0
dhcp-range=172.16.1.1,172.31.255.254,255.240.0.0,24h
dhcp-option=option:dns-server,172.16.0.1
```

7. Check your config.
```Bash
dnsmasq --test -C /etc/dnsmasq.conf
```

8. If everything is okay restart `dnsmasq` and enable it so it starts automatically. Also check if it has started correctly.
```Bash
sudo systemctl restart dnsmasq && 
sudo systemctl enable dnsmasq && 
sudo systemctl status dnsmasq
```

9. Edit the `hosts` file with `sudo nano /etc/hosts` and add the following line. It will allow guests to access the webinterface by using `party.boom` as the domain in the browser.
```
172.16.0.1      party.boom
```

10. Edit the `hostapd` configuration by typing `sudo nano /etc/hostapd/hostapd.conf`. It should look like the following example. If you have special drivers you can edit the second line (use Google for more help) but usually you don't need to. Edit `ssid`, `country_code` and the `wpa_passphrase` to your liking.
```
interface=wlan1
#driver=nl80211

ssid=Party Boom
channel=1
hw_mode=g
ieee80211n=1
ieee80211d=1
country_code=DE
wmm_enabled=1

auth_algs=1
wpa=2
wpa_key_mgmt=WPA-PSK
rsn_pairwise=CCMP
wpa_passphrase=testtest
```

11. Set the permissions of the `hostapd` configuration so only the root user can read it.
```Bash
sudo chmod 600 /etc/hostapd/hostapd.conf
```

12. Start `hostapd` in debug mode.
```Bash
sudo hostapd -dd /etc/hostapd/hostapd.conf
```

13. If you can see the following lines press `CTRL+C` to turn off `hostapd` again.
```
...
wlan1: interface state COUNTRY_UPDATE->ENABLED
...
wlan1: AP-ENABLED
...
```

14. Edit the following file.
```Bash
sudo nano /etc/default/hostapd
```

15. Append the following lines to the file.
```
RUN_DAEMON=yes
DAEMON_CONF="/etc/hostapd/hostapd.conf"
```

16. Start `hostapd` service and enable it so it starts automatically. Also look if it started correctly.
```Bash
sudo systemctl unmask hostapd && 
sudo systemctl start hostapd && 
sudo systemctl enable hostapd && 
sudo systemctl status hostapd
```

17. Edit `sysctl.conf` by typing `sudo nano /etc/sysctl.conf` and add the following line.
```
net.ipv4.ip_forward=1
```

18. Enable `NAT` so your guests can access the internet and save the `IPTable` rule.
```Bash
sudo iptables -t nat -A POSTROUTING -o wlan0 -j MASQUERADE && 
sudo sh -c "iptables-save > /etc/iptables.ipv4.nat"
```

19. Edit the autostart file with `sudo nano /etc/rc.local` and add the following line right before `exit 0`. It will automatically load the rule from step 18 after booting.
```
iptables-restore < /etc/iptables.ipv4.nat
```

20. Reboot the Pi and check if the WiFi hotspot as well as the connection to the internet is working.
```Bash
sudo reboot
```


### INSTALLING THE SPOTIFYD SERVICE

1. Download latest `spotifyd (armv6)` release from `https://github.com/Spotifyd/spotifyd/releases` with wget. Following command is only a example.
```Bash
wget https://github.com/Spotifyd/spotifyd/releases/download/v0.3.5/spotifyd-linux-armv6-slim.tar.gz
```

2. Unzip the archive.
```Bash
tar xzf spotifyd-linux-armv6*
```

3. Create a `systemd` user folder.
```Bash
mkdir -p ~/.config/systemd/user/
```

4. Edit (and create) a new service file for `spotifyd`
```Bash
nano ~/.config/systemd/user/spotifyd.service
```

5. Copy the following example. Keep in mind to change the path after `ExecStart=` to the location of your unzipped `spotifyd` binary.
```
[Unit]
Description=A spotify playing daemon
Documentation=https://github.com/Spotifyd/spotifyd
Wants=sound.target
After=sound.target
Wants=network-online.target
After=network-online.target

[Service]
ExecStart=/home/partypi/spotifyd --no-daemon
Restart=always
RestartSec=12

[Install]
WantedBy=default.target
```

6. Refresh user deamons.
```Bash
systemctl --user daemon-reload
```

7. Create a config folder for `spotifyd`
```Bash
mkdir ~/.config/spotifyd
```

8. Edit (and create) a new config file with `nano ~/.config/spotifyd/spotifyd.conf`. Copy the following example and change it as you need. If you use username and password comment out (or delete) `password_cmd` and `use_keyring`. If you use a keyring do so for `username` and `password`.  
For more info have a look at https://docs.spotifyd.rs/config/File.html.
```
[global]
# Your Spotify account name.
username = "username"

# Your Spotify account password.
password = "password"

# A command that gets executed and can be used to
# retrieve your password.
# The command should return the password on stdout.
#
# This is an alternative to the `password` field. Both
# can't be used simultaneously.
password_cmd = "command_that_writes_password_to_stdout"

# If set to true, `spotifyd` tries to look up your
# password in the system's password storage.
#
# Note, that the `password` field will take precedence, if set.
use_keyring = true

# The name that gets displayed under the connect tab on
# official clients. Spaces are not allowed!
device_name = "raspi_party_boom"

# The audio bitrate. 96, 160 or 320 kbit/s
bitrate = 160

# The directory used to cache audio data. This setting can save
# a lot of bandwidth when activated, as it will avoid re-downloading
# audio files when replaying them.
#
# Note: The file path does not get expanded. Environment variables and
# shell placeholders like $HOME or ~ don't work!
cache_path = "/home/partypi/.spotifycache"

# The maximal size of the cache directory in bytes
# The example value corresponds to ~ 1GB
max_cache_size = 1000000000

# If set to true, audio data does NOT get cached.
no_audio_cache = false

# Volume on startup between 0 and 100
# NOTE: This variable's type will change in v0.4, to a number (instead of string)
initial_volume = "90"

# If set to true, enables volume normalisation between songs.
volume_normalisation = true

# The normalisation pregain that is applied for each song.
normalisation_pregain = -10

# After the music playback has ended, start playing similar songs based on the previous tracks.
autoplay = false

# The displayed device type in Spotify clients.
# Can be unknown, computer, tablet, smartphone, speaker, t_v,
# a_v_r (Audio/Video Receiver), s_t_b (Set-Top Box), and audio_dongle.
device_type = "audio_dongle"
```

9. Start `spotifyd` and check if everything is running.
```Bash
systemctl --user start spotifyd.service && 
systemctl --user status spotifyd.service
```

10. Enable the user for long-running services (after logout) so `spotifyd` does not get killed by the OS. Also enable the service so it starts after booting.
```Bash
sudo loginctl enable-linger partypi && 
systemctl --user enable spotifyd.service
```


### INSTALLING THE WEBAPP

1. Get the newest `NodeJS` version (don't use the old versions from the repository).
```Bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
```

2. Install `git` and `NodeJS`.
```Bash
sudo apt -y install git nodejs
```

3. Clone the `raspi-party-boom` repository. And enter the folder.
```Bash
git clone https://github.com/nicokimmel/raspi-party-boom.git && 
cd raspi-party-boom
```

4. Install node modules.
```Bash
npm i
```

5. Create a Spotify app on the developer dashboard  
https://developer.spotify.com/dashboard/

6. Add `http://party.boom` (or the IP of your Pi inside the guest network) to the `Redirect URIs` in the app settings. Add a port if you plan to use it on anything other than `80` (default port).

7. Edit (and create) a `.env` file with `nano .env`. Copy the default values into the file. The `SPOTIFY_REDIRECT_URI` has to exactly match the URI you entered on the developer dashboard. Also copy and paste the client ID and secret.
```
PORT=80
SPOTIFY_REDIRECT_URI="http://party.boom"
SPOTIFY_CLIENT_ID=""
SPOTIFY_CLIENT_SECRET=""
```

8. Build the webapp. Also start it to see if it everything is installed correctly. Try to connect to it via your computer or smartphone.  
You have to start the app with `sudo` because you can only attach to ports <1024 as root.
```Bash
npm run build && 
sudo npm start
```

9. Install `pm2` with the Node Package Manager. It will autostart the app.
```Bash
sudo npm install -g pm2
```

10. Start the app.
```Bash
sudo pm2 start dist/boom.js --watch
```

11. Enable the app for autostart.
```Bash
sudo pm2 save && 
sudo pm2 startup
```

12. Look if everything works as it should.
```Bash
sudo pm2 ls
```

13. Attach to the app if needed. Replace `0` with the ID shown in step 12. It shows errors and useful information for debugging.
```Bash
sudo pm2 attach 0
```