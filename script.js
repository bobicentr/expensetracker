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

let currentFilter = 'all';
let editId = null

function editTransaction(id) {
    editId = id
    let editedTransaction = transactions.find((element) => element.id == id)
    document.getElementById('text').value = editedTransaction.text
    document.getElementById('amount').value = editedTransaction.amount
    document.getElementById('adding-btn').innerHTML = `Edit transaction`
    document.getElementById('adding-btn').classList.remove('btn-primary')
    document.getElementById('adding-btn').classList.add('btn-warning')
}

function setFilter(filterType) {
    currentFilter = filterType;
    init();
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function addTransaction(e) {
    e.preventDefault()
    let text = document.getElementById('text').value
    let amount = document.getElementById('amount').value
    if (editId == null) 
        {
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
        }
    else {
        transactions = transactions.map(item => {
            if (item.id === editId) {
                return {
                    id: editId,        
                    text: text,  
                    amount: +amount
                };
            } else {
                return item;
            }
        });
        editId = null
        document.getElementById('adding-btn').classList.add('btn-primary')
        document.getElementById('adding-btn').classList.remove('btn-warning')
        document.getElementById('adding-btn').innerHTML = `Add transaction`
        init()
    }
    text.value = '';
    amount.value = '';
    updateLocalStorage()
}

function init() {
    list.innerHTML = '';
    let filteredTransactions = transactions;
    if (currentFilter === 'plus') {
        filteredTransactions = transactions.filter(item => item.amount > 0);
    } else if (currentFilter === 'minus') {
        filteredTransactions = transactions.filter(item => item.amount < 0);
    }
    filteredTransactions.forEach(addTransactionDOM);
    updateValues(); 
    document.getElementById('adding-btn').classList.add('btn-primary')
    document.getElementById('adding-btn').classList.remove('btn-warning')
    document.getElementById('adding-btn').innerHTML = `Add transaction`
    
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
            
            <button class="btn btn-sm btn-outline-warning border-0 ms-2" onclick="editTransaction(${transaction.id})">
                <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger border-0 ms-2" onclick="removeTransaction(${transaction.id})">
                <i class="bi bi-x-lg"></i>
            </button>
        </span>
    `;
     list.appendChild(item);
    updateValues()
    document.getElementById('text').value = ''
    document.getElementById('amount').value = ''
}

document.querySelector('form').addEventListener('submit', addTransaction)

init();