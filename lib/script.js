
//
// Blackjack
//

// Card variables
let suits = [
	{
		suit: 'hearts',
	}, 
	{
		suit: 'clubs',
	},
	{
		suit: 'diamonds',
	}, 
	{
		suit: 'spades',
	}
];

let values = ['A', 'K', 'Q', 'J', 
'10', '9', '8', '7', '6', '5', '4', '3', '2'];

// DOM variables
let textArea = document.getElementById('text-area'),
	dealerHand = document.getElementById('dealerHand'),
	playerHand = document.getElementById('playerHand'),
	dealerScoreArea = document.getElementById('dealerScoreArea'),
	playerScoreArea = document.getElementById('playerScoreArea'),
	dealerCard1 = document.getElementById('dealerCard1'),
	dealerCard2 = document.getElementById('dealerCard2'),
	dealerCardAdditional = document.getElementById('dealerCardAdditional'),
	playerCard1 = document.getElementById('playerCard1'),
	playerCard2 = document.getElementById('playerCard2'),
	playerCardAdditional = document.getElementById('playerCardAdditional'),
	newGameButton = document.getElementById('new-game-button'),
	hitButton = document.getElementById('hit-button'),
	stayButton = document.getElementById('stay-button');

// Game variables
let gameStarted = false,
	cardHidden = true;
	gameOver = false,
	playerWon = false,
	blackjack = false,
	dealerCards = [],
	playerCards = [],
	dealerScore = 0,
	playerScore = 0,
	deck = [];

hitButton.style.visibility = 'hidden';
stayButton.style.visibility = 'hidden';
//showStatus();

newGameButton.addEventListener('click', function(){
	gameStarted = true;
	cardHidden = true;
	gameOver = false;
	playerWon = false;
	blackjack = false;

	playerHand.innerHTML = 
		'';

	dealerHand.innerHTML = 
		'';

	deck = createDeck();
	shuffleDeck(deck);
	playerCards = [getNextCard()];
	dealerCards = [getNextCard()];
	playerCards.push(getNextCard());
	dealerCards.push(getNextCard());
	//console.log(dealerCards);
	//console.log(playerCards);
	dealCards();
	
	textArea.innerHTML = '<p class="white-text">Game in progress...</p>';
	newGameButton.style.visibility = 'hidden';
	hitButton.style.visibility = 'visible';
	stayButton.style.visibility = 'visible';
	setTimeout(function(){
		checkBlackjack();
	}, 2000);

	showStatus();	
});

hitButton.addEventListener('click', function() {
	playerCards.push(getNextCard());
	//console.log(playerCards);
	getAdditionalCards('player');
	checkForEndOfGame();
	setTimeout(function(){
		showStatus();
	}, 500);
	
});

stayButton.addEventListener('click', function() {
	gameOver = true;
	checkForEndOfGame();
	setTimeout(function(){
		//showStatus();
	}, 500);
});

function createDeck(){
	let deck = []; // Clear Deck
	for(let suitIdx = 0; suitIdx < suits.length; suitIdx++){
		for(let valueIdx = 0; valueIdx < values.length; valueIdx++){
			let card = {
				suit: suits[suitIdx].suit,
				value: values[valueIdx]
			};
			deck.push(card);
		}
	}
	return deck;
}

function shuffleDeck(deck){
	for(let i = 0; i < deck.length; i++){
		let swapIdx = Math.trunc(Math.random() * deck.length);
		let tmp = deck[swapIdx];
		deck[swapIdx] = deck[i];
		deck[i] = tmp;
	}
}

function dealCards(){
	playerHand.innerHTML =
	getCardImage(playerCards[0]);

	setTimeout(function() {
		dealerHand.innerHTML = 
		'<div class="card" id="hidden"><img src="lib/img/cards/hidden.svg" width="100" /></div>'; 

		//getCardImage(dealerCards[0]);
		//hideCard(dealerCards[0]);
	}, 500);

	setTimeout(function() {
		playerHand.innerHTML += 
		getCardImage(playerCards[1]);
	}, 1000);

	setTimeout(function() {
		dealerHand.innerHTML += 
		getCardImage(dealerCards[1]);
	}, 1500);
}

// Scoring
function getCardNumericValue(card){
	switch(card.value){
		case 'A':
			return 1;
		case '2':
			return 2;
		case '3':
			return 3;
		case '4':
			return 4;
		case '5':
			return 5;
		case '6':
			return 6;
		case '7':
			return 7;
		case '8':
			return 8;
		case '9':
			return 9;
		default:
			return 10;
	}
}

function getScore(cardArray){
	let score = 0;
	let hasAce = false;
	for(let i = 0; i < cardArray.length; i++ ){
		let card = cardArray[i];
		score += getCardNumericValue(card);
		if(card.value === 'A') {
			hasAce = true;
		}
	}if(hasAce && score + 10 <= 21){
		return score + 10;
	}
	return score;
}

function updateScores(){
	dealerScore = getScore(dealerCards);
	playerScore = getScore(playerCards);
}

function checkForEndOfGame(){
	checkScores();
	updateScores();

	//showStatus();

	if(gameOver){
		if(blackjack){
			showCard(dealerCards[0]);
			checkScores();
			updateScores();
			showStatus();
		}else{
			showCard(dealerCards[0]);
			// Let dealer take cards

			var interval = setInterval(function(){
				if(playerScore <= 21 
				&& dealerScore <= 16){
					dealerCards.push(getNextCard());
					getAdditionalCards('dealer');
					checkScores();
					updateScores();
					
					//showStatus();
				}else{
					clearInterval(interval);
					checkScores();
					updateScores();
					showStatus();
				}
			}, 1000);
		}
		
	}
		
 	function checkScores() {
		if(playerScore > 21) {
			playerWon = false;
			gameOver = true;
		}else if(dealerScore > 21){
			playerWon = true;
			gameOver = true;
		}else if(gameOver) {
			if(playerScore > dealerScore) {
				playerWon = true;
			}else{
				playerWon = false;
			}
		}
	}

	//showStatus();
}

