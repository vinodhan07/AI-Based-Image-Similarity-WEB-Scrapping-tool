import os
import site
import subprocess

# PyTorch C extension DLL diagnosis
site_packages = site.getusersitepackages()
torch_c_ext = os.path.join(site_packages, "torch", "_C.cp311-win_amd64.pyd")

if os.path.exists(torch_c_ext):
    print(f"Checking dependencies for {torch_c_ext}")
    
    # We can use dumpbin if available to see what DLLs _C.pyd needs
    try:
        result = subprocess.run(["dumpbin", "/DEPENDENTS", torch_c_ext], capture_output=True, text=True)
        print("DUMPBIN OUTPUT:")
        print(result.stdout)
    except Exception as e:
        print("Dumpbin not found, cannot trace DLLs:", e)
else:
    print(f"Could not find {torch_c_ext}")
