package com.karankumar.bookproject.shelf.controller;

import com.karankumar.bookproject.book.model.Book;
import com.karankumar.bookproject.shelf.model.PredefinedShelf.ShelfName;
import com.karankumar.bookproject.book.service.BookService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/shelf/books")
public class PredefinedShelfController {

  private final BookService bookService;

  @Autowired
  public PredefinedShelfController(BookService bookService) {
    this.bookService = bookService;
  }

  @GetMapping(path = "/to-read")
  // TODO: only retrieve books that belong to the logged in user
  public List<Book> getAllToReadBooks() {
    return bookService.findAllBooksByPredefinedShelfName(ShelfName.TO_READ);
  }

  @GetMapping(path = "/reading")
  // TODO: only retrieve books that belong to the logged in user
  public List<Book> getAllReadingBooks() {
    return bookService.findAllBooksByPredefinedShelfName(ShelfName.READING);
  }

  @GetMapping(path = "/favourite")
  public List<Book> getAllFavouriteBooks() {
    return bookService.findAllFavourite();
  }

  @GetMapping(path = "/read")
  // TODO: only retrieve books that belong to the logged in user
  public List<Book> getAllReadBooks() {
    return bookService.findAllBooksByPredefinedShelfName(ShelfName.READ);
  }

  @GetMapping(path = "/did-not-finish")
  // TODO: only retrieve books that belong to the logged in user
  public List<Book> getAllDidNotFinishBooks() {
    return bookService.findAllBooksByPredefinedShelfName(ShelfName.DID_NOT_FINISH);
  }
}
