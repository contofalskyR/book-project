import React, { Component } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { Book } from '../shared/types/Book';
import './AddBookModal.css';

interface BookListItemProps {
    book: Book;
    onBookSelect: (title: string | number) => void;
}
interface BookListItemState {
    checked: boolean;
}
export default class BookListItem extends Component<
    BookListItemProps,
    BookListItemState
> {
    constructor(props: BookListItemProps) {
        super(props);
        this.state = {
            checked: false
        };
    }

    handleChange = (event: { target: { checked: any } }) => {
        const { book } = this.props;
        this.setState({ checked: event.target.checked });
        // Call the callback function passed from the parent component
        if (event.target.checked) {
            this.props.onBookSelect(book.id);
        }
    };

    render() {
        const { book } = this.props;
        return (
            <div
                className="booklist-book"
                key={book.title + book.author.fullName}
            >
                <div className="booklist-book-thumbnail">
                    <Checkbox
                        checked={this.state.checked}
                        onChange={this.handleChange}
                        inputProps={{
                            'aria-label': 'primary checkbox'
                        }}
                    />
                </div>
                <div className="booklist-book-title">{book.title}</div>
                <div className="booklist-book-author">
                    {book.author.fullName}
                </div>
                <div className="booklist-book-shelf">
                    {book.predefinedShelf?.shelfName}
                </div>
                <div className="booklist-book-genre">{book.bookGenre}</div>
                <div className="booklist-book-rating">{book.rating}</div>
            </div>
        );
    }
}
