#import webbrowser
import selenium  webdriver

# MacOS
chrome_path = 'open -a /Applications/Google\ Chrome.app %s'

# Windows
# chrome_path = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe %s'

# Linux
# chrome_path = '/usr/bin/google-chrome %s'

#open Phish Bank page in Chrome

webbrowser.get(chrome_path).open("http://www.phishbank.org")

#Scrape the last 100 entries in the page



//*[@id="entries"]/div[1]/div[2]/p

//*[@id="entries"]/div[2]/div[2]/p

#entries > div:nth-child(2) > div:nth-child(3) > p

//*[@id="entries"]/div[1]/div[2]/p/text()[1]
#entries > div:nth-child(1) > div:nth-child(3) > p