function showCard(){
	cardHidden = false;
	/*let cardId = "card-"+card.value+"-"+card.suit;
	//console.log(cardId);
	let cardFace = document.getElementById(cardId);
	cardFace.classList.remove('hidden');*/
	let dealerCardString = '';
		for(let i = 0; i < dealerCards.length; i++) {
			dealerCardString += getCardImage(dealerCards[i]);
	}

	dealerHand.innerHTML = 
		dealerCardString; 

	//getCardImage(dealerCards[0]);

	//console.log(cardFace.classList);
	//cardFace.innerHTML = '<img src="lib/img/cards/hidden.svg" width="150" />';
}

function hideCard(card){
	cardHidden = true;
	let cardId = "card-"+card.value+"-"+card.suit;
	//console.log(cardId);
	let cardFace = document.getElementById(cardId);
	cardFace.classList.add('hidden');

	//console.log(cardFace.classList);
	//cardFace.innerHTML = '<img src="lib/img/cards/hidden.svg" width="150" />';
}

function getAdditionalCards(person){
	updateScores();
	if(person === 'player'){
		let playerCardString = '';
		for(let i = 0; i < playerCards.length; i++) {
			playerCardString += getCardImage(playerCards[i]);
		}
		//console.log(playerCards);
		playerHand.innerHTML = 
			playerCardString;

	}else if(person === 'dealer'){
		let dealerCardString = '';
		for(let i = 0; i < dealerCards.length; i++) {
			dealerCardString += getCardImage(dealerCards[i]);
		}

		setTimeout(function(){

		//console.log(playerCards);
		dealerHand.innerHTML = 
			dealerCardString;

		}, 100);
	}
}

function showStatus(){
	if(!gameStarted) {
		textArea.innerHTML ='<h3 class="white-text">Start a new Game</h3>';
		return;
	}else{
		//textArea.innerText = '';
	}

	updateScores();

	/*dealerScoreArea.innerHTML =
		'(score: ' + dealerScore + ')<br/><br/>';*/

	playerScoreArea.innerHTML =
		' <h2 class="white-text">'+playerScore+'</h2>';
		
	if(gameOver) {

		if(playerScore === dealerScore){
			textArea.innerHTML = '<h3 class="white-text">Push!</h3>';
		}else if(playerWon && blackjack){
			textArea.innerHTML = '<h3 class="white-text">Blackjack! You win!</h3>';
		}else if(playerWon && !blackjack){
			textArea.innerHTML = '<h3 class="white-text">You win!</h3>';
		}else if(!playerWon && blackjack){
			textArea.innerHTML = '<h3 class="red-text">Blackjack! Dealer wins</red-text>';
		}else if(!playerWon && !blackjack){ 
			textArea.innerHTML = '<h3 class="red-text">Dealer wins</h3>';
		}

		showCard(dealerCards[0]);

		newGameButton.style.visibility = 'visible';
		hitButton.style.visibility = 'hidden';
		stayButton.style.visibility = 'hidden';
	}

	
	/*for(let i = 0; i < deck.length; i++) {
		textArea.innerText += '\n' + getCardString(deck[i]);
	}*/
}

function checkBlackjack(){
	if((playerCards[0].value === 'A') && ((playerCards[1].value === 'K'
			|| playerCards[1].value === 'Q'
			|| playerCards[1].value === 'J'
			|| playerCards[1].value === '10'))) {
		
		//console.log('blackjack');
		blackjack = true;
		gameOver = true;
		playerWon = true;
		//showCard(dealerCards[0]);
		//showStatus();

	}else if((playerCards[1].value === 'A') && ((playerCards[0].value === 'K'
			|| playerCards[0].value === 'Q'
			|| playerCards[0].value === 'J'
			|| playerCards[0].value === '10'))) {

		//console.log('blackjack');
		blackjack = true;
		gameOver = true;
		playerWon = true;
		//showCard(dealerCards[0]);
		//showStatus();

	}else if((dealerCards[1].value === 'A') && ((dealerCards[0].value === 'K'
			|| dealerCards[0].value === 'Q'
			|| dealerCards[0].value === 'J'
			|| dealerCards[0].value === '10'))) {

		//console.log('blackjack');
		blackjack = true;
		gameOver = true;
		playerWon = false;
		//showCard(dealerCards[0]);
		//showStatus();

	}else if((dealerCards[0].value === 'A') && ((dealerCards[1].value === 'K'
			|| dealerCards[1].value === 'Q'
			|| dealerCards[1].value === 'J'
			|| dealerCards[1].value === '10'))) {

		//console.log('blackjack');
		blackjack = true;
		gameOver = true;
		playerWon = false;
		//showCard(dealerCards[0]);
		//showStatus();
	}
	showStatus();
}


function getCardImage(card){
	return '<div class="card" id="card-'+card.value+'-'+card.suit+'"><img src="lib/img/cards/'+card.suit+'/card-'+card.value+'-'+card.suit+'.svg" width="100" /></div>'; 
}

function getNextCard(){
	return deck.shift();
}

/*
	
*/
