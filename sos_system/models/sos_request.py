from datetime import datetime
from bson import ObjectId

class SOSRequest:
    collection_name = "sos_requests"

    @staticmethod
    def create(db, hospital_id, blood_type, units_needed, hospital_coords, urgency="CRITICAL"):
        request = {
            "hospital_id": ObjectId(hospital_id),
            "blood_type": blood_type,
            "units_needed": units_needed,
            "urgency": urgency,
            "hospital_coords": hospital_coords,  # {"lat": 13.0827, "lng": 80.2707}
            "status": "ACTIVE",
            "created_at": datetime.utcnow(),
            "matched_donors": [],
            "responses": []
        }
        result = db[SOSRequest.collection_name].insert_one(request)
        return str(result.inserted_id)

    @staticmethod
    def add_response(db, request_id, donor_id, distance_km, eta_minutes):
        response = {
            "donor_id": ObjectId(donor_id),
            "distance_km": distance_km,
            "eta_minutes": eta_minutes,
            "status": "ENROUTE",
            "live_location": None
        }
        db[SOSRequest.collection_name].update_one(
            {"_id": ObjectId(request_id)},
            {"$push": {"responses": response}}
        )
