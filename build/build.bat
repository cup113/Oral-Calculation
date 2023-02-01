@echo off
if [%1] == [] ( goto end )
git add .
git commit -m %1
call vite build
echo dist| call netlify deploy --prod --message %1
git push origin main
:end
