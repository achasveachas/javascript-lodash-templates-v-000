JavaScript lodash Templates
---

## Objectives

1. Explain how to use lodash templates
2. Practice using lodash templates to organize JavaScript interactions
3. Trigger changes in the DOM in response to user actions

## Introduction

- Emphasize how difficult it was to manage string-based templates in the previous lab
- But build on `innerHTML`, since we can use it in clever ways:

``` javascript
<script id="my-template" type="text/x-lodash-template">
  <div class="foo">
    <h1><%- heading %></h1>
    <p><%= body %></p>
  </div>
</script>

var myTemplateFn = _.template(document.getElementById('my-template').innerHTML)

myTemplateFn({ heading: '', body: '<div>blah</div>' })
```

## Implementation

- Have students code-along to update posts and comments (totally on the client -- no need to submit to a server)
- Use templates to modularize comments!

## Resources

- [lodash.template](https://lodash.com/docs#template)
