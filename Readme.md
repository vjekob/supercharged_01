# Control Add-ins Development Supercharged

This repository is a follow-up of my NAV TechDays 2019 session named **Control Add-ins
Development Supercharged** and contains demos presented during the session.

There were total of 36 demos that I prepared for the session, but I delivered only about
25 of them. In this repo (and other follow-up repos) I'm making all of the demos available
to the public, together with the explanations and important code examples.

## Repository and Branch Info

This repository and branch contain the following:
* **Repository:** Stage 01 - "Simpler" control add-in
* **Branch:** 08-gulp-build-prod - Separating devevelopment and production build tasks

## Branch Detailed Info

When developing most kinds of things you often have different build configurations.
For example, when building a Windows application in C# using Visual Studio, you will
use a Debug and a Release configuration. Debug, or development configuration targets
the development machines and builds the final product in such a way as to streamline
debugging. Release, or production configuration targets actual production, and the
output is optimized as much as possible to achieve fastest and smoothest performance
of the application. With web, and JavaScript, you can - and very often - do the same:
you have one configuration which compiles your JavaScript to streamline your debugging
(often without minification, and always with sourcemaps); and one configuration which
aims for best performance, which includes all optimizations, it minifies your code,
and it almost always excludes sourcemaps.

This branch shows you how to configure `gulp` to allow you to have two distinct
configurations: one for debugging/development, and one for production.

## Task structure

So far we had a `build` task which built our bundles (JavaScript and CSS). They had
these structures:

* JavaScript:
    1. Select files to bundle
    2. Initialize sourcemaps
    3. Concatenate files
    4. Transpile using `babel`
    5. Minify
    6. Write sourcemaps
    7. Write bundle to destination
* CSS:
    1. Select files to bundle
    2. Concatenate files
    3. Minify
    4. Write bundle to destination

And this is cool for the development purposes, kind of. Even though you have
sourcemaps enabled, you may want to skip minification for development purposes.

For production purposes, though, this is not the best you can do. You'll want
to skip the sourcemaps, and you will absolutely want to have minification in place.

This means that we'll want to have two sets of tasks:

* Development
    * JavaScript
        1. Select files to bundle
        2. Initialize sourcemaps *(development only)*
        3. Concatenate files
        4. Transpile using `babel`
        5. Write sourcemaps *(development only)*
        6. Write bundle to destination
    * CSS:
        1. Select files to bundle
        2. Concatenate files
        3. Write bundle to destination
* Production
    * JavaScript:
        1. Select files to bundle
        2. Concatenate files
        3. Transpile using `babel`
        4. Minify *(production only)*
        5. Write bundle to destination
    * CSS:
        1. Select files to bundle
        2. Concatenate files
        3. Minify *(production only)*
        4. Write bundle to destination

## Setting up tasks in `gulpfile.js`

Apparently, we'll need two separate gulp tasks: one to build for development and
one for production. I'm going to call these two tasks `build` and `prod`, but you
may call them whatever you prefer.

Currently, the `build` task is defined as this:

```JavaScript
exports.build = gulp.parallel(buildJs, buildCss);
```

I could possibly do something like this now:

```JavaScript
exports.prod = gulp.parallel(buildJsProd, buildCssProd);
```

... and then define two new functions named `buildJsProd` and `buildCssProd`.
However, these functions would contain most of the code found in the `buildJs`
and `buildCss` functions respectively, and this is code duplication and it's
as bad in `gulp` as it is anywhere else. I don't want code duplication.

What I want to do is to be able to pass an argument to `buildJs` and `buildCss`
functions that will make those two functions decide whether to perform the
development or the production build workflow.

However, we have a tiny obstacle here. Let's take a look at the `buildCss`
function (just because it has a simpler structure):

```JavaScript
const bundleCss = () => gulp
    .src(globCss)
    .pipe(concat(bundleCssFileName))
    .pipe(cleanCss())
    .pipe(gulp.dest(path.css));
```

Now, the problem is this line:

```JavaScript
    .pipe(cleanCss())
```

We want to run that line only for production build process; for development
build process we want to skip that line.

Unfortunately, you can't do this:

```JavaScript
    .pipe(production && cleanCss())
```

... or this, for that matter:

```JavaScript
    .pipe(production ? cleanCss() : null)
```

The reason is that if the `production` parameter is `false`, the first case
would return a `false` and the second case would return a `null` to the `pipe`
method, and you can't do that. The `pipe` method expects a readable stream,
so you need something else - something that would return an empty stream, for
example.

### Installing dependencies

