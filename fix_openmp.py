import os
import urllib.request

def download_libomp():
    # PyTorch CPU requires libomp140.x86_64.dll which is often missing
    url = "https://github.com/llvm/llvm-project/releases/download/llvmorg-14.0.0/libomp140.x86_64.dll"
    import site
    site_packages = site.getusersitepackages()
    torch_lib_dir = os.path.join(site_packages, 'torch', 'lib')
    
    if os.path.exists(torch_lib_dir):
        target_path = os.path.join(torch_lib_dir, "libomp140.x86_64.dll")
        print(f"Downloading OpenMP DLL to {target_path}...")
        try:
            urllib.request.urlretrieve(url, target_path)
            print("Download successful.")
        except Exception as e:
            print(f"Failed to download: {e}")
    else:
        print(f"Could not find torch lib directory at {torch_lib_dir}")

if __name__ == "__main__":
    download_libomp()
