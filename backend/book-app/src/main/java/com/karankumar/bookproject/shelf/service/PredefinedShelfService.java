package com.karankumar.bookproject.shelf.service;

import com.karankumar.bookproject.ExcludeFromJacocoGeneratedReport;
import com.karankumar.bookproject.account.service.UserService;
import com.karankumar.bookproject.book.model.Book;
import com.karankumar.bookproject.shelf.model.PredefinedShelf;
import com.karankumar.bookproject.shelf.model.PredefinedShelf.ShelfName;
import com.karankumar.bookproject.account.model.User;
import com.karankumar.bookproject.book.repository.AuthorRepository;
import com.karankumar.bookproject.book.repository.BookRepository;
import com.karankumar.bookproject.shelf.repository.PredefinedShelfRepository;
import com.karankumar.bookproject.book.repository.PublisherRepository;
import com.karankumar.bookproject.book.repository.TagRepository;
import lombok.NonNull;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import static com.karankumar.bookproject.shelf.model.PredefinedShelf.ShelfName.DID_NOT_FINISH;
import static com.karankumar.bookproject.shelf.model.PredefinedShelf.ShelfName.READ;
import static com.karankumar.bookproject.shelf.model.PredefinedShelf.ShelfName.READING;
import static com.karankumar.bookproject.shelf.model.PredefinedShelf.ShelfName.TO_READ;
import static com.karankumar.bookproject.util.TestData.generateAuthors;
import static com.karankumar.bookproject.util.TestData.generateBooks;
import static com.karankumar.bookproject.util.TestData.generateListOfTags;
import static com.karankumar.bookproject.util.TestData.generatePublishers;
import static com.karankumar.bookproject.util.TestData.setPredefinedShelfForBooks;
import java.util.logging.Level;

@Service
@Log
public class PredefinedShelfService {
  private static final String ALL_BOOKS_SHELF = "All books";

  private final BookRepository bookRepository;
  private final PredefinedShelfRepository predefinedShelfRepository;
  private final AuthorRepository authorRepository;
  private final TagRepository tagRepository;
  private final UserService userService;
  private final PublisherRepository publisherRepository;

  public PredefinedShelfService(
      BookRepository bookRepository,
      AuthorRepository authorRepository,
      PredefinedShelfRepository shelfRepository,
      TagRepository tagRepository,
      UserService userService,
      PublisherRepository publisherRepository) {
    this.bookRepository = bookRepository;
    this.predefinedShelfRepository = shelfRepository;

    this.authorRepository = authorRepository;
    this.tagRepository = tagRepository;
    this.userService = userService;
    this.publisherRepository = publisherRepository;
  }

  public Optional<PredefinedShelf> findById(@NonNull Long id) {
    return predefinedShelfRepository.findById(id);
  }

  // TODO: make private. We should create predefined shelves when a user registers
  // and then not
  // allow further predefined shelves to be created
  public void save(@NonNull PredefinedShelf shelf) {
    predefinedShelfRepository.save(shelf);
  }

  public List<PredefinedShelf> findAllForLoggedInUser() {
    return predefinedShelfRepository.findAllByUser(userService.getCurrentUser());
  }

  public List<Book> findAllBooksByPredefinedShelfName(ShelfName shelfName) {
    return predefinedShelfRepository
        .findByPredefinedShelfNameAndUser(shelfName, userService.getCurrentUser())
        .map(PredefinedShelf::getBooks)
        .orElse(new HashSet<>())
        .stream()
        .collect(Collectors.toList());
  }

  public PredefinedShelf findToReadShelf() {
    return findByPredefinedShelfNameAndLoggedInUser(TO_READ).orElse(null);
  }

  public PredefinedShelf findReadingShelf() {
    return findByPredefinedShelfNameAndLoggedInUser(READING).orElse(null);
  }

  public PredefinedShelf findReadShelf() {
    return findByPredefinedShelfNameAndLoggedInUser(READ).orElse(null);
  }

  public PredefinedShelf findDidNotFinishShelf() {
    return findByPredefinedShelfNameAndLoggedInUser(DID_NOT_FINISH).orElse(null);
  }

  public Optional<PredefinedShelf> findByPredefinedShelfNameAndLoggedInUser(
      PredefinedShelf.ShelfName shelfName) {
    return predefinedShelfRepository.findByPredefinedShelfNameAndUser(
        shelfName, userService.getCurrentUser());
  }

  public Long count() {
    return predefinedShelfRepository.count();
  }

  @PostConstruct
  @ExcludeFromJacocoGeneratedReport
  public void populateTestData() {
    if (authorRepository.count() == 0) {
      populateAuthorRepository();
    }

    if (tagRepository.count() == 0) {
      populateTagRepository();
    }

    if (publisherRepository.count() == 0) {
      populatePublisherRepository();
    }

    if (bookRepository.count() == 0) {
      populateBookRepository();
    }
    // for each user, put a total of 20 books into their predefined shelves
    // distributed randomly
    for (User user : userService.findAll()) {
      if (predefinedShelfRepository.countAllByUser(user) == 0) {
        List<PredefinedShelf> predefinedShelves = populateShelfRepository(user);
        setShelfBooks(20, predefinedShelves);
      }
    }

  }

