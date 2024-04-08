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
import './ShelfCarousel.css';
import { Icon } from '@material-ui/core';
import { Book } from '../types/Book';
import { Component } from 'react';
import { DID_NOT_FINISH, READ, READING, TO_READ } from '../routes';
import { Link } from 'react-router-dom';
import { LocationDescriptor } from 'history';
import ShelfBook from './ShelfBook';

interface IShelfCarouselState {
    title: string;
    books: Book[];
    genre: string;
}

export type ShelfCarouselProps = {
    title: string;
    books: Book[];
    searchText: string;
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

export default class ShelfCarousel extends Component<
    ShelfCarouselProps,
    IShelfCarouselState
> {
    constructor(props: ShelfCarouselProps) {
        super(props);
        this.state = {
            title: props.title,
            books: props.books,
            genre: props.genre
        };
        this.searchText = props.searchText;
    }

    componentDidMount(): void {
        if (this.searchText === '') {
            this.setState({
                books: this.filterBooks(),
                genre: this.props.genre
            });
        }
        // console.log("from the shelf carousl:" + this.state.genre);
    }
    searchText = '';

    filterBooks(): Book[] {
        if (this.state.genre !== '') {
            return this.state.books.filter((book) => {
                // console.log("rerendering by genre!:" + typeof book.bookGenre);
                return (
                    book.bookGenre.toString().toLowerCase() ===
                    this.state.genre.toLowerCase()
                );
            });
        }
        return this.state.books.filter((book) => {
            // console.log("rerendering by all books!");
            // console.log(book.bookGenre[0]);
            return book.title
                .toLowerCase()
                .includes(this.searchText.toLowerCase());
        });
    }
    render(): JSX.Element {
        const books: any = this.renderShelfBook(this.state.books);
        // this.renderShelfBookByGenre(this.state.books).forEach((value, key) => {
        //     books.push(<div key={key}>
        //         {key}
        //         {value}
        //     </div>
        //     )
        // })
        let link: LocationDescriptor<unknown> = {};
        if (this.state.title == 'Reading') {
            link = READING;
        } else if (this.state.title == 'To Read') {
            link = TO_READ;
        } else if (this.state.title == 'Read') {
            link = READ;
        } else if (this.state.title == 'Did not finish') {
            link = DID_NOT_FINISH;
        }
        return (
            <div className="shelf-container">
                <span className="shelf-title">{this.state.title}</span>
                <Link to={link} style={{ textDecoration: 'none' }}>
                    <span className="view-all">View All</span>
                </Link>
                <div className="clear" />
                <div className="books-and-shelf">
                    <div className="book-wrap">
                        {books}
                        {/* <ShelfBook key="test" title="test" img='test' /> */}
                        <div className="clear" />
                    </div>
                    <div className="shelf"></div>
                </div>
            </div>
        );
    }

    renderShelfBook(books: Book[]): ReactElement<Book>[] {
        const elements = Array<ReactElement>();
        const maxBooksToDisplay = Math.min(books.length, 6);
        for (let i = 0; i < maxBooksToDisplay; i++) {
            elements.push(
                <ShelfBook
                    key={i}
                    title={books[i].title}
                    author={books[i].author.fullName}
                    id={books[i].id}
                    big={true}
                />
            );
        }
        return elements;
    }
    renderShelfBookByGenre(books: Book[]): Map<string, Array<ReactElement>> {
        const maxBooksToDisplay = Math.min(books.length, 6);
        const map = new Map(); // book genres to list of shelfbooks
        for (let i = 0; i < maxBooksToDisplay; i++) {
            if (map.get(books[i].bookGenre) == undefined) {
                map.set(books[i].bookGenre, Array<ReactElement>());
            }
            // eslint-disable-next-line max-len
            map.get(books[i].bookGenre).push(
                <ShelfBook
                    key={i}
                    title={books[i].title}
                    author={books[i].author.fullName}
                    id={books[i].id}
                    big={true}
                />
            );
        }
        return map;
    }
}
