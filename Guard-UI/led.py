import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(21,GPIO.OUT)
print ("LED on")
GPIO.output(21,GPIO.HIGH)

GPIO.output(21,GPIO.LOW)