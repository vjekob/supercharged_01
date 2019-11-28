# Control Add-ins Development Supercharged

This repository is a follow-up of my NAV TechDays 2019 session named **Control Add-ins
Development Supercharged** and contains demos presented during the session.

There were total of 36 demos that I prepared for the session, but I delivered only about
25 of them. In this repo (and other follow-up repos) I'm making all of the demos available
to the public, together with the explanations and important code examples.

## Repository and Branch Info

This repository and branch contain the following:
* **Repository:** Stage 01 - "Simpler" control add-in
* **Branch:** 03-gulp-hello-world - Introducing gulp

## Branch Detailed Info

This branch introduces [**gulp**](https://gulpjs.com/) - an essential tool to automate
development tasks, and it integrates nicely into VS Code.

This branch contains a "Hello, World!" example in gulp, no more, no less.

## Installing gulp

You might have used VS Code for a while, and you may have customized it heavily with extensions
of all sorts. However, chances are that you don't have all the things installed on your machine
because for AL development you don't really need them.

The first one you need to have is [Node.js](https://nodejs.org/). That's a prerequisite not only
for gulp, but also for for all future examples in this series. You just can't do serious web
front-end development these days without Node.js.

Let's first check if you have Node.js installed. Start VS Code, then in the Terminal window,
enter this:

```PowerShell
node --version
```

It should print something like this:

```
v10.13.0
```

If you don't have Node.js installed, then you'll see something like this:

```
node : The term 'node' is not recognized as the name of a cmdlet, function,
script file, or operable program. Check the spelling of the name, or if a
path was included, verify that the path is correct and try again.
At line:1 char:1
```

If you don't have Node.js, download the current LTS version from https://nodejs.org/en/

> **Important:** Make sure to install the version marked as **LTS**, not the one marked
as **Current**. The **Current** version is what's currently in development, while **LTS**
is what's currently in **Long Term Support** stage.

Once you have Node.js installed, time to install gulp.

First, install it globally (a prerequisite!) for your machine:

```PowerShell
npm i gulp --global
```

Once that is done, install it locally for your workspace (for now, just do it inside
your AL workspace):

```PowerShell
npm i gulp --save-dev
```

Now, restart VS Code (important if you want to put gulp to work immediately). When it
restarts, go to the Terminal window, and type this:

```PowerShell
gulp --version
```

It should give you something like this:

```
CLI version: 2.2.0
Local version: 4.0.2
```

If the `Local version` is shown as `Unknown` then you either didn't install it locally
for your workspace, or you are running the command from the context of a workspace or
folder where there is no local gulp installation. Check the previous step and fix it.

## `node_modules`, `.gitignore`, and `package-lock.json`

Once you install gulp locally, you'll notice that a new folder appears in your workspace:
`node_modules`. This folder contains dependencies for your Node.js applications, and
you need to get used to it sitting there in your workspaces. I won't go deep into theory,
if you want to read more about it, check the official documentation at https://docs.npmjs.com/files/folders.html
or just google it https://www.google.com/search?q=what+is+node_modules

One important thing to know about `node_modules` is that it **does not belong in git**
and you must add it to your `.gitgnore` file. If you don't have a `.gitignore` file in
your workspace, create one in the root of your workspace.

Then, add this to it:

```
node_modules
```

Another file you got when you installed gulp locally is `package-lock.json`. This file
is used by npm (Node Package Manager) to describe the dependencies used by your workspace.
You don't need to change this file manually.

> **Important:** Do not add `package-lock.json` to your `.gitignore`!

## `gulpfile.js`

Now that you have installed gulp, time to put it to work. Gulp uses `gulpfile.js`
to define tasks. This file must exist in the root of your workspace.

In this file, you define gulp tasks using JavaScript. We'll spend more time with gulp
in future examples, for this time, let's start with only this:

```JavaScript
function helloWorld(done) {
    console.log("Hello, World!");
    done();
}

exports.hello = helloWorld;
```

As simple as that. This creates a simple tasks that does nothing but print "Hello, World!"
to the console (in this case, it will be the Terminal).

This task is immediately available to gulp. To prove it, type this in the Terminal:

```PowerShell
gulp --tasks
```

And you'll see something like this:

```
[11:03:06] Tasks for C:\Source\test\gulpfile.js
[11:03:06] └── hello
```

You can also run this task. Do it using gulp...

```PowerShell
gulp hello
```

... or using VS Code by accessing the Command Palette (Ctrl+Shift+P), entering the
`Tasks: Run Task` command, then selecting `gulp: hello` from the list. If prompted,
select the `Continue without scanning the task output` option.

In either case, the output will be similar to this:

```
[11:06:25] Using gulpfile C:\Source\test\gulpfile.js
[11:06:25] Starting 'hello'...
Hello, World!
[11:06:25] Finished 'hello' after 2.64 ms
```

## Conclusion

That's it for today. Congratulations on installing gulp and making it work. We'll
spend much more time with it in the examples to follow.
