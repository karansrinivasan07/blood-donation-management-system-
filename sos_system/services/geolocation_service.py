import math

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
            }
        }
        
        # In this implementation, we assume the donor_locations collection 
        # might need to be joined with a users collection if blood_type is not there
        # For simplicity, we'll assume blood_type is stored in donor_locations or linked
        
        donors = db.donor_locations.find(query)
        # We can further refine with haversine if needed, but MongoDB nearSphere is typically sufficient
        return list(donors)
