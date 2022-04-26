import pygame
path = "/home/pi/Desktop/zapsplat_bells_medium_bell_soft_strike_long_decay_002_60153.mp3"

pygame.mixer.init()
speaker_volume = 0.5

pygame.mixer.music.load(path)
pygame.mixer.music.play()