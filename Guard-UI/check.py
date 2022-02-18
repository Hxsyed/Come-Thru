import time
import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
import mysql.connector

try:
    while True:
        db = mysql.connector.connect(
          
          host="us-cdbr-east-05.cleardb.net",
          user="bf3b65b19b9060",
          passwd="de5e5e17",
          database="heroku_182617f0d7b626c"
        )
        GPIO.setwarnings(False)

    
    
        reader = SimpleMFRC522()
        


        id,text = reader.read()
        print(id)
        
        cursor = db.cursor()
        sql_select_Query = """select * from users WHERE RFID = %s"""
        
          
        cursor.execute(sql_select_Query,(id,))
        # get all records

        records = cursor.fetchall()
        #print("Total number of rows in table: ", cursor.rowcount)
        #print("\nPrinting each row")
        GPIO.cleanup()
    
        for row in records:
            print("RFID = ", row[0], )
            print("First Name = ", row[1])
            print("Last Name = ", row[2])
            print("Email  = ", row[3])
            print("Vax Status  = ", row[4])
            print("Empl ID  = ", row[5], "\n")
        time.sleep(2)
    
except mysql.connector.Error as error:
        print("Failed to get record from MySQL table: {}".format(error))
finally:
    if db.is_connected():
        db.close()
        cursor.close()
        print("MySQL connection is closed")
    GPIO.cleanup()
