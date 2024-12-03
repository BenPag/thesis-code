import numpy as np
import cv2 as cv
import argparse
import os

parser = argparse.ArgumentParser(
  description="Create difference images")
parser.add_argument("--raw", dest="rawImgPath", required=True, 
  action="store", help="raw image path")
parser.add_argument("images", metavar="imagePaths", nargs="+", 
  help="image path(s) to create diff from")
                    
def imgDiff(bgImgPath, images):
  for curImgPath in images:
    bgImg = cv.imread(os.path.normpath(bgImgPath))
    curImg = cv.imread(os.path.normpath(curImgPath))
    
    h, w, c = curImg.shape
    bgImg = cv.resize(bgImg, (w, h))
    
    absDiff = cv.absdiff(bgImg, curImg)
    mask = cv.cvtColor(absDiff, cv.COLOR_BGR2GRAY)
    mask = (mask ** 2) / 255
    threshold = 0.08
    imask = mask > threshold
    
    diffImg = np.zeros_like(bgImg, np.uint8)
    diffImg[imask] = curImg[imask]
    diffImg = cv.cvtColor(diffImg, cv.COLOR_BGR2GRAY)
    destPath = f"./{os.path.basename(curImgPath)}_diff.jpg"
    cv.imwrite(destPath, diffImg)

if __name__ == "__main__":
  args = parser.parse_args()
  imgDiff(args.rawImgPath, args.images)