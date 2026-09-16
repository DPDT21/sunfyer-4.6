#define UNICODE
#define _UNICODE
#include <windows.h>
#include <shellapi.h>
#include <shlobj.h>
#include <tchar.h>
#include <stdio.h>
#include <stdlib.h>

#define DEFAULT_APP_URL L"https://ais-dev-qoe5elwp33znheflu3bcuf-557137885596.europe-west2.run.app"
#define APP_TITLE L"Sunfyer AI Assistant"

// Check if a file exists
BOOL FileExists(LPCWSTR szPath) {
    DWORD dwAttrib = GetFileAttributesW(szPath);
    return (dwAttrib != INVALID_FILE_ATTRIBUTES && !(dwAttrib & FILE_ATTRIBUTE_DIRECTORY));
}

// Try launching in dedicated Chromium / Edge App Mode
BOOL TryLaunchAppMode(LPCWSTR szExePath, LPCWSTR szUrl) {
    if (!FileExists(szExePath)) {
        return FALSE;
    }

    WCHAR szCmdLine[2048];
    _snwprintf(szCmdLine, 2048, L"\"%s\" --app=\"%s\" --window-size=1280,840 --enable-features=OverlayScrollbar", szExePath, szUrl);

    STARTUPINFOW si;
    PROCESS_INFORMATION pi;
    ZeroMemory(&si, sizeof(si));
    si.cb = sizeof(si);
    ZeroMemory(&pi, sizeof(pi));

    if (CreateProcessW(NULL, szCmdLine, NULL, NULL, FALSE, 0, NULL, NULL, &si, &pi)) {
        CloseHandle(pi.hProcess);
        CloseHandle(pi.hThread);
        return TRUE;
    }
    return FALSE;
}

// Read URL from companion config file if present
BOOL ReadConfigUrl(LPWSTR szUrlOut, DWORD dwMaxChars) {
    WCHAR szExePath[MAX_PATH];
    if (!GetModuleFileNameW(NULL, szExePath, MAX_PATH)) {
        return FALSE;
    }

    // Replace .exe with .url or look for sunfyer_url.txt in same directory
    WCHAR* lastSlash = wcsrchr(szExePath, L'\\');
    if (!lastSlash) return FALSE;

    WCHAR szConfigPath[MAX_PATH];
    *lastSlash = L'\0';
    _snwprintf(szConfigPath, MAX_PATH, L"%s\\sunfyer_url.txt", szExePath);

    FILE* fp = _wfopen(szConfigPath, L"r, ccs=UTF-8");
    if (!fp) {
        // Try Sunfyer.url
        _snwprintf(szConfigPath, MAX_PATH, L"%s\\Sunfyer.url", szExePath);
        fp = _wfopen(szConfigPath, L"r, ccs=UTF-8");
    }

    if (fp) {
        char line[1024];
        while (fgets(line, sizeof(line), fp)) {
            char* p = strstr(line, "http");
            if (p) {
                // Trim newline
                char* end = p;
                while (*end && *end != '\r' && *end != '\n') end++;
                *end = '\0';
                MultiByteToWideChar(CP_UTF8, 0, p, -1, szUrlOut, dwMaxChars);
                fclose(fp);
                return TRUE;
            }
        }
        fclose(fp);
    }
    return FALSE;
}

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
    (void)hInstance;
    (void)hPrevInstance;
    (void)nCmdShow;

    WCHAR szUrl[1024];
    wcsncpy(szUrl, DEFAULT_APP_URL, 1024);

    // 1. Check if command line argument passed a URL
    if (lpCmdLine && strlen(lpCmdLine) > 7 && strstr(lpCmdLine, "http")) {
        MultiByteToWideChar(CP_ACP, 0, lpCmdLine, -1, szUrl, 1024);
    } else {
        // 2. Check for companion config file
        WCHAR szFileUrl[1024];
        if (ReadConfigUrl(szFileUrl, 1024)) {
            wcsncpy(szUrl, szFileUrl, 1024);
        }
    }

    WCHAR szPath[MAX_PATH];
    WCHAR szCandidate[MAX_PATH];

    // 1. Check Google Chrome (64-bit Program Files) - Chrome holds active Google AI Studio session
    if (GetEnvironmentVariableW(L"ProgramFiles", szPath, MAX_PATH)) {
        _snwprintf(szCandidate, MAX_PATH, L"%s\\Google\\Chrome\\Application\\chrome.exe", szPath);
        if (TryLaunchAppMode(szCandidate, szUrl)) return 0;
    }

    // 2. Check Google Chrome (x86 Program Files)
    if (GetEnvironmentVariableW(L"ProgramFiles(x86)", szPath, MAX_PATH)) {
        _snwprintf(szCandidate, MAX_PATH, L"%s\\Google\\Chrome\\Application\\chrome.exe", szPath);
        if (TryLaunchAppMode(szCandidate, szUrl)) return 0;
    }

    // 3. Check Google Chrome in Local AppData
    if (GetEnvironmentVariableW(L"LOCALAPPDATA", szPath, MAX_PATH)) {
        _snwprintf(szCandidate, MAX_PATH, L"%s\\Google\\Chrome\\Application\\chrome.exe", szPath);
        if (TryLaunchAppMode(szCandidate, szUrl)) return 0;
    }

    // 4. Check direct chrome.exe on PATH
    STARTUPINFOW si;
    PROCESS_INFORMATION pi;
    ZeroMemory(&si, sizeof(si));
    si.cb = sizeof(si);
    ZeroMemory(&pi, sizeof(pi));
    WCHAR szDirectChrome[1024];
    _snwprintf(szDirectChrome, 1024, L"chrome.exe --app=\"%s\" --window-size=1280,840", szUrl);
    if (CreateProcessW(NULL, szDirectChrome, NULL, NULL, FALSE, 0, NULL, NULL, &si, &pi)) {
        CloseHandle(pi.hProcess);
        CloseHandle(pi.hThread);
        return 0;
    }

    // 5. Open in User's Default Windows Browser (opens in active signed-in session)
    HINSTANCE hResult = ShellExecuteW(NULL, L"open", szUrl, NULL, NULL, SW_SHOWNORMAL);
    if ((INT_PTR)hResult > 32) {
        return 0;
    }

    // 6. Fallback: Microsoft Edge (x86 Program Files)
    if (GetEnvironmentVariableW(L"ProgramFiles(x86)", szPath, MAX_PATH)) {
        _snwprintf(szCandidate, MAX_PATH, L"%s\\Microsoft\\Edge\\Application\\msedge.exe", szPath);
        if (TryLaunchAppMode(szCandidate, szUrl)) return 0;
    }

    // 7. Fallback: Microsoft Edge (64-bit Program Files)
    if (GetEnvironmentVariableW(L"ProgramFiles", szPath, MAX_PATH)) {
        _snwprintf(szCandidate, MAX_PATH, L"%s\\Microsoft\\Edge\\Application\\msedge.exe", szPath);
        if (TryLaunchAppMode(szCandidate, szUrl)) return 0;
    }

    MessageBoxW(NULL, L"Unable to launch browser for Sunfyer AI Assistant. Please open Google Chrome.", APP_TITLE, MB_OK | MB_ICONERROR);
    return 1;
}
