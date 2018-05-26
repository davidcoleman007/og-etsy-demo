document.onreadystatechange = () => {
  const {readyState} = document;
  console.log('document ready', readyState);
  if(readyState === 'complete') {

  }
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
          [API_PARAM_KEY]:API_KEY
        },data);
        console.log(data);
        const pStr = '?'+
          Object.entries(parameters).map(
            ([key, value]) => `${key}=${encodeURI(value)}`
          ).join('&');
        console.log(pStr);
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
          }
        }
      }
    )
  }
}

const createItem = data => `
  <li class="etsy-item">
    <article>
      <img src="https://lorempixel.com/100/100"/>
      <summary>${data.name}</summary>
    </article>
  </li>
`;

onSearchClick = (event) => {
  console.log($('#search-input'));
  ajax.get(LISTINGS_API,{keywords:'sheep'}).then(
    data => {
      console.log(data);
      const resultsList = $('.results-list');
      while(resultsList.firstChild) {
        resultsList.firstChild.remove();
      }
    }
  ).catch(
    err => {
      console.error('ERROR!', err);
    }
  );
}