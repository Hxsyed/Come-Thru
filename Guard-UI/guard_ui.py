from tkinter import *
import tkinter as tk
from tkinter import Label, ttk, messagebox
from db import Database
from time import strftime
import RPi.GPIO as GPIO
#dont think we need the bottom import
import time
from mfrc522 import SimpleMFRC522
from PIL import Image, ImageTk
#dont think we need the bottom import
#from PIL import ImageTk
import io 
import sys

import pygame
sound = "/home/pi/Desktop/Come-Thru/Guard-UI/sound.mp3"
denied = "/home/pi/Desktop/Come-Thru/Guard-UI/denied.mp3" 
success = "/home/pi/Desktop/Come-Thru/Guard-UI/success.mp3"

# libraries and packages
from tensorflow.keras.applications.mobilenet_v3 import preprocess_input
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.models import load_model
from imutils.video import VideoStream
import numpy as np
import imutils
import cv2
import os

# adding Folder_2 to the system path
sys.path.insert(0, '/home/pi/Desktop/Come-Thru/Mask_Detection')
from detect_mask_video import FaceMask
db = Database()
fm = FaceMask()
LARGEFONT =("Verdana", 35)
MEDIUMFONT =("Verdana", 20)
ALLOW_PIN = 20
STANDBY_PIN = 23
DENY_PIN = 21
BUZZER = 19

global Buzz 

B0=31
C1=33
CS1=35
D1=37

prototxtPath = r"/home/pi/Desktop/Come-Thru/Mask_Detection/face_detector/deploy.prototxt"
weightsPath = r"/home/pi/Desktop/Come-Thru/Mask_Detection/face_detector/res10_300x300_ssd_iter_140000.caffemodel"
global faceNet
faceNet = cv2.dnn.readNet(prototxtPath, weightsPath)
# load the face mask detector model from disk
global maskNet
maskNet = load_model("/home/pi/Desktop/Come-Thru/Mask_Detection/mask_detector_mnv3.model")
# initialize the video stream
#print("[INFO] starting video stream...")
global vs
vs = VideoStream(src=0).start()

