
/*----------------------PRODUCTS PAGE-----------------------------*/

let products = JSON.parse(localStorage.getItem('products')) || [];

function addProduct() {
    const name = document.getElementById('productName').value;
    const description = document.getElementById('productDescription').value;
    const price = document.getElementById('productPrice').value;
    const ogprice = document.getElementById('productOgprice').value

    // Check if any of the fields are empty
    if (!name || !description || !price || !ogprice) {
        alert("Please fill in all fields.");
        return;
    }

    // Check if price is a valid number
    if (isNaN(parseFloat(price))) {
        alert("Price must be a valid number.");
        return;
    }

    if (isNaN(parseFloat(ogprice))) {
        alert("Price must be a valid number.");
        return;
    }    

    const newProduct = { name, description, price, ogprice };

    const existingProductIndex = products.findIndex(product => product.name === name);
    if (existingProductIndex !== -1) {
        // If the product already exists, update its information
        products[existingProductIndex] = newProduct;
    } else {
        // Otherwise, add the new product to the array
        products.push(newProduct);
    }

    displayProducts();
    document.getElementById('productName').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productOgprice').value = '';
    document.getElementById('productPrice').value = '';
    localStorage.setItem('products', JSON.stringify(products));
    
}
//HIDE THE FORM
// Function to toggle the visibility of the add product form and the arrow direction
function toggleAddProductForm() {
    const form = document.getElementById('addProductForm');
    const arrowIcon = document.getElementById('arrowIcon');
    
    // Toggle form visibility
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    
    // Toggle arrow direction
    if (form.style.display === 'block') {
        arrowIcon.classList.remove('bx-down-arrow');
        arrowIcon.classList.add('bx-up-arrow');
    } else {
        arrowIcon.classList.remove('bx-up-arrow');
        arrowIcon.classList.add('bx-down-arrow');
    }
}

// Initially hide the form on page load
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('addProductForm').style.display = 'none';
});

// Add event listener to the 'Add Product' button
document.getElementById('showAddProductFormButton').addEventListener('click', toggleAddProductForm);

// END OF HIDING FORM



function displayProducts() {
    const tableBody = document.getElementById('productsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';
    products.forEach((product, index) => {
        let row = tableBody.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);
        cell1.textContent = product.name;
        cell2.textContent = product.description;
        cell3.textContent = `PHP ${product.ogprice}.00`;
        cell4.textContent = `PHP ${product.price}.00`;
        cell5.innerHTML = `<button onclick="editProduct(${index})">Edit</button>
                           <button onclick="deleteProduct(${index})">Delete</button>`;
    });
    document.getElementById('totalProducts').textContent = products.length.toString();
}


function deleteProduct(index) {
    products.splice(index, 1);
    displayProducts();
    localStorage.setItem('products', JSON.stringify(products));
    alert("Are you sure?");
}

function editProduct(index) {
    // Display the form if it's not already visible
    const form = document.getElementById('addProductForm');
    form.style.display = 'block';

    // Change the arrow icon to indicate the form is open
    const arrowIcon = document.getElementById('arrowIcon');
    arrowIcon.classList.remove('bx-down-arrow');
    arrowIcon.classList.add('bx-up-arrow');

    // Get the product details and populate the form fields
    const product = products[index];
    document.getElementById('productName').value = product.name;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productOgprice').value = product.ogprice;
    document.getElementById('productPrice').value = product.price;
   

    // Remove the product from the array since it's being edited
    deleteProduct(index);
}
displayProducts();

document.getElementById('addButton').addEventListener('click', function() {
    const productSelect = document.getElementById('productSelect');
    const selectedProductIndex = productSelect.value;
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const selectedProduct = products[selectedProductIndex];
    const quantityInput = document.getElementById('quantityInput').value;
    
    // Call a function to add the selected product to the table
    addSelectedProductToTable(selectedProduct, quantityInput);
});

/*----------------------ADD PRODUCTS IN SALES PAGE-----------------------------*/

function addSelectedProductToTable(product, quantity) {
    const tableBody = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    const row = tableBody.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    const cell5 = row.insertCell(4);
    const cell6 = row.insertCell(5);
    const cell7 = row.insertCell(6); // Cell for the delete button
    
    // Calculate profit for the product
    const profit = parseFloat(product.price) - parseFloat(product.ogprice) ;
    
    cell1.textContent = product.name;
    cell2.textContent = product.description;
    cell3.textContent = product.price;
    cell4.textContent = quantity;
    cell5.textContent = (parseFloat(product.price) * quantity).toFixed(2);
    cell6.textContent = (parseFloat(profit * quantity)).toFixed(2); // Display profit for this product

    // Create a delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function() {
        alert("Are you sure?");
        // Remove the product from the selectedProducts array
        const index = selectedProducts.findIndex(p => p.name === product.name && p.quantity === quantity);
        if (index > -1) {
            selectedProducts.splice(index, 1);
        }
        // Update the total amount display
        updateTotalAmount();
        // Remove the row from the table
        tableBody.deleteRow(row.rowIndex - 1);
    };
    cell7.appendChild(deleteButton);

    // Add the selected product to the selectedProducts array
    selectedProducts.push({
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        ogprice: parseFloat(product.ogprice), // Add original price for profit calculation
        quantity: quantity,
        totalAmount: parseFloat(cell5.textContent),
        totalProfit: parseFloat(cell6.textContent) // Store profit for this product
    });

    // Update the total amount display after adding the product
    updateTotalAmount();
}

// Function to calculate the total profit
function getTotalProfit() {
    return selectedProducts.reduce((sum, product) => sum + product.totalProfit, 0);
}
updateTotalAmount();

// Function to update the total amount and total profit
function updateTotalAmount() {
    const totalAmount = getTotalAmount();
    const totalProfit = getTotalProfit(); // Calculate total profit

    // Find or create the totals row
    let totalsRow = document.querySelector('#productTable tfoot .totals-row');
    if (!totalsRow) {
        const tfoot = document.querySelector('#productTable tfoot') || document.createElement('tfoot');
        totalsRow = tfoot.insertRow();
        totalsRow.classList.add('totals-row');
        totalsRow.insertCell(0).textContent = 'TOTAL:';
        totalsRow.insertCell(1); // Placeholder for total amount
        totalsRow.insertCell(2); // Placeholder for total profit
        totalsRow.insertCell(3); // Placeholder for total profit
        totalsRow.insertCell(4); // Placeholder for total profit
        totalsRow.insertCell(5); // Placeholder for total profit
        document.querySelector('#productTable').appendChild(tfoot);
    }

    // Update the totals row cells
    totalsRow.cells[4].textContent = `PHP ${totalAmount.toFixed(2)}`;
    totalsRow.cells[5].textContent = `PHP ${totalProfit.toFixed(2)}`;

     
}
  updateTotalAmount();
 updateProductInTable(); 
  // Function to calculate the total amount
  function getTotalAmount() {
    // Calculate the total amount from the selectedProducts array
    return selectedProducts.reduce((sum, product) => sum + product.totalAmount, 0);
  }
updateTotalAmount();


