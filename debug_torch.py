import os
import sys

try:
    import torch
    print("Torch imported successfully!")
except ImportError as e:
    print(f"ImportError caught: {e}")
    # Print the exact path to the _C.cp311-win_amd64.pyd file
    import site
    site_packages = site.getusersitepackages()
    torch_dir = os.path.join(site_packages, 'torch')
    print(f"Checking torch directory: {torch_dir}")
    
    for f in os.listdir(torch_dir):
        if f.startswith('_C'):
            print(f"Found C extension: {f}")
            pyd_path = os.path.join(torch_dir, f)
            
            # Use os.add_dll_directory if Python >= 3.8
            if hasattr(os, 'add_dll_directory'):
                lib_path = os.path.join(torch_dir, 'lib')
                if os.path.exists(lib_path):
                    print(f"Adding DLL directory: {lib_path}")
                    os.add_dll_directory(lib_path)
            break
