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
import Switch from '../settings/Switch';
import Button from '@material-ui/core/Button';
import AddBookModal from '../my-books/AddBookModal';
import { Layout } from '../shared/components/Layout';
import BookList from '../shared/book-display/BookList';
import { Genres } from '../shared/types/Genres';
import { Book } from '../shared/types/Book';
import HttpClient from '../shared/http/HttpClient';
import Endpoints from '../shared/api/endpoints';
import './Read.css';
import { FormControl, InputLabel, Select } from '@material-ui/core';
import ShelfCarouselSingle from '../shared/book-display/ShelfCarouselSingle';
interface IState {
    showShelfModal: boolean;
    showListView: boolean;
    readBooks: Book[];
    searchVal: string;
    genre: string;
}

class Read extends Component<Record<string, unknown>, IState> {
    constructor(props: Record<string, unknown>) {
        super(props);
        this.state = {
            showShelfModal: false,
            showListView: false,
            genre: '',
            readBooks: [],
            searchVal: ''
        };
        this.onAddShelf = this.onAddShelf.bind(this);
        this.onAddShelfModalClose = this.onAddShelfModalClose.bind(this);
        this.onToggleListView = this.onToggleListView.bind(this);
        this.readBooks = this.readBooks.bind(this);
        this.handleGenreChange = this.handleGenreChange.bind(this);
    }
    componentDidMount(): void {
        this.readBooks();
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

    readBooks(): void {
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

    onAddShelf(): void {
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

    onAddShelfModalClose(): void {
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
                title="Read"
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
                            variant="contained"
                            className="tempButton"
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
                    {this.state.showListView ? (
                        <BookList
                            key={
                                this.state.readBooks.length +
                                this.state.searchVal
                            }
                            bookListData={this.state.readBooks}
                            searchText={this.state.searchVal}
                        />
                    ) : (
                        <ShelfCarouselSingle
                            books={this.state.readBooks}
                            genre={this.state.genre}
                        />
                    )}
                </div>
                <AddBookModal
                    open={this.state.showShelfModal}
                    onClose={this.onAddShelfModalClose}
                />
                <div className="my-book-switch-container">
                    <div className="toggle-text">Shelf View</div>
                    <Switch onClick={this.onToggleListView} />
                    <div className="toggle-text">List View</div>
                </div>
            </Layout>
        );
    }
}
export default Read;
