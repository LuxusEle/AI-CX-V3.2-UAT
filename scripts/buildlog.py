#!/usr/bin/env python3
import subprocess, datetime, os, sys, pathlib
root = pathlib.Path(__file__).resolve().parents[1]
log = root / "docs" / "BUILD_LOG.md"

def last_commit_message():
    msg = subprocess.check_output(["git","log","-1","--pretty=%B"], cwd=root).decode().strip()
    return msg

entry = f"## {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}\n- {last_commit_message()}\n"

with open(log, "a", encoding="utf-8") as f:
    f.write(entry)

print(f"Appended to {log}:\n{entry}")
