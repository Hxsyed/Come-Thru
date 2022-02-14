import tkinter as tk
from tkinter import Label, ttk
from tkinter import messagebox
from db import Database

from tkinter import *

db = Database()

LARGEFONT =("Verdana", 35)
MEDIUMFONT =("Verdana", 20)

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
		self.show_frame(SignInPage)

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
	
	def authentication(self,action):
		print(action)
	
	def searchUser(self,EMPLID):
		ret = db.search(EMPLID)
		ret1 = db.fetch(34566235)
		print(ret1)
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
		label = ttk.Label(self, text ="Page 1", font = LARGEFONT)
		label.grid(row = 0, column = 4, padx = 10, pady = 10)

		#My code========================================================================
	
		myLabel = LabelFrame(self, text= "Student Information", font = MEDIUMFONT,padx = 30,pady = 30)
		myLabel.grid(row = 20, column = 1, padx = 10, pady = 10)

		result = db.fetch(1091481150244)
		
		Name = Label(myLabel, text = "Name: "+result[0])
		Name.grid(row = 1, column = 0, padx = 10, pady = 10)
		
		empl = Label(myLabel, text = " EMPL ID: "+ str(result[1]))
		empl.grid(row = 2, column = 0, padx = 10, pady = 10)
		
		vacc = Label(myLabel, text = " Vaccination Status: "+str(result[2]))
		vacc.grid(row = 3, column = 0, padx = 10, pady = 10)

		#=====================================================================================

		# EMPLID search 
		EMPLID = tk.StringVar()
		label1 = ttk.Label(self, text ="EMPL ID", font = MEDIUMFONT)
		label1.grid(row = 1, column = 4, padx = 10, pady = 10)
		EMPLIDEntry = ttk.Entry(self,textvariable=EMPLID)
		EMPLIDEntry.grid(row = 2, column = 4, padx = 10, pady = 10)
		findbutton = tk.Button(self, text ="FIND", bg='grey', fg='white',
		command = lambda : controller.searchUser(EMPLID.get()))
		findbutton.grid(row = 2, column = 5, padx = 10, pady = 10)
		# button to show frame 2 with text
		# layout2
	    # Entry button 
		
		#LabelFrame button for Approve and deny Buttons
		buttonLabel = LabelFrame(self, text= "", font = MEDIUMFONT,padx = 10,pady = 10)
		buttonLabel.grid(row = 20, column = 0, padx = 5, pady = 5)

		approve = tk.Button(buttonLabel, text ="YES", bg='green', fg='white',
		command = lambda : controller.authentication("Y"))
		approve.grid(row = 0, column = 0, padx = 10, pady = 10)
		# Deny button
		deny = tk.Button(buttonLabel, text ="NO", bg='red', fg='white',
		command = lambda : controller.authentication("N"))
		deny.grid(row = 1, column = 0, padx = 10, pady = 10)

# Driver Code
app = tkinterApp()
app.state('zoomed')
app.title('Come-Thru')
app.mainloop()
