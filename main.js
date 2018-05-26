const API_KEY = 'zm6wrrhrcnb9lkkkfkv9xb61';
const API_BASE = 'https://openapi.etsy.com/v2';
const LISTINGS_API = '/listings/active';
const API_PARAM_KEY = 'api_key';

const XHR = {
  readyState: {
    DONE : 4
  },
  status: {
    OK : 200
  }
};

/**
 * on document ready we check the url to see if any
 * search term is in the url
 */
document.onreadystatechange = () => {
  const {readyState} = document;
  if(readyState === 'complete') {
    doSearch();
  }
}

/**
 * a function which sets the value of `#search-input` to
 * whatever `?search` url parameter holds and invokes
 * `runSearch()`
 */
const doSearch = () => {
  const search = searchParams().get('search');
  if(search) {
    $('#search-input').value = search;
    runSearch();
  }
}

/**
 * the main search function
 *   * this function reads the `#search-input` element value and
 *   clears the children of the `.results-list` `<ul>`
 *   * it then executes `ajax.get()` with the search term as specified
 *   in `#search-input`
 *   * when the promise resolves to data, we itterate over the `results`
 *   key and build result items which are added as children of the
 *   `.results-list` `<ul>`
 */
const runSearch = () => {
  const {value: searchText} = $('#search-input');
  const resultsList = $('.results-list');
  while(resultsList.firstChild) {
    resultsList.firstChild.remove();
  }
  ajax.get(LISTINGS_API,{keywords:searchText}).then(
    data => {
      data.results.forEach(
        result => {
          const item = createItem(result);
          resultsList.appendChild(item);
        }
      )
    }
  ).catch(
    err => {
      console.error('ERROR!', err);
    }
  );
}

/**
 * handles browser navigation
 */
window.onpopstate = () => {
  doSearch();
}

/**
 * handles getting url parameters from `location.href`
 */
const searchParams = () => {
  const urlStr = window.location.href;
  const url = new URL(urlStr);
  return url.searchParams;
}

/**
 * a simple selector function that keeps syntax familiar and easy to use
 * @param {String} selector css selector to query in document
 */
const $ = selector => {
  return document.querySelector(selector);
}

/**
 * this object is a simple ajax util
 */
const ajax = {
  /**
   * Implements ajax for GET requests
   * * this returns a `Promise` which uses raw XHR to fetch the contents at the api endpoint specified
   * * this method assumes that all endpoints have a common `API_BASE`
   * * this method also supplies the `API_KEY` to every request
   * * this method also requests the association of `MainImage` for the purpose of displaying tile images
   *
   * @param {String} api the specific api which you want to call
   * @param {Object} data the url parameters to call the api with
   **/
  get : (api, data = {}) => {
    return new Promise(
      (resolve, reject) => {
        const req = new XMLHttpRequest();
        const parameters = Object.assign({
          [API_PARAM_KEY]:API_KEY,
          includes: 'MainImage'
        },data);
        const pStr = '?'+
          Object.entries(parameters).map(
            ([key, value]) => `${key}=${encodeURI(value)}`
          ).join('&');
        req.open('GET', `${API_BASE}/${api}${pStr}`);
        req.send(null);
        req.onreadystatechange = () => {
          switch(req.readyState) {
            case XHR.readyState.DONE:
              if(req.status == XHR.status.OK) {
                resolve(JSON.parse(req.responseText));
              } else {
                reject({
                  error: req.status,
                  message: req.responseText
                });
              }
              break;
            //todo: errors?
            default:
              //todo : something here?
              break;
          }
        }
      }
    )
  }
}

/**
 * this function looks for the template identified by `#{id}`
 * and creates and returns a new instance of it
 * @param {String} id
 */
const createTemplate = id => {
  const template = $(`#${id}`);
  return document.importNode(template.content, true);
}

/**
 * this function takes a `result` from the  `results[]` array
 * which is returned by the `LISTINGS_API` and applies the
 * necessary data to an instance of `#etsy-item-template` as
 * created by `createTemplate`
 *
 * @param {Object} data a `result` returned by the `LISTINGS_API`
 */
const createItem = data => {
  const item = createTemplate('etsy-item-template')
  const summary = item.querySelector('summary');
  const img = item.querySelector('img');
  img.src = data.MainImage.url_170x135;
  summary.textContent = data.title;
  return item;
}

/**
 * does exactly what it sounds like it does - it handles the
 * click on the search button
 *
 * it also saves the new search in the `window.history` and
 * invokes `runSearch()`
 */
const onSearchClick = () => {
  window.history.pushState(
    searchParams(),
    `Search Results For ${searchText}`,
    '/?search='+searchText
  );
  runSearch();
}
