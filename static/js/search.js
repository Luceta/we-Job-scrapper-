const HISTORY_KEY = 'search_history';

console.log("search.js!");
console.log(HISTORY_KEY);


const history = document.querySelector('.search-history');

function loadAllHistory(){
  const historyStr = localStorage.getItem(HISTORY_KEY);

  if(historyStr){
    const historyArr = historyStr.split(',');
    const historyTotalNum = historyArr.length;

    for(let i=historyTotalNum; i>0; i--){
      history.innerHTML +=
      `<button class="search-history-button"><a href='/search?word=${historyArr[i-1]}'>${historyArr[i-1]}</a></button>`;
    }
  }
  else{
    history.innerHTML = null;
  }
}

function init(){
  loadAllHistory();
}

init();