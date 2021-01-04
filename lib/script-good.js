
/*
console.log('Hello World!');

let productName = "Hammer",
	productId = "H123";

console.log(productName, productId);

for(let i = 2; i < 3; i++) {
		console.log(i);
	}

	let count = 1;
	while(count<5) {
		console.log(count);
		count++;
	}

	function myFunction(message, message2) {
		console.log(message, message2);
	}

	myFunction('First message', 'Second Message');

	function triplePlus(value){
		let newValue = value + value + value;
		return newValue;
	}

	console.log(triplePlus(3));

	// Generate random number from 0 - 52
	let result = Math.random() * 52;
	result = Math.trunc(result);

	console.log(result);

	let result = 1 / 1;
	console.log(Number.isNaN(result));
*/







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
	dealerCard2 = document.getElementById('dealerCard1'),
	dealerCardAdditional = document.getElementById('dealerCardAdditional'),
	playerCard1 = document.getElementById('playerCard2'),
	playerCard2 = document.getElementById('playerCard1'),
	playerCardAdditional = document.getElementById('playerCardAdditional'),
	newGameButton = document.getElementById('new-game-button'),
	hitButton = document.getElementById('hit-button'),
	stayButton = document.getElementById('stay-button');

// Game variables
let gameStarted = false,
	cardHidden = true;
	gameOver = false,
	playerWon = false,
	dealerCards = [],
	playerCards = [],
	dealerScore = 0,
	playerScore = 0,
	deck = [];

hitButton.style.display = 'none';
stayButton.style.display = 'none';
showStatus();

newGameButton.addEventListener('click', function(){
	gameStarted = true;
	cardHidden = true;
	gameOver = false;
	playerWon = false;

	deck = createDeck();
	shuffleDeck(deck);
	dealerCards = [getNextCard(), getNextCard()];
	playerCards = [getNextCard(), getNextCard()];

	//textArea.innerText = 'Started...';
	newGameButton.style.display = 'none';
	hitButton.style.display = 'inline';
	stayButton.style.display = 'inline';
	showStatus();
});

hitButton.addEventListener('click', function() {
	playerCards.push(getNextCard());
	checkForEndOfGame();
	showStatus();
});

stayButton.addEventListener('click', function() {
	gameOver = true;
	checkForEndOfGame();
	showStatus();
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
	updateScores();

	if(gameOver){
		showCard(dealerCards[1]);
		// Let dealer take cards
		while(dealerScore < playerScore 
			&& playerScore <= 21 
			&& dealerScore <= 21){
			
			dealerCards.push(getNextCard());
			updateScores();
		}
		
	}

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

function hideCard(card){
	cardHidden = true;
	let cardId = "card-"+card.value+"-"+card.suit;
	//console.log(cardId);
	let cardFace = document.getElementById(cardId);
	cardFace.classList.add('hidden');

	//console.log(cardFace.classList);
	//cardFace.innerHTML = '<img src="lib/img/cards/hidden.svg" width="150" />';
}

function showCard(card){
	cardHidden = false;
	let cardId = "card-"+card.value+"-"+card.suit;
	//console.log(cardId);
	let cardFace = document.getElementById(cardId);
	cardFace.classList.remove('hidden');

	//console.log(cardFace.classList);
	//cardFace.innerHTML = '<img src="lib/img/cards/hidden.svg" width="150" />';
}

function showStatus(){
	if(!gameStarted) {
		textArea.innerText ='Start a new game';
		return;
	}else{
		textArea.innerText = '';
	}

	//console.log(dealerCards[1].suit);
	let dealerCardString = '';
	for(let i = 0; i < dealerCards.length; i++) {
		dealerCardString += getCardString(dealerCards[i]) + '\n';		
	}

	let playerCardString = '';
	for(let i = 0; i < playerCards.length; i++) {
		playerCardString += getCardString(playerCards[i]) + '\n';
	}
	
	updateScores();

	dealerHand.innerHTML =
		'Dealer has: <br>' +
		dealerCardString;
	/*dealerScoreArea.innerHTML =
		'(score: ' + dealerScore + ')<br/><br/>';*/

	playerHand.innerHTML =
		'Player has: <br>' +
		playerCardString;
	/*playerScoreArea.innerHTML =
		'(score: ' + playerScore + ')<br/><br/>';*/
		
	if(cardHidden === true){
		hideCard(dealerCards[0]);
	}

	if(gameOver) {
		if(playerWon){
			textArea.innerText += 'You win!';
		}else{
			textArea.innerText += 'Dealer wins';
		}

		newGameButton.style.display = 'inline';
		hitButton.style.display = 'none';
		stayButton.style.display = 'none';
	}

	
	/*for(let i = 0; i < deck.length; i++) {
		textArea.innerText += '\n' + getCardString(deck[i]);
	}*/
}

function getCardString(card){
	return '<div class="card" id="card-'+card.value+'-'+card.suit+'"><img src="lib/img/cards/'+card.suit+'/card-'+card.value+'-'+card.suit+'.svg" width="100" /></div>'; 
}

function getNextCard(){
	return deck.shift();
}
