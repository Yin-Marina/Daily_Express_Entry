import os
import requests

# Define the URL
json_url = "https://www.canada.ca/content/dam/ircc/documents/json/ee_rounds_123_en.json"

# Define the save directory and file path
save_dir = "json"
save_path = os.path.join(save_dir, "ee_rounds_123_en.json")

# Ensure the directory exists
if not os.path.exists(save_dir):
    os.makedirs(save_dir)
    print(f"Created directory: {save_dir}")

# Fetch JSON data
response = requests.get(json_url)
if response.status_code == 200:
    with open(save_path, "wb") as file:
        file.write(response.content)
    print(f"JSON file saved to {save_path}")
else:
    print(f"Failed to fetch JSON. Status code: {response.status_code}")
    exit(1)

# Verify file exists
if os.path.exists(save_path):
    print(f"✅ File verified: {save_path}")
else:
    print(f"❌ Error: File was not saved correctly!")
    exit(1)
