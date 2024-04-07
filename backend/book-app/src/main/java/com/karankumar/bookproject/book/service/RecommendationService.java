package com.karankumar.bookproject.book.service;

import com.karankumar.bookproject.book.model.Book;
import com.karankumar.bookproject.book.repository.BookRepository;
import com.karankumar.bookproject.shelf.service.PredefinedShelfService;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.ArrayList;

@Service
@Log
@Transactional
public class RecommendationService {

    private final AuthorService authorService;
    private final BookRepository bookRepository;
    private final PublisherService publisherService;
    private final PredefinedShelfService predefinedShelfService;

    public RecommendationService(
            BookRepository bookRepository,
            AuthorService authorService,
            PublisherService publisherService,
            PredefinedShelfService predefinedShelfService) {
        this.bookRepository = bookRepository;
        this.authorService = authorService;
        this.publisherService = publisherService;
        this.predefinedShelfService = predefinedShelfService;
    }

    public List<Book> getRecommendations(List<Book> userBooks) {
        List<Book> allBooks = this.bookRepository.findAll();
        List<Book> recommendedBooks = new ArrayList<Book>();
        // TODO: perform cosign similarity
        return recommendedBooks;
    }

}
