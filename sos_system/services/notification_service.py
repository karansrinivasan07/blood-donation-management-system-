import os
from twilio.rest import Client
import firebase_admin
from firebase_admin import messaging, credentials

class NotificationService:
    def __init__(self):
        # Initialize Twilio
        self.twilio_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.twilio_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.twilio_number = os.getenv("TWILIO_PHONE_NUMBER")
        if self.twilio_sid and self.twilio_token:
            self.twilio_client = Client(self.twilio_sid, self.twilio_token)
        else:
            self.twilio_client = None

        # Initialize FCM
        try:
            cred = credentials.Certificate(os.getenv("FCM_CREDENTIALS_PATH", "fcm-key.json"))
            firebase_admin.initialize_app(cred)
        except Exception as e:
            print(f"FCM initialization failed: {e}")

    def send_push(self, token, title, body, data=None):
        message = messaging.Message(
            notification=messaging.Notification(title=title, body=body),
            data=data or {},
            token=token
        )
        try:
            response = messaging.send(message)
            return response
        except Exception as e:
            print(f"Push notification failed: {e}")
            return None

    def send_sms(self, to_number, body):
        if self.twilio_client:
            try:
                message = self.twilio_client.messages.create(
                    body=body,
                    from_=self.twilio_number,
                    to=to_number
                )
                return message.sid
            except Exception as e:
                print(f"SMS failed: {e}")
                return None
        return None

    def broadcast_sos(self, donors, blood_type, hospital_name):
        # Notify multiple donors
        results = []
        message_body = f"URGENT: {blood_type} blood needed at {hospital_name}. Respond NOW!"
        
        for donor in donors:
            # Assume donor object has fcm_token and phone
            if donor.get("fcm_token"):
                self.send_push(donor["fcm_token"], "SOS BLOOD EMERGENCY", message_body)
            if donor.get("phone"):
                self.send_sms(donor["phone"], message_body)
        return True
