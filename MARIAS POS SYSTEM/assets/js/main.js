
/*----------------------SIDE-BAR, NAV-BAR, SWITCH-MODE, TIME, LOADER-----------------------------*/

var preloader = document.getElementById('loading');
function myFunction() {
    setTimeout(function() {
        preloader.style.display = 'none';
    }, 500); // Hide after 4 seconds
}


const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item=> {
	const li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i=> {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});


// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})


const switchMode = document.getElementById('switch-mode');

// Function to toggle dark mode
function toggleDarkMode(isDark) {
  if(isDark) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
}

// Event listener for the switch
switchMode.addEventListener('change', function () {
  toggleDarkMode(this.checked);
  // Save the preference to localStorage
  localStorage.setItem('darkMode', this.checked);
});

// Check for saved dark mode preference on page load
document.addEventListener('DOMContentLoaded', (event) => {
  const isDarkMode = JSON.parse(localStorage.getItem('darkMode'));
  // Set the switch position based on the preference
  switchMode.checked = isDarkMode;
  // Apply the dark mode based on the preference
  toggleDarkMode(isDarkMode);
});



function updateDateTime() {
    var now = new Date();
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var day = days[now.getDay()];
    var date = now.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
    var time = now.toLocaleTimeString();
    var formattedTime = day + ', ' + date + ' ' + time;
    document.getElementById('date-time').textContent = formattedTime;
}

// Update the date and time upon loading the page
updateDateTime();

// Set the date and time to update every second (1000 milliseconds)
setInterval(updateDateTime, 1000);

//LOG-OUT Function
function logout() {
    if(confirm("Continue Signing-Out?")) {
        window.location.href = "ADMIN_LOGIN_PAGE.html";
    } else {
        location.reload();
    }
}


/*----------------------SALES-----------------------------*/

document.getElementById('addButton').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form submission

    const productSelect = document.getElementById('productSelect');
    const selectedProductIndex = productSelect.value;
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const selectedProduct = products[selectedProductIndex];
    const quantityInput = parseInt(document.getElementById('quantityInput').value);
    
    // Update the selected product in the table or add a new one
    updateTotalAmount(); // Update total amount after adding product
});
// Update the product table
function updateProductInTable(product, quantity) {
    // Check if the product is defined and has a name
    if (!product || !product.name) {
        alert('Please select a product first.');
        return; // Exit the function if no product is selected
    }

    // Check if the quantity is a positive number
    if (!quantity || quantity <= 0) {
        alert('Please enter a valid quantity.');
        return; // Exit the function if the quantity is not valid
    }

    const tableBody = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    let productExists = false;
    // Check if the product already exists in the table
    for (let i = 0; i < tableBody.rows.length; i++) {
        const row = tableBody.rows[i];
        if (row.cells[0].textContent === product.name) {
            const existingQuantity = parseInt(row.cells[3].textContent);
            const newQuantity = existingQuantity + quantity;
            row.cells[3].textContent = newQuantity;
            row.cells[4].textContent = (parseFloat(product.price) * newQuantity).toFixed(2);
            
            // Calculate and update profit for the product
            const profit = (parseFloat(product.price) - parseFloat(product.ogprice)) * newQuantity;
            row.cells[5].textContent = profit.toFixed(2);

            productExists = true;

            // Update the quantity in the selectedProducts array
            const selectedProductIndex = selectedProducts.findIndex(p => p.name === product.name);
            if (selectedProductIndex !== -1) {
                selectedProducts[selectedProductIndex].quantity = newQuantity;
                selectedProducts[selectedProductIndex].totalAmount = parseFloat(row.cells[4].textContent);
                selectedProducts[selectedProductIndex].totalProfit = parseFloat(row.cells[5].textContent);
            }
            break;
        }
    }

    // If the product doesn't exist, add it as a new row
    if (!productExists) {
        addSelectedProductToTable(product, quantity);
    }

    // Recalculate the total amount and total profit
    updateTotalAmount();
    updateTotalProfit();
}

/*----------------------CASH MODAL-----------------------------*/

