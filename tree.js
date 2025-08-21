import fs from "fs";
import path from "path";

// Folder to scan
const ROOT_DIR = "./";  
const OUTPUT_FILE = "tree.txt";

// Folders to ignore
const IGNORE_FOLDERS = ["node_modules", ".git"];

function generateTree(dir, prefix = "") {
  let treeStr = "";
  const items = fs.readdirSync(dir, { withFileTypes: true });

  items.forEach((item, index) => {
    const itemPath = path.join(dir, item.name);
    
    // Skip ignored folders
    if (item.isDirectory() && IGNORE_FOLDERS.includes(item.name)) return;

    const isLast = index === items.length - 1;
    const pointer = isLast ? "└── " : "├── ";
    treeStr += `${prefix}${pointer}${item.name}\n`;

    if (item.isDirectory()) {
      const newPrefix = prefix + (isLast ? "    " : "│   ");
      treeStr += generateTree(itemPath, newPrefix);
    }
  });

  return treeStr;
}

// Generate tree and write to file
const tree = generateTree(ROOT_DIR);
fs.writeFileSync(OUTPUT_FILE, tree);

console.log(`✅ Project tree written to ${OUTPUT_FILE} (node_modules and .git ignored)`);
