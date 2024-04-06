import React from 'react';
import { Link } from 'react-router-dom';
import { BOOK_OVERVIEW } from '../routes';
import { Paper, Tooltip } from '@material-ui/core';

type BookProps = {
    id: string | number;
    title: string;
    author: string;
    big: boolean;
};
export default function ShelfBook(props: BookProps): JSX.Element {
    const bookClass = props.big ? 'book' : 'book-single-carousel';
    const displayTitle =
        props.title.length > 12
            ? props.title.substring(0, 12) + '...'
            : props.title;
    console.log('Holy buckets!');

    return (
        <Link
            to={BOOK_OVERVIEW + '/' + props.id}
            style={{ textDecoration: 'none', color: 'black' }}
        >
            <Tooltip title={props.title} arrow>
                <Paper className={bookClass} variant="elevation" square={false}>
                    {<div className="book-spine"></div>}
                    {displayTitle}
                </Paper>
            </Tooltip>
        </Link>
    );
}
