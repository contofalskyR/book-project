import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import ShelfCarousel, { ShelfCarouselProps } from './ShelfCarousel';

describe('ShelfCarousel component', () => {
  const props: ShelfCarouselProps = {
    title: 'Test Shelf',
    books: [
      { title: 'Book 1', img: 'book1.jpg', bookGenre: 'Fiction' },
      { title: 'Book 2', img: 'book2.jpg', bookGenre: 'Non-fiction' },
    ],
    genre: '',
    searchText: ''
  };

  it('renders ShelfCarousel component without crashing', () => {
    shallow(<ShelfCarousel {...props} />);
  });

  it('correctly renders shelf title', () => {
    const wrapper: ShallowWrapper = shallow(<ShelfCarousel {...props} />);
    expect(wrapper.find('.shelf-title').text()).toEqual(props.title);
  });

  it('calls componentDidMount', () => {
    const componentDidMountSpy = jest.spyOn(ShelfCarousel.prototype, 'componentDidMount');
    shallow(<ShelfCarousel {...props} />);
    expect(componentDidMountSpy).toHaveBeenCalledTimes(1);
  });

  it('filters books correctly by genre', () => {
    const wrapper: ShallowWrapper = shallow(<ShelfCarousel {...props} />);
    const instance: ShelfCarousel = wrapper.instance() as ShelfCarousel;
    instance.setState({ genre: 'Fiction' }); // Set genre to filter by
    expect(instance.filterBooks()).toHaveLength(1); // Expecting one book to be filtered
  });

  it('renders shelf books correctly by genre', () => {
    const wrapper: ShallowWrapper = shallow(<ShelfCarousel {...props} />);
    const instance: ShelfCarousel = wrapper.instance() as ShelfCarousel;
    const booksMap: Map<string, React.ReactElement[]> = instance.renderShelfBookByGenre(props.books);
    expect(booksMap.get('Fiction')).toHaveLength(1); // Expecting one book in Fiction genre
    expect(booksMap.get('Non-fiction')).toHaveLength(1); // Expecting one book in Non-fiction genre
  });

});
