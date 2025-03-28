# Books Library

This is a **Books Library Web Application** that allows users to browse books, search by title or author, switch between grid and list views, and sort books by title or publication date. The data is fetched from an external API.


## 📌 Functionalities

### 📚 Fetching Books

- Books are fetched from `https://api.freeapi.app/api/v1/public/books?page=1&limit=12`
- Data is dynamically rendered on the page

### 🔄 Pagination

- Users can navigate pages using **Next** and **Previous** buttons
- Pagination state is stored in `sessionStorage`

### 🔍 Search

- Users can search for books by title or author
- Hitting `Enter` or clicking the search button triggers a search

### 🔀 Sorting

- Users can **sort books alphabetically** or by **published date**

### 🔄 View Toggle

- Users can switch between **Grid View** and **List View**

### ⏳ Loading Spinner

- A spinner is displayed while books are being fetched




