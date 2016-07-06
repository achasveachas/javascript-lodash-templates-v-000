JavaScript lodash Templates
---

## Objectives

1. Explain how to use lodash templates
2. Practice using lodash templates to organize JavaScript interactions
3. Trigger changes in the DOM in response to user actions

## Introduction

Dynamically adding and manipulating chunks of the DOM based on data can
be a tedious, error-prone activity when we try to manually create HTML
strings out of data, like this:

```js
var commentNode = document.getElementById("comments");
commentNode.innerHTML = "<div class='some-class'>This is a comment and
it's real long</div><p>" + someDynamicValue + "</p><p>" + someOtherValue
+ "</p>";
```

The better way is to use a *template* that
provides a way to use dynamically add data on a set HTML structure,
preventing us from having to type out these monster strings of data and
markup.

We could build out our own template for each section of our blog,
creating a new function for each part, and that would work, but there
are tools out there to make this task nice and easy for us.

## lodash

[Lodash](https://lodash.com/) is a JavaScript library that provides a
lot of utilities for working with arrays, objects, and strings,
including a template library which is what we'll be working with today.

Let's look at the earlier example:

```js
commentNode.innerHTML = "<div class='some-class'>This is a comment and
it's real long</div><p>" + someDynamicValue + "</p><p>" + someOtherValue
+ "</p>"
```

The `<div class='some-class'>...` string is our template. It's not very
pretty, but it's ours. We load data into the template by closing the
string and concatenating variables then continuing the template string.
If you're anything like me, you've forgotten to type at least one of the
plus signs nearly every time you've done any long string concatenation,
so, bare minimum, our templating tool should fix this problem.

### Basic Templating With Interpolation

Let's wire up a basic comments form to our blog post. Starting with the
markup in `index.html`, we'll add a simple form, and a placeholder for
the comments to be displayed.

```html
<article>
  <header><h2>The Results are In!</h2></header>
  <p>
    After careful consideration and a generous grant from NASA, our team has determined that a woodchuck could chuck five wood, with a standard deviation of +/- .37 wood.
  </p>
  <footer>posted by Chuck Wooden</footer>
  <form onsubmit="postComment();return false;">
    Name: <input type="text" id="commenterName"><br>
    Comment: <input type="textarea" id="commentText"><br>
    <input type="submit">
  </form>
  <div id="comments"></div>
</article>
```

So we have a basic form that will submit with a `postComment()`
function. Let's add the basic bits of that to our `index.js`.

```js
function postComment() {
  var commenter = document.getElementById("commenterName").value;
  var comment = document.getElementById("commentText").value;
  //insert comment into "comments" div in this format:
  //<div class="comment"><p>comment</p><p>Posted By: <span class="commenter">commenter</span></p></div>
}
```

We know the format of the template we want, but instead of adding it
using string concatenation, we're going to use the lodash `template`
function.

**Top-tip:** By default, we access lodash functions through the
underscore, which is a variable that holds the root object, like `_.template()`. This is similar to accessing
jQuery functions via the `$` variable. This is because lodash was
originally a fork of the [Underscore.js library](http://underscorejs.org/).

We'll start by building a template string as we have in the past, but
instead of concatenation, we'll be using *interpolation*, which is a way
to replace text in strings using special delimeters.

In lodash, we can interpolate strings with the `<%= %>`
delimeter, so let's try it out.

```js
function postComment() {
  var commenter = document.getElementById("commenterName").value;
  var comment = document.getElementById("commentText").value;
  //insert comment into "comments" div in this format:
  //<div class="comment"><p>comment</p><p>Posted By: <span class="commenter">commenter</span></p></div>

  var commentTemplate = '<div class="comment"><p><%= comment %></p><p>Posted By: <span class="commenter"><%= commenter %></span></p></div>';
}
```

We're creating a new variable called `commentTemplate` that will hold our template string. We've wrapped our
two variables inside the interpolation delimiters, with `<%= comment %>`
and `<%= commenter %>`.

The next step is to use the `template()` function of lodash to turn this
template string into a function that we can call with a JSON argument
for the variable values.

```js
function postComment() {
  var commenter = document.getElementById("commenterName").value;
  var comment = document.getElementById("commentText").value;
  //insert comment into "comments" div in this format:
  //<div class="comment"><p>comment</p><p>Posted By: <span class="commenter">commenter</span></p></div>

  //create template string
  var commentTemplate = '<div class="comment"><p><%= comment %></p><p>Posted By: <span class="commenter"><%= commenter %></span></p></div>';
  //create template function
  var templateFn = _.template(commentTemplate);
}
```

We create a function here by executing `_.template()`, but we don't
execute it now. Why?

One of the reasons to use templating is to be able to reuse the
templates. By creating a function and holding it in a variable, we can
execute the function over and over with different data, rather than
having to rebuild the template function every time.

Now that we have our function, we'll need to execute it with our form
data as a regular JSON object: `{ 'comment': value, 'commenter': value
}`. Note that the keys for the object match the variable names inside
our interpolation delimiters.

Executing the function will return a string, which we can then append to
our comments div. Let's finish it out.

```js
function postComment() {
  var commenter = document.getElementById("commenterName").value;
  var comment = document.getElementById("commentText").value;
  //insert comment into "comments" div in this format:
  //<div class="comment"><p>comment</p><p>Posted By: <span class="commenter">commenter</span></p></div>

  //create template string
  var commentTemplate = '<div class="comment"><p><%= comment %></p><p>Posted By: <span class="commenter"><%= commenter %></span></p></div>';
  //create template function
  var templateFn = _.template(commentTemplate);

  var commentsDiv = document.getElementById("comments");

  //execute template function with JSON object for the interpolated values
  var templateHTML = templateFn({ 'comment': comment, 'commenter': commenter });

  //append rather than replace!
  commentsDiv.innerHTML += templateHTML;
}
```

Reload your `index.html` and see it in action!

Okay, this is all fine and good, and we aren't concatenating strings
anymore, but we're still building out a huge string for the template,
and this is a pretty simple template. What happens when we have a lot of
markup to work with?

### HTML Templates in JavaScript

Putting our templates in a string isn't great for a couple of reasons.
We don't get the human-readable, indented structure of regular HTML. We
don't get the syntax highlighting on the tags that our editor provides.
Adding or changing HTML inside a string is difficult and prone to error.
What we need is a way to use a regular chunk of HTML as our template.

Fortunately, lodash gives us a great way to do this. We can use a
special `<script>` tag with the content-type of `text/x-lodash-template`
and embed HTML directly inside. Let's redo our comment template.

This time, we're going to put this in the bottom of our `index.html`
like it was any other JavaScript block.

```html
<!-- index.html, place before end body tag -->
<body...>
  <article>...</article>
  <script id="comment-template" type="text/x-lodash-template">
    <div class="comment">
      <div class="comment-body"><%= comment %></div>
      <div class="commenter">
        <p>
          <span class="posted-by">Posted By: </span>
          <%= commenter %>
        </p>
      </div>
    </div>
  </script>
</body>
```

Inside that `<script id="comment-template">` tag we just have *mostly*
regular HTML! The only difference is, since we're inside a `script` tag,
we also can use the interpolation delimiters from lodash to mark where
our dynamic data is.

Okay, we've made a significant change here, so surely there's a lot of
work require to wire this up, right?

```js
// index.js
function postComment() {
  var commenter = document.getElementById("commenterName").value;
  var comment = document.getElementById("commentText").value;

  //insert comment into "comments" div in this format:
  //<div class="comment"><p>comment</p><p>Posted By: <span class="commenter">commenter</span></p></div>

  //create template string - THIS IS THE ONLY LINE WE HAVE TO CHANGE
  //var commentTemplate = '<div class="comment"><p><%= comment %></p><p>Posted By: <span class="commenter"><%= commenter %></span></p></div>';
  var commentTemplate = document.getElementById("comment-template").innerHTML;

  //create template function
  var templateFn = _.template(commentTemplate);

  var commentsDiv = document.getElementById("comments");

  //execute template function with JSON object for the interpolated values
  var templateHTML = templateFn({ 'comment': comment, 'commenter': commenter });

  //append rather than replace!
  commentsDiv.innerHTML += templateHTML;
}
```

Nope! We just had to change the one line that defines the source string
for the template. Remember that HTML is just a string, and we can read
the `innerHTML` property of any element. Since we gave the `script` tag
an `id`, we know how to query it, read its contents, and use that as our
template string.

Let's reload and give it a shot. Works great, right?

Since lodash expects a string argument for `template()`, we just fed it
a different template string with the same interpolated values and everything else works just fine. Master hackers over here.

![mr robot](http://i.giphy.com/mQG644PY8O7rG.gif)

Using this technique, you can build out one or more HTML templates
inside script tags, taking advantage of the ease of editing HTML in its
normal form, then take the `innerHTML` of those script tags and use it
to build lodash templates. No more giant strings!

### Other Template Delimiters

We've seen how to interpolate text into our templates, but what if
we want to prevent HTML tags from being evaluated? Or execute
some JavaScript code on an interpolated value?

Lodash gives us what we need here as well, allowing us to use different
delimiters to interpolate different things.

#### Escaping HTML Data

Let's say we don't want to allow our commenters to use HTML markup in their
comments. Right now, if you tried posting a comment like
`<p>hi</p><p>everyone</p><h1>this is my comment</h1>`, our form would
let you. But of course, like everything else, trolls ruin this and find
ways to break our blog style with their markup, so we want to change our
comment field to not execute HTML tags.

Luckily, it's as simple as changing the delimiter from *interpolate* (`<%= %>`) to *escape* (`<%-
%>`). Let's try it:

```html
<script id="comment-template" type="text/x-lodash-template">
  <div class="comment">
    <div class="comment-body"><%- comment %></div>
    <div class="commenter">
      <p>
        <span class="posted-by">Posted By: </span>
        <%- commenter %>
      </p>
    </div>
  </div>
</script>
```

A quick refresh and try to post that same comment again, and we'll see
that our HTML has been escaped and the tags display harmlessly on the
page.

#### Executing Code

Let's say we want to execute some non-printing JavaScript code in our template. We
can use the `<% %>`, or *eval* delimiter.

For instance, we want to display the commenter's name, but if they
accidentally left it blank, we want to display "Anonymous". We can use
the eval delimiter to execute an `if...else` statement.

```html
<div class="commenter">
  <p>
    <span class="posted-by">Posted By: </span>
    <% if(commenter !== '') { %>
    <%= commenter %>
    <% } else { %>
    Anonymous
    <% } %>
  </p>
</div>
```

**Top-tip:** The eval delimiter is for executing non-printing code, that
is, code that won't display a result directly on the page, such as
`if...then` blocks or `for` loops. If you wanted to display the results
of a function, say, `Date.now()` on the page, you would use the regular
interpolation delimiter, like `<%= Date.now() %>`.

## Summary

In this lesson we learned how to use lodash and the `template()`
function to create templates and dynamically add templated data to our
DOM. We saw that we can use a `script` tag to hold complex HTML
templates rather than building our templates inside string variables.

Finally, we learned how to use the different delimiters to display text,
escape HTML, and execute code for more powerful templates.

## Resources

- [lodash.template](https://lodash.com/docs#template)
