export type Book = {
    id: number | string;
    title: string;
    img: string;
    // Add img property once we have thumbnails
    author: {
        fullName: string;
    };
    predefinedShelf: {
        shelfName: string;
    };
    bookGenre: string;
    favourite: boolean;
    likes: number;
    dislikes: number;
    summary: string;
    numberOfPages: number;
    rating: number;
};
