# Publishing Checklist

Before publishing to npm, follow these steps:

## 1. Update Package Information

Edit `package.json`:
- [ ] Update `author` name and email
- [ ] Update `repository` URL with your GitHub username
- [ ] Update `bugs` URL
- [ ] Update `homepage` URL
- [ ] Change package name if `@phantom-ai/cli` is taken

## 2. Test Locally

```bash
# Install dependencies
cd cli
npm install

# Test the CLI
npm link
phantom --help
phantom login
phantom wakeup

# Unlink after testing
npm unlink
```

## 3. Prepare for Publishing

```bash
# Login to npm (one-time setup)
npm login

# Check package for issues
npm pack --dry-run

# View what will be published
npm publish --dry-run
```

## 4. Publish to npm

```bash
# For first-time publish
npm publish --access public

# For updates (bump version first)
npm version patch  # or minor, or major
npm publish
```

## 5. Test Installation

```bash
# Test global install
npm install -g @phantom-ai/cli

# Or test with npx
npx @phantom-ai/cli wakeup
```

## 6. Update Documentation

- [ ] Add installation badge to README
- [ ] Update version in README
- [ ] Create GitHub release
- [ ] Announce on social media

## Version Management

```bash
npm version patch   # 1.0.0 -> 1.0.1 (bug fixes)
npm version minor   # 1.0.0 -> 1.1.0 (new features)
npm version major   # 1.0.0 -> 2.0.0 (breaking changes)
```

## Useful Commands

```bash
# View package info
npm view @phantom-ai/cli

# Unpublish (within 72 hours)
npm unpublish @phantom-ai/cli@1.0.0

# Deprecate a version
npm deprecate @phantom-ai/cli@1.0.0 "Use version 1.0.1 instead"
```

## Tips

1. **Test thoroughly before publishing** - Once published, you can't change it
2. **Use semantic versioning** - Follow semver.org guidelines
3. **Keep README updated** - Clear installation and usage instructions
4. **Add examples** - Show real use cases
5. **Monitor issues** - Respond to user feedback on GitHub
