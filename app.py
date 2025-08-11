from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import random

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

API_KEY = 'c9a2ffd8b58c24398c07807296d4c81a'

@app.route('/aqi-data', methods=['GET'])
def get_aqi_data():
    lat = request.args.get('lat')
    lng = request.args.get('lng')

    if not lat or not lng:
        return jsonify({"error": "Missing lat or lng in query params"}), 400

    try:
        url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lng}&appid={API_KEY}"
        response = requests.get(url)
        data = response.json().get("list", [])[0]

        pm25 = data.get('components', {}).get('pm2_5', 0)
        pm10 = data.get('components', {}).get('pm10', 0)

        if pm25 is None and pm10 is None:
            return jsonify({"error": "Smog level data not available for this location"}), 404

        smog_level = (pm25 * 0.7) + (pm10 * 0.3)

        return jsonify({
            "location": {"lat": lat, "lng": lng},
            "pm25": pm25,
            "pm10": pm10,
            "smogLevel": smog_level,
            "aqiLevel": data.get('main', {}).get('aqi', 'Unavailable')
        })

    except Exception as e:
        return jsonify({"error": "Failed to fetch data from OpenWeather API"}), 500

@app.route('/smog-variation', methods=['POST'])
def smog_variation():
    points = request.get_json()

    if not isinstance(points, list) or len(points) == 0:
        return jsonify({"error": "Invalid input. Expected array of objects."}), 400

    all_same = all(point['smogLevel'] == points[0]['smogLevel'] for point in points)

    if all_same:
        varied = []
        for point in points:
            variation = random.randint(-15, 15)
            new_level = max(0, point['smogLevel'] + variation)
            varied.append({**point, "smogLevel": new_level})
        return jsonify(varied)
    else:
        return jsonify(points)

if __name__ == '__main__':
    app.run(debug=True, port=5000)