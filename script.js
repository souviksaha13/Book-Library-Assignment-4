document.addEventListener("DOMContentLoaded", () => {
  fetchBooks();
  switchViewFunction('List View', 'book-container-grid');
});

const bookContainer = document.querySelector("#book-container");
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
const currentPage = document.querySelector(".current");
const switchView = document.querySelector('.switch-view');
const sortSelect = document.querySelector(".sort");
const searchBtn = document.querySelector('#search-button');
const searchInput = document.querySelector('#search-input');
const pagination = document.querySelector('.pagination');
let books = [];
let pageNo = sessionStorage.getItem("pageNo") ? Number(sessionStorage.getItem("pageNo")) : 1;


/*---------------------------- Fetching Books ------------------------- */
async function fetchBooks() {
  const spinner = document.querySelector("#loading-spinner");
  spinner.classList.remove("hide"); // Showing spinner

  try {
    const response = await fetch(`https://api.freeapi.app/api/v1/public/books?page=${pageNo}&limit=12`);
    const res = await response.json();
    const data = res.data.data;

    books = data.map(book => {
      const title = book.volumeInfo.title ?? "";
      const authors = book.volumeInfo.authors?.join(", ") ?? "";
      const publisher = book.volumeInfo.publisher ?? "";
      const publishedDate = book.volumeInfo.publishedDate ?? "";
      const thumbnail = book.volumeInfo.imageLinks?.thumbnail? book.volumeInfo.imageLinks.thumbnail.replace(/^http:/, "https:") : "https://www.secondhandbooksindia.com/img/not-found.jpg";
      const infoLink = book.volumeInfo.infoLink ?? "";

      return { title, authors, publisher, publishedDate, thumbnail, infoLink };
    });

    displayBooks();
  } catch (error) {
    console.error("Error fetching books:", error);
    bookContainer.innerHTML = "<h1>Failed to load books</h1>";
  } finally {
    spinner.classList.add("hide"); // Hide spinner after fetching is done
    pagination.classList.remove("hide");
  }
}



/*---------------------------- Displaying Books ------------------------- */
function displayBooks() {
  if (books.length === 0) {
    bookContainer.innerHTML = "<h1>No books found</h1>";
    return;
  }

  currentPage.innerHTML = `${pageNo}`;
  bookContainer.innerHTML = "";

  // Prev button for 1st page will be disabled
  if (pageNo === 1) {
    prevButton.disabled = true;
  }

  // Next button for last page will be disabled (as per page consists 12 items, so last page is 18)
  if (pageNo === 18) {
    nextButton.disabled = true;
  }


  //Displaying each book inside a card

  books.forEach((book) => {
    const bookDiv = document.createElement('div');
    bookDiv.classList.add('book-div')
    bookDiv.innerHTML = `
      <a href=${book.infoLink} target="_blank" class="book-link">
        <img src="${book.thumbnail}" alt="" srcset="">
        <div class="book-info">
            <p class="title">${book.title}</p>
            <p class="author"><span class="highlight-label">Authors:</span> ${book.authors}</p>
            <p class="publisher"><span class="highlight-label">Publisher:</span> ${book.publisher}</p>
            <p class="published-date"><span class="highlight-label">Published Date:</span> ${book.publishedDate}</p>
        </div>
      </a>  `

    bookContainer.appendChild(bookDiv);
  });

  // Handling the edge case when no books are found
  const noBookFound = document.createElement('h1');
  noBookFound.id = 'no-books';
  noBookFound.innerHTML = `No Books found`
  noBookFound.classList.add('hide');
  bookContainer.appendChild(noBookFound)
}


/*------------------------- Sorting ------------------------ */
sortSelect.addEventListener("change", () => {
  console.log(sortSelect.value);
  const selectedSort = sortSelect.value;

  if (selectedSort === "alphabet") {
   books = sortByAlphabet(books);
  } else if (selectedSort === "date") {
    books = sortByDate(books);
  }
  console.log(books);

  displayBooks(); // Re-render books with new sort order
});




/*------------------------- Pagination ------------------------ */

prevButton.addEventListener("click", () => {
  clearSearchBar();
  pageNo--;
  sessionStorage.setItem("pageNo", pageNo);
  prevButton.disabled = false;
  currentPage.innerHTML = `${pageNo}`;
  fetchBooks();
});

nextButton.addEventListener("click", () => {
  clearSearchBar();
  pageNo++;
  sessionStorage.setItem("pageNo", pageNo);
  prevButton.disabled = false;
  currentPage.innerHTML = `${pageNo}`;
  fetchBooks();
});


/*------------------------ Switching View ----------------------- */

function switchViewFunction(view, viewStructure) {
  switchView.innerHTML = view;
  bookContainer.classList.remove('book-container-grid', 'book-container-list'); // Remove previous classes
  bookContainer.classList.add(viewStructure); // Add the new view class
}

switchView.addEventListener('click', () => {
  const currentView = switchView.innerHTML.trim(); // Get updated button text
  if (currentView === 'List View') {
      switchViewFunction('Grid View', 'book-container-list');
  } else {
      switchViewFunction('List View', 'book-container-grid');
  }
});


/*------------------------ Sorting Functionality ----------------------- */

function sortByDate(books) {
  books.sort((a, b) => a.publishedDate.localeCompare(b.publishedDate));
  return books;
}

function sortByAlphabet(books) {
  books.sort((a, b) => a.title.localeCompare(b.title));
  return books;
}



/*------------------------ Search Functionality ----------------------- */

searchBtn.addEventListener('click', searchFunction);
searchInput.addEventListener('keyup', (e) => {
  if(e.key === 'Enter') searchFunction();
});

function searchFunction() {
  let counter = 0;
  document.querySelectorAll('.book-div').forEach(book => {
    const title = book.querySelector('.title').textContent.toLowerCase();
    const author = book.querySelector('.author').textContent.toLowerCase();
    const searchValue = searchInput.value.toLowerCase();
    const isVisible = (title.includes(searchValue) || author.includes(searchValue));
    if(isVisible) counter++;
    book.classList.toggle('hide', !isVisible);
    console.log(title, author);
  })

  const noBooksFound = document.querySelector('#no-books');
  noBooksFound.classList.toggle('hide', counter > 0);
  console.log(counter);
  console.log(noBooksFound);
}

function clearSearchBar () {
  searchInput.value = "";
}
