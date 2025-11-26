var forms = document.querySelectorAll('.needs-validation')
Array.prototype.slice.call(forms)
  .forEach(function (form) {
    form.addEventListener('submit', function (event) {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  });

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function addTransaction(e) {
    e.preventDefault()
    let text = document.getElementById('text').value
    let amount = document.getElementById('amount').value
    if (text == "" || amount == "") {
        return
    }
    let newTransaction = {
        id: Date.now(),
        text: text,
        amount: +amount
    }
    transactions.push(newTransaction)
    addTransactionDOM(newTransaction); // <--- Рисуем то, что только что добавили
    text.value = '';
    amount.value = '';
    updateLocalStorage()
}

function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    
    // Сюда потом добавим пересчет баланса
    updateValues()
}

function updateValues() {
    let amounts = transactions.map(transactions => transactions.amount)
    let total = amounts.reduce((acc, item) => (acc += item), 0)
    document.getElementById('balance').innerHTML = `<span class="fw-bold"> ${total.toFixed(2)} </span>`
    let income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0)
    document.getElementById('money-plus').innerHTML = `<span> ${income.toFixed(2)} </span>`
    let expences = amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    document.getElementById('money-minus').innerHTML = `<span> ${expences.toFixed(2)} </span>`
}

function removeTransaction(id) {
    transactions = transactions.filter(item => item.id !== id);
    init();
    updateLocalStorage()
}

function addTransactionDOM(transaction) {

    const sign = transaction.amount < 0 ? '-' : '+';    
    const colorClass = transaction.amount < 0 ? 'border-danger' : 'border-success';
    const item = document.createElement('li');
    item.className = `list-group-item d-flex justify-content-between align-items-center border-start border-5 ${colorClass} mb-2 shadow-sm rounded`;

    item.innerHTML = `
        <span class="fw-bold">${transaction.text}</span>
        <span>
            <span class="fw-bold">${sign}$${Math.abs(transaction.amount)}</span>
            <button class="btn btn-sm btn-outline-danger border-0 ms-2" onclick="removeTransaction(${transaction.id})">
                <i class="bi bi-x-lg"></i>
            </button>
        </span>
    `;
     list.appendChild(item);
    updateValues()
}

document.querySelector('form').addEventListener('submit', addTransaction)

init();