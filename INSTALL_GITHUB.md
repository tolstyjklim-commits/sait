# GitHub Pages Setup Guide

## 1. Initialize Git and add files
```bash
cd "C:\Users\Mr. Klim\Documents\Default Project\wooden-art-store"
git init
git add .
git commit -m "First commit: WoodyArt store"
```

## 2. Connect to GitHub repository
```bash
git branch -M main
git remote add origin https://github.com/tolstyjklim-commits/sait.git
git push -u origin main
```

## 3. Enable GitHub Pages
1. Open repository: https://github.com/tolstyjklim-commits/sait
2. Go to **Settings** → **Pages**
3. Select **Deploy from a branch**
4. Choose branch: `main`, folder: `/ (root)`
5. Click **Save**

Site will be available at:
https://tolstyjklim-commits.github.io/sait/