class tkinterApp(tk.Tk):

	# __init__ function for class tkinterApp
	def __init__(self, *args, **kwargs):
		# __init__ function for class Tk
		tk.Tk.__init__(self, *args, **kwargs)
		
		# creating a container
		container = tk.Frame(self)
		container.pack(side = "top", fill = "both", expand = True)

		container.grid_rowconfigure(0, weight = 1)
		container.grid_columnconfigure(0, weight = 1)

		# initializing frames to an empty array
		self.frames = {}

		# iterating through a tuple consisting
		# of the different page layouts
		for F in (SignInPage, HomePage):

			frame = F(container, self)

			# initializing frame of that object from
			# startpage, page1, page2 respectively with
			# for loop
			self.frames[F] = frame

			frame.grid(row = 0, column = 0, sticky ="nsew")
		#switched to HomePage 
		self.show_frame(HomePage)
	# to display the current frame passed as
	# parameter
	def show_frame(self, cont):
		frame = self.frames[cont]
		frame.tkraise()
	
	def login(self, username, password):
		# validate the username and password
		if not username.isalpha():
			messagebox.showerror("Login Error", "Invalid Username")
			return
		if not username.isalnum():
			messagebox.showerror("Login Error", "Invalid Password")
			return
		# Authentication
		ret = db.login(username, password)
		if(ret == True):
			messagebox.showinfo("Sign In", "Signed In Successfully!")
			# go to the next frame
			self.show_frame(HomePage)
		elif(ret == 'IP'):
			messagebox.showerror("Sign In", "Incorrect Password")
		else:
			messagebox.showerror("Sign In", "User does not exist")
		
	def authentication(self,auth):
		if(auth=='Y'):
			# Turn on the green led right on bred board
			print(auth)
			self.greenlight()
		else:
			# Turn on the red led right on bread board
			print(auth)
			self.redlight()
			

		# Turn on the orange led right on bred board to show standby mode
		self.yellowlight()
		
	
	def redlight(self):
		GPIO.setmode(GPIO.BCM)
		GPIO.setup(DENY_PIN, GPIO.OUT)
		GPIO.output(DENY_PIN, GPIO.HIGH)
		time.sleep(1)
		GPIO.output(DENY_PIN, GPIO.LOW)
		GPIO.cleanup()
	
	def greenlight(self):
		GPIO.setmode(GPIO.BCM)
		GPIO.setup(ALLOW_PIN, GPIO.OUT)
		GPIO.output(ALLOW_PIN, GPIO.HIGH)
		time.sleep(1)
		GPIO.output(ALLOW_PIN, GPIO.LOW)
		GPIO.cleanup()
	def yellowlight(self):
		GPIO.setmode(GPIO.BCM)
		GPIO.setup(STANDBY_PIN, GPIO.OUT)
		GPIO.output(STANDBY_PIN, GPIO.HIGH)
		time.sleep(1)
		GPIO.output(STANDBY_PIN, GPIO.LOW)
		GPIO.cleanup()
        
        
        
        
	
	def searchUser(self,EMPLID):
		ret = db.search(EMPLID)
		if(ret=="NUF"):
			messagebox.showerror("Error", "User does not exist")
		else:
			# ret1 = db.fetch(34566235)
			self.popup_window(ret)
		
	def popup_window(self,ret):
		window = tk.Toplevel()
		window.title('Student')
		full_name = tk.Label(window, text="Full Name")
		full_name.pack(fill='x', padx=50, pady=5)

		setfull_name = tk.Label(window, text=ret[0])
		setfull_name.pack(fill='x', padx=50, pady=5)

		EMPLID = tk.Label(window, text="EMPL ID")
		EMPLID.pack(fill='x', padx=50, pady=5)

		setEMPLID = tk.Label(window, text=ret[1])
		setEMPLID.pack(fill='x', padx=50, pady=5)

		VAXInfo = tk.Label(window, text="Vaccination Info")
		VAXInfo.pack(fill='x', padx=50, pady=5)

		if(ret[2] == 1):
			setVAXInfo = tk.Label(window, text="Vaccinated")
			setVAXInfo.pack(fill='x', padx=50, pady=5)
		else:
			setVAXInfo = tk.Label(window, text="Not Vaccinated")
			setVAXInfo.pack(fill='x', padx=50, pady=5)

		button_close = tk.Button(window, text="Close", command=window.destroy)
		button_close.pack(fill='x')

# first window frame startpage

class SignInPage(tk.Frame):
	def __init__(self, parent, controller): 
		tk.Frame.__init__(self, parent)
		
		username = tk.StringVar()
		password = tk.StringVar()

		label = ttk.Label(self, text ="SIGN IN", font = LARGEFONT)
		label.place(relx=.5, rely=.3,anchor= 'c')

		# Username Label and Entry
		label1 = ttk.Label(self, text ="Username", font = MEDIUMFONT)
		label1.place(relx=.5, rely=.4,anchor= 'c')
		usernameentry = ttk.Entry(self,textvariable=username)
		usernameentry.place(relx=.5, rely=.45,anchor= 'c')

		# Password Label and Entry
		label2 = ttk.Label(self, text ="Password", font = MEDIUMFONT)
		label2.place(relx=.5, rely=.5,anchor= 'c')
		passwordentry = ttk.Entry(self,textvariable=password)
		passwordentry.place(relx=.5, rely=.55,anchor= 'c')
		
		# Log-In Button
		button1 = ttk.Button(self, text ="Log In",
		command = lambda : controller.login(usernameentry.get(), passwordentry.get()))
		button1.place(relx=.5, rely=.6,anchor= 'c')

		


