let openShopping = document.querySelector('.shopping');
let closeShopping = document.querySelector('.closeShopping');
let list = document.querySelector('#bookList');
let listCard = document.querySelector('.listCard');
let body = document.querySelector('body');
let total = document.querySelector('.total');
let quantity = document.querySelector('.quantity');
let filterSelect = document.getElementById('filter');
let searchInput = document.getElementById('search');
let suggestionsList = document.getElementById('suggestions');
let cartButton = document.querySelector('.cartButton');
let cartOverlay = document.getElementById('cartOverlay');
let cartList = document.getElementById('cartList');
let books = [];
let cartItems = [];
let bookModal = document.getElementById('bookModal');
let bookInfo = document.getElementById('bookInfo');

// Event Listeners
openShopping.addEventListener('click', openCart);
closeShopping.addEventListener('click', closeCart);
filterSelect.addEventListener('change', applyFilter);

// Initialize the application
initApp();

// Functions
function initApp() {
  fetchData()
    .then(data => {
      books = data;
      displayBooks();
    })
    .catch(error => {
      console.error('Error fetching books:', error);
    });
}

function fetchData() {
  // Randomly generate books data (replace with your API endpoint logic)
  const genres = ['Fiction', 'Mystery', 'Fantasy', 'Science Fiction', 'Romance', 'Thriller', 'Horror', 'Non-Fiction'];
  const authors = ['Author 1', 'Author 2', 'Author 3', 'Author 4', 'Author 5'];
  const booksData = [];

  for (let i = 0; i < 20; i++) {
    const title = `Book Title ${i + 1}`;
    const author = authors[Math.floor(Math.random() * authors.length)];
    const genre = genres[Math.floor(Math.random() * genres.length)];
    const available = Math.random() < 0.5; // Randomly assign availability
    const copies = available ? Math.floor(Math.random() * 10) + 1 : 0; // Randomly assign number of copies (1-10)

    const book = {
      id: i + 1,
      title,
      author,
      genre,
      available,
      copies
    };

    booksData.push(book);
  }

  return Promise.resolve(booksData);
}

function displayBooks(filteredBooks) {
  list.innerHTML = '';

  const booksToDisplay = filteredBooks || books;

  booksToDisplay.forEach(book => {
    const newDiv = createBookElement(book);
    list.appendChild(newDiv);
  });
}

function createBookElement(book) {
  const newDiv = document.createElement('div');
  newDiv.classList.add('item');
  const availabilityClass = book.available ? 'available' : 'unavailable';
  const availabilityText = book.available ? `Available (${book.copies} copies)` : 'Unavailable';
  newDiv.innerHTML = `
    <div class="title">${book.title}</div>
    <div class="author">${book.author}</div>
    <div class="genre">${book.genre}</div>
    <div class="availability ${availabilityClass}">${availabilityText}</div>
    <button onclick="openModal(${book.id})">View Details</button>`;
  
  return newDiv;
}

function openModal(bookId) {
  const book = books.find(book => book.id === bookId);
  if (book) {
    bookInfo.innerHTML = `
      <h2>${book.title}</h2>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Genre:</strong> ${book.genre}</p>
      <p><strong>Availability:</strong> ${book.available ? 'Available' : 'Unavailable'}</p>
      <p><strong>Copies:</strong> ${book.copies}</p>
    `;
    bookModal.style.display = 'block';
  }
}

function closeModal() {
  bookModal.style.display = 'none';
}

function addToCart() {
  const bookId = parseInt(bookInfo.dataset.bookId);
  const book = books.find(book => book.id === bookId);
  if (book) {
    const cartItem = cartItems.find(item => item.id === bookId);
    if (cartItem) {
      cartItem.quantity++;
    } else {
      cartItems.push({ ...book, quantity: 1 });
    }
    updateCart();
    closeModal();
  }
}

function updateCart() {
  cartList.innerHTML = '';
  let totalPrice = 0;
  let totalCount = 0;

  cartItems.forEach(item => {
    const newLi = document.createElement('li');
    newLi.innerHTML = `
      <div>${item.title}</div>
      <div>Quantity: ${item.quantity}</div>
    `;
    cartList.appendChild(newLi);

    const itemPrice = item.copies * item.quantity;
    totalPrice += itemPrice;
    totalCount += item.quantity;
  });

  total.innerText = totalPrice;
  quantity.innerText = totalCount;
  cartButton.innerText = `Cart ${totalCount}`;

  if (totalCount > 0) {
    cartButton.classList.add('has-items');
  } else {
    cartButton.classList.remove('has-items');
  }
}

function openCart() {
  cartOverlay.style.display = 'block';
}

function closeCart() {
  cartOverlay.style.display = 'none';
}

function checkout() {
  // Perform checkout logic here
  // Update availability and number of copies fields
  // Reset cartItems array
  // Update UI accordingly
  // ...
  cartItems = [];
  updateCart();
}

function searchBooks(query) {
  const filteredBooks = books.filter(book => {
    const lowercaseQuery = query.toLowerCase();
    return (
      book.title.toLowerCase().includes(lowercaseQuery) ||
      book.author.toLowerCase().includes(lowercaseQuery)
    );
  });

  displayBooks(filteredBooks);
}

function applyFilter() {
  const filterValue = filterSelect.value;

  let sortedBooks = [...books];

  switch (filterValue) {
    case 'title':
      sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'author':
      sortedBooks.sort((a, b) => a.author.localeCompare(b.author));
      break;
    case 'genre':
      sortedBooks.sort((a, b) => a.genre.localeCompare(b.genre));
      break;
    case 'publishDate':
      sortedBooks.sort((a, b) => a.publishDate - b.publishDate);
      break;
    default:
      break;
  }

  displayBooks(sortedBooks);
}
