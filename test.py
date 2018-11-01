# -*- coding: utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf-8')
from gtts import gTTS
import pygame
from pygame import mixer
from pygame import time
from tempfile import TemporaryFile


class mGTTs:
    def __init__(self):
        pass

    def run(self, text):
        # pygame.init()
        mixer.init()
        sf = TemporaryFile()
        
        tts = gTTS(text=text, lang='ko')
        
        clock = time.Clock()
        tts.write_to_fp(sf)
        sf.seek(0)
        mixer.music.load(sf)
        mixer.music.play()

        while mixer.music.get_busy()==True:
            clock.tick(1000)
            print( mixer.music.get_busy())
    
    def stop(self):
        mixer.music.stop()
    
if  __name__ == "__main__":
    m = mGTTs()
    try:
        m.run("안녕하세요")
        m.run("반가워요")
        m.run("하이")
    except KeyboardInterrupt:  # to stop playing, press "ctrl-c"
        m.stop()
        print("\nPlay Stopped by user")
    except Exception as e: 
        print(e)
        print("unknown error")

    
    

