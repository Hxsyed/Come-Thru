import mysql.connector
import os
import requests
import bcrypt
from dotenv import load_dotenv
load_dotenv()

# Connect to the database
db = mysql.connector.connect(user=os.getenv("USER"), 
                            password=os.getenv("DATABASE_PASSWORD"),
                            host=os.getenv("HOST"),
                            database=os.getenv("DATABASE_NAME"))
 
mycursor = db.cursor()

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
        # fetch the data from the database using the RFID TAG
        # select * from admins
        # ("SELECT RFID FROM users WHERE RFID = ?", (RFID))

        mycursor.execute("SELECT * FROM users WHERE RFID = %s", (int(RFID),))
        rows = mycursor.fetchall()
        print(len(rows))
        if(len(rows)>0):
            full_name = rows[0][1] + " " + rows[0][2]
            empl = rows[0][5]
            vax = rows[0][4]
            return(full_name, empl, vax)
        # for i in rows:
        #     print(i[0][0])

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
            mycursor.close()
            return ('No User Found')
    
    def weather(self):
        
        complete_api_link = "https://api.openweathermap.org/data/2.5/weather?q="+"New York, US"+"&appid="+os.getenv("WEATHER_API_KEY")
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