@echo off
if [%2] == [] ( goto warning )
if not [%3] == [] ( goto warning )
echo Please make sure you have:
echo (1) Edited version information in src/App.vue.
echo (2) Edited version of package.json.
echo (3) made pnpm-lock.yaml up-to-date.
echo (4) made README.md coverage ^& other information up-to-date.
echo (5) printed README.md to public/README.html.
echo (6) printed CHANGELOG.md to public/CHANGELOG.html.
set /p ready="Ready? (y/N) "
if not "%ready%" == "y" ( goto end )
call pnpm build || goto end
call git add .
call git commit -m %2
call git tag %1
call netlify deploy --prod -d dist --message %2
call git push origin main --tags && echo Push successfully!
goto end

:warning
echo build\release.bat version(with 'v') commit-info
goto end

:end
