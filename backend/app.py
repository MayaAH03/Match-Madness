from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes


frontend_folder = os.path.join(os.getcwd(), "..", "frontend")
build_folder = os.path.join(frontend_folder,"build")

@app.route("/", defaults={"filename": ""})
@app.route("/<path:filename>")
def index(filename):
    if not filename:
        filename = "index.html"
    try:
        return send_from_directory(build_folder, filename)
    except FileNotFoundError:
        return "File not found", 404
    

# Serve static files from the 'static' directory in 'build'
@app.route("/static/<path:filename>")
def static_files(filename):
    try:
        return send_from_directory(os.path.join(build_folder, "static"), filename)
    except FileNotFoundError:
        return "File not found", 404

# Load game data from JSON file
def load_game_data():
    #encoding with UTF-8 encoding to handle non-ASCII characters, the letters with accents!!
    with open('game_data.json', 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

#api route to get game data from JSON file
@app.route('/api/game-data', methods=['GET'])
def get_game_data():
    data = load_game_data()
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
