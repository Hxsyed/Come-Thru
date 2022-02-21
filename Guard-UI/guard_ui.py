from tkinter import *
import tkinter as tk
from tkinter import Label, ttk, messagebox
# from tkinter import messagebox
from db import Database
# from datetime import datetime
from time import strftime
import threading
# import time
import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
# from check import rfid_check

db = Database()
# rfid = rfid_check()
#now = datetime.now()
LARGEFONT =("Verdana", 35)
MEDIUMFONT =("Verdana", 20)


class tkinterApp(tk.Tk):
	
	
	# __init__ function for class tkinterApp
	def __init__(self, *args, **kwargs):
		print("hello world")
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
		else:
			# Turn on the red led right on bred board
			print(auth)
	
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

		# Camera
		camera = LabelFrame(self, text= "Live Camera", font = MEDIUMFONT,padx = 10,pady = 10)
		camera.place(relx=.75, rely=.25,anchor= 'c')
		cameralabel = Label(camera, text = "cameralabel: ")
		cameralabel.grid(row = 1, column = 0, padx = 10, pady = 10)

		# self.my_time()
	
	
	
	def my_time(self):

		date_time = LabelFrame(self, text= "", font = MEDIUMFONT,padx = 30,pady = 30)
		date_time.place(relx=.3, rely=.1,anchor= 'c')
		dateandtime = Label(date_time, font = LARGEFONT)
		dateandtime.grid(row = 1, column = 0, padx = 10, pady = 10)
		time_string = strftime("%m/%d/%Y %I:%M %p") # time format 
		
		dateandtime.config(text=time_string)
		threading.Timer(2.0, self.my_time).start()
	
	#def camera(self):
		#camera = LabelFrame(self, text= "Live Camera", font = MEDIUMFONT,padx = 10,pady = 10)-
		#camera.place(relx=.75, rely=.25,anchor= 'c')-
		
		#L1 =Label(self)-
		#L1.place(relx=.75, rely=.25,anchor= 'c')-
		#cap = cv2.VideoCapture(0)
		#cam = cv2.VideoCapture(0)-
		#cv2image= cv2.cvtColor(cam.read()[1],cv2.COLOR_BGR2RGB)-
		#img = Image.fromarray(cv2image).resize((500,500), Image.ANTIALIAS)-
		# Convert image to PhotoImage
		#imgtk = ImageTk.PhotoImage(image = img)-
		#L1.imgtk = imgtk-
		#L1.configure(image=imgtk)-
		 # Repeat after an interval to capture continiously
           #label.after(20, show_frames)	
		#cv2.imwrite('/home/pi/testimage.jpg', image)
		#cam.release()
		#cv2.destroyAllWindows()
		#threading.Timer(0.0001,self.camera).start()-
		           

	def activate_rfid(self):

		GPIO.setwarnings(False)	
		reader = SimpleMFRC522()
		id,text = reader.read()
		result = db.fetch(id)
        # RFID SCAN
		myLabel = LabelFrame(self, text= "Student Information", font = MEDIUMFONT,padx = 30,pady = 30)
		myLabel.place(relx=.75, rely=.75,anchor= 'c')
		if(result=="IU"):
			Error = Label(myLabel, text = "Error: User is unidentified")
			Error.grid(row = 1, column = 0, padx = 10, pady = 10)
			GPIO.cleanup()
			threading.Timer(2.0,self.activate_rfid).start()

		else:
			Name = Label(myLabel, text = "Name: "+result[0])
			Name.grid(row = 1, column = 0, padx = 10, pady = 10)
			
			empl = Label(myLabel, text = " EMPL ID: "+ str(result[1]))
			empl.grid(row = 2, column = 0, padx = 10, pady = 10)
			
			vacc = Label(myLabel, text = " Vaccination Status: "+str(result[2]))
			vacc.grid(row = 3, column = 0, padx = 10, pady = 10)
			
			temp = Label(myLabel, text = db.temp())
			temp.grid(row = 4, column = 0, padx = 10, pady = 10)
			GPIO.cleanup()
			threading.Timer(2.0,self.activate_rfid).start()
    
		

# Driver Code
app = tkinterApp()
app.geometry('1500x1000')
app.title('Come-Thru')
app.mainloop()