// DOM elements
const modal = document.getElementById('myModal');
const cashInput = document.getElementById('cashInput');
const changeDisplay = document.getElementById('changeDisplay');
const totalAmountDisplay = document.getElementById('totalAmountDisplay');
const totalProfitDisplay = document.getElementById('totalProfitDisplay');
const saveButton = document.getElementById('saveButton');
const finishButton = document.getElementById('finishButton');
let selectedProducts = []; // Modified let to allow reassignment

// Event listeners
saveButton.addEventListener('click', openCashModal);
finishButton.addEventListener('click', calculateChange);
modal.querySelector('.close').addEventListener('click', closeCashModal);

// Add product event listener
document.getElementById('addButton').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form submission

    const productSelect = document.getElementById('productSelect');
    const selectedProductIndex = productSelect.value;
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const selectedProduct = products[selectedProductIndex];
    const quantityInput = parseInt(document.getElementById('quantityInput').value);
    
    // Update the selected product in the table or add a new one
    updateProductInTable(selectedProduct, quantityInput);
    updateTotalAmount(); // Update total amount after adding product
});

function openCashModal() {
    if (selectedProducts.length === 0) {
        alert("No products added!");
    } else {
        modal.style.display = 'block';
        const customerName = document.getElementById('customerNameInput').value;
        const totalAmount = getTotalAmount();
        totalAmountDisplay.textContent = `\nTotal Amount: PHP ${totalAmount.toFixed(2)}`;
        const totalProfit = getTotalProfit();
        totalProfitDisplay.textContent= `Total Profit: PHP ${totalProfit.toFixed(2)}`;
        document.getElementById('seeReceiptButton').style.display = 'none';
    }
}
// Calculate the change
function calculateChange() {
    const totalAmount = getTotalAmount();
    const cashAmount = parseFloat(cashInput.value);

    if (isNaN(cashAmount) || cashAmount < 0) {
        changeDisplay.textContent = 'Invalid cash amount. Please enter a valid positive number.';
    } else if (cashAmount < totalAmount) {
        changeDisplay.textContent = 'Insufficient cash. Please enter a higher amount.';
    } else {
        const change = cashAmount - totalAmount;
        changeDisplay.textContent = `Change: PHP ${change.toFixed(2)}`;
        document.getElementById('seeReceiptButton').style.display = 'block';
        
        // Add a thank you message
        const thankYouMessage = document.createElement('p');
        thankYouMessage.textContent = ' ';
        changeDisplay.appendChild(thankYouMessage);
    }
    
}

// Add event listener for the close button of the cash modal
var cashModalCloseButton = document.querySelector('#myModal .close');
if (cashModalCloseButton) {
    cashModalCloseButton.addEventListener('click', closeCashModal);
} else {
    console.error('Cash modal close button not found.');
}


// Function to clear the cash modal contents
function clearCashModalContents() {
    document.getElementById('cashInput').value = '';
    document.getElementById('changeDisplay').textContent = '';
    document.getElementById('customerNameInput').value = '';
    document.getElementById('totalAmountDisplay').textContent = '';

    // Remove the See Receipt button if it exists
    const seeReceiptButton = document.getElementById('seeReceiptButton');
    if (seeReceiptButton) {
        seeReceiptButton.remove();
    }
}

// Get the total amount of selected products
function getTotalAmount() {
    return selectedProducts.reduce((total, product) => total + product.totalAmount, 0);
}

// Function to clear the product table
function clearProductTable() {
    const tableBody = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    while (tableBody.rows.length > 0) {
        tableBody.deleteRow(0);
    }
}

// Function to delete the total row from the table footer
function deleteTotalRow() {
    const tfooter = document.getElementById('productTable').getElementsByTagName('tfoot')[0];
    if (tfooter && tfooter.rows.length > 0) {
        tfooter.deleteRow(-1); // Deletes the last row
    }
}


// Function to clear all contents including the product table and the total row
function clearAllContents() {
    clearProductTable(); // Clears the product table entries
    deleteTotalRow(); // Deletes the total row from the table footer
    clearCashModalContents(); // Clears the cash modal contents
    clearReceiptModalContents(); // Clears the receipt modal contents
}

