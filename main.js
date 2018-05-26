document.onreadystatechange = () => {
  const {readyState} = document;
  if(readyState === 'complete') {
    doSearch();
  }
}

const doSearch = () => {
  const search = searchParams().get('search');
  if(search) {
    $('#search-input').value = search;
    runSearch();
  }
}

window.onpopstate = (event) => {
  doSearch();
}

const searchParams = () => {
  const urlStr = window.location.href;
  const url = new URL(urlStr);
  return url.searchParams;
}

const $ = selector => {
  return document.querySelector(selector);
}

// please use Chrome and enable this plugin for local dev
// https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en-US

// I am serving this demo with:
// py -m SimpleHTTPServer 8000

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

const ajax = {
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

const createTemplate = id => {
  const template = $(`#${id}`);
  return document.importNode(template.content, true);
}

const createItem = data => {
  const item = createTemplate('etsy-item-template')
  const summary = item.querySelector('summary');
  const img = item.querySelector('img');
  img.src = data.MainImage.url_170x135;
  summary.textContent = data.title;
  return item;
}

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

const onSearchClick = (event) => {
  window.history.pushState(
    searchParams(),
    `Search Results For ${searchText}`,
    '/?search='+searchText
  );
  runSearch();
}
