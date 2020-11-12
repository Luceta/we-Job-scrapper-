from flask import Flask, render_template, request, redirect, send_file
##from indeed import get_jobs as get_indeed_jobs
##from so import get_jobs as get_so_jobs
from exporter import save_to_file
from scrapper import get_jobs

app = Flask("JobScrapper")
db = {}

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/search")
def search():
    word = request.args.get('word')
    if word:  #검색 단어가 있는 경우
        word = word.lower()  #검색 단어를 모두 소문자로 만들어 주는 함수
        fromDb = db.get(word)  #해당 검색어가 db에 존재하는지 확인

        if fromDb:  #해당 검색어가 db에 존재한다면
            jobs = fromDb  #db에 있는 자료를 출력
        else:  #해당 검색어가 db에 없다면
            jobs = get_jobs(word)  #해당 검색어를 기반으로 자료 추출
            db[word] = jobs  #검색단어에 따라 자료가 저장되도록 한다.

    else:  #검색 단어가 없는 경우
        return redirect("/")  #메인 페이지로 돌아간다
    return render_template(
        'search.html', searchword=word, resultsNumber=len(jobs), jobs=jobs)

@app.route("/export")
def export():
  try:
    word = request.args.get('word')
    if not word:
        raise Exception()
    word = word.lower()
    jobs = db.get(word)
    if not jobs :
        raise Exception()
    save_to_file(jobs)
    return send_file("jobs.csv", as_attachment = True)
  except:
    return redirect("/")


app.run(host="localhost")
