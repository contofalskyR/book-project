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

import React from 'react';
import './NavBar.css';
import {
    Book,
    Bookmarks,
    CollectionsBookmark,
    ExitToApp,
    Favorite,
    MenuBook,
    Settings,
    ThumbUp,
    TrackChanges,
    TrendingUp
} from '@material-ui/icons';
import SearchIcon from '@material-ui/icons/Search';
import logo from '../media/logo/logo-two-lines-white@1x.png';
import darkLogo from '../media/logo/dark-logo.png';
import {
    HOME,
    MY_BOOKS,
    READING,
    READ,
    TO_READ,
    DID_NOT_FINISH,
    GOAL,
    STATS,
    SETTINGS,
    SIGN_IN,
    SEARCH,
    RECOMMENDATIONS,
    FAVOURITES
} from '../routes';
import { useTheme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
    button: {
        textTransform: 'none',
        fontSize: '12px',
        marginLeft: '-12px',
        marginRight: '0px',
        color: 'white',
        padding: '8px 0px 8px 0px'
    }
});

function NavItem(props: NavItemProps) {
    const classes = useStyles();
    return (
        <Link to={props.goTo} style={{ textDecoration: 'none' }}>
            <div className="nav-item">
                <Button className={classes.button} startIcon={props.icon}>
                    {props.itemText}
                </Button>
            </div>
        </Link>
    );
}

type NavItemProps = {
    icon: JSX.Element;
    itemText: string;
    goTo: string;
};

export function NavBar(): JSX.Element {
    const theme = useTheme();
    const navClass =
        'nav-bar ' +
        (theme.palette.type === 'dark' ? 'nav-bar-dark' : 'nav-bar-light');

    return (
        <MuiThemeProvider theme={theme}>
            <div className={navClass}>
                <div className="nav-top">
                    <Link to={HOME}>
                        <h1 className="sidebar">MY BOOKS</h1>
                    </Link>
                    <hr />
                </div>
                <div className="nav-links" id="nav-links-top">
                    <NavItem
                        icon={<CollectionsBookmark />}
                        itemText={'My Books'}
                        goTo={MY_BOOKS}
                    />
                    <NavItem
                        icon={<MenuBook />}
                        itemText={'Reading Now'}
                        goTo={READING}
                    />
                    <NavItem
                        icon={<Bookmarks />}
                        itemText={'To Read'}
                        goTo={TO_READ}
                    />
                    <NavItem icon={<Book />} itemText={'Read'} goTo={READ} />
                    <NavItem
                        icon={<Book />}
                        itemText={'Did Not Finish'}
                        goTo={DID_NOT_FINISH}
                    />

                    <br />

                    <NavItem
                        icon={<SearchIcon />}
                        itemText={'Search'}
                        goTo={SEARCH}
                    />
                    <NavItem
                        icon={<ThumbUp />}
                        itemText={'Recommended'}
                        goTo={RECOMMENDATIONS}
                    />
                    <NavItem
                        icon={<Favorite />}
                        itemText={'Favorites'}
                        goTo={FAVOURITES}
                    />
                    {/* <NavItem icon={<TrackChanges />} itemText={"Goals"} goTo={GOAL} />
              <NavItem icon={<TrendingUp />} itemText={"Statistics"} goTo={STATS} /> */}
                </div>
                <div className="nav-links">
                    <NavItem
                        icon={<Settings />}
                        itemText={'Settings'}
                        goTo={SETTINGS}
                    />
                    <NavItem
                        icon={<ExitToApp />}
                        itemText={'Log out'}
                        goTo={SIGN_IN}
                    />
                </div>
            </div>
        </MuiThemeProvider>
    );
}
