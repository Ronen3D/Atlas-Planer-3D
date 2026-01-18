import { Atlas3DPlanerSample } from './samples.js';


// Initialize the app
const sample = new Atlas3DPlanerSample();
await sample.init();

// UI Controls
const getItemsBtn = document.getElementById('getItemsBtn');
const itemCountSpan = document.getElementById('itemCount');
const itemsCombobox = document.getElementById('itemsCombobox');

getItemsBtn.addEventListener('click', () => {
    const itemsList = sample.getItemsList();
    const itemCount = itemsList ? itemsList.length : 0;
    itemCountSpan.textContent = `Items: ${itemCount}`;
    console.log('Items list:', itemsList);
    populateItemsCombobox(itemsList);
});

// Populate combobox with items from library data
function populateItemsCombobox(items) {
    if (!items || items.length === 0) return;

    // Clear existing options except the default one
    itemsCombobox.innerHTML = '<option value="">-- Select an item --</option>';

    // Add each item from library data
    items.forEach((item, index) => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name + ".  " + item.id;
        itemsCombobox.appendChild(option);
    });
}

itemsCombobox.addEventListener('change', (e) => {
    if (e.target.value) {
        console.log('Selected item ID:', e.target.value);
    }
    sample.focuseOnItemById(e.target.value);
});





