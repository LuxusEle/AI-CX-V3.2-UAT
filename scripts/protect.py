#!/usr/bin/env python3
\"\"\"Fail if protected modules are modified without override.\"\"\"
import json, os, subprocess, sys, shlex
def sh(cmd): return subprocess.check_output(shlex.split(cmd), text=True).strip()
def main():
    allow = None
    for i, arg in enumerate(sys.argv):
        if arg == "--allow-protected" and i+1 < len(sys.argv): allow = sys.argv[i+1]
    protected = set(json.load(open(".protected-modules.json"))["modules"])
    base = os.environ.get("BASE_REF", "HEAD~1")
    try: diff = sh(f"git diff --name-only {base}").splitlines()
    except Exception: diff = sh("git diff --name-only --cached").splitlines()
    touched = [p for p in diff if p in protected]
    if touched and not allow:
        print("❌ Protected modules modified:\\n - " + "\\n - ".join(touched))
        sys.exit(2)
    print("✅ Protect check passed."); sys.exit(0)
if __name__ == "__main__": main()
