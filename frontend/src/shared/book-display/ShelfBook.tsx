import React from 'react';
import { Link } from 'react-router-dom';
import { BOOK_OVERVIEW } from '../routes';
import { Paper } from '@material-ui/core';

type BookProps = {
    id: string | number;
    title: string;
    author: string;
    img: string;
};
export default function ShelfBook(props: BookProps): JSX.Element {
    const bookClass =
        'book-single-carousel' + (props.img === '' ? '' : ' image');
    const displayTitle =
        props.title.length > 12
            ? props.title.substring(0, 12) + '...'
            : props.title;
    // add link to book page
    return (
        <Link
            to={BOOK_OVERVIEW + '/' + props.id}
            style={{ textDecoration: 'none', color: 'black' }}
            // key={props.title + props.author}
        >
            <Paper className={bookClass} variant="elevation" square={false}>
                {bookClass !== 'book' && <div className="book-spine"></div>}
                {displayTitle}
            </Paper>
        </Link>
    );
}
