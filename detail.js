// detail.js

const urlParams = new URLSearchParams(window.location.search);
const symbol = urlParams.get('symbol');

console.log('Symbol:', symbol); // Log the symbol to make sure it's correct

document.getElementById('crypto-title').innerText = `${symbol.substring(0, 8)} Price History`;

// Initialize ApexCharts
let options = {
  chart: {
    type: 'candlestick',
    height: 350,
    toolbar: {
      show: false
    },
    background: '#1f2937',
    foreColor: '#ffffff'
  },
  series: [{
    name: 'Price',
    data: []
  }],
  xaxis: {
    type: 'datetime',
    labels: {
      style: {
        colors: '#ffffff'
      }
    }
  },
  yaxis: {
    title: {
      text: 'Price (USDT)',
      style: {
        color: '#ffffff'
      }
    },
    labels: {
      style: {
        colors: '#ffffff'
      }
    }
  },
  tooltip: {
    theme: 'dark',
    x: {
      format: 'dd MMM yyyy HH:mm'
    }
  },
  grid: {
    borderColor: '#444',
    strokeDashArray: 5
  },
  plotOptions: {
    candlestick: {
      colors: {
        upward: '#4CAF50',
        downward: '#F44336'
      }
    }
  }
};

let chart = new ApexCharts(document.querySelector("#priceChart"), options);
chart.render();

async function fetchData(interval) {
  const endTime = Date.now();
  let startTime;

  switch(interval) {
    case '4h':
      startTime = endTime - (4 * 60 * 60 * 1000);
      break;
    case '1d':
      startTime = endTime - (24 * 60 * 60 * 1000);
      break;
    case '1w':
      startTime = endTime - (7 * 24 * 60 * 60 * 1000);
      break;
  }

  console.log('Fetching data with interval:', interval); // Log the interval
  console.log('Start time:', startTime, 'End time:', endTime); // Log the time range

  try {
    const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&startTime=${startTime}&endTime=${endTime}`);
    const data = await response.json();

    console.log('Data:', data); // Log the received data

    if (Array.isArray(data) && data.length) {
      const seriesData = data.map(item => ({
        x: new Date(item[0]),
        y: [parseFloat(item[1]), parseFloat(item[2]), parseFloat(item[3]), parseFloat(item[4])]
      }));

      console.log('Series Data:', seriesData); // Log the series data

      chart.updateSeries([{
        name: 'Price',
        data: seriesData
      }]);
    } else {
      console.error('Invalid data received from API');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Default fetch for 4 hours
fetchData('4h');
