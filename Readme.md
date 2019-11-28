# Control Add-ins Development Supercharged

This repository is a follow-up of my NAV TechDays 2019 session named **Control Add-ins
Development Supercharged** and contains demos presented during the session.

There were total of 36 demos that I prepared for the session, but I delivered only about
25 of them. In this repo (and other follow-up repos) I'm making all of the demos available
to the public, together with the explanations and important code examples.

## Repository and Branch Info

This repository and branch contain the following:
* **Repository:** Stage 01 - "Simpler" control add-in
* **Branch:** 01-split-js - Splitting source files

## Branch Detailed Info

This branch demonstrates a better way to organize files. It addresses the "one-script-to-rule-them-all"
issue that was present in the master branch.

When developing control add-ins, it's usually a good idea to split functionality into
multiple files, just like you would do with AL, or C#. One file per feature, or class, or
"concern" or anything that can be isolated and can stand on its own. When you do it that way,
it's much easier to manage your code.

## Script files structure

There are several independent files:
- `simpler.constant.js`: contains the constants to be used by other scripts. If you have more
constants to add, it's easy to add them to this file, and then use them from other files.
- `simpler.interface.js`: contains the "interface" towards Business Central. This file contains
the function declaration for SendData which must be in the global scope. It also contains the
"entry" function to be invoked by the `start.js` script.
- `simpler.state.js`: contains state management code.
- `simpler.ui.js`: contains code to build and maintain UI through DOM.

## Issues with this repository

Whereas much better than the original one, where all script code was in a single file,
this one still comes with several issues:

- **Global scope pollution:** For simple scripts to be able to share context, you must
declare all variables in the global scope. This makes your code more exposed to potential
global variable overwrite by other scripts, or makes it more likely that your variables
will overwrite variables from other scripts.
- **Difficult to maintain the `controladdin` object:** The more scripts you have, the "fatter"
your `controladdin` object gets. Not a big issue, but still something to be concerned with.
- **Mixed concerns:** Some scripts have mixed concerns, and this will make it more difficult to
make proper decision on where code belongs in the future when you need to expand. See more below.
- **Direct DOM access:** The original repository suffered from the same issue. You should try
to minimize DOM access as it causes most performance issues.

Some minor issues are also these:
- **Loading time:** Whereas multiple scripts help you structure your code logically, it comes
at the performance cost. Your browser must load and process each script individually, and this
costs you some processing time at startup.
- **Stability:** If one script breaks, other scripts will still execute, and if they depend on
the broken script, this will result in unexpected behavior. It's better that either the entire
"script" breaks, or that none of them break. The original repo didn't suffer from this issue.

## Mixed concerns issue

There are issues in two scripts that require restructuring. However, proper structuring of that
code could cause confusion as to where exactly code needs to belong.

### `simpler.state.js`

This script has a part of code that subscribes UI elements to click events. Since these events
have to do with state, more than with UI, I put them in this script. However, the state management
script should not be concerned with UI, and therefore this piece of code is a bit offensive:

```JavaScript
// TODO: This one is still pretty ugly
function entryClicked(entryDiv, entry) {
    if (selected.includes(entry)) {
        entryDiv.classList.remove("selected");
        selected = selected.filter(e => e !== entry);
        updateSummary(entry, SUMMARY_ACTION.REMOVE)
    } else {
        entryDiv.classList.add("selected");
        selected.push(entry);
        updateSummary(entry, SUMMARY_ACTION.ADD);
    }
}
```

The truth is, this does not fully belong to the `simpler.ui.js` script either, because the
primary thing it does is that it handles state.

This code could be broken down into two separate things, one function to handle state, and
one to handle UI, but that would only attribute to more complication.

In fact - this piece of code is the perfect example why developing web front ends with DOM
directly bound to state this way will cause confusion of concerns and architectural problems.
I'll address this issue in a follow-up repo soon.

### `simpler.interface.js`

This script should only be concerned with AL-to-JavaScript interface, however it is also
concerned with UI and event binding.

```JavaScript
function SendData(data) {
    // TODO: ... and this one is pretty ugly, too
    data.forEach(entry => {
        var entryDiv = getEntry(entry);
        entryDiv.addEventListener("click", () => entryClicked(entryDiv, entry));
        addToDataContainer(entryDiv);
    });
    renderSummary(summary);
}
```

Again, this function illustrates a major problem with this "naive" approach where UI and
state cannot be properly separated, and where everything is tightly and directly bound to 
DOM.

## Conclusion

This repo fixes some of the original repo's issues, but it emphasizes some other, more
important issues:
- Separation of concerns can't really be properly achieved with the "naive" approach
- A good framework is needed - it could help achieve better separation of concerns
- A number of smaller issues makes this one a less than ideal approach

Stay tuned - another repo to address these issues is coming soon.
