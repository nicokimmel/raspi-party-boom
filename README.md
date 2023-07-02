# raspi-party-boom

## INSTALLATION

### PREREQUISITES

* This installation guide is using a fresh install of the `Raspberry Pi OS (lite and 32bit)` as well as Wifi preconfigured through the `Raspberry Pi Imager` (TODO: LINK).

* Read every example config and look out for usernames and paths to replace. The default user in this guide is `partypi`.

* Update your system with `sudo apt update && sudo apt upgrade`.

* Install wifi drivers for the second wifi interface if needed.


### CONFIGURE GUEST WIFI


1. Install needed packages.  
```Bash
sudo apt install dnsmasq hostapd iptables
```  

2. Edit wifi interfaces with `sudo nano /etc/dhcpcd.conf` so it looks like the example. `wlan0` is the interface that connects to your home wifi and `wlan1` opens the guest wlan hotspot. In this guide all the guest devices will end up in the `172.16/12` subnet.  
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

4. Check wether both wifi interfaces are set up correctly.
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

9. Edit the `hosts` file with `sudo nano /etc/hosts` and add the following line. It will enable the guests to access the webinterface by using `party.boom` as the domain in the browser.
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
wlan0: interface state COUNTRY_UPDATE->ENABLED
...
wlan0: AP-ENABLED
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

20. Reboot the Pi and check if the wifi hotspot as well as the connection to the internet is working.
```Bash
sudo reboot
```

### INSTALL SPOTIFYD SERVICE

### INSTALL WEBAPP