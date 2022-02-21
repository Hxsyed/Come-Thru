#temp.py (1 sec scan)

#libraries
import time,board,busio
import numpy as np
import adafruit_mlx90640

# 400k frequency and 2HZ refreshrate = 2 fps
i2c = busio.I2C(board.SCL, board.SDA, frequency=400000)
mlx = adafruit_mlx90640.MLX90640(i2c)
mlx.refresh_rate = adafruit_mlx90640.RefreshRate.REFRESH_2_HZ

#create frame then get a 1 sec temp values
frame = np.zeros((24*32,))
while True:
    try:
        mlx.getFrame(frame)
        break
    except ValueError:
        continue

#max will give our temp in C
print(np.max(frame))

#convert to fahrenheit
print((np.max(frame) *9/5) + 32)
