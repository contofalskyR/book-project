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

import React, { useState } from 'react';
import Endpoints from '../api/endpoints';
import HttpClient from '../http/HttpClient';
import { Book } from '../types/Book';

interface ISearchResultProps {
    query: string;
}

export default function SearchResults(props: ISearchResultProps): JSX.Element {
    const [results, setResults] = useState<Book[]>([]);
    let hasError = false;

    HttpClient.post(Endpoints.books, `search?term=${props.query}`)
        .then(async (response) => {
            setResults(response as unknown as Book[]);
        })
        .catch((error: Record<string, string>) => {
            console.error('error: ', error);
            hasError = true;
        });

    // if (loading) {
    //     return <p>Loading</p>;
    // }
    if (hasError) {
        return <p>error! please try again!</p>;
    }
    // if (results) {
    //     console.log(results);
    // }
    return <div className="query-results-container">{results}</div>;
}
