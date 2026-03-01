import math
from datetime import datetime

def haversine(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    """
    R = 6371  # Earth radius in km
    
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    
    a = math.sin(dphi / 2)**2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2)**2
        
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

class GeolocationService:
    @staticmethod
    def find_nearby_donors(db, hospital_lat, hospital_lng, blood_type, radius_km=10):
        # First use MongoDB 2dsphere index for broad filtering
        # Note: MongoDB uses [lng, lat]
        query = {
            "coords": {
                "$nearSphere": {
                    "$geometry": {
                        "type": "Point",
                        "coordinates": [hospital_lng, hospital_lat]
                    },
                    "$maxDistance": radius_km * 1000
                }
            },
            "blood_type": blood_type, # Ensure blood type match
            "eligible_until": {"$gt": datetime.utcnow()} # Basic eligibility check
        }
        
        donors = db.donor_locations.find(query)
        return list(donors)
