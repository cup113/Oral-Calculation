@echo off
if "%1" == "" ( goto warning )
call pnpm build || goto end
call git add .
call git commit -m %1
call git push origin main && echo Push successfully!
goto end

:warning
echo build\release.bat version(with 'v')
goto end

:end
