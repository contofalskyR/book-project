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

import React, { Component, ReactElement } from 'react';
import { NavBar } from '../shared/navigation/NavBar';
import Button from '@material-ui/core/Button';
import AddBookModal from './AddBookModal';
import { Layout } from '../shared/components/Layout';
import { Genres } from '../shared/types/Genres';
import { Book } from '../shared/types/Book';
import HttpClient from '../shared/http/HttpClient';
import Endpoints from '../shared/api/endpoints';
import './MyBooks.css';
import ShelfView from '../shared/book-display/ShelfView';
import { FormControl, InputLabel, Select } from '@material-ui/core';
interface IState {
    showShelfModal: boolean;
    showListView: boolean;
    readBooks: Book[];
    didNotFinishBooks: Book[];
    toReadBooks: Book[];
    readingBooks: Book[];
    searchVal: string;
    genre: string;
}

class MyBooks extends Component<Record<string, unknown>, IState> {
    constructor(props: Record<string, unknown>) {
        super(props);
        this.state = {
            showShelfModal: false,
            showListView: false,
            genre: '',
            readBooks: [],
            didNotFinishBooks: [],
            toReadBooks: [],
            readingBooks: [],
            searchVal: ''
        };
        this.onAddBook = this.onAddBook.bind(this);
        this.onAddBookModalClose = this.onAddBookModalClose.bind(this);
        this.onToggleListView = this.onToggleListView.bind(this);
        this.getDidNotFinishBooks = this.getDidNotFinishBooks.bind(this);
        this.toReadBooks = this.toReadBooks.bind(this);
        this.readingBooks = this.readingBooks.bind(this);
        this.getReadBooks = this.getReadBooks.bind(this);
        this.handleGenreChange = this.handleGenreChange.bind(this);
    }
    componentDidMount(): void {
        this.getReadBooks();
        this.getDidNotFinishBooks();
        this.toReadBooks();
        this.readingBooks();
        this.trackCurrentDeviceSize();
        this.setState({ genre: '' });
    }
    genresList: JSX.Element[] = Object.keys(Genres).map((value, index) => {
        return (
            <option key={index} value={Genres[value as keyof typeof Genres]}>
                {Genres[value as keyof typeof Genres]}
            </option>
        );
    });

    getReadBooks(): void {
        HttpClient.get(Endpoints.read)
            .then((readBooks: Book[]) => {
                this.setState((state) => ({
                    readBooks: Array.isArray(readBooks)
                        ? readBooks
                        : state.readBooks
                }));
            })
            .catch((error: Record<string, string>) => {
                console.error('error: ', error);
            });
    }

    getDidNotFinishBooks(): void {
        HttpClient.get(Endpoints.didNotFinish)
            .then((didNotFinishBooks: Book[]) => {
                this.setState((state) => ({
                    didNotFinishBooks: Array.isArray(didNotFinishBooks)
                        ? didNotFinishBooks
                        : state.didNotFinishBooks
                }));
            })
            .catch((error: Record<string, string>) => {
                console.error('error: ', error);
            });
    }

    toReadBooks(): void {
        HttpClient.get(Endpoints.toRead)
            .then((toReadBooks: Book[]) => {
                this.setState((state) => ({
                    toReadBooks: Array.isArray(toReadBooks)
                        ? toReadBooks
                        : state.toReadBooks
                }));
            })
            .catch((error: Record<string, string>) => {
                console.error('error: ', error);
            });
    }

    readingBooks(): void {
        HttpClient.get(Endpoints.reading)
            .then((readingBooks: Book[]) => {
                this.setState((state) => ({
                    readingBooks: Array.isArray(readingBooks)
                        ? readingBooks
                        : state.readingBooks
                }));
            })
            .catch((error: Record<string, string>) => {
                console.error('error: ', error);
            });
    }

    onAddBook(): void {
        this.setState({
            showShelfModal: true
        });
    }

    trackCurrentDeviceSize(): void {
        window.onresize = (): void => {
            if (window.matchMedia('(max-width: 800px)').matches) {
                this.setState({ showListView: true });
            } else {
                this.setState({ showListView: false });
            }
        };
        return;
    }

    onAddBookModalClose(): void {
        this.setState({
            showShelfModal: false
        });
    }

    onToggleListView(): void {
        this.setState({
            showListView: !this.state.showListView
        });
    }
    handleGenreChange(
        event: React.ChangeEvent<{ name?: string; value: unknown }>
    ): void {
        this.setState({ genre: event.target.value as string });
        console.log(this.state.genre);
    }
    render(): ReactElement {
        return (
            <Layout
                title="My books"
                btn={
                    <div className="my-book-top-buttons">
                        <FormControl variant="filled" className="">
                            <InputLabel htmlFor="filled-native-simple">
                                Genre
                            </InputLabel>
                            <Select
                                native
                                value={this.state.genre}
                                onChange={this.handleGenreChange}
                                inputProps={{
                                    name: 'genre',
                                    id: 'filled-native-simple'
                                }}
                            >
                                <option aria-label="None" value="" />
                                {this.genresList}
                            </Select>
                        </FormControl>
                        <Button
                            onClick={this.onAddBook}
                            variant="contained"
                            color="primary"
                            disableElevation
                        >
                            Add Book
                        </Button>
                    </div>
                }
            >
                <NavBar />
                <div>
                    {
                        <ShelfView
                            key={
                                [
                                    ...this.state.readBooks,
                                    ...this.state.readingBooks,
                                    ...this.state.toReadBooks,
                                    ...this.state.didNotFinishBooks
                                ].length +
                                this.state.searchVal +
                                this.state.genre
                            }
                            readBooks={this.state.readBooks}
                            toReadBooks={this.state.toReadBooks}
                            didNotFinishBooks={this.state.didNotFinishBooks}
                            readingBooks={this.state.readingBooks}
                            searchText={this.state.searchVal}
                            genre={this.state.genre}
                        />
                    }
                </div>
                <AddBookModal
                    open={this.state.showShelfModal}
                    onClose={this.onAddBookModalClose}
                />
            </Layout>
        );
    }
}
export default MyBooks;
