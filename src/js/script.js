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
    bookMenu: Handlebars.compile(document.querySelector(select.templateBook).innerHTML),
  };
  let favoriteBooks =[];
  let filters =[];

  function render(){
    const data = dataSource.books;
    const bookContainer = document.querySelector(select.allBook);
    bookContainer.innerHTML = '';

    for(const book of data){
      book.ratingBgc = setColorRating(book.rating);
      book.ratingWidth = book.rating * 10;

      const generateHTML = template.bookMenu(book);
      const element = utils.createDOMFromHTML(generateHTML);

      bookContainer.appendChild(element);
    }

    console.log(bookContainer);
    initAction();
  }

  function initAction(){
    const allBooks = document.querySelector(select.allBook);
    const filtersDOM = document.querySelector(select.filters);
    filtersDOM.addEventListener('click', (e) => {
      e.preventDefault();
      const filter = e.target;
      const value = filter.getAttribute('value');
      if(filter.tagName === 'INPUT' && filter.type === 'checkbox' && filter.name === 'filter') {
        if(filter.checked){
          if(!filters.includes(value)){
            filters.push(value);
          }
          else {
            const index = filters.indexOf(value);
            if (index !== -1) {
              filters.splice(index, 1);
            }
          }
        }
        renderByFilters(filters);
      }
    });
    allBooks.addEventListener('dblclick', (e) => {
      e.preventDefault();
      const image = e.target;
      console.log(image.offsetParent);
      if(image.offsetParent.classList.contains('book__image')) {
        const imageId = image.offsetParent.getAttribute('data-id');
        image.offsetParent.classList.toggle('favorite');
        if(favoriteBooks.includes(imageId)){
          const index = favoriteBooks.indexOf(imageId);
          favoriteBooks.splice(index, 1);
        } else {
          favoriteBooks.push(imageId);
        }
      }

      console.log(favoriteBooks);
    });
  }
  function renderByFilters(filters){
    const data = dataSource.books;
    for(const book of data){
      let shouldBeFiltered = false;
      for(const filter of filters){
        if(!book.details[filter]){
          shouldBeFiltered = true;
          break;
        }
      }
      const bookElement = document.querySelector(`.book__image[data-id="${book.id}"]`);
      if(shouldBeFiltered){
        bookElement.classList.add('hidden');
      } else{
        bookElement.classList.remove('hidden');
      }
    }
  }

  function setColorRating(rating){
    if (rating < 6) {
      return 'linear-gradient(to bottom, #f34444 0%,#f34444 100%)';
    } else if (rating >= 6 && rating < 8) {
      return 'linear-gradient(to bottom, #ffb820 0%,#ffb820 100%)';
    } else if (rating >= 8 && rating < 9) {
      return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
    } else {
      return 'linear-gradient(to bottom, #299a0b 0%,#299a0b 100%)';
    }
  }

  render();
}