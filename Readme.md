# Control Add-ins Development Supercharged

This repository is a follow-up of my NAV TechDays 2019 session named [**Control Add-ins
Development Supercharged**](https://www.youtube.com/watch?v=_IjppPvkmgE) and contains demos presented during the session.

There were total of 36 demos that I prepared for the session, but I delivered only about
25 of them. In this repo (and other follow-up repos) I'm making all of the demos available
to the public, together with the explanations and important code examples.

## Repository and Branch Info

This repository and branch contain the following:
* **Repository:** Stage 01 - "Simpler" control add-in
* **Branch:** 02-framework - "Introducing" a front-end framework

## Branch Detailed Info

And now a prank. Even though this repository isn't really useful, since I "demoed" it during
[my session at NAV TechDays](https://www.youtube.com/watch?v=_IjppPvkmgE), I want to include
it in this series. After all, the point I made during the session is the same point I want to
make here: don't waste time creating a yet another framework - pick one off the shelf, there
are a dime-a-dozen, and quite some pretty good ones.

This branch in fact introduces only one new file - `framework.js`.

## `framework.js`

It's worth both my and your time including the entire content of the `framework.js` file in
this Readme document, so here we go:

```JavaScript
/*


                    ██████╗  ██████╗ ███╗   ██╗████████╗
                    ██╔══██╗██╔═══██╗████╗  ██║╚══██╔══╝
                    ██║  ██║██║   ██║██╔██╗ ██║   ██║   
                    ██║  ██║██║   ██║██║╚██╗██║   ██║   
                    ██████╔╝╚██████╔╝██║ ╚████║   ██║   
                    ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   

            The last thing the world needs at this point is a
                    yet another JavaScript Framework.

                               From you.
                    
*/
```

Ok, maybe a little harsh that last line, but the point is: don't create a new framework. It
might seem like a great idea, it may be that whichever framework you choose has a drawback
in some area and that you just have to do it better because you know better. And even if you
do know better - don't. Don't create one. Pick one.

There are [hundreds of memes](https://www.google.com/search?q=new+javascript+framework+meme&tbm=isch)
on the Internet and [almost seven million search results](https://www.google.com/search?q=new+javascript+framework+meme)
on the same topic, there are websites [making fun](https://hackernoon.com/how-it-feels-to-learn-javascript-in-2016-d3a717dd577f)
of how [new JavaScript frameworks](https://hugovk.github.io/dayssincelastjavascriptframework/) spring
up [like mushrooms after rain](https://dayssincelastjavascriptframework.com/), there's even an [Alexa
skill](https://www.amazon.com/Days-Since-Last-Javascript-Framework/dp/B07435H79R) for that.

In my session I've shown this picture:

![](https://worldpece.org/sites/default/files/styles/pece_artifact_image_large/public/artifacts/media/image/standards.png)

(Used under CC license from https://worldpece.org/content/how-standards-proliferate)

And I'd like to say that it applies to JavaScript frameworks as much as it applies to anything
else.

And to conclude this musing, let me just state that I am not trying to say that you should not
explore or create - no, not at all. I am not trying to hinder your creativity or to tell you
that you are incapable of building the next great thing. That's not what I am trying to achieve
here. The only thing I want to do is to make you aware of how many frameworks are out there and
that a tiny, negligible portion of those is actually good, and that it's better not to ~~waste~~
invest time into building a yet another one.
