# Control Add-ins Development Supercharged

This repository is a follow-up of my NAV TechDays 2019 session named **Control Add-ins
Development Supercharged** and contains demos presented during the session.

There were total of 36 demos that I prepared for the session, but I delivered only about
25 of them. In this repo (and other follow-up repos) I'm making all of the demos available
to the public, together with the explanations and important code examples.

## Repository and Branch Info

This repository and branch contain the following:
* **Repository:** Stage 01 - "Simpler" control add-in
* **Branch:** 04-gulp-useful - Configuring a few useful gulp tasks

## Branch Detailed Info

This branch adds a few more `gulp` tasks and showcases how gulp can be introduced in
a control add-in development workflow in a useful way.

The `gulpfile.js` now contains tasks to bundle *.js and *.css files into separate
JavaScript and CSS bundles.

## Installing dependencies

Very often gulp tasks will require external dependencies. Those dependencies are typically
installed as Node.js modules, and you can install them from the Terminal window using this
general syntax:

```PowerShell
npm install <module_name> --save-dev
```

> **Important:** Always make sure to include the `--save-dev` option when installing gulp
dependency modules.

In this branch, the following Node.js dependencies are used:
- `del` (https://www.npmjs.com/package/del) for deleting files
- `gulp-clean-css` (https://www.npmjs.com/package/gulp-clean-css) for minifying CSS files
- `gulp-concat` (https://www.npmjs.com/package/gulp-concat) for concatenating multiple files into one
- `gulp-uglify-es` (https://www.npmjs.com/package/gulp-uglify-es) for minifying JavaScript files

You can install these dependencies by doing:

```PowerShell
npm install del --save-dev
npm install gulp-clean-css --save-dev
npm install gulp-concat --save-dev
npm install gulp-uglify-es
```

When you run an `npm install` command, the Node Package Manager will mark the
dependencies in the `package.json` file. After installing all the necessary dependencies,
this file should contain contents similar to the following under the `devDependencies` section:

```json
"devDependencies": {
    "del": "^5.1.0",
    "gulp": "^4.0.2",
    "gulp-clean-css": "^4.2.0",
    "gulp-concat": "^2.6.1",
    "gulp-uglify": "^3.0.2",
    "gulp-uglify-es": "^2.0.0"
}
```

The purpose of this section of the `package.json` file is to list the dependencies that
must be present on any development machine. If any of the dependencies listed in here
are not available, or an incorrect version is available, you can always make your dependencies
up-to-date by simply running this:

```PowerShell
npm install
```

The `npm install` command will go through the dependencies listed in the `package.json` and
will make sure that all of them are available in the `node_modules` subfolder. If any of 
the dependencies is not available, npm will download them and make them available.

> **Important:** The `package.json` file must not be excluded from source control in the
`.gitignore` file.

## Task structure

The `gulpfile.json` file is a JavaScript module file, and as such it must explicitly export
any publicly accessible functionality. Gulp will treat any function exported from `gulpfile.js`
as a task.

The only top-level task that is accessible to gulp in this example is `build`. This is how
it is declared (and exported):

```JavaScript
exports.build = gulp.parallel(buildJs, buildCss);
```

It's a composite task that runs two subtasks in parallel: `buildJs` and `buildCss`. These
two subtasks build the JavaScript and the CSS bundles.

This is how they are declared:

```JavaScript
const buildJs = gulp.series(deleteBundleJs, bundleJs);
const buildCss = gulp.series(deleteBundleCss, bundleCss);
```

Apparently, each of them is a composite task in their own right. They both run as a series
of subtasks (each task in a series must complete before gulp executes the next one). They
each first delete the existing bundle file, and then build a new bundle file.

The delete part of the JavaScript and CSS parts of the build process are defined as this:

```JavaScript
const deleteBundleJs = () => del(pathBundleJs);
const deleteBundleCss = () => del(pathBundleCss);
```

They are simple tasks: they simply use the `del` dependency to delete the specified file.

The bundling tasks are also very similar in their structure, and they follow a similar
pattern:
1. Collect the files to bundle using `gulp.src()` function
2. Pipe the files into the `concat` task (from the `gulp-concat` dependency)
3. Pipe the concatenated file into the transformation task (`uglify` for JavaScript, and `cleanCss` for CSS)
4. Pipe the transformed file into the `gulp.dest()` function that stores the file at the specified location

This is what JavaScript bundling task looks like:

```JavaScript
const bundleJs = () => gulp
    .src([globJs, `!${path.js}/start.js`])
    .pipe(concat(bundleJsFileName))
    .pipe(uglify())
    .pipe(gulp.dest(path.js))
```

... and this is the same for CSS: 

```JavaScript
const bundleCss = () => gulp
    .src(globCss)
    .pipe(concat(bundleCssFileName))
    .pipe(cleanCss())
    .pipe(gulp.dest(path.css))
```

Now, you can run the `build` task by executing this command in the Terminal window:

```PowerShell
gulp build
```

It will give an output similar to this one:

```
[22:12:40] Using gulpfile C:\Source\Demos\TechDays2019\01 Simple Control Add-in\gulpfile.js
[22:12:40] Starting 'build'...
[22:12:40] Starting 'deleteBundleJs'...
[22:12:40] Starting 'deleteBundleCss'...
[22:12:40] Finished 'deleteBundleJs' after 49 ms
[22:12:40] Starting 'bundleJs'...
[22:12:40] Finished 'deleteBundleCss' after 86 ms
[22:12:40] Starting 'bundleCss'...
[22:12:41] Finished 'bundleJs' after 460 ms
[22:12:41] Finished 'bundleCss' after 458 ms
[22:12:41] Finished 'build' after 596 ms
```

... and it will create two new files in your `scripts` and `styles` folders respectively.
Inspect their contents to see how they differ from your original source files.

## Notes about best practices

In this example, for simplicity purposes, the bundle file is built in the same folder as the
source files. Normally, you would not configure `gulp` to do this. However, for simplicity
purposes and to allow easy tracing of changes between example branches, this is how `gulp`
is configured in this example.

In real life, you'll want your source files to reside in a different directory than your 
bundle file. Soon, we'll configure our workspace like that, too; for now, just keep in mind
that the actual folder structure for real-life project should be different than this one here.

## Conclusion

In this branch, you've seen how to configure `gulp` to run your bundling task. This process
results in much more compact files, reduces the number of files to download, which also
improves your control add-in startup performance.

In the next follow-up branch, you'll see how to automate `gulp` itself even further by
configuring it to run automatically whenever you change your source JavaScript or CSS files.
