# og-etsy-demo
og etsy exercise

## How to run it
use any static http server

I used:

```
cd {project dir}
py -m SimpleHTTPServer 8000
```

please use Chrome and enable this plugin for local dev:
https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en-US

The plugin mentioned above enable cors with local dev servers

## What was done

`main.js`

  * on document ready we check the url to see if any search term is in the url
  * `doSearch()`
    * a function which sets the value of `#search-input` to whatever `?search` url parameter holds and invokes `runSearch()`
  * `runSearch()`
    * this function reads the `#search-input` element value and clears the children of the `.results-list` `<ul>`
    * it then executes `ajax.get()` with the search term as specified in `#search-input`
    * when the promise resolves to data, we itterate over the `results` key and build result items which are added as children of the `.results-list` `<ul>`
  * `window.onpopstate` handles browser navigation
  * `searchParams` handles getting url parameters from `location.href`
  * `$` is a simple selector function that keeps syntax familiar and easy to use
  * the `ajax` object contains a `get` method
    * this returns a `Promise` which uses raw XHR to fetch the contents at the api endpoint specified
    * this method assumes that all endpoints have a common `API_BASE`
    * this method also supplies the `API_KEY` to every request
    * this method also requests the association of `MainImage` for the purpose of displaying tile images
  * the `createTemplate(id)` function
    * this function looks for the template identified by `#{id}` and creates and returns a new instance of it
  * `createItem(data)`
    * this function takes a `result` from the  `results[]` array which is returned by
    the `LISTINGS_API` and applies the necessary data to an instance of `#etsy-item-template` as created by `createTemplate`
  * `onSearchClick()` does exactly what it sounds like it does - it handles the click on the search button
    * it also saves the new search in the `window.history` and invokes `runSearch()`

`index.html`
  * a simple HTML5 doc
  * it contains a main header with the following elements:
    * `.search`
      * this is the page header
    * `.search-input`
      * where we type the search terms
    * generic button which executes searches
  * it contains a `.main-results` element
    * this contains a `<header>` which generically says "Search Results"
    * this contains a `.results` `<section>`
      * the results section contains an HTML `<template>` which is used to build each results tile when search results are retrieved from the api
      * the results section contains an empty `<ul>` identified by `.results-list`
        * this ul is populated with the instances of `template#etsy-item-template` created by the `createItem()` function

## Summary
I choose to implement everything from scratch since this was the requirement.

Additionally, I choose to implement the `$` function to make the code easier to read and more familiar.

I choose to use HTML Templates to avoid long and dense `document.createElement` chains. I felt it was much more elegant and compact.

I choose to use semantic HTML because it is proper to do so.  :)

I was considering implementing some things like `<ENTER>` to search but I ran out of time and the exercise was time-boxed to 2-3 hours and I needed to leave myself at least 30 mins to write up this file and document my code.

I implemented bookmarkable search results as well as the ability to navigate fwd/back w/o redirect.

Styles are minimal and use etsy orange.

Flex box was used for quick and reliable layout.

Rems were used to allow for simple addition of a core set of media queries which would modify font-size based on device and the page should be almost instantly all-device friendly! :)
