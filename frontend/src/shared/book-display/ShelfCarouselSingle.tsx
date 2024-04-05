/*
The book project lets a user keep track of different books they would like to read, are currently
reading, have read or did not finish.
Copyright (C) 2020  Karan Kumar

This program is free software: you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.
If not, see <https://www.gnu.org/licenses/>.
*/

import React, { ReactElement } from 'react';
import './ShelfCarouselSingle.css';
import { Icon } from '@material-ui/core';
import { Book } from '../types/Book';
import { Component } from 'react';
import ShelfBook from './ShelfBook';

export type ShelfCarouselSingleProps = {
    books: Book[];
    genre: string;
};

function AddBook() {
    return (
        <div className="book add-new">
            <Icon className="icon">add</Icon>
            <p className="book-title add-new">Add book</p>
        </div>
    );
}

export default class ShelfCarouselSingle extends Component<ShelfCarouselSingleProps> {
    constructor(props: ShelfCarouselSingleProps) {
        super(props);
    }

    filterBooks(): Book[] {
        if (this.props.genre !== '') {
            return this.props.books.filter((book) => {
                // console.log("rerendering by genre!:" + typeof book.bookGenre);
                return (
                    book.bookGenre.toString().toLowerCase() ===
                    this.props.genre.toLowerCase()
                );
            });
        }
        return this.props.books;
    }
    render(): JSX.Element {
        const books: any = this.renderShelfBook(this.filterBooks());
        // console.log(this.props.books);

        return (
            <div className="shelf-container">
                <div className="clear" />
                <div className="books-and-shelf">
                    <div className="book-wrap-single">
                        {books}
                        <AddBook />
                        <div className="clear" />
                    </div>
                    <div className="shelf"></div>
                </div>
            </div>
        );
    }

    renderShelfBook(books: Book[]): ReactElement<Book>[] {
        // console.log('size:' + books.length);
        const elements = Array<ReactElement>();
        for (let i = 0; i < books.length; i++) {
            elements.push(
                <ShelfBook
                    key={i}
                    title={books[i].title}
                    author={books[i].author.fullName}
                    id={books[i].id}
                    big={false}
                />
            );
        }
        return elements;
    }
}