  private void populateAuthorRepository() {
    authorRepository.saveAll(generateAuthors());
  }

  private void populateTagRepository() {
    tagRepository.saveAll(generateListOfTags());
  }

  private void populatePublisherRepository() {
    publisherRepository.saveAll(generatePublishers());
  }

  private List<PredefinedShelf> populateShelfRepository(User user) {
    return predefinedShelfRepository.saveAll(createPredefinedShelves(user));
  }

  // populate the database with mock books
  private void populateBookRepository() {
    bookRepository.saveAll(
        generateBooks(
            authorRepository.findAll(),
            tagRepository.findAll(),
            publisherRepository.findAll()));
  }

  // put books into predefined shelves
  private void setShelfBooks(int numberOfBooks, List<PredefinedShelf> shelves) {
    Pageable pageable = PageRequest.of(0, numberOfBooks);
    List<Book> books = setPredefinedShelfForBooks(bookRepository.findAllBooks(pageable), shelves);
    bookRepository.saveAll(books);
  }

  private List<PredefinedShelf> createPredefinedShelves(User user) {
    return Stream.of(PredefinedShelf.ShelfName.values())
        .map(shelfName -> new PredefinedShelf(shelfName, user))
        .collect(Collectors.toList());
  }

  public Optional<PredefinedShelf> getPredefinedShelfByNameAsString(String shelfName) {
    List<PredefinedShelf> shelfFound = findAllForLoggedInUser().stream()
        .filter(
            shelf -> shelf
                .getPredefinedShelfName()
                .equals(PredefinedShelf.ShelfName.valueOf(shelfName)))
        .collect(Collectors.toList());

    if (shelfFound.isEmpty()) {
      return Optional.empty();
    }

    // TODO: throw exception if there is more than one
    return Optional.of(shelfFound.get(0)); // there should only be one
  }

  public Optional<PredefinedShelf> getPredefinedShelfByPredefinedShelfName(
      PredefinedShelf.ShelfName predefinedShelfName) {
    List<PredefinedShelf> shelfFound = findAllForLoggedInUser().stream()
        .filter(shelf -> shelf.getPredefinedShelfName().equals(predefinedShelfName))
        .collect(Collectors.toList());

    if (shelfFound.isEmpty()) {
      return Optional.empty();
    }

    return Optional.of(shelfFound.get(0)); // there should only be one
  }

  /**
   * Fetches all of the books in the chosen predefined shelf or all of the
   * predefined shelves
   */
  public Set<Book> getBooksInChosenPredefinedShelf(String chosenShelf) {
    if (isAllBooksShelf(chosenShelf)) {
      return getBooksInAllPredefinedShelves();
    }

    Optional<ShelfName> predefinedShelfName = getPredefinedShelfName(chosenShelf);
    if (predefinedShelfName.isEmpty()) {
      return new HashSet<>();
    }

    Optional<PredefinedShelf> predefinedShelf = findByPredefinedShelfNameAndLoggedInUser(predefinedShelfName.get());
    if (predefinedShelf.isEmpty()) {
      return new HashSet<>();
    }

    return predefinedShelf.get().getBooks();
  }

  private boolean isAllBooksShelf(@NonNull String shelfName) {
    return shelfName.equals(ALL_BOOKS_SHELF);
  }

  public Set<Book> getBooksInAllPredefinedShelves() {
    return getBooksInPredefinedShelves(findAllForLoggedInUser());
  }

  public void deleteAll() {
    predefinedShelfRepository.deleteAll();
  }

  /** Fetches all of the books in the chosen predefined shelves */
  public static Set<Book> getBooksInPredefinedShelves(List<PredefinedShelf> predefinedShelves) {
    return predefinedShelves.stream()
        .map(PredefinedShelf::getBooks)
        .collect(HashSet::new, Set::addAll, Set::addAll);
  }

  public static boolean isPredefinedShelf(String shelfName) {
    return Arrays.stream(ShelfName.values())
        .map(ShelfName::toString)
        .anyMatch(shelfName::equalsIgnoreCase);
  }

  public static Optional<ShelfName> getPredefinedShelfName(@NonNull String predefinedShelfName) {
    switch (predefinedShelfName) {
      case "To read":
        return Optional.of(ShelfName.TO_READ);
      case "Reading":
        return Optional.of(ShelfName.READING);
      case "Read":
        return Optional.of(ShelfName.READ);
      case "Did not finish":
        return Optional.of(ShelfName.DID_NOT_FINISH);
      default:
        return Optional.empty();
    }
  }

  public void addBookToPredefinedShelfByNameAsString(PredefinedShelf.ShelfName shelfName, Long book_id) {
    Optional<Book> book = bookRepository.findBookById(book_id);
    Optional<PredefinedShelf> shelf = predefinedShelfRepository.findByPredefinedShelfNameAndUser(
        shelfName, userService.getCurrentUser());
    LOGGER.log(
        Level.INFO,
        "ADDING" + book.get().getTitle() + " TO " + shelf.get().getPredefinedShelfName() + "STEPPA PIG");
    book.get().addPredefinedShelf(shelf.get());
  }
}