// Function to close the cash modal
function closeCashModal() {
    if (confirm("Are you sure you want to close the cash modal?")) {
        document.getElementById('myModal').style.display = 'none'; 
        clearAllContents(); // Clears all contents when the cash modal is closed
        refreshpage();
    }
}



/*----------------------RECEIPT MODAL-----------------------------*/

// Function to close the receipt modal
function closeReceiptModal() {
    document.getElementById('receiptModal').style.display = 'none';
    document.getElementById('receiptContent').textContent = '';
}
function refreshpage() {
    // Refreshes the current page
    location.reload();
    
}

// Function to add the See Receipt button after Finish is clicked
function addSeeReceiptButton() {
    const seeReceiptButton = document.createElement('button');
    seeReceiptButton.id = 'seeReceiptButton';
    seeReceiptButton.textContent = 'See Receipt';
    seeReceiptButton.onclick = showReceipt();
    document.getElementById('myModal').appendChild(seeReceiptButton);
}


// Add event listener for the close button of the receipt modal
var receiptModalCloseButton = document.querySelector('#receiptModal .close');
if (receiptModalCloseButton) {

    receiptModalCloseButton.addEventListener('click', closeReceiptModal);

} else {
    console.error('Receipt modal close button not found.');
}


// Function to clear the receipt modal contents
function clearReceiptModalContents() {
    document.getElementById('receiptContent').textContent = '';
}



 /*----------------------RECEIPT contents-----------------------------*/


// Function to generate and store a unique Transaction ID and current date/time
function generateAndStoreReceiptData() {
    // Generate a random Transaction ID
    const transactionId = 'TX' + Math.random().toString(36).substr(2, 9).toUpperCase();
    localStorage.setItem('transactionId', transactionId);

    // Get the current date and time
    const currentDateTime = new Date();
    // Format the date and time
    const formattedDateTime = currentDateTime.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    localStorage.setItem('currentDateTime', formattedDateTime);
}

// Function to show the receipt modal with the correct data
function showReceipt() {
    generateAndStoreReceiptData();

    // Capture the data from the cash modal
    const customerName = document.getElementById('customerNameInput').value;
    const totalAmount = document.getElementById('totalAmountDisplay').textContent;
    const changeDisplay = document.getElementById('changeDisplay').textContent;
    const cashAmount = document.getElementById('cashInput').value;
    const totalProfit = document.getElementById('totalProfitDisplay').textContent;

    // Generate the list of selected products and store it
    let productsList = '';
    for (let product of selectedProducts) {
        productsList += `<p>Name: ${product.name} <br>Price: PHP ${product.price.toFixed(2)} <br>Quantity: ${product.quantity}<br></p>`;
    }
    localStorage.setItem('productsList', productsList); // Store the products list

    // Store other receipt details
    localStorage.setItem('customerName', customerName);
    localStorage.setItem('totalAmount', totalAmount);
    localStorage.setItem('cashRendered', cashAmount);
    localStorage.setItem('change', changeDisplay);
    localStorage.setItem('totalProfit', totalProfit);

    // Retrieve the stored Transaction ID and date/time
    const transactionId = localStorage.getItem('transactionId');
    const formattedDateTime = localStorage.getItem('currentDateTime');

    // Populate the receipt content
    const receiptContent = `
        <p>Transaction ID: <strong>${transactionId}</strong></p>
        <p><strong>${formattedDateTime}</strong></p><br>
        <p>Customer Name: <strong>${customerName}</strong></p>
        <p>---------------------</p>
        ${productsList}
        <p>${totalAmount}</p>
        <br>
        <p>${totalProfit}</p>
        <br>
        <p>Cash Rendered: PHP ${cashAmount}</p>
        <br>
        <p>${changeDisplay}</p>
    `;
    document.getElementById('receiptContent').innerHTML = receiptContent;

    // Show the receipt modal
    document.getElementById('receiptModal').style.display = 'block';
    loadReceiptData();
}


// Function to clear the previous session data
function clearPreviousSessionData() {
    // Clear the specific local storage items
    localStorage.removeItem('transactionId');
    localStorage.removeItem('currentDateTime');
    // ... clear other data as needed
}

