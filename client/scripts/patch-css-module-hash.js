/* eslint-disable */
/**
 * Makes CSS Module class names identical on Windows and Linux.
 *
 * THE BUG
 * -------
 * react-dev-utils/getCSSModuleLocalIdent.js hashes the module's path:
 *
 *   loaderUtils.getHashDigest(
 *     path.posix.relative(context.rootContext, context.resourcePath) + localName, …)
 *
 * `path.posix.relative` treats "\" as an ordinary character, so on Windows the
 * hashed string still contains backslashes:
 *
 *   Windows : src/components\Navbar\Navbar.module.css   -> .Navbar_navLogo__giohx
 *   Linux   : src/components/Navbar/Navbar.module.css   -> .Navbar_navLogo__O4awZ
 *
 * Same source, same CRA version, different class names per platform.
 *
 * WHY IT MATTERED HERE
 * --------------------
 * prerender-cache/ holds pre-rendered markup captured on a developer machine and
 * is replayed by a build on the Linux host. With platform-dependent class names,
 * every cached page referenced classes the host-built CSS did not define — so
 * all 107 pages shipped completely unstyled until React re-rendered a second
 * later. Visitors saw a full-screen unstyled image before the site appeared.
 *
 * THE FIX
 * -------
 * Normalise the separator before hashing, so the hashed string is the same
 * everywhere. Runs from "postinstall"/"prebuild", like the existing
 * patch-react-scripts-dev-server.js, so a fresh npm install re-applies it.
 */
const fs = require('fs');
const path = require('path');

const TARGET = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-dev-utils',
  'getCSSModuleLocalIdent.js'
);

const NEEDLE = 'path.posix.relative(context.rootContext, context.resourcePath) + localName,';
const PATCHED =
  '// PATCHED (scripts/patch-css-module-hash.js): path.posix.relative leaves\n' +
  '    // Windows backslashes in the string, which changes the hash and makes\n' +
  '    // class names differ between Windows and Linux builds.\n' +
  '    path\n' +
  '      .relative(context.rootContext, context.resourcePath)\n' +
  '      .split(path.sep)\n' +
  '      .join(\'/\') + localName,';

if (!fs.existsSync(TARGET)) {
  // Not fatal: a production install without react-dev-utils just skips this.
  console.log('[patch-css-module-hash] react-dev-utils not present — skipped');
  process.exit(0);
}

const src = fs.readFileSync(TARGET, 'utf8');

if (src.includes('patch-css-module-hash')) {
  console.log('[patch-css-module-hash] already applied');
  process.exit(0);
}

if (!src.includes(NEEDLE)) {
  console.warn(
    '[patch-css-module-hash] WARNING: expected code not found in ' +
      'react-dev-utils/getCSSModuleLocalIdent.js — CSS Module class names may ' +
      'differ between platforms, which breaks prerender-cache replay. ' +
      'Check whether react-scripts changed.'
  );
  process.exit(0);
}

fs.writeFileSync(TARGET, src.replace(NEEDLE, PATCHED), 'utf8');
console.log('[patch-css-module-hash] CSS Module class names are now platform-independent');
