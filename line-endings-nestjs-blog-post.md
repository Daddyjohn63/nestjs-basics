# Fixing Line Ending Issues in NestJS Projects: A Complete Guide

## The Problem

When developing NestJS applications on Windows, you might encounter the frustrating linter error:

```
Delete `␍`
```

This cryptic error indicates that your files contain carriage return characters (`\r`) that your linter wants removed. This commonly happens when:

- Files are created on Windows but the project expects Unix-style line endings
- Git automatically converts line endings during checkout/commit
- Different editors handle line endings inconsistently
- The issue appears in Cursor but not in VS Code (editor-specific behavior)

## Understanding Line Endings

- **Windows**: Uses `\r\n` (CRLF - Carriage Return + Line Feed)
- **Unix/Linux/macOS**: Uses `\n` (LF - Line Feed only)
- **Modern development**: Generally prefers LF for consistency

## The Immediate Fix

If you're facing this issue right now, here's the quick fix using PowerShell:

```powershell
# Navigate to your problematic directory
cd src/my-logger

# Convert all TypeScript files from CRLF to LF
Get-ChildItem *.ts | ForEach-Object {
    (Get-Content $_.FullName -Raw).Replace("`r`n", "`n") |
    Set-Content $_.FullName -NoNewline
}
```

Or for the entire project:

```powershell
# Convert all TypeScript and JavaScript files in the project
Get-ChildItem -Recurse -Include *.ts,*.js,*.json | ForEach-Object {
    (Get-Content $_.FullName -Raw).Replace("`r`n", "`n") |
    Set-Content $_.FullName -NoNewline
}
```

## The Long-Term Solution

To prevent this issue in all future projects, implement these four configuration files:

### 1. `.gitattributes` (Most Important)

Create this file in your project root:

```gitattributes
# Auto detect text files and perform LF normalization
* text=auto

# Force LF line endings for these file types
*.ts text eol=lf
*.js text eol=lf
*.json text eol=lf
*.md text eol=lf
*.yml text eol=lf
*.yaml text eol=lf

# Binary files
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.woff binary
*.woff2 binary
```

### 2. `.editorconfig`

Ensures consistent behavior across all editors:

```editorconfig
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{js,ts,json}]
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false
```

### 3. `.prettierrc`

Configure Prettier to enforce LF line endings:

```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "printWidth": 100,
  "endOfLine": "lf"
}
```

### 4. Git Global Configuration

Run this command once on your development machine:

```bash
git config --global core.autocrlf false
```

This prevents Git from automatically converting line endings.

## Why Each File Matters

- **`.gitattributes`**: Controls how Git handles line endings during checkout/commit
- **`.editorconfig`**: Ensures your editor respects line ending preferences
- **`.prettierrc`**: Makes Prettier format files with consistent line endings
- **Git global config**: Prevents Git from interfering with your line endings

## NestJS Project Template

For future NestJS projects, create a template folder with these configuration files. When starting a new project:

1. Run `nest new my-project`
2. Copy your configuration files (`.gitattributes`, `.editorconfig`, `.prettierrc`)
3. Commit these files first before writing any code

## Editor-Specific Notes

### Cursor vs VS Code

If you see this issue in Cursor but not VS Code, it's likely due to:

- Different default line ending handling
- Different linter integration behavior
- Cursor may be more strict about detecting existing line ending issues

### Status Bar Check

Most editors show the current line ending type in the status bar:

- Look for "LF" (good) or "CRLF" (problematic)
- You can often click this to change the line ending for the current file

## Prevention Checklist

✅ Create `.gitattributes` with `eol=lf` for text files  
✅ Add `.editorconfig` with `end_of_line = lf`  
✅ Configure `.prettierrc` with `"endOfLine": "lf"`  
✅ Set Git global config: `core.autocrlf false`  
✅ Check editor status bar shows "LF"  
✅ Include these files in your project templates

## Troubleshooting

If you still see issues after implementing these fixes:

1. **Verify your files**: Check that the configuration files were created correctly
2. **Restart your editor**: Some changes require a restart to take effect
3. **Re-clone the repository**: Sometimes a fresh clone with proper Git attributes helps
4. **Check existing files**: Run the PowerShell conversion script on any existing problematic files

## Conclusion

Line ending issues are a common pain point in cross-platform development, especially when working with NestJS on Windows. By implementing these four configuration files and setting up your Git configuration properly, you can eliminate these issues permanently.

The key is to be proactive: set up these configurations before you start coding, and include them in your project templates. This small investment of time upfront will save you countless hours of debugging mysterious linter errors.

Remember: consistency is key in software development, and line endings are no exception!

---

_Tags: #NestJS #Git #Windows #Development #LineEndings #Linting #Configuration_
