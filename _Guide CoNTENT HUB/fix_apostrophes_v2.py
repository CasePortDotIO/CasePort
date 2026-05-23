#!/usr/bin/env python3
import re

# Read the file
with open('/home/ubuntu/caseport-guides-hub/client/src/components/CategoryGuideTemplate.tsx', 'r') as f:
    content = f.read()

# Replace escaped apostrophes ONLY inside single-quoted strings
# This regex finds single-quoted strings and replaces \' with '
def fix_quotes(match):
    string_content = match.group(1)
    # Replace escaped apostrophes with regular apostrophes
    fixed = string_content.replace("\\'", "'")
    return f"'{fixed}'"

# Find all single-quoted strings and fix them
content = re.sub(r"'((?:[^'\\]|\\.)*)'", fix_quotes, content)

# Write back
with open('/home/ubuntu/caseport-guides-hub/client/src/components/CategoryGuideTemplate.tsx', 'w') as f:
    f.write(content)

print("✅ All apostrophes fixed correctly!")
