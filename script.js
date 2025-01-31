document.addEventListener('DOMContentLoaded', () => {
  const tradeForm = document.getElementById('tradeForm');
  const tradeTable = document.getElementById('tradeTable').getElementsByTagName('tbody')[0];
  let trades = [];

  // Convert symbol to uppercase as the user types
  const symbolInput = document.getElementById('symbol');
  symbolInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
  });

  tradeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const symbol = document.getElementById('symbol').value.trim();
    const date = document.getElementById('date').value.trim();
    const entryPrice = document.getElementById('entryPrice').value.trim();
    const exitDate = document.getElementById('exitDate').value.trim();
    const exitPrice = document.getElementById('exitPrice').value.trim();
    const quantity = document.getElementById('quantity').value.trim();
    const type = document.querySelector('input[name="type"]:checked').value;

    if (!symbol || !date || !entryPrice) {
      alert('Please enter Symbol, Entry Date, and Entry Price.');
      return;
    }

    const newTrade = {
      id: Date.now(),
      symbol,
      date,
      entryPrice: parseFloat(entryPrice),
      exitDate,
      exitPrice: exitPrice ? parseFloat(exitPrice) : null,
      quantity: parseInt(quantity, 10),
      type,
    };

    trades.push(newTrade);
    renderTrades();
    tradeForm.reset();
  });

  function renderTrades() {
    tradeTable.innerHTML = '';
    trades.forEach(trade => {
      const row = tradeTable.insertRow();

      const entryDateCell = row.insertCell(0);
      entryDateCell.textContent = trade.date;

      const symbolCell = row.insertCell(1);
      symbolCell.textContent = trade.symbol;

      const statusCell = row.insertCell(2);
      const status = trade.exitDate ? 'Closed' : 'Open';
      statusCell.textContent = status;
      statusCell.className = status === 'Closed' ? 'text-green-500' : 'text-gray-500';

      const quantityCell = row.insertCell(3);
      quantityCell.textContent = trade.quantity;

      const entryPriceCell = row.insertCell(4);
      entryPriceCell.textContent = `$${trade.entryPrice.toFixed(2)}`;

      const exitPriceCell = row.insertCell(5);
      exitPriceCell.textContent = trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : '-';

      const daysHeldCell = row.insertCell(6);
      if (trade.exitDate) {
        const entry = new Date(trade.date);
        const exit = new Date(trade.exitDate);
        const daysHeld = (exit - entry) / (1000 * 60 * 60 * 24);
        daysHeldCell.textContent = daysHeld;
      } else {
        daysHeldCell.textContent = '-';
      }

      const profitLossPriceCell = row.insertCell(7);
      if (trade.exitPrice) {
        const profitLossPrice = (trade.exitPrice - trade.entryPrice) * trade.quantity;
        profitLossPriceCell.textContent = `$${profitLossPrice.toFixed(2)}`;
        profitLossPriceCell.className = profitLossPrice >= 0 ? 'text-green-500' : 'text-red-500';
      } else {
        profitLossPriceCell.textContent = '-';
      }

      const profitLossPercentCell = row.insertCell(8);
      if (trade.exitPrice) {
        const profitLossPercent = ((trade.exitPrice - trade.entryPrice) / trade.entryPrice) * 100;
        profitLossPercentCell.textContent = `${profitLossPercent.toFixed(2)}%`;
        profitLossPercentCell.className = profitLossPercent >= 0 ? 'text-green-500' : 'text-red-500';
      } else {
        profitLossPercentCell.textContent = '-';
      }

      const typeCell = row.insertCell(9);
      typeCell.textContent = trade.type === 'buy' ? 'Long' : 'Short';

      const actionsCell = row.insertCell(10);
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.className = 'inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2';
      editButton.addEventListener('click', () => editTrade(trade.id));

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500';
      deleteButton.addEventListener('click', () => deleteTrade(trade.id));

      actionsCell.appendChild(editButton);
      actionsCell.appendChild(deleteButton);
    });
  }

  function editTrade(id) {
    const trade = trades.find(trade => trade.id === id);
    if (trade) {
      document.getElementById('symbol').value = trade.symbol;
      document.getElementById('date').value = trade.date;
      document.getElementById('entryPrice').value = trade.entryPrice;
      document.getElementById('exitDate').value = trade.exitDate || '';
      document.getElementById('exitPrice').value = trade.exitPrice || '';
      document.getElementById('quantity').value = trade.quantity;
      document.querySelector(`input[name="type"][value="${trade.type}"]`).checked = true;

      const tradeIndex = trades.indexOf(trade);
      trades.splice(tradeIndex, 1);

      tradeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedTrade = {
          id: trade.id,
          symbol: document.getElementById('symbol').value.trim(),
          date: document.getElementById('date').value.trim(),
          entryPrice: parseFloat(document.getElementById('entryPrice').value.trim()),
          exitDate: document.getElementById('exitDate').value.trim(),
          exitPrice: document.getElementById('exitPrice').value.trim() ? parseFloat(document.getElementById('exitPrice').value.trim()) : null,
          quantity: parseInt(document.getElementById('quantity').value.trim(), 10),
          type: document.querySelector('input[name="type"]:checked').value,
        };

        trades.push(updatedTrade);
        renderTrades();
        tradeForm.reset();
      }, { once: true });
    }
  }

  function deleteTrade(id) {
    trades = trades.filter(trade => trade.id !== id);
    renderTrades();
  }
});
