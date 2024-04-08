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

package com.karankumar.bookproject.util;

import com.karankumar.bookproject.book.model.Author;
import com.karankumar.bookproject.book.model.Book;
import com.karankumar.bookproject.book.model.BookGenre;
import com.karankumar.bookproject.shelf.model.PredefinedShelf;
import com.karankumar.bookproject.book.model.Publisher;
import com.karankumar.bookproject.book.model.RatingScale;
import com.karankumar.bookproject.book.model.Tag;
import com.karankumar.bookproject.util.MockData;

import static java.util.stream.Collectors.collectingAndThen;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public final class TestData {
  private static final ThreadLocalRandom threadLocalRandom = ThreadLocalRandom.current();
  private static final List<String> recommenders = Arrays.asList("John", "Thomas", "Christina", "Luke", "Sally");

  private TestData() {
  }

  public static int generateRandomNumberInRange() {
    int min = 300;
    int max = 1000;
    return threadLocalRandom.nextInt(min, max + 1);
  }

  public static List<Author> generateAuthors() {
    return MockData.AUTHORS.stream().map(name -> {
      return new Author(name);
    }).collect(Collectors.toList());
  }

  public static List<Book> generateBooks(
      List<Author> authors,
      List<Tag> tags,
      List<Publisher> publishers) {
    return MockData.BOOK_TITLES.stream().map(title -> createBook(authors, title, tags, publishers))
        .collect(Collectors.toList());
  }

  public static List<Publisher> generatePublishers() {
    return MockData.PUBLISHERS.stream().map(Publisher::new)
        .collect(Collectors.toList());
  }

  public static List<Tag> generateListOfTags() {
    return Stream.of("Adventure", "Interesting", "Tolkien", "Pokemon")
        .map(Tag::new)
        .collect(Collectors.toList());
  }

  public static Book createBook(
      List<Author> authors,
      String title,
      List<Tag> tags,
      List<Publisher> publishers) {
    Book book = new Book(
        title,
        generateRandomAuthor(authors),
        generateRandomPublishers(publishers),
        getRandomBookSummary());

    book.setBookGenre(generateRandomGenre());
    book.setBookRecommendedBy(generateRandomRecommender());
    book.addTag(generateRandomTag(tags));
    book.setSeriesPosition(generateRandomSeriesPosition());
    book.setBookReview("Must Read Book. Really Enjoyed it");
    book.setNumberOfPages(generateRandomNumberInRange());
    book.setPagesRead(generateRandomNumberInRange());
    book.setPublicationYear(generateRandomPublicationYear());
    book.setPublishers(generateRandomPublishers(publishers));
    book.setLikes(0);
    book.setDislikes(0);
    book.setFavourite(false);

    return book;
  }

  private static String getRandomBookSummary() {
    return MockData.SUMMARIES.get(threadLocalRandom.nextInt(MockData.SUMMARIES.size()));
  }

  private static Author generateRandomAuthor(List<Author> authors) {
    return authors.get(threadLocalRandom.nextInt(authors.size()));
  }

  private static Set<Publisher> generateRandomPublishers(List<Publisher> publishers) {
    Set<Publisher> publisherSet = new HashSet<>();
    publisherSet.add(publishers.get(threadLocalRandom.nextInt(publishers.size())));
    return publisherSet;
  }

  private static Set<BookGenre> generateRandomGenre() {
    return Collections.singleton(
        BookGenre.values()[threadLocalRandom.nextInt(BookGenre.values().length)]);
  }

  private static String generateRandomRecommender() {
    return recommenders.get(threadLocalRandom.nextInt(recommenders.size()));
  }

  private static Tag generateRandomTag(List<Tag> tags) {
    return tags.get(threadLocalRandom.nextInt(tags.size()));
  }

  private static int generateRandomSeriesPosition() {
    return threadLocalRandom.nextInt(1, 10 + 1);
  }

  public static PredefinedShelf generateRandomPredefinedShelf(
      List<PredefinedShelf> predefinedShelves) {
    return predefinedShelves.get(threadLocalRandom.nextInt(predefinedShelves.size()));
  }

  public static int generateRandomPublicationYear() {
    return threadLocalRandom.nextInt(1920, 2020 + 1);
  }

  public static List<Book> setPredefinedShelfForBooks(
      List<Book> books, List<PredefinedShelf> predefinedShelves) {
    for (Book book : books) {
      PredefinedShelf shelf = generateRandomPredefinedShelf(predefinedShelves);
      PredefinedShelf.ShelfName predefinedShelfName = shelf.getPredefinedShelfName();
      book.addPredefinedShelf(shelf);
      switch (predefinedShelfName) {
        case TO_READ:
          book.setDateStartedReading(null);
          book.setDateFinishedReading(null);
          book.setRating(RatingScale.NO_RATING);
          break;
        case READING:
        case DID_NOT_FINISH:
          book.setDateStartedReading(LocalDate.now().minusDays(2));
          book.setDateFinishedReading(null);
          book.setRating(RatingScale.NO_RATING);
          break;
        case READ:
        case FAVOURITE:
          book.setRating(
              RatingScale.values()[threadLocalRandom.nextInt(RatingScale.values().length)]);
          book.setDateStartedReading(LocalDate.now().minusDays(2));
          book.setDateFinishedReading(LocalDate.now());
          break;
      }
    }
    return books;
  }
}
