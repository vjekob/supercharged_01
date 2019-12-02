# Control Add-ins Development Supercharged

This repository is a follow-up of my NAV TechDays 2019 session named **Control Add-ins
Development Supercharged** and contains demos presented during the session.

There were total of 36 demos that I prepared for the session, but I delivered only about
25 of them. In this repo (and other follow-up repos) I'm making all of the demos available
to the public, together with the explanations and important code examples.

## Repository and Branch Info

This repository and branch contain the following:
* **Repository:** Stage 01 - "Simpler" control add-in
* **Branch:** master - Introduction

## Branch Detailed Info

This branch introduces the "Simpler" control add-in and sets the stage for all further demos.
It contains a very simple AL extension that contains a control add-in. The control add-in does
not provide a feature-complete functionality, but merely showcases how it could be possible to
simplify an otherwise less user-friend process. Keep in mind that the control add-in itself
does not matter. What matters is its structure and how it was created.

In this branch, the control add-in is done in a "naive" way, how a typical AL developer without
much experience in JavaScript or web development would develop it.

## Control add-in structure

The control add-in as presented in this repository contains a very simple structure:

```AL
controladdin Simpler
{
    Scripts =
        'src/add-in/scripts/numeral.min.js',
        'src/add-in/scripts/simpler.js';

    StartupScript = 'src/add-in/scripts/start.js';

    StyleSheets = 'src/add-in/styles/simpler.css';

    RequestedHeight = 400;
    RequestedWidth = 600;
    MaximumHeight = 1200;
    MinimumHeight = 200;

    HorizontalShrink = false;
    HorizontalStretch = true;
    VerticalShrink = true;
    VerticalStretch = true;

    event OnControlReady();

    procedure SendData(Data: JsonArray);
}
```

There are a few elements in here that I won't address any further because they don't
play any specific role for either the demo or the topic of the session. I'll explain
them here, and then won't pay any attention to them in the future:

### Sizing options

Control add-ins should normally specify some sizing options. In this example, the
control add-in requests area of 600x400 pixels, but allows growing up to 1200 pixels
high, and shrinking to minimum 200 pixels high. It doesn't allow horizontal shrinking,
and doesn't limit horizontal stretching.

```AL
    RequestedHeight = 400;
    RequestedWidth = 600;
    MaximumHeight = 1200;
    MinimumHeight = 200;

    HorizontalShrink = false;
    HorizontalStretch = true;
    VerticalShrink = true;
    VerticalStretch = true;
```

### Interface declaration

Even though it's not an official name, I prefer refering to AL procedure and event
declarations as "interface", because that's what it was in the pre-AL world of
control add-ins.

All of control add-ins should have at minimum a [Control Add-in ready event](http://vjeko.com/adding-a-controladdinready-event-to-custom-controls/)
that allows notifying AL about whether the contrl add-in is safe to "talk" to from AL.

```AL
    event OnControlReady();
```

In my example I will be sending the unapplied sales invoice data to JavaScript
as a `JsonArray` object:

```AL
    procedure SendData(Data: JsonArray);
```

The interface won't change in any of the demos, and I won't be explaining it
any further.

## Web portion

This leaves us with the web portion of the control add-in definition - those
parts of the `controladdin` object that pertain to web: scripts and stylesheets.

In this demo (this branch, this stage) this is what I have:

```AL
    Scripts =
        'src/add-in/scripts/numeral.min.js',
        'src/add-in/scripts/simpler.js';

    StartupScript = 'src/add-in/scripts/start.js';

    StyleSheets = 'src/add-in/styles/simpler.css';
```

Let's take a look at this a little deeper.

## `start.js`

As in any other control add-in, the script marked as `StartupScript` runs when
all other scripts finished loading and when the entire page has been rendered.

It does this:

```JavaScript
Simpler.initialize();
Microsoft.Dynamics.NAV.InvokeExtensibilityMethod("OnControlReady", []);
```

First, it initializes the user interface to prepare the basic elements, and then
it invokes the `OnControlReady` event in AL. This will trigger AL to prepare the
data and send it to JavaScript using the `SendData` method.

By itself, this script is okay, and most of `StartScript` scripts should look more
or less like this. The logic all of them should follow is:
1. Initialize the UI
2. Invoke the "control add-in ready" event

## `simpler.js`

Now this script is what the entire first stage of my session was about. It isn't
structured well, and it isn't developed the way web developers would develop any
decent scripts. It may look okay at first, but there are many problems in it.

First of all, it renders everything using pure DOM, for example:

```JavaScript
    let entryDiv = document.createElement("div");
    entryDiv.id = entry.entryNo;
    entryDiv.className = "entry";

    let dateCaption = document.createElement("div");
    dateCaption.className = "date";
    dateCaption.innerText = entry.documentDate;

    let customerCaption = document.createElement("div");
    customerCaption.className = "customer";

    let customerCaptionNo = document.createElement("div");
    customerCaptionNo.className = "no";
    customerCaptionNo.innerText = entry.customerNo;
```

This is not necessarily a bad thing - in fact, it's probably going to perform better
than JQuery would, but this is very dirty, unreadable, unmaintainable, and generally
a very outdated approach. There are better way.

But there are a number of other problems:
* No separation of concerns. This script does everything from state management to
data binding to UI. Very confusing.
* Debugging of this is not directly possible with VS Code; you must use browser
debugging tools.
* Performance. While not directly obvious, this script will cause performance issues
when the amount of data it processes starts growing. Since it uses direct DOM manipulation
without any optimization, rendering will take time, and it will be perceivable on slower
machines.
* All-in-one script. This is one huge script. The more it grows, the more unmanageable it
gets. Developer(s) will lose time searching trhough it and finding the relevant code when
something needs to change or improve.
* Browser compatibility. The script won't work in Internet Explorer or Edge, and possibly
in some other browsers on non-Windows platforms.

There are possibly more issues, but these are most obvious and most burning.

However, it's still a cool control add-in that shows in a nice way how control add-ins
can be very useful to simplify user processes. In other branches and repos, I'll expand
on this topic and will address all of the issues above.

You can check other examples:
- [branch 01-split-js](https://github.com/vjekob/supercharged_01/tree/01-split-js) - it addresses an attempt at separating front-end concerns
- [branch 02-framework](https://github.com/vjekob/supercharged_01/tree/02-framework) - it teaches you not to build a yet another front-end framework
- [branch 03-gulp-hello-world](https://github.com/vjekob/supercharged_01/tree/03-gulp-hello-world) - we're introducing `gulp` to the stage
- [branch 04-gulp-useful](https://github.com/vjekob/supercharged_01/tree/04-gulp-useful) - we're making `gulp` actually useful by teaching it how to bundle JavaScript and CSS files for our control add-in
