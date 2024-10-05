# Configs
DatabaseURI = 'sqlite:///database.db'
UploadFolder = '.\\instance\\uploads'
CacheFolder = '.\\instance\\cache'
KeyPath = '.\\instance'
MaxFileSize = 10 * 1024 * 1024 * 1024 #10 GB
AcceptNewUsers = 5

adminmail = ["changeme@example.com"]

version = '1.0-2024.09.30'

# NOTE the SecretKey is automaticaly created and saved
SecretKey=''

# Generate Secret Key
import os, random

def generate_secret_key():
    chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+'
    return ''.join(random.choice(chars) for _ in range(50))

if not os.path.exists(os.path.join(KeyPath, "key.secret")):
    SecretKey = generate_secret_key()
    os.makedirs(KeyPath, exist_ok=True)
    with open(os.path.join(KeyPath, "key.secret"), 'w') as f:
        f.write(SecretKey)
else:
    with open(os.path.join(KeyPath, "key.secret"), 'r') as f:
        SecretKey = f.read().strip()

# Ensure the upload folder exists
if not os.path.exists(UploadFolder):
    os.makedirs(UploadFolder)
