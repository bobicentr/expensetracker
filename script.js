const list = document.getElementById('list');
const form = document.querySelector('form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const addBtn = document.getElementById('adding-btn');

let currentFilter = 'all';
let editId = null;

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function addTransaction(e) {
    e.preventDefault();

    if (textInput.value.trim() === "" || amountInput.value.trim() === "") {
        alert("Please fill in all fields");
        return;
    }

    if (editId === null) {
        let newTransaction = {
            id: Date.now(),
            text: textInput.value,
            amount: +amountInput.value
        };
        transactions.push(newTransaction);
    } else {
        transactions = transactions.map(item => {
            if (item.id === editId) {
                return {
                    id: editId,
                    text: textInput.value,
                    amount: +amountInput.value
                };
            }
            return item;
        });

        editId = null;
        addBtn.innerText = 'Add transaction';
        addBtn.classList.remove('btn-warning');
        addBtn.classList.add('btn-primary');
    }

    textInput.value = '';
    amountInput.value = '';
    
    updateLocalStorage();
    init();
}

function editTransaction(id) {
    editId = id;
    const itemToEdit = transactions.find(item => item.id === id);
    
    textInput.value = itemToEdit.text;
    amountInput.value = itemToEdit.amount;
    
    addBtn.innerText = 'Update transaction';
    addBtn.classList.remove('btn-primary');
    addBtn.classList.add('btn-warning');
}

function removeTransaction(id) {
    if (id === editId) {
        editId = null;
        textInput.value = '';
        amountInput.value = '';
        addBtn.innerText = 'Add transaction';
        addBtn.classList.remove('btn-warning');
        addBtn.classList.add('btn-primary');
    }

    transactions = transactions.filter(item => item.id !== id);
    updateLocalStorage();
    init();
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
}

function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';    
    const colorClass = transaction.amount < 0 ? 'border-danger' : 'border-success';
    
    const item = document.createElement('li');
    item.className = `list-group-item d-flex justify-content-between align-items-center border-start border-5 ${colorClass} mb-2 shadow-sm rounded`;

    item.innerHTML = `
        <span class="fw-bold text-break">${transaction.text}</span>
        <span class="d-flex align-items-center">
            <span class="fw-bold me-2">${sign}$${Math.abs(transaction.amount)}</span>
            <button class="btn btn-sm btn-outline-secondary border-0" onclick="editTransaction(${transaction.id})">
                <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger border-0 ms-1" onclick="removeTransaction(${transaction.id})">
                <i class="bi bi-x-lg"></i>
            </button>
        </span>
    `;
    
    list.appendChild(item);
}

function updateValues() {
    const amounts = transactions.map(item => item.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0);
    
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0);

    const expense = (amounts
        .filter(item => item < 0)
        .reduce((acc, item) => (acc += item), 0) * -1);

    document.getElementById('balance').innerText = `$${total.toFixed(2)}`;
    document.getElementById('money-plus').innerText = `+$${income.toFixed(2)}`;
    document.getElementById('money-minus').innerText = `-$${expense.toFixed(2)}`;
}

function setFilter(filterType) {
    currentFilter = filterType;
    init();
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

form.addEventListener('submit', addTransaction);

init();