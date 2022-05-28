import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
GPIO.setwarnings(False)
reader = SimpleMFRC522()

try:
        id, text = reader.read()
        print(int(id/256))
        print(text)
finally:
        GPIO.cleanup()