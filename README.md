# Source code files of master thesis 'Analyse und Konzeption von Maßnahmen zum Schutz von Bildern im Web am Beispiel der offenen Forschungsdatenbank Cranach Digital Archive mit über 20000 Abbildungen'

## Table of content
- Watermarking prototyp
- CaptchaFox basic integration
- CaptchaFox integration with OpenSeadragon
- IP-Filter

### Watermarking prototyp

#### Prerequisite
- Python with version >=3.9
- OpenCV
- numpy
- Image(s) for watermark

First install Python on your machine. After that you can the python requirements via `pip`.
To install the python requirements navigate into folder `watermarking` and run:
```bash
pip install -r requirements.txt
```

Put all images which should be watermarked in to following folder: `watermarking/cranach-data/RAW_PAINTINGS`
##### Note:
The prototyp only searches for `.tif` images.

You can change this by editing line 33 in `watermarking/main.py`  
Example for using JPG images: `if img_file.endswith(".jpg"):`

#### Execute 
To run the prototyp navigate into folder `watermarking` and run:
```bash
python main.py
```

### CaptchaFox basic integration
This example uses the testing keys of CaptchaFox see: https://docs.captchafox.com/automated-testing
To use production keys you need your own `site_key` and `secret_key`. 
These keys can be configured in https://portal.captchafox.com/login.
- To change `site_key` edit line 17 of `dzi-captcha/public/app.js`
- To change `secret_key` edit line 7 of `dzi-captcha/server.js`

#### Prerequisite
- Current LTS version of node.js

First install node.js on your machine. After that you can the python requirements via `npm`.
To install all dependencies navigate into folder `captchafox` and run:
```bash
npm install
```

#### Execute
To run this app navigate into folder `captchafox` and run:
```bash
npm run start
```
After that the app is accessible at: http://localhost:3000   

### CaptchaFox integration with OpenSeadragon
This example uses the testing keys of CaptchaFox see: https://docs.captchafox.com/automated-testing
To use production keys you need your own `site_key` and `secret_key`.
These keys can be configured in https://portal.captchafox.com/login.
- To change `site_key` edit line 17 of `dzi-captcha/public/app.js`
- To change `secret_key` edit line 9 of `dzi-captcha/config.js`

#### Prerequisite
- Current LTS version of node.js
- DZI image with imageData

First install node.js on your machine. After that you can the python requirements via `npm`.
To install all dependencies navigate into folder `dzi-captcha` and run:
```bash
npm install
```
Additionally, you need to place a DZI and a corresponding imageData.json into the `dzi-captcha\images` folder.
To configure DZI path in app change line 34 in `dzi-captcha/public/app.js`
```js
const dziPath = "images/DE_RMK_M6_FR-none/01_Overall/DE_RMK_M6_FR-none_2019_Overall.dzi"
```

#### App configuration
You can configure the app by changing values in `dzi-captcha/config.js`.
After the configuration values you need to restart the server.

#### Execute
To run this app navigate into folder `dzi-captcha` and run:
```bash
npm run start
```
After that the app is accessible at: http://localhost:3000   

### IP-Filter
This example uses the testing keys of CaptchaFox see: https://docs.captchafox.com/automated-testing
To use production keys you need your own `site_key` and `secret_key`.
These keys can be configured in https://portal.captchafox.com/login.
- To change `site_key` edit line 17 of `dzi-captcha/public/app.js`
- To change `secret_key` edit line 9 of `dzi-captcha/config.js`

#### Prerequisite
- Current LTS version of node.js

First install node.js on your machine. After that you can the python requirements via `npm`.
To install all dependencies navigate into folder `ip-filter` and run:
```bash
npm install
```
Additionally, you need to place a DZI and a corresponding imageData.json into the `dzi-captcha\images` folder.
To configure DZI path in app change line 34 in `ip-filter/public/app.js`
```js
const dziPath = "images/DE_RMK_M6_FR-none/01_Overall/DE_RMK_M6_FR-none_2019_Overall.dzi"
```

#### App configuration
You can configure the app by changing values in `ip-filter/config.js`.
After the configuration values you need to restart the server.

**allowlist.txt**  
If you're running on localhost add `localhost` as new line to it. 
After that you should see the DZI without a captcha.

#### Execute
To run this app navigate into folder `ip-filter` and run:
```bash
npm run start
```
After that the app is accessible at: http://localhost:3000   
