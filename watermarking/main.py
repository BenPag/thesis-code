from concurrent import futures
import threading
import numpy as np
import cv2 as cv
import math as Math
import random
import os

srcDir = "./cranach-data/RAW_PAINTINGS"
targetDir = "./cranach-data/hiRes"
watermarkImg = cv.imread("./cda_watermark_new.png")
random.seed(10)
sizes = {
  "xsmall": { "suffix": "xs", "width": 200, "quality": 70,
    "sharpen": True, "watermark": False, "metadata": False,
  },
  "small": { "suffix": "s", "width": 400, "quality": 80,
    "sharpen": True, "watermark": False, "metadata": True,
  },
  "medium": { "suffix": "m", "width": 600, "quality": 80,
    "sharpen": True, "watermark": False, "metadata": True,
  },
  "origin": { "suffix": "origin", "width": "auto", 
    "quality": 95,  "sharpen": False, "watermark": True, 
    "metadata": True }
}
lock = threading.Lock()

def collectImages(dirname):
  images = []
  for (root, dirs, files) in os.walk(dirname):
    for img_file in files:
      if img_file.endswith(".tif"):
        images.append(os.path.join(root, img_file))
  
  return images

def getColoredWatermark(maxSize, color):
  factor = random.uniform(0.2, 0.6)
  watermark = resizeLimit(watermarkImg, round(maxSize * factor))
  return (watermark.astype(np.float64) * (color / 255)).astype(np.uint8)
  
def addWatermark(watermark, img, x, y, minOpacity):
  height, width, c = watermark.shape
  x -= int(width / 2)
  y -= int(height / 2)
  
  overlay = np.ones(img.shape, np.uint8) * 255
  overlay[y:height+y, x:width+x ] = watermark
  garyOverlay = cv.cvtColor(overlay, cv.COLOR_BGR2GRAY)
  ret, mask = cv.threshold(garyOverlay, 200, 100, cv.THRESH_BINARY_INV)
  
  temp1 = cv.bitwise_and(img, img, mask= cv.bitwise_not(mask))
  temp2 = cv.bitwise_and(overlay, overlay, mask= mask)
  result = cv.add(temp1,temp2)
  
  opacity = round(random.uniform(minOpacity, 1), 4)
  cv.addWeighted(result, opacity, img, 1-opacity, 0, result)
  
  return result

def resizeByWidth(img, width):
  h, w, c = img.shape
  factor = width / w 
  newSize = (round(w * factor), round(h * factor))
  return cv.resize(img, newSize)

def resizeLimit(img , limit):
  h, w, c = img.shape
  factor = limit / max([h, w])
  newSize = (round(w * factor), round(h * factor))
  return cv.resize(img , newSize)

def getLuminance(bgrColor):
  # from here: https://stackoverflow.com/a/596243
  return (bgrColor * [0.587, 0.114, 0.299]).sum()

def improveColor(color):
  luminance = getLuminance(color)
  
  if luminance < 50:
     color *= 4
  elif luminance < 100:
     color *= 2
  elif luminance < 192:
     color *= 1.2
  elif luminance > 230:
     color *= 0.6
  else:
     color *= 0.75
     
  return np.clip(color, 0, 255)

def applyWatermarks(img):
  height, width, channels = img.shape
  
  base = min([width, height])
  tileAmount = max([4, round(base / 1000)])
  tileSize = base / tileAmount
  cols, rows = round(width / tileSize), round(height / tileSize)  
  matrix = np.zeros((cols, rows), dtype=np.int8)
  
  while matrix.sum() < round((cols+rows) / 1.5):
    for col in range(cols):
      for row in range(rows):
        if (row % 2 == 1 and col % 2 == 0) or (row % 2 == 0 and col % 2 == 1):
          continue
        if matrix[col,row] != 0 or random.random() > 0.1:
          continue
        
        matrix[col,row] = 1
        x = int(col * tileSize + tileSize / 2)
        y = int(row * tileSize + tileSize / 2)
        
        color = img[y][x]
        watermarkColor = improveColor(color.astype(np.float64))
        minOpacity = 0.6 if getLuminance(color) < 100 else 0.4
        maxSize = min([tileSize / 2.5, (width - x) * 2, (height - y) * 2])
        
        watermark = getColoredWatermark(maxSize, watermarkColor)
        img = addWatermark(watermark, img, x, y, minOpacity)
  
  return img

def unsharp(img):
  sigmaX = 1.2
  gaussian = cv.GaussianBlur(img, (0, 0), sigmaX)
  return cv.addWeighted(img, 0.7, gaussian, 0.3, 0)

def processImage(imgPath, printPrefix = "[]"):
  print(f"{printPrefix}: Verarbeite {imgPath}")
  destDir = (imgPath.replace(srcDir, targetDir)
    .replace(os.path.basename(imgPath), ""))
  
  lock.acquire()
  if not os.path.exists(destDir):
    os.makedirs(destDir)
  lock.release()

  for size in sizes.values(): 
    img = cv.imread(imgPath)
    if size["width"] != "auto":
      img = resizeByWidth(img, int(size["width"]))
      
    if size["watermark"] is True:
      img = applyWatermarks(resizeLimit(img , 2400))
      
    if size["sharpen"] is True:
      img = unsharp(img)
        
    destFilename = (os.path.basename(imgPath)
      .replace(".tif", f"_{size['suffix']}.jpg"))
    destPath = f"{destDir}/{destFilename}"
    cv.imwrite(destPath, img, [int(cv.IMWRITE_JPEG_QUALITY), int(size["quality"])])

def main():
  images = collectImages(srcDir)
  imgCount = len(images)
  
  print(f"Generiere Derivate für {imgCount} Abbildungen")
  with futures.ThreadPoolExecutor(max_workers=3) as executor:
    for idx, imgPath in enumerate(images):
      executor.submit(processImage, imgPath, f"[{idx+1}/{imgCount}]")
  

if __name__ == "__main__":
  main()