function startNewTransaction() {
    clearPreviousSessionData();
    generateAndStoreReceiptData();
    showReceipt();
}


function printReceipt() {
    var content = document.getElementById('receiptWrapper').innerHTML;
    var printWindow = window.open('', '', 'height=600,width=800');

    // Open HTML for print
    printWindow.document.write('<html><head><title>.</title>');

    // Include the print-specific styles directly in the print window
    printWindow.document.write('<style>');
    printWindow.document.write(`
        body {
            margin: 0;
            padding: 0;
            text-align: center;
            font-family: Arial, sans-serif;
        }
        #receiptWrapper {
            width: auto; /* Adjust width to content size */
            max-width: 80mm; /* Set the max width to common receipt paper width */
            margin: 0 auto; /* Center the content */
            padding: 20px;
            border: 1px solid #000; /* Ensure the border is visible */
            box-shadow: none; /* Remove box-shadow for printing */
        }
        #receiptWrapper * {
            visibility: visible;
        }
        .close, #receiptWrapper button {
            display: none; /* Hide buttons */
        }
    `);
    printWindow.document.write('</style>');

    // Close head and open body tag
    printWindow.document.write('</head><body>');

    // Write the content to the new window
    printWindow.document.write('<div id="receiptWrapper">' + content + '</div>');

    // Close body and HTML tags
    printWindow.document.write('</body></html>');

    // Close the document for writing
    printWindow.document.close();

    // Wait for the content to fully load before printing
    printWindow.onload = function() {
        printWindow.focus(); // Focus on the new window
        printWindow.print(); // Print the content
        printWindow.close(); // Close the print window
    };
}


 /*----------------------SEARCH PRODUCT-----------------------------*/

function searchProduct() {
    // Get the search keyword from the input field
    var searchKeyword = document.getElementById('searchInput').value.toLowerCase();
  
    // Get the table rows
    var table = document.getElementById('productsTable');
    var tr = table.getElementsByTagName('tr');
  
    // Loop through all table rows, and hide those who don't match the search query
    for (var i = 1; i < tr.length; i++) { // Start from 1 to skip the header row
      var td = tr[i].getElementsByTagName('td')[0]; // Assuming the product name is in the first column
      if (td) {
        var productName = td.textContent || td.innerText;
        if (productName.toLowerCase().indexOf(searchKeyword) > -1) {
          tr[i].style.display = '';
        } else {
          tr[i].style.display = 'none';
        }
      }
    }
  }
  
  // Add event listener for 'Enter' key on the search input
  document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      searchProduct();
    }
  });
  
  // Add event listener for the search button if you have one
  // Replace 'searchButtonId' with the actual ID of your search button
  document.getElementById('searchButtonId').addEventListener('click', searchProduct);
  


 /*----------------------SETTINGS-----------------------------*/
// Function to make email and password fields editable
function editInfo(field) {
    var fieldSpan = document.getElementById(field + 'Text');
    var fieldInput = document.getElementById('new' + capitalizeFirstLetter(field));
    fieldInput.value = fieldSpan.textContent; // Pre-fill current info
    fieldInput.style.display = 'block'; // Show input field
    fieldSpan.style.display = 'none'; // Hide static text
    document.getElementById('saveChangesBtn').style.display = 'block'; // Show save button
  }
  
  // Function to save the new email or password
  function saveInfo() {
    var emailInput = document.getElementById('newEmail');
    var emailSpan = document.getElementById('emailText');
    var passwordInput = document.getElementById('newPassword');
    var passwordSpan = document.getElementById('passwordText');
  
    // Update static text and hide input fields
    if (emailInput.style.display === 'block') {
      emailSpan.textContent = emailInput.value;
      emailInput.style.display = 'none';
      emailSpan.style.display = 'block';
    }
    if (passwordInput.style.display === 'block') {
      passwordSpan.textContent = passwordInput.value.replace(/./g, '*');
      passwordInput.style.display = 'none';
      passwordSpan.style.display = 'block';
    }
  
    document.getElementById('saveChangesBtn').style.display = 'none'; // Hide save button
    alert('Information updated!'); // Confirmation message
  }
  
  // Helper function to capitalize the first letter of a string
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

 