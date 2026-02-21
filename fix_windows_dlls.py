import os
import urllib.request
import zipfile

def install_vc_redist():
    url = "https://aka.ms/vs/17/release/vc_redist.x64.exe"
    exe_path = "vc_redist.x64.exe"
    print("Downloading Visual C++ Redistributable...")
    urllib.request.urlretrieve(url, exe_path)
    print("Installing Visual C++ Redistributable (this may require admin rights)...")
    os.system(f"{exe_path} /install /quiet /norestart")
    print("Installation finished.")
    os.remove(exe_path)

if __name__ == "__main__":
    install_vc_redist()
