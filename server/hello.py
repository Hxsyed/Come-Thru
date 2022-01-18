from datetime import datetime

import sys
print("Python version")
print (sys.version)
print("Version info.")
print (sys.version_info)

now = datetime.now()

current_time = now.strftime("%H:%M:%S")

print("Current Time is :", current_time)

def fun():
    print("Hello There Sir!")

fun()


# #!/usr/bin/env python
# #import time

# import RPi.GPIO as GPIO
# from mfrc522 import SimpleMFRC522
# import time
# GPIO.setwarnings(False) 
# reader = SimpleMFRC522()

# try:
    
        
#     id, text = reader.read()
#     print(id)
#     #print(text)
#     print("Hello")
#     GPIO.cleanup()
    
  
        
# finally:
#         GPIO.cleanup()
        
# print('Hello from python')