# second window frame page1
class HomePage(tk.Frame):
	

	def __init__(self, parent, controller):
		tk.Frame.__init__(self, parent)
		self.my_time()
		self.activate_rfid()
		
		# Temperature

		weather = db.weather()
		weather_frame = LabelFrame(self, text= "", font = MEDIUMFONT,padx = 30,pady = 30)
		weather_frame.place(relx=.7, rely=.1,anchor= 'c')

		City = Label(weather_frame, text = "City: "+weather[0])
		City.grid(row = 0, column = 0, padx = 10, pady = 10)


		Temperature = Label(weather_frame, text = "Temperature: "+weather[1]+"°F")
		Temperature.grid(row = 1, column = 0, padx = 10, pady = 10)

		Description = Label(weather_frame, text = "Description: "+weather[2])
		Description.grid(row = 0, column = 2, padx = 10, pady = 10)

		HTemperature = Label(weather_frame, text = "H: "+weather[3]+"°F")
		HTemperature.grid(row = 1, column = 2, padx = 10, pady = 10)

		LTemperature = Label(weather_frame, text = "L: "+weather[4]+"°F")
		LTemperature.grid(row = 1, column = 3, padx = 10, pady = 10)

		# Signout button
		signoutbutton = tk.Button(self, text ="SIGN OUT", bg='grey', fg='white',
		command = lambda : controller.show_frame(SignInPage))
		signoutbutton.place(relx=.95, rely=.05,anchor= 'c')

		# EMPLID search 
		EMPLID = tk.StringVar()
		empllabelframe = LabelFrame(self, text= "EMPL ID", font = MEDIUMFONT,padx = 30,pady = 30)
		empllabelframe.place(relx=.25, rely=.25,anchor= 'c')
		EMPLIDEntry = ttk.Entry(empllabelframe,textvariable=EMPLID)
		EMPLIDEntry.grid(row = 2, column = 4, padx = 10, pady = 10)
		findbutton = tk.Button(empllabelframe, text ="FIND", bg='grey', fg='white',
		command = lambda : controller.searchUser(EMPLID.get()))
		findbutton.grid(row = 2, column = 5, padx = 10, pady = 10)
		
		# Authentication
		buttonLabel = LabelFrame(self, text= "Authentication", font = MEDIUMFONT,padx = 10,pady = 10)
		buttonLabel.place(relx=.25, rely=.75,anchor= 'c')
		# Approve Button 
		approve = tk.Button(buttonLabel, text ="YES", bg='green', fg='white',
		command = lambda : controller.authentication("Y"))
		approve.grid(row = 0, column = 0, padx = 10, pady = 10)
		# Deny button
		deny = tk.Button(buttonLabel, text ="NO", bg='red', fg='white',
		command = lambda : controller.authentication("N"))
		deny.grid(row = 1, column = 0, padx = 10, pady = 10)

	
	
	
	def my_time(self):

		date_time = LabelFrame(self, text= "", font = MEDIUMFONT,padx = 30,pady = 30)
		date_time.place(relx=.3, rely=.1,anchor= 'c')
		dateandtime = Label(date_time, font = LARGEFONT)
		dateandtime.grid(row = 1, column = 0, padx = 10, pady = 10)
		time_string = strftime("%m/%d/%Y %I:%M %p") # time format 
		
		dateandtime.config(text=time_string)
		self.after(30000,self.my_time)
		           

	def redlight(self):
		GPIO.setmode(GPIO.BCM)
		GPIO.setup(DENY_PIN, GPIO.OUT)
		GPIO.output(DENY_PIN, GPIO.HIGH)
		time.sleep(2)
		GPIO.output(DENY_PIN, GPIO.LOW)
		GPIO.cleanup()
	
	def greenlight(self):
		GPIO.setmode(GPIO.BCM)
		GPIO.setup(ALLOW_PIN, GPIO.OUT)
		GPIO.output(ALLOW_PIN, GPIO.HIGH)
		time.sleep(2)
		GPIO.output(ALLOW_PIN, GPIO.LOW)
		GPIO.cleanup()
	
	def activate_rfid(self):
		
			
		GPIO.setwarnings(False)
		reader = SimpleMFRC522()
		status = reader.read_no_block()
		
		if status == (None,None):
			print('NO CARD')
			result = db.fetch(1234)
			self.after(1000,self.activate_rfid)
		else:
			id,text = reader.read()
			result = db.fetch(id)
			# RFID SCAN
			myLabel = LabelFrame(self, text= "Student Information", font = MEDIUMFONT,padx = 30,pady = 30)
			myLabel.place(relx=.75, rely=.80,anchor= 'c')
			pygame.mixer.init()
			pygame.mixer.music.load(sound)
			pygame.mixer.music.play()
			if(result=="IU"):
				#print("I am here!")
				result = db.fetch(0)
				fp = io.BytesIO(result[3])
				# load the image
				image = Image.open(fp)
				# drawing image to top window
				render = ImageTk.PhotoImage(image)
				img = Label(image=render)
				img.image = render
				Error = Label(myLabel, text = "Error: User is unidentified")
				Error.grid(row = 1, column = 0, padx = 10, pady = 10)
				camera = LabelFrame(self, text= "Student", font = MEDIUMFONT,padx = 10,pady = 10)
				camera.place(relx=.75, rely=.42,anchor= 'c')
				cameralabel = Label(camera, image=render,borderwidth = 10,background="red")
				cameralabel.grid(row = 1, column = 0, padx = 10, pady = 10)
				pygame.mixer.init()
				pygame.mixer.music.load(denied)
				pygame.mixer.music.play()
				
				empl = Label(myLabel, text = "")
				empl.grid(row = 2, column = 0, padx = 10, pady = 10)
				
				vacc = Label(myLabel, text = "")
				vacc.grid(row = 3, column = 0, padx = 10, pady = 10)
				
				temp = Label(myLabel, text = db.temp())
				temp.grid(row = 4, column = 0, padx = 10, pady = 10)
				
				GPIO.cleanup()
				self.after(3000,self.activate_rfid)

			else:
				#pygame.mixer.init()
				#pygame.mixer.music.load(sound)
				#pygame.mixer.music.play()
				
				Name = Label(myLabel, text = "Name: "+result[0])
				Name.grid(row = 1, column = 0, padx = 10, pady = 10)
				
				empl = Label(myLabel, text = " EMPL ID: "+ str(result[1]))
				empl.grid(row = 2, column = 0, padx = 10, pady = 10)
				
				vacc = Label(myLabel, text = " Vaccination Status: "+str(result[2]))
				vacc.grid(row = 3, column = 0, padx = 10, pady = 10)
				
				temp = Label(myLabel, text = db.temp() + "\u00b0 F")
				temp.grid(row = 4, column = 0, padx = 10, pady = 10)
				
				fp = io.BytesIO(result[3])
				
				# load the image
				image = Image.open(fp)
				# drawing image to top window
				render = ImageTk.PhotoImage(image)
				img = Label(image=render)
				img.image = render
				camera = LabelFrame(self, text= "Student", font = MEDIUMFONT,padx = 10,pady = 10)
				camera.place(relx=.75, rely=.42,anchor= 'c')
				
				GPIO.cleanup()
				if(fm.driver(vs,maskNet,faceNet) == "Mask" and float(db.temp()) <101.5 and result!="IU"):
					pygame.mixer.init()
					pygame.mixer.music.load(success)
					pygame.mixer.music.play()
					cameralabel = Label(camera, image=render,borderwidth = 10,background="green")
					cameralabel.grid(row = 1, column = 0, padx = 10, pady = 10)
					self.greenlight()
				else:
					pygame.mixer.init()
					pygame.mixer.music.load(denied)
					pygame.mixer.music.play()
					cameralabel = Label(camera, image=render,borderwidth = 10,background="red")
					cameralabel.grid(row = 1, column = 0, padx = 10, pady = 10)
					self.redlight()
					
                    
                
				GPIO.cleanup()
				self.after(3000,self.activate_rfid)
# Driver Code
app = tkinterApp()
app.geometry('1500x1000')
app.title('Come-Thru')
def on_closing():
    if messagebox.askokcancel("Quit", "Do you want to quit?"):
        app.destroy()

app.protocol("WM_DELETE_WINDOW", on_closing)
app.mainloop()