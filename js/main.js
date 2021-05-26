const btnAddBook = document.getElementById("btn-add-book");
const btnSave = document.getElementById("btn-save");
const btnCancel = document.getElementById("btn-cancel");
const modal = document.getElementById("modal");
const form = document.getElementById("form");
let myLibrary = [];

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("book__btn--remove")) {
    const index = e.target.getAttribute("data-id");
    removeBookById(parseInt(index));
    renderBooks();
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("book__btn--read")) {
    const index = e.target.getAttribute("data-id");
    markAsRead(parseInt(index));
    renderBooks();
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  addBook();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});

function closeModal() {
  modal.classList.toggle("active", false);
}

btnAddBook.addEventListener("click", (event) => {
  modal.classList.toggle("active");
});

btnCancel.addEventListener("click", (event) => {
  modal.classList.toggle("active");
});

btnSave.addEventListener("click", form.submit());

function addBook() {
  let title = form.title.value;
  let author = form.author.value;
  let pages = form.pages.value;
  let read = form.read.checked;
  let cover = form.cover.value;

  let newBook = new Book(title, author, pages, read, cover);

  let addedBook = addToLibrary(newBook);

  if (addedBook) {
    renderBooks();
    modal.classList.toggle("active");
  } else {
    alert("Book already exists");
  }
}

function Book(title, author, pages, read, cover) {
  this.id = null;
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.cover = cover ? cover : "https://via.placeholder.com/64x95";
  this.info = function () {
    let readStatus = this.read ? "read" : "not read yet";
    return title + " by " + author + ", " + pages + " pages, " + readStatus;
  };
}

function addToLibrary(newBook) {
  if (myLibrary.some((book) => book.title === newBook.title)) {
    return false;
  }
  newBook.id = myLibrary.length;
  myLibrary.push(newBook);
  saveToLocalStorage("library", myLibrary);
  return newBook;
}

function removeBookByTitle(bookTitle) {
  myLibrary = myLibrary.filter((book) => book.title !== bookTitle);
}

function removeBookById(id) {
  myLibrary = myLibrary.filter((book) => book.id !== id);
}

function renderBooks() {
  let bookList = document.getElementById("book-list");
  let template = document.getElementById("book-template");

  bookList.innerHTML = "";

  myLibrary.forEach((book, index) => {
    let clone = template.content.cloneNode(true);
    let title = clone.querySelector(".book__title");
    let author = clone.querySelector(".book__author");
    let pages = clone.querySelector("#book__pages");
    let read = clone.querySelector("#book__read");
    let cover = clone.querySelector("#book__cover");
    let root = clone.querySelector(".book");
    let btnRemove = clone.querySelector(".book__btn--remove");
    let btnRead = clone.querySelector(".book__btn--read");
    let readText = "Read";

    if (!book.read) {
      readText = "Unread";
    }

    root.setAttribute("data-id", index);
    btnRemove.setAttribute("data-id", index);
    btnRead.setAttribute("data-id", index);

    title.textContent = book.title;
    author.textContent = book.author;
    pages.textContent = book.pages;
    read.textContent = readText;
    cover.src = book.cover;

    bookList.appendChild(clone);
  });
}

function markAsRead(id) {
  let book = myLibrary[id];
  book.read = !book.read;
}

function addMockData() {
  let book = new Book(
    "Tender is the flesh",
    "Agustina Bazterrica",
    219,
    true,
    "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1594563107l/49090884.jpg"
  );

  addToLibrary(book);
}

init();

// Local storage stuff

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable(type) {
  var storage;
  try {
    storage = window[type];
    var x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

function saveToLocalStorage(key, object) {
  if (storageAvailable("localStorage")) {
    localStorage[key] = JSON.stringify(object);
  } else {
  }
}

function removeFromLocalStorage(key) {
  if (localStorage) {
    localStorage.removeItem(key);
  }
}

function loadLibraryFromLocalStorage() {}

// init function

function init() {
  if (storageAvailable("localStorage")) {
    loadLibraryFromLocalStorage();
    if (localStorage["library"].length) {
      myLibrary = JSON.parse(localStorage["library"]);
    }
  } else {
  }
  renderBooks();
}
