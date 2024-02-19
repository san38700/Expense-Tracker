leaderBoardButton = document.getElementById('leaderboard')
leaderBoardButton.addEventListener('click',leaderboard)
const downloadButton = document.getElementById('download')
const downloadUrls = document.getElementById('downloaded-items')

let currentPage = 1;
let itemsPerPage;
let pageId = document.getElementById('pageid')






downloadButton.addEventListener('click', downloadExpense)

function downloadExpense(){
    const token = localStorage.getItem('jwtToken')
    axios.get('http://localhost:3000/user/download', { headers: {"Authorization" : token} })
    .then((response) => {
        if(response.status === 201){
            console.log(response)
            var a = document.createElement("a");
            a.href = response.data.fileURL;
            a.download = 'myexpense.csv';
            a.click();
            downloadedExpense()

        } else {
            throw new Error(response.data.message)
        }

    })
    .catch((err) => {
        console.log(err)
    });
}

function downloadedExpense() {
    downloadUrls.innerHTML = ""
    const token = localStorage.getItem('jwtToken')
    axios.get('http://localhost:3000/user/downloads', { headers: {"Authorization" : token} })
    .then((res) => {
        if(res.data.downloadedExpenses.length == 0){
            downloadUrls.innerHTML = "No downloaded data found"
        }
        
        //console.log(res.data.downloadedExpenses.length)
        res.data.downloadedExpenses.forEach(function (data){
            console.log(data.url)
            var a = document.createElement("a");
            const url = data.url
            a.href = url
            const date = new Date
            a.textContent = `${url}`
            downloadUrls.appendChild(a)
        })
    })
    .catch(err => console.log(err))
    
}

function updateDateTime() {
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    const formattedDate = currentDate.toLocaleDateString('en-US', options);

    // Update the content of the element with id 'currentDateTime'
    document.getElementById('currentDateTime').textContent = formattedDate;
}

// Call the function to update date and time on page load
updateDateTime();

// Update date and time every second (1000 milliseconds)
setInterval(updateDateTime, 1000);

function premiumuser(){
    premiumlabel = document.getElementById('buy-button')
    premiumlabel.innerText = 'Premium User';
    premiumlabel.disabled = true;
    premiumlabel.style.backgroundColor = 'gold';
    premiumlabel.style.pointerEvents = 'none';

    
    leaderBoardButton.style.display = "block"
    downloadButton.style.display = 'block'

    const downloads = document.getElementById('old-downloads')
    downloads.style.display = 'block'

}

async function leaderboard(){
    const leaderboard = document.getElementById('leaderboard-items');
    leaderboard.innerHTML = ""
    await axios.get('http://localhost:3000/premium/leaderboard')
    .then(res => {
        res.data.users.forEach(expense => {
            var i = 0
            
            const leaderboardItems = document.createElement('div');

            // Create a text node with the userName and append it to the li element
            const expensesTextNode = document.createTextNode(`---> Name:${expense.name} Total Expense:${expense.totalexpenses}`);
            leaderboardItems.appendChild(expensesTextNode);

            // Append the li element to the leaderboard
            leaderboard.appendChild(leaderboardItems);

            console.log(expense);
        });
    })
    .catch(err => console.log(err))

    
}



