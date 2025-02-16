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


  class BooksList{
    constructor(){
      const thisBooksList = this;
      thisBooksList.initData();
      // console.log(thisBookList);
      thisBooksList.getElements();
      thisBooksList.renderBooks();
      thisBooksList.initActions();
      thisBooksList.favoriteBooks = [];
      thisBooksList.filters = [];
    }

    getElements(){
      const thisBooksList = this;
      thisBooksList.dom = {};
      thisBooksList.dom.allBook = document.querySelector(select.allBook);
      thisBooksList.dom.filters = document.querySelector(select.filters);
    }

    initData(){
      const thisBooksList = this;
      thisBooksList.data = dataSource.books;
    }
    initActions(){
      const thisBooksList = this;
      const allBooks = thisBooksList.dom.allBook;
      const filtersDOM = thisBooksList.dom.filters;
      filtersDOM.addEventListener('click', (e) => {
        const filter = e.target;
        const value = filter.getAttribute('value');
        if (
          filter.tagName === 'INPUT' &&
          filter.type === 'checkbox' &&
          filter.name === 'filter'
        ) {
          if (!thisBooksList.filters.includes(value)) {
            thisBooksList.filters.push(value);
          } else {
            const index = thisBooksList.filters.indexOf(value);
            if (index !== -1) {
              thisBooksList.filters.splice(index, 1);
            }
          }
          thisBooksList.renderByFilters(thisBooksList.filters);
        }
      });
      allBooks.addEventListener('dblclick', (e) => {
        e.preventDefault();
        const image = e.target;
        console.log(image.offsetParent);
        if (image.offsetParent.classList.contains('book__image')) {
          const imageId = image.offsetParent.getAttribute('data-id');
          image.offsetParent.classList.toggle('favorite');
          if (thisBooksList.favoriteBooks.includes(imageId)) {
            const index = thisBooksList.favoriteBooks.indexOf(imageId);
            thisBooksList.favoriteBooks.splice(index, 1);
          } else {
            thisBooksList.favoriteBooks.push(imageId);
          }
        }
        console.log(thisBooksList.favoriteBooks);
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

  new BooksList();
}
