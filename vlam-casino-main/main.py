from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route('/')
def mainPage():
    return render_template('Main Page.html')

@app.route('/geekWheel')
def geekWheel():
    return render_template('geekWheel.html')

if __name__ == '__main__':
    app.run(debug=True)
