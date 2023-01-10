# smart-home-cloudRUN

In this project Cloud Run to run an API that connects to a MongoDB database and an MQTT server. This API serves as the main interface for interacting with our smart home system.

## Google Cloud Workflow

![alt text](https://firebasestorage.googleapis.com/v0/b/gccp-project-373305.appspot.com/o/GCCP%20workflow.png?alt=media&token=21e00844-1c8a-43fd-8636-4154ba55fb92)

## Getting Started

Install gcloud CLI

- https://cloud.google.com/sdk/docs/install

```
gcloud auth login
gcloud auth configure-docker
```

.env file :

```
MQTT_IP="ip"
MQTT_PORT="port"
MONGO_IP="ip"
MONGO_PORT="port"
MQTT_USERNAME="username"
MQTT_PASSWORD="password"
CRED="filenamePATH"
```

Note:

- https://cloud.google.com/run/docs/troubleshooting?&_ga=2.169408417.-127588082.1666004812&_gac=1.187289050.1670855951.CjwKCAiAv9ucBhBXEiwA6N8nYH2qIr8UjRfcyIg6BAn2FH2SwbP9T5LxBCkyLNz81FtW2986_E8CuhoCSFgQAvD_BwE#container-failed-to-start
- By default "PORT" env is set to 8080
- modify package.json -> "scripts" ->
  "start":"node index.js",

Build Docker and push to Container Registry

```
docker build --platform linux/amd64 -t smart-home .
docker tag smart-home gcr.io/gccp-project-373305/smart-home
docker push gcr.io/gccp-project-373305/smart-home
```

## API Routes

IP-ADDRESS = CLOUD-RUN-URL

POST
http://IP-ADDRESS/smartdevices/createdevice
body : {
"deviceID": "0x01",
"deviceState": false,
"deviceName": "Lock",
"deviceType": "lock"
}

GET
http://IP-ADDRESS/smartdevices/getDeviceID

POST
http://IP-ADDRESS/smartdevices/updatedevice
body : {
"deviceID": "0x01",
"deviceState": false
}

GET
http://IP-ADDRESS/smartdevices/deleteDeviceID
body : {"deviceID": "0x00"}

GET
http://IP-ADDRESS:PORT/smartdevices/getAllDeviceID

Install Arduino IDE:
https://support.arduino.cc/hc/en-us/articles/360019833020-Download-and-install-Arduino-IDE

## IoT Device Setup

Install Arduino Library:

- PubSubClient.h
- WiFi.h
- ArduinoJson.h

Upload homeAutomation.ino located in ArduinoIDE folder to ESP32 microcontroller

homeAutomation.ino variables modify

```
const char *ssid = "Username";     // Enter your WiFi name
const char *password = "password"; // Enter WiFi password
const char *mqtt_broker = "IP-ADDRESS"; // Change IP-ADDRESS
const char *topic = "/<topic>/<topic>"; // Change TOPIC
const char *mqtt_username = "username";
const char *mqtt_password = "password";
```

Flutter APP : https://github.com/Raghavendiran-2002/smart-home-app

# Setup Personal Cloud

##### Install Apache

```
sudo apt update
sudo apt install apache2
sudo apt install apache2* -y
sudo systemctl stop apache2.service
sudo systemctl start apache2.service
sudo systemctl enable apache2.service
sudo apt install mariadb-server
sudo apt install mariadb-client
sudo systemctl stop mariadb.service
sudo systemctl start mariadb.service
sudo systemctl enable mariadb.service
sudo mysql_secure_installation
```

Use the guide below to answer:

```
If you've just installed MariaDB, and haven't set the root password yet, you should just press enter here.
Enter current password for root (enter for none): PRESS ENTER
Switch to unix_socket authentication [Y/n] n
Change the root password? [Y/n] n
Remove anonymous users? [Y/n] y
Disallow root login remotely? [Y/n] y
Remove test database and access to it? [Y/n] y
Reload privilege tables now? [Y/n] y
All done!
```

##### Install PHP on Ubuntu

```
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:ondrej/php
sudo apt update
sudo apt install php7.4 libapache2-mod-php7.4 php7.4-imagick php7.4-common php7.4-mysql php7.4-gmp php7.4-imap php7.4-json php7.4-pgsql php7.4-ssh2 php7.4-sqlite3 php7.4-ldap php7.4-curl php7.4-intl php7.4-mbstring php7.4-xmlrpc php7.4-gd php7.4-xml php7.4-cli php7.4-zip
sudo nano /etc/php/7.4/apache2/php.ini
# make changes to the file
file_uploads = On
allow_url_fopen = On
short_open_tag = On
memory_limit = 256M
upload_max_filesize = 100M
max_execution_time = 360
date.timezone = America/Chicago
```

##### Create a Nextcloud database

```
sudo mysql -u root -p
CREATE DATABASE nextcloud;
CREATE USER '<username>'@'localhost' IDENTIFIED BY '<password>';
GRANT ALL ON nextcloud.* TO '<username>'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EXIT;
```

##### Download Nextcloud

```
wget https://download.nextcloud.com/server/releases/nextcloud-22.2.0.zip -P /tmp
sudo unzip /tmp/nextcloud-22.2.0.zip -d /var/www
sudo chown -R www-data:www-data /var/www/nextcloud/
sudo chmod -R 755 /var/www/nextcloud/
sudo cp /var/www/nextcloud/* /var/www/html/
```

##### Configure Apache for Nextcloud

```
sudo nano /etc/apache2/sites-available/ssl.conf
```

Create both files below with SSL Certificate

```
sudo nano /home/ubuntu/nextcloud.com.crt
sudo nano /home/ubuntu/nextcloud.com.crt
```

Copy and paste the content below into the file and save

```
Alias /nextcloud "/var/www/nextcloud/"

<VirtualHost *:80>
    ServerAdmin <mail-ID>.com
    ServerName nextcloud.ztechonoid.com # https://nextcloud.ztechonoid.com/index.php
    Redirect / https://nextcloud.ztechonoid.com/
    DocumentRoot /var/www/nextcloud/
</VirtualHost>
<IfModule mod_ssl.c>
<VirtualHost *:443>
    ServerAdmin <mail-ID>.com
    ServerName nextcloud.ztechonoid.com https://nextcloud.ztechonoid.com/index.php
    # Logging
    DocumentRoot /var/www/nextcloud/
    ErrorLog /var/www/tomcat-error.log
    LogLevel info
    CustomLog /var/www/tomcat-access.log combined
####  SSL Configuration
    SSLEngine on
    SSLProxyEngine on
        # Place both Certificate on this location
        SSLCertificateKeyFile   /home/ubuntu/nextcloud.com.key
        SSLCertificateFile      /home/ubuntu/nextcloud.com.crt
    BrowserMatch "MSIE [2-6]" \
        nokeepalive ssl-unclean-shutdown \
        downgrade-1.0 force-response-1.0
    # MSIE 7 and newer should be able to use keepalive
    BrowserMatch "MSIE [17-9]" ssl-unclean-shutdown
#### End SSL Configuration
    # Proxy Settings
        ProxyPass         /  http://localhost:80/ nocanon
        ProxyPassReverse  /  http://localhost:80/
        ProxyRequests     Off
        AllowEncodedSlashes NoDecode

    <Proxy *>
        Order Deny,Allow
        Allow from all
    </Proxy>
    <Location />
         Order allow,deny
         Allow from all
    </Location>
</VirtualHost>
</IfModule>
```

```
sudo a2ensite nextcloud.conf
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod env
sudo a2enmod dir
sudo a2enmod mime
sudo systemctl reload apache2
sudo systemctl restart apache2
```

Open brower http://localhost/nextcloud
