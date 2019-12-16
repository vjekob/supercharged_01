# Control Add-ins Development Supercharged

This repository is a follow-up of my NAV TechDays 2019 session named **Control Add-ins
Development Supercharged** and contains demos presented during the session.

There were total of 36 demos that I prepared for the session, but I delivered only about
25 of them. In this repo (and other follow-up repos) I'm making all of the demos available
to the public, together with the explanations and important code examples.

## Repository and Branch Info

This repository and branch contain the following:
* **Repository:** Stage 01 - "Simpler" control add-in
* **Branch:** 06-gulp-babel - Adding babel to the toolchain

## Branch Detailed Info

This branch configures `gulp` to include `babel`. [Babel](https://babeljs.io/) is a JavaScript 
compiler that transpiles between different versions of JavaScript. At it's heart, `babel` makes
sure that your JavaScript code runs under all browsers (or runtime environments).

## What does `babel` do

Babel allows you to use next generation JavaScript regardless of what browsers or what runtime
environments your JavaScript code will run at.

Even though I don't like copying and pasting content from other sites here, I simply can't do
`babel` right if I don't copy what it's documentation says about it.

> Babel is a toolchain that is mainly used to convert ECMAScript 2015+ code into a backwards compatible version of JavaScript in current and older browsers or environments. Here are the main things Babel can do for you:
>
>* Transform syntax
>* Polyfill features that are missing in your target environment (through @babel/polyfill)
>* Source code transformations (codemods)
>* And more!

## Configuring gulp for babel

Unlike previous examples in previous branches of this repo, configuring `babel` is complex.
Whoever tells you otherwise is just not honest enough. Working with `babel` - especially if
you are doing it for the first time - will take some time before you get it right.

The core reason for this is the huge number of possible combinations of what JavaScript *dialect*
you write and what JavaScript *dialect* you want to transpile into. For example, if you are using
some experimental EcmaScript 2019 features and want to make sure that code still runs in Internet
Explorer 8, your transpiled JavaScript will look a lot different if you are writing using strict
EcmaScript 2016 features, and merely want to make your code run in modern browsers with full
EcmaScript 2015 support.

That's why you can't merely ***use*** `babel`, but you must also make sure to ***configure***
`babel` correctly. And configuring `babel` requires you to download and configure multiple plug-ins.

My goal here is not to explain `babel` in-depth or to go deep into what `babel` can do in all
different scenarios. My only concern here is to make sure you can use `gulp`, add `babel` to the
`gulp` toolchain, and get debuggable code that works in all browsers including IE11.

Let's start by installing `babel` itself. This is what you should do:

```PowerShell
npm i @babel/core --save-dev
```

This will install `babel` core functionality, and make it a development dependency. However, this
will not already allow you to reference `babel` from your `gulpfile.js`. To allow that, you must 
install `gulp`'s plugin for babel:

```PowerShell
npm i gulp-babel --save-dev
```

The next thing you should install is a [preset](https://babeljs.io/docs/en/presets) that covers
nearly all of use cases: the `env` preset. You can read more about this preset here:
https://babeljs.io/docs/en/next/babel-preset-env.html

This is how you install it:

```PowerShell
npm i @babel/preset-env --save-dev
```

On top of this, you'll need a plugin named [`transform-runtime`](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime):

```PowerShell
npm i @babel/plugin-transform-runtime --save-dev
```

And for this one to work correctly in all situations, you'll need this one:

```PowerShell
npm i core-js --save-dev
```

This gets you the minimum of plugins that you'll need to be able to successfully use `babel`
from your `gulpfile.js`. You may want to use some other plugins and packages, but I've personally
found this setup good enough.

## Adding `babel` to your `gulp` toolchain

Now that `babel` and all its dependencies are installed and available, you are ready to configure
it in your `gulpfile.js`. That's an easier part.

The first thing you must do is import the `gulp-babel` module:

```JavaScript
const babel = require("gulp-babel");
```

After that, you simply need to add `babel` to your build pipeline. It's just this line of code:

```JavaScript
    .pipe(babel({ presets: ["@babel/preset-env"] }))
```

Or, if you want to see the entire build task (in my example, it's the `bundleJs` function), here
you go:

```JavaScript
const bundleJs = () => gulp
    .src([globJs, `!${path.js}/start.js`])
    .pipe(sourcemaps.init())
    .pipe(concat(bundleJsFileName))
    .pipe(babel({
        presets: ["@babel/preset-env"]
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.js));
```

For `babel` to be the most efficient inside your `gulp` build pipeline, you should include it after
all other tasks that transform code, but before the minification task.

Now, for all `babel` purists out there, this seems not to be the cleanest `babel` configuration, and
even `babel` documentation says that you should not merely use `"@babel/preset-env"` preset, and should
instead configure it explicitly, like for example this way:

```json
{
  "presets": [
        ["@babel/preset-env", {
            "targets": {
                "ie": 11,
                "browsers": "last 2 versions"
            },
            "useBuiltIns": "usage"
        }]
    ]
}
```

Yes, indeed, that would be much better, but it wouldn't really make much difference for what we
are trying to do here (make our control add-in work in all browsers). The thing is - syntax is
only half of the problem.

Take a look at this simple example:

```JavaScript
Promise.resolve(() => alert("Done"));
```

This won't work in IE. `"@babel/preset-env"` will do an honest attempt to make sure it works
*syntactically*, and will give you this:

```JavaScript
Promise.resolve(function() {
  return alert("Done");
});
```

But this *still* won't run in IE, and this time it's not because of the syntax. The syntax is
perfectly okay here, it's a runtime feature that IE doesn't understand: `Promise`.

With correct `@babel/preset-env` configuration, the best you can get from `babel` is this:

```JavaScript
require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

Promise.resolve(function() {
  return alert("Done");
});
```

But this will *still* not work in IE. This time it's because IE doesn't understand the
`require` function.

And to make that work, you have to use [*polyfills*](https://en.wikipedia.org/wiki/Polyfill_(programming)).

For polyfilling functionality, I recommend using https://polyfill.io/ - this website allows
you to configure the polyfills you need, and build a URL that requests those polyfills. However,
when your browser sends the actual request, the website will only serve those polyfills that
you actually need. For example, if you access the URL with IE, it will polyfill missing features,
while the same URL may return an empty string for Chrome.

This is the script URL I use:
https://polyfill.io/v3/polyfill.min.js?flags=gated%2Calways&features=Symbol%2CElement.prototype.append%2CArray.prototype.includes

... and I make it a part of my `controladdin` declaration:

```Pascal
    Scripts =
        'https://polyfill.io/v3/polyfill.min.js?flags=gated%2Calways&features=Symbol%2CElement.prototype.append%2CArray.prototype.includes',
        'src/add-in/scripts/simpler.min.js';
```

And this is why I don't configure `@babel/preset-env` in more detail - I let it transpile to
generally-compatible syntax, and I let the polyfill.io website to configure everything else for me.

And that's it - you now have your `babel` implemented in your `gulp` toolchain with all bells and
whistles you had before (bundling, minification, sourcemaps, and debugging)

## Conclusion

Babel is the last big piece of functionality I use for simple control add-ins. It's a little bit
more complicated to set up and configure, but once you do it, it becomes a piece of boilerplate that
you can use for all your future projects.

There will be one more branch where I'll do a distinction between production and development
versions of JavaScript code, and will configure `gulp` to build these with different setups.
