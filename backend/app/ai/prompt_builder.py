import re
from datetime import datetime

class PromptBuilderAgent:

    def extract_schedule(self, text):
        text = text.lower()

        # Weekday Extraction
        weekdays = {
            "monday": 0, "tuesday": 1, "wednesday": 2,
            "thursday": 3, "friday": 4, "saturday": 5, "sunday": 6
        }

        weekday = None
        for w in weekdays:
            if w in text:
                weekday = weekdays[w]
                break

        # Time Extraction (e.g. 6 pm)
        time_match = re.search(r"(\d{1,2})\s?(am|pm)", text)
        hour = None

        if time_match:
            hr = int(time_match.group(1))
            period = time_match.group(2)

            if period == "pm" and hr != 12:
                hr += 12
            if period == "am" and hr == 12:
                hr = 0

            hour = hr

        return {"weekday": weekday, "hour": hour}

    def extract_email(self, text):
        emails = re.findall(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
        return emails[0] if emails else None

    def build_workflow(self, text, template_id=None):
        email = self.extract_email(text)
        schedule = self.extract_schedule(text)

        workflow_def = {
            "steps": [
                {
                    "type": "email",
                    "to": email,
                    "template_id": template_id,
                    "subject": "Automated Workflow Email"
                }
            ],
            "schedule": schedule
        }

        return workflow_def

prompt_builder_agent = PromptBuilderAgent()
