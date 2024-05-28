from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import logging

app = Flask(__name__)
CORS(app, resources={r"/stagiaire": {"origins": "*"}})  # Enable CORS for the /stagiaire route

client = MongoClient("mongodb://localhost:27017/")
db = client["system_facial"]
collection = db["stagiaire"]

logging.basicConfig(level=logging.INFO)

@app.route('/')
def index():
    return 'Welcome to the backend!'

@app.route('/stagiaire', methods=['GET', 'OPTIONS'])
def get_stagiaire():
    if request.method == "OPTIONS":  
        return _build_cors_prelight_response()
    else:
        try:
            stagiaire_list = []
            for stagiaire in collection.find():
                stagiaire_list.append({
                    "_id": str(stagiaire["_id"]),
                    "nom": stagiaire["nom"],
                    "prenom": stagiaire["prenom"],
                    "date_naissance": stagiaire["date_naissance"],
                    "genre": stagiaire["genre"]
                })
            return jsonify(stagiaire_list)
        except Exception as e:
            error_msg = f"Error fetching stagiaires: {e}"
            logging.error(error_msg)
            return jsonify({"error": error_msg}), 500

def _build_cors_prelight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    return response

if __name__ == '__main__':
    app.run(debug=True, port=5000)
