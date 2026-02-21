import sys
import os
import site

site_packages = site.getusersitepackages()
torch_c_ext = os.path.join(site_packages, "torch", "_C.cp311-win_amd64.pyd")

if not os.path.exists(torch_c_ext):
    print("Cannot find torch C extension")
    sys.exit(1)

import pefile
pe = pefile.PE(torch_c_ext)

print("Checking imported DLLs for _C.pyd:")
for entry in pe.DIRECTORY_ENTRY_IMPORT:
    dll_name = entry.dll.decode('utf-8')
    print(f"  Requires: {dll_name}")
    
print("\nChecking if required DLLs exist in the PyTorch lib folder:")
torch_lib_dir = os.path.join(site_packages, "torch", "lib")
if os.path.exists(torch_lib_dir):
    actual_libs = [f.lower() for f in os.listdir(torch_lib_dir)]
    for entry in pe.DIRECTORY_ENTRY_IMPORT:
        dll_name = entry.dll.decode('utf-8').lower()
        if dll_name not in actual_libs and not dll_name.startswith("api-ms-win"):
            print(f"MISSING IN TORCH LIB: {dll_name}")
else:
    print("No torch lib directory found!")
