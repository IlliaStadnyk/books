/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  ('use strict');
  const select = {
    allBook: '.books-list',
    bookImage: '.book__image',
    filters: '.filters',
    templateBook: '#template-book',
  };
  const template = {
    bookMenu: Handlebars.compile(
      document.querySelector(select.templateBook).innerHTML
    ),
  };
  let favoriteBooks = [];
  let filters = [];

  class BookList{
    constructor(){
      const thisBookList = this;
      thisBookList.initData();
      // console.log(thisBookList);
      thisBookList.getElements();
      thisBookList.renderBooks();
      thisBookList.initActions();
    }

    getElements(){
      const thisBookList = this;
      thisBookList.dom = {};
      thisBookList.dom.allBook = document.querySelector(select.allBook);
      thisBookList.dom.filters = document.querySelector(select.filters);
    }

    initData(){
      const thisBookList = this;
      thisBookList.data = dataSource.books;
    }
    initActions(){
      const thisBookList = this;
      const allBooks = thisBookList.dom.allBook;
      const filtersDOM = thisBookList.dom.filters;
      filtersDOM.addEventListener('click', (e) => {
        const filter = e.target;
        const value = filter.getAttribute('value');
        if (
          filter.tagName === 'INPUT' &&
          filter.type === 'checkbox' &&
          filter.name === 'filter'
        ) {
          if (!filters.includes(value)) {
            filters.push(value);
          } else {
            const index = filters.indexOf(value);
            if (index !== -1) {
              filters.splice(index, 1);
            }
          }
          thisBookList.renderByFilters(filters);
        }
      });
      allBooks.addEventListener('dblclick', (e) => {
        e.preventDefault();
        const image = e.target;
        console.log(image.offsetParent);
        if (image.offsetParent.classList.contains('book__image')) {
          const imageId = image.offsetParent.getAttribute('data-id');
          image.offsetParent.classList.toggle('favorite');
          if (favoriteBooks.includes(imageId)) {
            const index = favoriteBooks.indexOf(imageId);
            favoriteBooks.splice(index, 1);
          } else {
            favoriteBooks.push(imageId);
          }
        }
        console.log(favoriteBooks);
      });
    }
    renderByFilters(filters) {
      const thisBookList = this;
      for (const book of thisBookList.data) {
        let shouldBeFiltered = false;
        for (const filter of filters) {
          if (!book.details[filter]) {
            shouldBeFiltered = true;
            break;
          }
        }
        const bookElement = document.querySelector(
          `.book__image[data-id="${book.id}"]`
        );
        if (shouldBeFiltered) {
          bookElement.classList.add('hidden');
        } else {
          bookElement.classList.remove('hidden');
        }
      }
    }
    renderBooks() {
      const thisBookList = this;
      // bookContainer.innerHTML = '';

      for (const book of thisBookList.data) {
        book.ratingBgc = thisBookList.determineRatingBgc(book.rating);
        book.ratingWidth = book.rating * 10;

        const generateHTML = template.bookMenu(book);
        const element = utils.createDOMFromHTML(generateHTML);
        const bookContainer = thisBookList.dom.allBook;
        bookContainer.appendChild(element);
      }
    }
    determineRatingBgc(rating) {
      if (rating < 6) return 'linear-gradient(to bottom, #f00000, #dc281e)';
      if (rating >= 6 && rating < 8) return 'linear-gradient(to bottom, #f5d020, #f53803)';
      if (rating >= 8 && rating < 9) return 'linear-gradient(to bottom, #66ff66, #33cc33)';
      return 'linear-gradient(to bottom, #008000, #004d00)';
    }
  }

  new BookList();
}
