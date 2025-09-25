

class ExpenseTracker {
    constructor() {
        this.expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderExpenses();
        this.updateTotal();
        this.setDefaultDate();
    }

    bindEvents() {
        const form = document.getElementById('expenseForm');
        const expensesList = document.getElementById('expensesList');

        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        expensesList.addEventListener('click', (e) => this.handleDeleteClick(e));
    }

    handleFormSubmit(e) {
        e.preventDefault();

        const expenseName = document.getElementById('expenseName').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const description = document.getElementById('description').value.trim();
        const date = document.getElementById('date').value;

        if (!expenseName || !amount || !date) {
            this.showNotification('Please fill in all required fields!', 'error');
            return;
        }

        if (amount <= 0) {
            this.showNotification('Amount must be greater than 0!', 'error');
            return;
        }

        const expense = {
            id: Date.now().toString(),
            name: expenseName,
            amount: amount,
            description: description,
            date: date
        };

        this.expenses.push(expense);
        this.saveExpenses();
        this.renderExpenses();
        this.updateTotal();
        this.clearForm();
        this.showNotification('Expense added successfully!', 'success');
    }

    handleDeleteClick(e) {
        if (e.target.classList.contains('delete-btn')) {
            const expenseId = e.target.dataset.id;
            this.deleteExpense(expenseId);
        }
    }

    deleteExpense(id) {
        if (confirm('Are you sure you want to delete this expense?')) {
            this.expenses = this.expenses.filter(expense => expense.id !== id);
            this.saveExpenses();
            this.renderExpenses();
            this.updateTotal();
            this.showNotification('Expense deleted successfully!', 'success');
        }
    }

    renderExpenses() {
        const expensesList = document.getElementById('expensesList');

        if (this.expenses.length === 0) {
            expensesList.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 30px; color: #6c757d;">
                        No expenses added yet. Add your first expense above!
                    </td>
                </tr>
            `;
            return;
        }

        expensesList.innerHTML = this.expenses
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(expense => `
                <tr>
                    <td>${this.escapeHtml(expense.name)}</td>
                    <td class="amount">₹${expense.amount.toFixed(2)}</td>
                    <td>${this.escapeHtml(expense.description || '-')}</td>
                    <td class="date">${this.formatDate(expense.date)}</td>
                    <td>
                        <button class="delete-btn" data-id="${expense.id}">Delete</button>
                    </td>
                </tr>
            `).join('');
    }

    updateTotal() {
        const total = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const totalElement = document.getElementById('totalAmount');
        totalElement.textContent = total.toFixed(2);

        totalElement.style.transform = 'scale(1.05)';
        setTimeout(() => {
            totalElement.style.transform = 'scale(1)';
        }, 200);
    }

    clearForm() {
        document.getElementById('expenseForm').reset();
        this.setDefaultDate();
        document.getElementById('expenseName').focus();
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
    }
}