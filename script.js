document.addEventListener('DOMContentLoaded', () => {
  const tradeForm = document.getElementById('tradeForm');
  const tradeTableBody = document.getElementById('tradeTable').getElementsByTagName('tbody')[0];
  let trades = [];

  tradeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(tradeForm);
    const trade = {
      date: formData.get('date'),
      symbol: formData.get('symbol'),
      quantity: formData.get('quantity'),
      entryPrice: formData.get('entryPrice'),
      exitPrice: formData.get('exitPrice'),
      exitDate: formData.get('exitDate'),
      type: formData.get('type'),
      id: Date.now(),
    };

    trades.push(trade);
    renderTrades();
    tradeForm.reset();
  });

  function renderTrades() {
    tradeTableBody.innerHTML = '';

    trades.forEach(trade => {
      const row = tradeTableBody.insertRow();

      const entryDateCell = row.insertCell();
      entryDateCell.textContent = trade.date;

      const symbolCell = row.insertCell();
      symbolCell.textContent = trade.symbol;

      const statusCell = row.insertCell();
      const { profitLossPrice, profitLossPercentage } = calculateProfitLoss(trade.entryPrice, trade.exitPrice, trade.quantity);
      const status = calculateStatus(trade.exitPrice, profitLossPrice);
      statusCell.textContent = status;
      statusCell.className = status === 'Win' ? 'text-green-500' : status === 'Loss' ? 'text-red-500' : 'text-gray-500';

      const quantityCell = row.insertCell();
      quantityCell.textContent = trade.quantity;

      const entryPriceCell = row.insertCell();
      entryPriceCell.textContent = `$${parseFloat(trade.entryPrice).toFixed(2)}`;

      const exitPriceCell = row.insertCell();
      exitPriceCell.textContent = trade.exitPrice ? `$${parseFloat(trade.exitPrice).toFixed(2)}` : '-';

      const daysHeldCell = row.insertCell();
      daysHeldCell.textContent = calculateDaysHeld(trade.date, trade.exitDate);

      const profitLossPriceCell = row.insertCell();
      profitLossPriceCell.textContent = `$${profitLossPrice.toFixed(2)}`;
      profitLossPriceCell.className = profitLossPrice >= 0 ? 'text-green-500' : 'text-red-500';

      const profitLossPercentageCell = row.insertCell();
      profitLossPercentageCell.textContent = `${profitLossPercentage.toFixed(2)}%`;
      profitLossPercentageCell.className = profitLossPercentage >= 0 ? 'text-green-500' : 'text-red-500';

      const typeCell = row.insertCell();
      typeCell.textContent = trade.type;

      const actionsCell = row.insertCell();
      const editButton = document.createElement('button');
      editButton.className = 'inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2';
      editButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 12"></polygon></svg>';
      editButton.addEventListener('click', () => editTrade(trade));

      const deleteButton = document.createElement('button');
      deleteButton.className = 'inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500';
      deleteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
      deleteButton.addEventListener('click', () => deleteTrade(trade.id));

      actionsCell.appendChild(editButton);
      actionsCell.appendChild(deleteButton);
    });
  }

  function calculateDaysHeld(entryDate, exitDate) {
    const entry = new Date(entryDate);
    const exit = exitDate ? new Date(exitDate) : new Date();
    const timeDifference = exit - entry;
    const dayDifference = timeDifference / (1000 * 60 * 60 * 24);
    return dayDifference;
  }

  function calculateProfitLoss(entryPrice, exitPrice, quantity) {
    if (!exitPrice) return { profitLossPrice: 0, profitLossPercentage: 0 };
    const entryPriceNum = parseFloat(entryPrice);
    const exitPriceNum = parseFloat(exitPrice);
    const quantityNum = parseFloat(quantity);
    const profitLossPrice = (exitPriceNum - entryPriceNum) * quantityNum;
    const profitLossPercentage = ((exitPriceNum - entryPriceNum) / entryPriceNum) * 100;
    return { profitLossPrice, profitLossPercentage };
  }

  function calculateStatus(exitPrice, profitLossPrice) {
    if (!exitPrice) return 'Open';
    return profitLossPrice > 0 ? 'Win' : 'Loss';
  }

  function editTrade(trade) {
    // Implement edit functionality here
    alert('Edit trade functionality not implemented yet.');
  }

  function deleteTrade(id) {
    trades = trades.filter(trade => trade.id !== id);
    renderTrades();
  }
});
