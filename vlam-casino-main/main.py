from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route('/Home')
def mainPage():
    return render_template('Main Page.html')

@app.route('/GeekWheel')
def geekWheel():
    return render_template('geekWheel.html')

@app.route('/Casino')
def casinol():
    return render_template('casino.html')

if __name__ == '__main__':
    app.run(debug=True)