One obvious dependency would be [`gulp-empty`](https://www.npmjs.com/package/gulp-empty).
My original code I demoed at NAV TechDays contained that one. That line from
the `buildCss` function would look like this:

```JavaScript
    .pipe(prod ? cleanCss() : empty())
```

And `empty` comes from:

```JavaScript
const empty = require("gulp-empty");
```

The problem with this is that in the meantime the folks maintaining `gulp-empty`
decided to abandon it, and now their `npm` page says it's deprecated and will
go away. Also, that page suggests several alternatives, and I went for [`gulp-if`](https://www.npmjs.com/package/gulp-if)
this time.

Let's install it first:

```PowerShell
npm i gulp-if --save-dev
```

Perfect, now you are ready to use this new dependency.

### Restructuring `gulpfile.js`

Let's first import the `gulp-if` module:

```JavaScript
const gulpif = require("gulp-if");
```

And then let's use it. To keep as simple as possible, I'll apply the 
[currying](https://scotch.io/tutorials/closures-and-currying-in-javascript)
pattern here to get from this:

```JavaScript
const build = gulp.parallel(buildJs, buildCss);
```

... to this:

```JavaScript
const build = prod => gulp.parallel(buildJs(prod), buildCss(prod));
```

*Currying* is an essential concept in JavaScript that keeps functions pure
while minimizing code duplication. If you can't follow the change I did here,
I invite you to check the article I linked earlier. For your convenience, it's
here again: https://scotch.io/tutorials/closures-and-currying-in-javascript

Now, I'll want to curry-up my `buildJs` and `buildCss` functions as they both
receive a parameter indicating the production or development mode, and they
should now return a function that returns a stream, rather than simply return
a stream directly.

This is what my `buildJs` function will now look like:

```JavaScript
const bundleJs = prod => () => gulp
    .src([globJs, `!${path.js}/start.js`])
    .pipe(gulpif(!prod, sourcemaps.init()))
    .pipe(concat(bundleJsFileName))
    .pipe(babel({
        presets: ["@babel/preset-env"]
    }))
    .pipe(gulpif(prod, uglify()))
    .pipe(gulpif(!prod, sourcemaps.write()))
    .pipe(gulp.dest(path.js));
```

And this is my `buildCss` function:

```JavaScript
const bundleCss = prod => () => gulp
    .src(globCss)
    .pipe(concat(bundleCssFileName))
    .pipe(gulpif(prod, cleanCss()))
    .pipe(gulp.dest(path.css));
```

Both functions receive the `prod` parameter, and then return a function
that actually processes the `gulp` workflow. These inner functions will
access the `prod` parameter through a closure, and will use it to make
decisions inside the `gulpif` call.

Totally off-topic, but let me explain at this point why I generally
prefer this syntax:

```JavaScript
var foo = () => {
    //...
};
```

... to this syntax:

```JavaScript
function foo() {
    //...
}
```

They are equivalent, and while the second one may seem more obvious,
more *intentional* (as I like to say), the first one has a lot of
advantages:
* It may be curried directly, without having to refactor the entire
function definition
    ```JavaScript
        // Much easier to convert this:
        var foo = () => {
            // ...
        };
        // ... into this:
        var foo = bar => () => {
            // ... do something with bar
        };

        // ... than it is to conver this:
        function foo() {
            // ...
        }
        // ... into this:
        function foo(bar) {
            return function() {
                // ... do something with bar
            };
        }

        // The first one is not only much easier to write,
        // but is also far more readable.
    ```
* Arrow functions don't change the meaning of `this`, and this is how you
almost always want your functions to behave. All pure functions should behave
like this anyway, and all functions should be pure, unless you have very strong
reasons for them not to be.
* Shouldn't really be a big consideration in modern JavaScript, but functions
declared with `function` keyword can be redeclared or reassigned. Arrow functions
can be declared as constants preventing this and avoiding the lamest kind of bugs
that can happen in JavaScript.
    ```JavaScript
        // You can do this:
        function a() {
            // ...
        }
        a = 5;
        // a is now 5, duh!
        a(); // You now get a runtime error, and that sucks!

        // ... but you cannot do this:
        const b = () => {
            // ...
        };
        b = 5; // You'll get a compiler error on this line
        b(); // Solve the compile-time error, and this call cannot fail at runtime
    ```

Sorry for this digression, but I wanted to explain both my syntactical choice
and the currying pattern that my `gulpfile.js` now uses all over the place.

Now that I've curried-up my `buildJs` and `buildCss` functions, I can export my
`build` and `prod` tasks:

```JavaScript
exports.build = build(false);
exports.prod = build(true);
```

Remember, this was my refactored `build` function:

```JavaScript
const build = prod => gulp.parallel(buildJs(prod), buildCss(prod));
```

## Trying it out

This will be the easiest part, trust me 😉

All you need to do now is to run these two tasks. Run this:

```PowerShell
gulp build
```

... and then run this:

```PowerShell
gulp prod
```

... and then compare their outputs.

And that's all there is to it.

## Conclusion

In this branch you've seen how to configure `gulp` to execute conditional
logic and how to build different sets of outputs for development and production
purposes. You've also learned why it's a good idea to separate these two.

With this branch, I end my series on simple control add-ins; these are control
add-ins that use traditional JavaScript, and don't use any more advanced
functionality, such as modules, modern UI frameworks, or more comprehensive
toolchains. I'll explore these in the follow-up repos (in my TechDays session
I had 6 repos, and here - so far - I've only covered the first one).
