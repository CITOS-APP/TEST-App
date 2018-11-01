# -*- coding: utf-8 -*-

import sys
reload(sys)
sys.setdefaultencoding('utf-8')
from gtts import gTTS
import pygame
from pygame import mixer
from pygame import time
from tempfile import TemporaryFile

import datetime
import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web


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
            # print( mixer.music.get_busy())
    
    def stop(self):
        mixer.music.stop()

class WSHandler(tornado.websocket.WebSocketHandler):
    clients = []
    def check_origin(self, origin):
        return True

    def open(self):
        print 'new connection'
        self.write_message("Hello World")
        WSHandler.clients.append(self)

    def on_message(self, message):
        m = mGTTs()
        print 'message received %s' % message
        m.run(message)
        # print 'message received %s' % message
        self.write_message('ECHO: ' + message)

    def on_close(self):
        print 'connection closed'
        WSHandler.clients.remove(self)

    @classmethod
    def write_to_clients(cls):
        print "Writing to clients"
        # for client in cls.clients:
            # client.write_message("Hi there!")


application = tornado.web.Application([
  (r'/ws', WSHandler),
])


if __name__ == "__main__":
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(8888)
    tornado.ioloop.IOLoop.instance().add_timeout(datetime.timedelta(seconds=15), WSHandler.write_to_clients)
    tornado.ioloop.IOLoop.instance().start()