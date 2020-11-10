/* handle search history */

import { keywordList } from './module.js'

// 검색 기록 localstorage key
const HISTORY_KEY = 'search_history';
const MAX_HISTORY_NUM = 5;
const PLACEHOLDER_FREQUENCY = 1000;
const PLACEHOLDER_EXAMPLE = keywordList;
let pickNum = 0;
// 왜 아래 코드에서 querySelector 대신에 getElementBy는 안되는가?
const input = document.querySelector('#keyword');
const form = document.querySelector('.search-form');
const history = document.querySelector('.search-history');
const deleteButton = document.querySelector('.delete-history button');
let historyButton;
let historyLength = 0;


// 검색 기록 로드
function loadHistory(){
  // 모든 검색 기록은 하나의 string으로 되어 있으며 콤마로 나뉘어져 있다.
  const historyStr = localStorage.getItem(HISTORY_KEY);
  if(historyStr){
    showDeleteButton();
    const historyArr = historyStr.split(',')
    const historyTotalNum = historyArr.length;
    const historyViewNum = historyTotalNum>MAX_HISTORY_NUM ? MAX_HISTORY_NUM:historyTotalNum;
    
    // 검색 기록중 최근 5개만 보여준다.
    for(let i=historyTotalNum; i>historyTotalNum-historyViewNum; i--){
      // 검색 기록 버튼을 누르면 해당 검색어를 다시 검색한 페이지를 연다.
      history.innerHTML += 
      `<button class="search-history-button"><a href='/search?word=${historyArr[i-1]}'>${historyArr[i-1]}</a></button>`;
    }
    historyButton = document.querySelectorAll('.search-history-button a');
    if(historyButton){
      historyLength = historyButton.length;
    }
  }
  else{
    removeDeleteButton();
    history.innerHTML = null;
  }
}

function showDeleteButton(){
  deleteButton.classList.remove('button-hidden')
}

function removeDeleteButton(){
  deleteButton.classList.add('button-hidden')
}

function submitHandler(){
  // get user's search keyword
  const keyword = input.value.trim()
  const historyStr = localStorage.getItem(HISTORY_KEY);
  let historyArr = [];

  if(historyStr){
    historyArr = localStorage.getItem(HISTORY_KEY).split(',');
  }

  // empty spaces keyword: do nothing
  if(keyword==='') return;
  
  // repeated keyword: change index of the keyword history to the end index
  if(historyArr.includes(keyword)){
    updateRepeatedKeywordIndex(keyword, historyArr);
  }
  // add search keyword to history, prevent empty string
  else if(localStorage.getItem(HISTORY_KEY)){
    localStorage.setItem(HISTORY_KEY, localStorage.getItem(HISTORY_KEY)+`,${keyword}`);
  }
  else{
    localStorage.setItem(HISTORY_KEY, keyword);
  }
  
}

// change index of repeated keyword to the end index
function updateRepeatedKeywordIndex(repeatedKeyword, historyArr){
  const repeatedKeyworIndex = historyArr.findIndex(
    e=> { if(e===repeatedKeyword) return true} )
  historyArr.splice(repeatedKeyworIndex, 1);
  localStorage.setItem(HISTORY_KEY, historyArr + `,${repeatedKeyword}`);
}

function setNewPlaceholder(){
  const totalExampleNum = PLACEHOLDER_EXAMPLE.length;
  const placeholder = PLACEHOLDER_EXAMPLE[pickNum%totalExampleNum]
  //console.log(pickNum);
  input.setAttribute("placeholder", placeholder)
  pickNum = (pickNum + 1) % totalExampleNum;
}

function deleteHistory(){
  localStorage.removeItem(HISTORY_KEY);
  loadHistory()
  removeDeleteButton()
}

function clickHistoryButton(event){
  const historyArr = localStorage.getItem(HISTORY_KEY).split(',');
  const clickedKeyword = event.target.innerHTML;
  updateRepeatedKeywordIndex(clickedKeyword, historyArr);
  console.log(clickedKeyword)
}


function init(){
  loadHistory();
  form.addEventListener('submit', submitHandler);
  deleteButton.addEventListener('click', deleteHistory);

  for(let i=0; i<historyLength; i++){
    historyButton[i].addEventListener('click', clickHistoryButton)
  }

  setInterval(setNewPlaceholder, PLACEHOLDER_FREQUENCY);
}

init();
