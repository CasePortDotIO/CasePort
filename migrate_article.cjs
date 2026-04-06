const fs = require("fs");
const path = require("path");

const sourcePath = path.join(__dirname, "caseport-insights-complete", "caseport-insights", "client", "src", "pages", "ArticlePage.tsx");
const targetPath = path.join(__dirname, "src", "app", "(frontend)", "insights", "[slug]", "page.tsx");
const errorTarget = path.join(__dirname, "src", "components", "insights", "ErrorBoundary.tsx");
const errorSource = path.join(__dirname, "caseport-insights-complete", "caseport-insights", "client", "src", "components", "ErrorBoundary.tsx");

// Copy ErrorBoundary
let errorContent = fs.readFileSync(errorSource, "utf8");
if (!errorContent.includes("'use client'")) {
    errorContent = `'use client'\n` + errorContent;
}
fs.writeFileSync(errorTarget, errorContent);

// Modify ArticlePage
let content = fs.readFileSync(sourcePath, "utf8");

// 1. Add 'use client'
if (!content.includes("'use client'")) {
    content = `'use client'\n` + content;
}

// 2. Change wouter imports to Next.js
content = content.replace(/import { useParams, Link } from "wouter";/g, `import { useParams } from "next/navigation";\nimport Link from "next/link";`);

// 3. Fix lucide-react (remove Linkedin, Twitter, add react-icons)
content = content.replace(/Linkedin, Twitter, /g, "");
content = content.replace(/import { useParams } from "next\/navigation";/g, `import { useParams } from "next/navigation";\nimport { FaLinkedin, FaTwitter } from "react-icons/fa";`);
// Now replace instances of <Linkedin and <Twitter
content = content.replace(/<Linkedin/g, "<FaLinkedin");
content = content.replace(/<Twitter/g, "<FaTwitter");

// 4. Update component imports
content = content.replace(/@\/components\/Navbar/g, "@/components/insights/Navbar");
content = content.replace(/@\/components\/Footer/g, "@/components/insights/Footer");
content = content.replace(/@\/components\/StructuredData/g, "@/components/insights/StructuredData");
content = content.replace(/@\/components\/AEOContent/g, "@/components/insights/AEOContent");
content = content.replace(/@\/components\/ErrorBoundary/g, "@/components/insights/ErrorBoundary");

// 5. Some other fixes for Next.js useParams
// wouter hook returns { slug: string }, same as next/navigation for dynamic routes
// React.FC syntax might need adjusting but usually fine, assuming Next js page is just a default export.

fs.writeFileSync(targetPath, content);
console.log("Migration complete!");
