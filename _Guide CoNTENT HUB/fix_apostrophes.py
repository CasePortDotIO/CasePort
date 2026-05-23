#!/usr/bin/env python3
import re

# Read the file
with open('/home/ubuntu/caseport-guides-hub/client/src/components/CategoryGuideTemplate.tsx', 'r') as f:
    content = f.read()

# Replace all escaped apostrophes with regular apostrophes
# This handles both \' and \'
content = content.replace("\\'", "'")

# Write back
with open('/home/ubuntu/caseport-guides-hub/client/src/components/CategoryGuideTemplate.tsx', 'w') as f:
    f.write(content)

print("✅ All apostrophes fixed!")
