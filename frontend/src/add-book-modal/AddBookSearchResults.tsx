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

import React, { useEffect, useState } from 'react';
import Endpoints from '../shared/api/endpoints';
import HttpClient from '../shared/http/HttpClient';
import { Book } from '../shared/types/Book';
import AddBookList from './AddBookList';

interface ISearchResultProps {
    query: string;
}

export default function AddBookSearchResults(
    props: ISearchResultProps
): JSX.Element {
    const [results, setResults] = useState<Book[]>([]);
    const [hasError, setHasError] = useState<boolean>(false);

    useEffect(() => {
        HttpClient.post(Endpoints.books, `search?term=${props.query}`)
            .then((response) => {
                console.log('I am hitting endpoint');
                const books = response as unknown as Book[];
                // console.log(books);
                setResults([...books]);
                setHasError(false);
            })
            .catch((error: Record<string, string>) => {
                console.error('error: ', error);
                setHasError(true);
            });
    }, [props.query]); // Only run effect if props.query changes

    if (hasError) {
        return <p>error! please try again!</p>;
    }

    return (
        <div className="query-results-container">
            {results.length > 0 ? (
                <AddBookList bookListData={results} searchText=""></AddBookList>
            ) : (
                <p>No books found</p>
            )}
        </div>
    );
}
