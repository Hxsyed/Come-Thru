import mysql.connector
import os
import requests
import bcrypt
from dotenv import load_dotenv
import time,board,busio
import numpy as np
import adafruit_mlx90640
load_dotenv()
# Connect to the database
db = mysql.connector.connect(
          
          host="us-cdbr-east-05.cleardb.net",
          user="bf3b65b19b9060",
          passwd="de5e5e17",
          database="heroku_182617f0d7b626c"
        )
WEATHER_API_KEY = "22d99c9ccdaf14ed6a6434a0471accba"

mycursor = db.cursor()

#TEMP
# 400k frequency and 2HZ refreshrate = 2 fps
i2c = busio.I2C(board.SCL, board.SDA, frequency=400000)
mlx = adafruit_mlx90640.MLX90640(i2c)
mlx.refresh_rate = adafruit_mlx90640.RefreshRate.REFRESH_2_HZ

class Database:
    
    def login(self, username, password):

        mycursor.execute("SELECT * FROM guards WHERE username = %s", (username,))
        rows = mycursor.fetchall()
        if(len(rows)>0):
            matched = bcrypt.checkpw(password.encode('utf8'), bytes(rows[0][2], 'utf-8'))
            if(matched):
                return True
            else:
                return ("IP")
        else:
            return False
    
    def fetch(self, RFID):

        mycursor.execute("SELECT * FROM users WHERE RFID = %s", (int(RFID),))
        rows = mycursor.fetchall()
        if(len(rows)>0):
            full_name = rows[0][1] + " " + rows[0][2]
            empl = rows[0][5]
            vax = rows[0][4]
            image = rows[0][6]
            return(full_name, empl, vax, image)
        else:
            return("IU")

    def search(self,EMPL):
        # search for the particular user when the pole cannot detect the user
        # it then searches the user based on the users EMPL ID
        mycursor.execute("SELECT * FROM users WHERE EmplID = %s", (int(EMPL),))
        rows = mycursor.fetchall()
        if(len(rows)>0):
            full_name = rows[0][1] + " " + rows[0][2]
            empl = rows[0][5]
            vax = rows[0][4]
            return (full_name, empl, vax)
        else:
            return ('NUF')
    
    def weather(self):
        
        complete_api_link = "https://api.openweathermap.org/data/2.5/weather?q="+"New York, US"+"&appid="+WEATHER_API_KEY
        api_link = requests.get(complete_api_link)
        api_data = api_link.json()
        # city name, temp, main, high, low
        city_name = api_data['name']
        temp = self.conv_k_to_f(api_data['main']['temp'])
        desc = api_data['weather'][0]['description']
        h_temp = self.conv_k_to_f(api_data['main']['temp_max'])
        l_temp = self.conv_k_to_f(api_data['main']['temp_min'])
        return(city_name, temp, desc, h_temp, l_temp)
    
    def conv_k_to_f(self, k):
        F = (int(k) - 273.15) * 1.8 + 32
        format_float = "{:.2f}".format(F)
        return format_float

    def temp(self):
        #create frame then get a 1 sec temp values
        frame = np.zeros((24*32,))
        while True:
            try:
                mlx.getFrame(frame)
                break
            except ValueError:
                continue

        #convert to fahrenheit
        print((np.max(frame) *9/5) + 32)
        return((np.max(frame) *9/5) + 32)
