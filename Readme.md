# Control Add-ins Development Supercharged

This repository is a follow-up of my NAV TechDays 2019 session named **Control Add-ins
Development Supercharged** and contains demos presented during the session.

There were total of 36 demos that I prepared for the session, but I delivered only about
25 of them. In this repo (and other follow-up repos) I'm making all of the demos available
to the public, together with the explanations and important code examples.

## Repository and Branch Info

This repository and branch contain the following:
* **Repository:** Stage 01 - "Simpler" control add-in
* **Branch:** 05-gulp-watch - Configuring a gulp watch task

## Branch Detailed Info

This branch configures `gulp` to automatically watch file changes for any JavaScript and
CSS files. In case there are any changes, it will automatically run the bundling process for
JavaScript or CSS, respectively.

## Configuring the watch task

An interesting feature of the `gulp` API is a possibility to [watch file changes](https://gulpjs.com/docs/en/getting-started/watching-files).
Much like using [globs](https://gulpjs.com/docs/en/getting-started/explaining-globs) to
specify files to process in context of a gulp task (using `gulp.src()`), you can use
globs to specify which files should be monitored. When a change is detected on a monitored
file, the configured task is executed automatically.

### Configuring the watch tasks

To configure `gulp` to watch files, you use the `gulp.watch()` method. The method takes
a glob (or array of globs) and task as parameters. You define the watch tasks inside your
`gulpfile.js` file, just like any other `gulp` tasks.

This is how I configured two separate watch tasks, one to watch JavaScript and one to
watch CSS:

```JavaScript
const watchJs = () => gulp.watch([globJs, `!${pathBundleJs}`], buildJs);
const watchCss = () => gulp.watch([globCss, `!${pathBundleCss}`], buildCss);
```

I am using array of globs here for both JavaScript and CSS. This is because I want to trigger
the buildJs and buildCss tasks when changes happen to any JavaScript or CSS file, other than
the bundle file.

It's important to understand that by merely invoking `gulp.watch()` you are not automatically
telling `gulp` to watch those files. The two lines above have merely created to separate
tasks. For `gulp` to "see" those tasks, you must export them, and then run them.

This is how I exported my watch tasks:

```JavaScript
exports.watch = gulp.parallel(watchJs, watchCss);
```

This defines one single task named `watch` that runs the `watchJs` and `watchCss` tasks in
parallel.

Now, I can run this in the terminal to tell gulp to start watching the files:

```PowerShell
gulp watch
```

When you do this, you'll see output similar to this:

```
[16:19:18] Using gulpfile C:\Source\Demos\TechDays2019\01 Simple Control Add-in\gulpfile.js
[16:19:18] Starting 'watch'...
[16:19:18] Starting 'watchJs'...
[16:19:18] Starting 'watchCss'...
```

You will also notice that this task doesn't end. This is by design. Watch tasks remain running
and the terminal window in which they are running remains busy until you terminate the task.

Now, open any JavaScript file (other than the bundle file, that is `simpler.min.js`), and just
press `Ctrl+S` to save it. Your terminal window will start giving you more info:

```
[16:20:56] Starting 'deleteBundleJs'...
[16:20:56] Finished 'deleteBundleJs' after 26 ms
[16:20:56] Starting 'bundleJs'...
[16:20:57] Finished 'bundleJs' after 586 ms
```

If you do the same for any CSS file (other than the `simpler.min.css` bundle file), you will
see that the CSS portion of the watch task executes:

```
[16:22:29] Starting 'deleteBundleCss'...
[16:22:29] Finished 'deleteBundleCss' after 22 ms
[16:22:29] Starting 'bundleCss'...
[16:22:29] Finished 'bundleCss' after 80 ms
```

You can now go on with developing your JavaScript or CSS. You can add files, modify files, or
delete files - as long as `gulp` matches them to globs you specified in your watch task,
the corresponding watch task will execute. For example, add a new file named `test.js` in your
`scripts` folder, and then delete that file. You'll see that `gulp` happily gulps on both
of these changes:

```
[16:24:01] Starting 'deleteBundleJs'...
[16:24:01] Finished 'deleteBundleJs' after 9.78 ms
[16:24:01] Starting 'bundleJs'...
[16:24:01] Finished 'bundleJs' after 495 ms
[16:24:13] Starting 'deleteBundleJs'...
[16:24:14] Finished 'deleteBundleJs' after 178 ms
[16:24:14] Starting 'bundleJs'...
[16:24:14] Finished 'bundleJs' after 513 ms
```

### Automating the watch task

At this point, we have a `watch` task monitoring relevant changes to our `scripts` and `styles`
folders, but this we are not quite there yet. The problem is - if you close VS Code, and then
start it again, and then start changing JavaScript or CSS files, you will see that the watch
task is not detecting those changes. That's because you have to run the watch task before it
starts performing; it's not executed automatically just because you want it to.

In fact - it's not `gulp` that's misbehaving here; it's VS Code that you need to teach a lesson.

So, let's configure VS Code to automatically execute the `gulp watch` task.

To configure your automatic task manually, in your `.vscode` folder, create a new file named
`tasks.json`, and put this content in there:

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Watch *.js and *.css",
            "command": "gulp",
            "type": "shell",
            "args": [
                "watch"
            ],
            "runOptions": {
                "runOn": "folderOpen"
            }
        }
    ]
}
```

However, you don't need to do this manually; VS Code can help you with this.
Instead of creating the `tasks.json` file manually, you can simply press `Ctrl+P`
to access the command palette, and then run **Tasks: Configure Task**. Then, in the
**Select a task to configure** prompt select **gulp: watch**. This will create the
`tasks.json` file for you, and will put the following content in there:

```json
{
    // See https://go.microsoft.com/fwlink/?LinkId=733558 
    // for the documentation about the tasks.json format
    "version": "2.0.0",
    "tasks": [
        {
            "type": "gulp",
            "task": "watch",
            "group": "build",
            "problemMatcher": []
        }
    ]
}
```

Now, replace the content with the example above. For your convenience, here it
goes again:

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Watch *.js and *.css",
            "command": "gulp",
            "type": "shell",
            "args": [
                "watch"
            ],
            "runOptions": {
                "runOn": "folderOpen"
            }
        }
    ]
}
```

The `"runOptions"` section defines the run options for this new task, and the `"runOn"`
option with value of `"folderOpen"` instructs VS Code to run `gulp watch` in a shell
(terminal) window every time this folder (workspace) opens.

However, if you restart VS Code now, it will still not run your task, because you first
must allow VS Code to run tasks automatically for this workspace. To do so, press
`Ctrl+P` again, and then in the command palette, run **Tasks: Manage Automatic Tasks in Folder**,
and then in the follow-up prompt, select **Allow Automatic Tasks in Folder**.

That's it. Now restart VS Code, and observe the terminal window. It should soon start
the `gulp watch` task, and you can start coding without worrying that your JavaScript
or CSS bundle will fall out of date.

And since you are in an AL workspace, you can just publish your extension and all your
JavaScript or CSS changes done to individual files are automatically deployed to your
BC instance through the bundle files included in your `controladdin` object. How cool
is that? 😎

### Dependencies

To use the `gulp.watch()` method, you don't need to install any dependencies.

## Conclusion

In this branch, you've seen how to configure `gulp` and VS Code to automatically monitor
changes on JavaScript and CSS source files and automatically execute the bunding process
when any changes are detected.

In the next follow-up branch, we'll look into the next cool feature of `gulp`: source maps.
