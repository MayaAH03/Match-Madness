from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# Load game data from JSON file
def load_game_data():
    #encoding with UTF-8 encoding to handle non-ASCII characters, the letters with accents!!
    with open('game_data.json', 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

@app.route('/api/game-data', methods=['GET'])
def get_game_data():
    data = load_game_data()
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
