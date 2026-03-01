import os
from flask import Flask, request, jsonify, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
from dotenv import load_dotenv

from models.sos_request import SOSRequest
from models.donor_location import DonorLocation
from services.geolocation_service import GeolocationService
from services.notification_service import NotificationService
from services.maps_service import MapsService

load_dotenv()

app = Flask(__name__)
CORS(app) # Enable CORS for all routes
socketio = SocketIO(app, cors_allowed_origins="*")

# Database Setup
client = MongoClient(os.getenv("MONGODB_URI"))
db = client.get_database()

# Services
notify_service = NotificationService()
maps_service = MapsService()

@app.route("/")
def index():
    return "SOS Blood Alert System Active"

@app.route("/api/v1/notify-service", methods=["POST"])
def trigger_sos():
    data = request.json
    blood_type = data.get("blood_type")
    units = data.get("units_needed")
    h_lat = data.get("hospital_lat")
    h_lng = data.get("hospital_lng")
    hospital_id = data.get("hospital_id")
    
    # 1. Save Request
    request_id = SOSRequest.create(db, hospital_id, blood_type, units, {"lat": h_lat, "lng": h_lng})
    
    # 2. Find Nearby Donors
    donors = GeolocationService.find_nearby_donors(db, h_lat, h_lng, blood_type)
    
    # 3. Broadcast Notifications
    hospital_name = "City Hospital" # In reality look up from DB
    notify_service.broadcast_sos(donors, blood_type, hospital_name)
    
    return f"""
    <div class="bg-green-50 border border-green-200 rounded-lg p-6 animate-bounce">
        <p class="text-green-800 font-bold text-xl">🚀 SOS Alert Broadcasted!</p>
        <p class="text-green-600 mt-2 font-semibold">Found <span class="text-2xl">{len(donors)}</span> donors within 10km ready to respond.</p>
        <p class="text-sm text-green-500 italic mt-1">Waiting for first acceptance...</p>
    </div>
    """

@app.route("/api/v1/update-status/<hospital_id>", methods=["GET"])
def get_active_requests(hospital_id):
    requests = list(db.sos_requests.find({"hospital_id": ObjectId(hospital_id), "status": "ACTIVE"}))
    for r in requests:
        r["_id"] = str(r["_id"])
        r["hospital_id"] = str(r["hospital_id"])
    return jsonify(requests)

@app.route("/api/v1/respond-to-call/<request_id>", methods=["POST"])
def respond_sos(request_id):
    data = request.json
    donor_id = data.get("donor_id")
    d_lat = data.get("donor_lat")
    d_lng = data.get("donor_lng")
    
    # Get hospital coords
    sos_req = db.sos_requests.find_one({"_id": ObjectId(request_id)})
    h_lat = sos_req["hospital_coords"]["lat"]
    h_lng = sos_req["hospital_coords"]["lng"]
    
    # Calculate ETA
    eta = maps_service.get_eta(d_lat, d_lng, h_lat, h_lng)
    
    # Update Request
    SOSRequest.add_response(db, request_id, donor_id, 0, eta)
    
    # Notify Hospital via SocketIO
    socketio.emit("donor_accepted", {
        "request_id": request_id,
        "donor_id": donor_id,
        "eta": eta,
        "location": {"lat": d_lat, "lng": d_lng}
    }, room=str(sos_req["hospital_id"]))
    
    return jsonify({"status": "success", "eta": eta})

# SocketIO Handlers
@socketio.on("join_hospital")
def on_join(data):
    hospital_id = data.get("hospital_id")
    print(f"Hospital {hospital_id} joined tracking")

@socketio.on("donor_location_update")
def handle_location_update(data):
    donor_id = data.get("donor_id")
    request_id = data.get("request_id")
    lat = data.get("lat")
    lng = data.get("lng")
    
    # Emit to hospital room
    sos_req = db.sos_requests.find_one({"_id": ObjectId(request_id)})
    if sos_req:
        socketio.emit("live_tracking", {
            "donor_id": donor_id,
            "lat": lat,
            "lng": lng
        }, room=str(sos_req["hospital_id"]))

if __name__ == "__main__":
    socketio.run(app, debug=True, port=5005)
