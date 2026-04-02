import speech_recognition as sr
import pyttsx3

def speech_to_text():
    recognizer = sr.Recognizer()

    with sr.Microphone() as source:
        print("Speak now...")
        audio = recognizer.listen(source)

    try:
        return recognizer.recognize_google(audio)
    except:
        return "Could not understand"


def text_to_speech(text):
    engine = pyttsx3.init()
    engine.say(text)
    engine.runAndWait()