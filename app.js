// app.js

const binanceSocket = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

// Function to create or update a card
function createOrUpdateCard(coin) {
  const price = parseFloat(coin.c);
  const formattedPrice = price < 1 ? price.toFixed(6) : price.toFixed(2);

  let card = document.getElementById(coin.s);

  if (!card) {
    card = document.createElement('div');
    card.id = coin.s;
    card.className = 'bg-gray-800 p-6 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 mb-4 cursor-pointer';
    card.onclick = () => {
      window.location.href = `detail.html?symbol=${coin.s}`;
    };
    document.getElementById('crypto-container').appendChild(card);
  }

  card.innerHTML = `
    <div class="flex items-center mb-4">
      <h2 class="text-2xl font-bold">${coin.s.substring(0, 8)}</h2>
    </div>
    <p class="text-gray-400">Price: <span class="text-white">$${formattedPrice}</span></p>
    <p class="text-gray-400">Price Change: <span class="text-white">${parseFloat(coin.P).toFixed(2)}%</span></p>
    <p class="text-gray-400">Volume: <span class="text-white">${parseFloat(coin.v).toLocaleString()}</span></p>
  `;
}

binanceSocket.onmessage = function(event) {
  const coins = JSON.parse(event.data);
  const filteredCoins = coins.filter(coin => coin.s === 'BTCUSDT' || coin.s === 'SHIBUSDT' || coin.s === 'FLOKIUSDT' || coin.s === 'ADAUSDT' || coin.s === 'PEPEUSDT' || coin.s === 'SOLUSDT');
  filteredCoins.forEach(createOrUpdateCard);
};
