@echo on
REM disable hibernate
powercfg -hibernate off
REM sleep
%windir%\System32\rundll32.exe powrprof.dll,SetSuspendState 0,1,0