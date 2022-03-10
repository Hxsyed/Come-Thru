import cv2
import os, sys

#save old image and update new
if os.path.exists('new_img.jpg'):
   os.rename('new_img.jpg', 'old_img.jpg')
#might not be needed, depends on architecture.
   
#libcamera-jpeg (quick picture in jpg)
#-t = timer
#-n = nopreview
#-o = object
libcamjpeg = "libcamera-jpeg -n -t 1000 -e jpg -o new_img.jpg"

#libcamera-still (hold fo 5 secs)
#libcamstill = "libcamera-still -o still.jpg"

#libcamera-hello (just run cam non stop) -video
#libcamhello= "libcamera-hello -t 0"
os.system(libcamjpeg) #output command line using os

#load and display image
cv2.namedWindow('The Output', cv2.WINDOW_AUTOSIZE)
image = cv2.imread('new_img.jpg')
image_r = cv2.resize(image, (640,480))
cv2.imshow('The Output', image_r)
cv2.waitKey(0)
cv2.destroyAllWindows()