import os

# Define the folder path you want to explore
folder_path = ''

# Define the base URL
base_url = "https://raw.githubusercontent.com/FrancoFantomius/HF/refs/heads/main/"

# Define the output file
output_file = "index.txt"

# Open the index.txt file in write mode
with open(output_file, 'w') as file:
    # Walk through the folder and its subfolders
    for root, dirs, files in os.walk(folder_path):
        for filename in files:
            # Get the relative file path
            relative_path = os.path.relpath(os.path.join(root, filename), folder_path)
            # Create the URL by appending the relative path to the base URL
            file_url = base_url + relative_path.replace("\\", "/")  # Ensure the path uses forward slashes
            # Write the URL to the index.txt file
            file.write(file_url + '\n')

print(f"All file URLs have been written to {output_file}.")
