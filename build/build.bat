@echo off
if [%1] == [] ( goto end )
git add .
git commit -m %1
call pnpm build
call netlify deploy --prod -d dist --message %1
git push origin main
:end
