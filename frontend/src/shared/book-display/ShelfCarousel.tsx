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

import React, { ReactElement } from 'react'
import './ShelfCarousel.css'
import { Icon, Paper } from '@material-ui/core';
import { Book } from '../types/Book';
import { Component } from 'react';

function ShelfBook(props: BookProps): JSX.Element {
    const bookClass = 'book' + (props.img === "" ? '' : ' image');
    const displayTitle = props.title.length > 12 ?
        (props.title.substring(0, 12) + "...") : props.title;

    return (
        <Paper className={bookClass} variant="elevation" square={false}>
            {(bookClass !== "book") && <div className="book-spine"></div>}
            {displayTitle}
        </Paper>
    )
}

type BookProps = {
    title: string;
    img: string;
}

interface IShelfCarouselState {
    title: string;
    books: Book[];
    genre: string;
}

type ShelfCarouselProps = {
    title: string;
    books: Book[];
    searchText: string;
    genre: string;
}

function AddBook() {
    return (
        <div className="book add-new">
            <Icon className="icon">add</Icon>
            <p className="book-title add-new">Add book</p>
        </div>
    )
}

export default class ShelfCarousel extends Component<ShelfCarouselProps, IShelfCarouselState> {

    constructor(props: ShelfCarouselProps) {
        super(props);
        this.state = {
            title: props.title,
            books: props.books,
            genre: props.genre
        }
        this.searchText = props.searchText
    }

    componentDidMount(): void {
        if (this.searchText === '') {
            this.setState({
                books: this.filterBooks(),
                genre: this.props.genre
            })
        }
        console.log("from the shelf carousl:" + this.state.genre);

    }
    searchText = '';

    filterBooks(): Book[] {
        if (this.state.genre !== '') {
            console.log("rerendering by genre!");
            return this.state.books.filter(book => {
                return book.bookGenre[0].toLowerCase() === this.state.genre.toLowerCase();
            });
        }
        return this.state.books.filter(book => {
            console.log("rerendering by all books!");
            console.log(book.bookGenre[0]);
            return book.title.toLowerCase().includes(this.searchText.toLowerCase());
        });

    }
    render(): JSX.Element {
        const books: any = [];
        this.renderShelfBookByGenre(this.state.books).forEach((value, key) => {
            books.push(<div>
                {key}
                {value}
            </div>
            )
        })
        return (
            <div className="shelf-container">
                <span className="shelf-title">{this.state.title}</span>
                <span className="view-all">View All</span>
                <div className="clear" />
                <div className="books-and-shelf">
                    <div className="book-wrap">
                        {
                            books
                        }
                        {/* <ShelfBook key="test" title="test" img='test' /> */}
                        <AddBook />
                        <div className="clear" />
                    </div>
                    <div className="shelf"></div>
                </div>
            </div>
        );
    }

    renderShelfBook(books: Book[]): ReactElement<Book>[] {
        const elements = Array<ReactElement>();
        const maxBooksToDisplay = Math.min(books.length, 6)
        for (let i = 0; i < maxBooksToDisplay; i++) {
            elements.push(<ShelfBook key={i} title={books[i].title} img={books[i].img} />)
        }
        return elements;
    }
    renderShelfBookByGenre(books: Book[]): Map<string, Array<ReactElement>> {
        const elements = Array<ReactElement>();
        const maxBooksToDisplay = Math.min(books.length, 6)
        const map = new Map(); // book genres to list of shelfbooks
        for (let i = 0; i < maxBooksToDisplay; i++) {
            if (map.get(books[i].bookGenre) == undefined) {
                map.set(books[i].bookGenre, Array<ReactElement>());
            }
            // eslint-disable-next-line max-len
            map.get(books[i].bookGenre).push(<ShelfBook key={i} title={books[i].title} img={books[i].img} />)
        }
        return map;
    }
}
