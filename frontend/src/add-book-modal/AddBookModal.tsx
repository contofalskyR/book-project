/*
The book project lets a user keep track of different books they would like to read, are currently
reading, have read or did not finish.
Copyright (C) 2021  Karan Kumar

This program is free software: you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.
If not, see <https://www.gnu.org/licenses/>.
*/

import React, { Component } from 'react';
import Modal, { IModalProps } from '../shared/components/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import './AddBookModal.css';
import Hidden from '@material-ui/core/Hidden';
import HttpClient from '../shared/http/HttpClient';
import Endpoints from '../shared/api/endpoints';
import AddBookSearch from './AddBookSearch';

type MyState = {
    name: string;
    showError: boolean;
    showInfo: boolean;
    msg: string;
    bookId: string | number;
};
export default class AddBookModal extends Component<
    IModalProps & { shelfname: string },
    MyState
> {
    constructor(props: never) {
        super(props);
        this.state = {
            name: '',
            showError: false,
            showInfo: false,
            msg: '',
            bookId: 0
        };
        this.submitBook = this.submitBook.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({ name: event.target.value });
    };

    submitBook = (event: React.MouseEvent<HTMLButtonElement>): void => {
        event.preventDefault();
        const bookId = this.state.bookId;
        let body = {};
        if (this.props.shelfname === 'FAVOURITES') {
            body = { favourite: true };
        } else {
            body = { predefinedShelf: this.props.shelfname };
        }
        console.log('BOOK ID: ' + this.state.bookId);

        HttpClient.patch(Endpoints.books, bookId as string, body)
            .then(() => {
                this.setState({
                    showError: false,
                    showInfo: true,
                    msg: 'Book saved successfully'
                });
                if (this.props.onClose) {
                    this.props.onClose();
                }
            })
            .catch((error: Record<string, string>) => {
                console.error(error);
                this.setState({
                    showError: true,
                    showInfo: false,
                    msg: 'Some error occurred'
                });
            });
    };

    handleBookSelection = (bookId: number | string) => {
        // Handle the selected book title in the parent component
        console.log('Selected book title in AddBookModal:', bookId);
        this.setState({ bookId });
    };

    // Only re render if the value from the child has changed
    // shouldComponentUpdate(nextProps: IModalProps, nextState: MyState) {
    //     return nextState.bookId !== this.state.bookId;
    // }

    render(): JSX.Element {
        return (
            <div>
                <Modal open={this.props.open} onClose={this.props.onClose}>
                    <div className="shelf-modal-container">
                        <div className="modal-content">
                            <div className="modal-title">Add Book</div>
                            <AddBookSearch
                                handleBookSelection={this.handleBookSelection}
                            />
                        </div>
                        <div className="modal-form-spacer" />

                        <div className="shelf-button-container">
                            <Button
                                className="shelf-modal-button"
                                variant="contained"
                                onClick={this.props.onClose}
                                disableElevation
                            >
                                Cancel
                            </Button>
                            <Button
                                className="shelf-modal-button"
                                variant="contained"
                                onClick={this.submitBook}
                                color="primary"
                                disableElevation
                            >
                                Add Book
                            </Button>
                        </div>
                        <div>
                            {this.state.showError || this.state.showInfo ? (
                                <Alert
                                    variant="filled"
                                    severity={
                                        this.state.showError ? 'error' : 'info'
                                    }
                                >
                                    {this.state.msg}
                                </Alert>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}
