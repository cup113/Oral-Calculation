@echo off
if [%1] == [] ( goto end )
call vite build
echo dist| call netlify deploy --prod --message %1
git add .
git commit -m %1
git push origin main
:end