document.getElementById('buy-button').onclick = async function (e){
    const token = localStorage.getItem('jwtToken')
    //console.log(token)
    const response = await axios.post('http://localhost:3000/purchase/purchase-premium', {}, {headers: {'Authorization': token}
});
    console.log(response)

    var options = 
        {
            'key': response.data.key_id, 
            'order_id': response.data.order.id,
            'handler': async function(response) {
                await axios.post('http://localhost:3000/purchase/updatetransactionstatus',
                {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id,
                },{headers: {'Authorization': token}})
                
                premiumuser()

                // document.getElementById('buy-button').innerText = 'Premium User';
                // document.getElementById('buy-button').disabled = true;
                // document.getElementById('buy-button').style.backgroundColor = 'gold';
                
                alert('You are now a premium user')
                
            }
        }
    const rzp1 = new Razorpay(options)
    rzp1.open()
    e.preventDefault()

    rzp1.on('payment.failed', async function (response) {
        await axios.post('http://localhost:3000/purchase/purchase-failure', {response}, {headers: {'Authorization': token}});
        console.log('Payment failed:', response.error.metadata.order_id);
        alert("Something went wrong")
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('form');
    const expenseList = document.getElementById('items');
    const pagination = document.getElementById('pagination')
    
    // Adding event listener to the select element
    document.getElementById('items-per-page').addEventListener('change', function() {
    itemsPerPage = document.getElementById('items-per-page').value;
    fetchAndDisplayExpenses(currentPage, itemsPerPage);

    });

    // Create a single table for all expenses
    const tableElement = document.createElement('table');
    tableElement.style.borderCollapse = 'collapse';
    tableElement.style.width = '100%';

    // Flag to check if headers have been added
    let headersAdded = false;

    // Event listener for form submission
    expenseForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const amount = document.getElementById('amount-id').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;

        try {
            // Create a new expense
            const token = localStorage.getItem('jwtToken')
            //console.log(token)
            const response = await axios.post(`http://localhost:3000/expense/add-expense`, { amount, description, category},{headers :{'Authorization': token}});
            console.log(response)
            alert('Please click again on leaderboard for updated data')
            // Fetch and display expenses
            fetchAndDisplayExpenses(currentPage);
            
        } catch (error) {
            console.error(error);
        }
    });

    // Fetch and display expenses on page load
    fetchAndDisplayExpenses(currentPage,itemsPerPage);

    // Function to fetch and display Expenses
    async function fetchAndDisplayExpenses(page,itemno) {
        try {
            clearTableContent();
            const token = localStorage.getItem('jwtToken')
            //console.log(token)
            const response = await axios.get(`http://localhost:3000/expense/get-expense?page=${page}&pageitems=${itemno}`,{headers: {'Authorization': token }});
            const expenses = response.data.Expenses;
            const pageData = response.data.pageData
            //console.log(response.data);
            //console.log(pageData)
            const totalItems = response.data.pageData.totalItems
            //console.log(totalItems)
            console.log
            const ispremiumuser = response.data.premiumuser
            
            //pageId.innerText = `Showing ${itemsPerPage} of ${totalItems}`

            if (ispremiumuser === true){
                premiumuser()
                leaderboard.innerHTML = ""
                leaderBoardButton.addEventListener('click',leaderboard)
                downloadUrls.innerHTML = ""
                downloadedExpense()
                // document.getElementById('buy-button').innerText = 'Premium User';
                // document.getElementById('buy-button').disabled = true;
                // document.getElementById('buy-button').style.backgroundColor = 'gold';
                // document.getElementById('buy-button').style.pointerEvents = 'none';
            }


            // Only add headers if not added yet
            if (!headersAdded) {
                const headerRow = tableElement.insertRow();
                addTableHeader(headerRow,'Sl.No')
                addTableHeader(headerRow, 'Amount');
                addTableHeader(headerRow, 'Description');
                addTableHeader(headerRow, 'Category');
                //addTableHeader(headerRow, ''); // Empty cell for the delete button
                headersAdded = true;
            }

            // Append the table to the expenseList
            expenseList.appendChild(tableElement);
           
        

            // Display expenses
            for (let i = 0; i < expenses.length; i++) {
                //console.log(expenses[i])
                showExpenseOnScreen(expenses[i], i);
                showPagination(pageData)
            }


        } catch (error) {
            console.error(error);
        }
    }

    function clearTableContent() {
        // Remove all rows except the first row (headers)
        while (tableElement.rows.length > 1) {
            tableElement.deleteRow(1);
        }
    }

    function showPagination({
        currentPage,
        hasNextPage,
        nextPage,
        hasPreviousPage,
        previousPage,
    }){
        pagination.innerHTML = ""

        if(hasPreviousPage){
            const btn2 = document.createElement('button')
            btn2.innerHTML = previousPage
            btn2.addEventListener('click', () => fetchAndDisplayExpenses(previousPage,itemsPerPage))
            pagination.appendChild(btn2)
        }

        const btn1 = document.createElement('button')
        btn1.innerHTML = `<h3>${currentPage}</h3`
        btn1.addEventListener('click',() => fetchAndDisplayExpenses(currentPage,itemsPerPage))
        pagination.appendChild(btn1)

        if(hasNextPage){
            const btn3 = document.createElement('button')
            btn3.innerHTML = nextPage
            btn3.addEventListener('click',() => fetchAndDisplayExpenses(nextPage,itemsPerPage))
            pagination.appendChild(btn3)
        }

    }
    

    // Function to display an expense on the screen
    function showExpenseOnScreen(expense, index) {
        //console.log(expense)
        // Add a row with cells for each property and the delete button
        const row = tableElement.insertRow();
        addTableCell(row, index+1+".")
        addTableCell(row, expense.amount);
        addTableCell(row, expense.description);
        addTableCell(row, expense.category);

        // Add the delete button to the last column
        const deleteCell = row.insertCell();
        deleteCell.style.textAlign = 'center';

        const buttonElement = document.createElement('button');
        buttonElement.className = 'btn btn-primary';
        buttonElement.textContent = 'Delete Expense';
        buttonElement.onclick = () => deleteExpense(expense.id, row);

        deleteCell.appendChild(buttonElement);
    }

    // Function to add a table header cell with name
    function addTableHeader(row, heading) {
        const cell = row.insertCell();
        cell.textContent = heading;
        cell.style.fontWeight = 'bold';
        cell.style.border = '1px solid #ddd';
        cell.style.padding = '8px';
    }

    // Function to add a table cell with value
    function addTableCell(row, value) {
        const cell = row.insertCell();
        cell.textContent = value;
        cell.style.border = '1px solid #ddd';
        cell.style.padding = '8px';
    }

    async function deleteExpense(expenseId, expenseItem) {
        try {
            const token = localStorage.getItem('jwtToken')
            const response = await axios.delete(`http://localhost:3000/expense/delete-expense/${expenseId}`,{headers: {'Authorization': token}});

            // Remove the expense item from the DOM
            expenseItem.remove();
            leaderboard()
        } catch (error) {
            console.error(error);
        }
    }
});
