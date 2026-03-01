import os
import requests

class MapsService:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_MAPS_API_KEY")

    def get_eta(self, origin_lat, origin_lng, dest_lat, dest_lng):
        """
        Get ETA using Google Maps Directions API
        Returns duration in minutes
        """
        if not self.api_key:
            return 15 # Default fallback
            
        url = f"https://maps.googleapis.com/maps/api/directions/json?origin={origin_lat},{origin_lng}&destination={dest_lat},{dest_lng}&key={self.api_key}"
        
        try:
            response = requests.get(url)
            data = response.json()
            if data["status"] == "OK":
                duration_seconds = data["routes"][0]["legs"][0]["duration"]["value"]
                return round(duration_seconds / 60)
        except Exception as e:
            print(f"Maps API error: {e}")
            
        return 15 # Fallback
