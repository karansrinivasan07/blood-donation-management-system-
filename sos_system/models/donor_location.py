from datetime import datetime, timedelta
from bson import ObjectId

class DonorLocation:
    collection_name = "donor_locations"

    @staticmethod
    def update_location(db, donor_id, coords):
        # coords should be [lng, lat] for legacy 2dsphere
        # but the prompt says {"type": "Point", "coordinates": [80.2707, 13.0827]}
        db[DonorLocation.collection_name].update_one(
            {"donor_id": ObjectId(donor_id)},
            {
                "$set": {
                    "last_seen": datetime.utcnow(),
                    "coords": {
                        "type": "Point",
                        "coordinates": coords # [lng, lat]
                    }
                }
            },
            upsert=True
        )

    @staticmethod
    def get_eligible_donors_nearby(db, coords, radius_km, blood_type):
        # 10km radius
        radius_radians = radius_km / 6371.0
        
        query = {
            "coords": {
                "$nearSphere": {
                    "$geometry": {
                        "type": "Point",
                        "coordinates": coords # [lng, lat]
                    },
                    "$maxDistance": radius_km * 1000 # in meters
                }
            },
            "eligible_until": {"$gt": datetime.utcnow()}
        }
        # In a real app we'd join with User collection to match blood_type
        # For now, let's assume donor_locations has blood_type or we filter later
        return list(db[DonorLocation.collection_name].find(query))
