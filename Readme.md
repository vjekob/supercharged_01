# Control Add-ins Development Supercharged

This repository is a follow-up of my NAV TechDays 2019 session named **Control Add-ins
Development Supercharged** and contains demos presented during the session.

There were total of 36 demos that I prepared for the session, but I delivered only about
25 of them. In this repo (and other follow-up repos) I'm making all of the demos available
to the public, together with the explanations and important code examples.

## Repository and Branch Info

This repository and branch contain the following:
* **Repository:** Stage 01 - "Simpler" control add-in
* **Branch:** 06-gulp-debug - Building and integrating source maps

## Branch Detailed Info

This branch configures `gulp` to build source maps for all code that it processes. Source maps 
are exteremely
useful because they allow you to debug your original source code from a VS Code instance,
rather than your bundle files through browser developer tools.

## What are source maps

The more comprehensive your gulp process becomes, the more remote your source code is
from the code that's actually running in the browser. At this point your `gulp` concatenates
the source files together, and then minifies them, and then saves the results as a bundle.
Your browser loads and runs the bundle file, and knows nothing of the source files from which
the bundle was built.

If you attach VS Code to a browser for debugging purposes (for example, using the [Chrome
Debugger extension for VS Code](https://code.visualstudio.com/blogs/2016/02/23/introducing-chrome-debugger-for-vs-code)),
you cannot set breakpoints in your source files. The browser knows nothing of your source
files, and VS Code cannot match whatever the browser is executing with the original source
files in your workspace. You can, though, successfully set breakpoints in the bundle file
loaded by the browser, but that's not how you want to debug anything. It would be akin to
debugging a C# program by stepping through the assembly code executing on your processor.

Enter source maps.

Source maps are exactly what you can imply from their name: maps for source. They tell your
browser (and consequently, any debugger attached to the browser) which file, line of code
and line position in your source code matches which statement in the resulting bundle file.

As your `gulp` (or any other bundler or compiler capable of producing source maps) transforms
your code, it maintains the source maps. Then, it can store the source maps together with
the generated bundle file, and your browser can then use those   allow the
debugger attached to it to locate the source files and allow debugging through the actual
source, including support for breakpoints.

## Configuring gulp for source maps

There are a number of `gulp` plugins that you can use to build source maps. My personal
preference is the most obvious one: `gulp-sourcemaps` (https://www.npmjs.com/package/gulp-sourcemaps).

You should know how to install it by now, but just in case it's still a mystery, you do
this:

```PowerShell
npm install gulp-sourcemaps --save-dev
```

When this plugin installs, you can proceed with modifying the `gulpfile.js` file. Start
by requiring the new plugin. Add this line to the end of the `require` block at the
beginning of the file:

```JavaScript
const sourcemaps = require("gulp-sourcemaps");
```

Then, locate the `bundleJs` task; you'll need to modify it.

Sourcemap generation has two stages: in the first stage you initialize the source maps,
and in the second stage you write the source maps. The rule is simple: the first stage
is performed right after reading the files that need to be mapped (and before any of
transformations takes place), and the second stage occurs right before writing the
bundle file (and after all of the transformations).

In our case, our `bundleJs` task looks like this at this point:

```JavaScript
const bundleJs = () => gulp
    .src([globJs, `!${path.js}/start.js`])
    .pipe(concat(bundleJsFileName))
    .pipe(uglify())
    .pipe(gulp.dest(path.js))
```

It's a very simple task, it has four stages:
1. Reads the files to transform and bundle from the disk
2. Concatenates the files into the bundle
3. Uglifies (minifies) the bundle
4. Writes the bundle to the disk

We need to add `gulp-sourcemaps` stages right after the first stage, and right before
the fourth stage.

To initialize source maps, you call the `init()` method, and to write them, you call the
`write()` method. Couldn't possibly be any simpler.

This is what the final `bundleJs` task will look like:

```JavaScript
const bundleJs = () => gulp
    .src([globJs, `!${path.js}/start.js`])
    .pipe(sourcemaps.init())
    .pipe(concat(bundleJsFileName))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.js))
```

And that's it. When your `bundleJs` tasks executes, `gulp` will generate source maps
for you. In the example above, I've shown how to use *inline* source maps - these maps
are embedded into the bundle file. There are also *external* source maps, but we'll
talk about those at a later stage when we introduce [webpack] to our toolchain.

## Debugging

Now that you have sourcemaps, you can use VS Code to debug your original, unbundled,
unminified JavaScript source files.

Let's configure the debugger.

First step is to install a browser debugger extension. Here, I'll show how to use
Chrome debug extension, but there are debugger extensions for Edge (which includes
support for Edge "Canary", too) and for Firefox. Unfortunately, there is no Safari
debugging extension, and I don't see one coming any time soon.

Go to Extensions (in the Activity bar in VS Code), search for the *Debugger for Chrome*
extension, and install it.

Then, go to Debug (again, in the Activity bar), and click the gear icon to open 
`launch.json` file. Then, click **Add Configuration > Chrome (Launch)**. Now, you need
to configure your Chrome debugger to launch your BC page that contains your control
add-in, and you need to point it to look for source files in the correct directory.

This is an example of the correct Chrome debugger launch configuration on my machine:

```json
{
    "type": "chrome",
    "request": "launch",
    "name": "Launch Chrome",
    "url": "https://demos.vjeko.com/BC150/?page=50100",
    "webRoot": "${workspaceFolder}/src/add-in/scripts"
}
```

The ["url"] property should point to your BC page that contains the control add-in. 
The ["webRoot"] property should point to the folder that contains your scripts.

If you configure your launch configuration like this, you will be able to debug your
source scripts.

## Starting the debugger

Debugging time. First, run `gulp build` to build your bundle (that now includes the
source maps). Then, run the `AL: Publish without debugging` command. This will deploy
the control add-in with the script containing source maps, and will start the web
client. However, you need to close this web client instance, because Chrome debugger
cannot use browser instances that are not executed with correct startup options to
enable external debuggers to attach to them.

Before you run the debugger, open the [simpler.interface.js] file and set a breakpoint
at the `data.forEach...` line.

Now, go to Debug in the Activity bar, and from **Debug** dropdown, select **Launch Chrome**.
VS Code will launch Chrome with remote debugging enabled, it will attach to the debugger
process, and your breakpoint will come alive. In a couple of moments, it will be hit and
you'll be able to debug your source JavaScript file regardless of the fact that your
browser is executing something very different looking than your source files.

Pretty cool stuff, this.

## Conclusion

We are slowly approaching having a serious toolset configured and running. At this point,
you are creating a minified bundle with source maps that allow you to debug your control
add-in source files in VS Code.

In the next follow-up branch, we'll add another important step - we'll introduce **babel**
to help us with cross-browser compatibility. Stay tuned!
