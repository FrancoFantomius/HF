import os
import requests

# Define the input file containing the URLs
input_file = 'index.txt'

# Read the URLs from index.txt
with open(input_file, 'r') as file:
    urls = file.readlines()

# Loop through each URL
for url in urls:
    url = url.strip()  # Remove any extra whitespace/newlines
    if not url:
        continue  # Skip empty lines
    
    # Extract the file path from the URL after the base path
    base_url = "https://raw.githubusercontent.com/FrancoFantomius/HF/refs/heads/main/"
    if url.startswith(base_url):
        relative_path = url[len(base_url):]
    else:
        print(f"Skipping invalid URL: {url}")
        continue
    
    # Determine the local file path
    local_file_path = os.path.join(os.getcwd(), relative_path)
    
    # Create directories if they do not exist
    local_dir = os.path.dirname(local_file_path)
    os.makedirs(local_dir, exist_ok=True)
    
    # Download the file
    try:
        response = requests.get(url)
        response.raise_for_status()  # Check for any HTTP errors
        
        # Write the file content to the local file
        with open(local_file_path, 'wb') as local_file:
            local_file.write(response.content)
        
        print(f"Downloaded and saved: {local_file_path}")
    
    except requests.exceptions.RequestException as e:
        print(f"Failed to download {url}: {e}")

print("All files have been processed.")
