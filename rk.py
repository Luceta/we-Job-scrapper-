import requests
from bs4 import BeautifulSoup
URL = "https://remoteok.io/"


def extract_job(html):

  title = html.find("h2", {"itemprop": "title"}).string
  company = html.find("h3", {"itemprop": "name"}).string
  location = html.find("span", {"class": "location"})
  job_id = html.find("td", {"class": "source"}).find("a")


  if location is None:  #리모트라 위치 없는것이 더 많음
    location = ""
  else:
    location = location.string  
  if job_id is not None:    #닫힌 채용사이트 처리
    job_id = job_id['href']
    # print(title, company, location, job_id)
    # print("==================================")
    return {'title': title, 'company': company, 'location': location, 'apply_link': f"{URL}{job_id}"}
    
    
def extract_jobs(url):
  jobs = []
  
  print(f"RemoteOk Scrapping page is One.")
  print(url)
  
  headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36'}
  result = requests.get(url, headers=headers)
  soup = BeautifulSoup(result.text, "html.parser")
  results = soup.find_all("tr", {"class": "job"})
  # results_except = soup.find_all("tr", {"class": "closed"})
        
  #results =  soup.find_all("tr", {"class": "hot"})
  # print(len(results))   23
  
  for result in results:
    # closed 된것은 불러오지 않을 것
    if(result.find("td", {"class": "source"}).find("a") is not None):
      job = extract_job(result)          
      jobs.append(job)
  return jobs
          

def get_jobs(word):
    url = f"{URL}remote-dev+{word}-jobs"
    jobs = extract_jobs(url)
    return jobs
