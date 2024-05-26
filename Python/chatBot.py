# -*- coding: utf-8 -*-
"""
Created on Sat May 25 21:02:50 2024

@author: Matt Kline
"""
# dependencies
# pip install wolframalpha
# pip install wikipedia


import wolframalpha
import wikipedia
import re


# Wikipedia search function
def search_wiki(keyword=''):

  # search in wikipedia
  searchResults = wikipedia.search(keyword)

  if not searchResults:
    message = "Sorry, No result from Wikipedia. Try again."
    response(message)
    return

  try:
    page = wikipedia.page(searchResults[0])

  except Exception as err:
    page = wikipedia.page(err.options[0])

  wikiTitle = str(page.title.encode('utf-8'))
  wikiSummary = str(page.summary.encode('utf-8'))

  return str(wikiSummary)[2:]


# Wolframalpha search function
def search(text=''):

  res = client.query(text)

  # check if query is resolved
  if res['@success'] == 'false':
     # search wikipedia if unsuccessful  
     response(search_wiki(text))
  else:
    result = ''
    # pod0 contains query and pod1 contains result
    pod0 = res['pod'][0]
    pod1 = res['pod'][1]
    if (('definition' in pod1['@title'].lower()) or ('result' in  pod1['@title'].lower()) or (pod1.get('@primary','false') == 'true')):
      
      result = resolveListOrDict(pod1['subpod'])
      return result
    else:
      question = resolveListOrDict(pod0['subpod'])
      question = question.split('(')[0]
      search_wiki(question)


def resolveListOrDict(variable):
  if isinstance(variable, list):
    return variable[0]['plaintext']
  else:
    return variable['plaintext']


# Bot activity function
def activity(data):

    # about bot
    if re.search("are you", data) or re.search("your name", data):
        listening = True
        intro = "I'm Wiki-Bot. I have access to Wolfram|Alpha and Wikipedia."
        response(intro)

    # bot help
    elif re.search("help", data) or re.search("you do", data):
        listening = True
        message = 'I have access to Wolfram|Alpha and Wikipedia. Ask anything and I will find the answer for you. To quit say bye, quit, or stop'
        response(message)

    # stop the bot
    elif re.search("stop", data) or re.search("bye", data) or re.search("quit", data):
        listening = False
        print('Bot: Bye')
        print('Listening stopped')
        return listening
    
    elif re.search("created you") or re.search("made you"):
        listening = True
        message = 'This instance was created by Matt Kline.'
        return listening

    # search keyword
    else:
        listening = True
        result = search(data)
        if result is not None:
            response(result)
            response("Do you have any additional questions?")
        else:
            message = "Please try again."
            response(message)

    return listening


# Text response function
def response(data):
    print('Bot:', data)
    

### main ###

# Wolframalpha App Id
appId = 'JH9XHR-W9J76L7H5A'
# Wolfram Instance
client = wolframalpha.Client(appId)


greet = "Hi there, what can I do for you?"
response(greet)

# loop till listening is False 
listening = True
while listening == True:
    
    data = str(input('User: ')).lower()
    if data != '':
        listening = activity(data)
    else:
        message = "Please try again."
        response(message)