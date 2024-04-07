package com.karankumar.bookproject.shelf.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.karankumar.bookproject.ExcludeFromJacocoGeneratedReport;
import com.karankumar.bookproject.account.model.User;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedAttributeNode;
import javax.persistence.NamedEntityGraph;
import javax.persistence.OneToMany;

import com.karankumar.bookproject.book.model.Book;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A predefined shelf is a shelf that is created by the app and will always
 * exist (cannot be deleted
 * or renamed)
 */
@Entity
@JsonIgnoreProperties(value = { "id", "books", "predefinedShelfName" })
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@NamedEntityGraph(name = "PredefinedShelf.books", attributeNodes = @NamedAttributeNode("books"))
@ExcludeFromJacocoGeneratedReport
public class PredefinedShelf extends Shelf {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Setter(AccessLevel.NONE)
  private Long id;

  @Setter(AccessLevel.NONE)
  private ShelfName predefinedShelfName;

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "predefinedShelf")
  @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
  protected Set<Book> books = new HashSet<>();

  public PredefinedShelf(ShelfName predefinedShelfName, User user) {
    super(predefinedShelfName.toString(), user);
    this.predefinedShelfName = predefinedShelfName;
  }

  public enum ShelfName {
    TO_READ("To read"),
    READING("Reading"),
    READ("Read"),
    DID_NOT_FINISH("Did not finish"),
    FAVOURITE("Favourite");

    private final String name;

    ShelfName(String name) {
      this.name = name;
    }

    @Override
    public String toString() {
      return name;
    }
  }

  @Override
  public String toString() {
    return predefinedShelfName.toString();
  }

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;
    PredefinedShelf that = (PredefinedShelf) o;
    return predefinedShelfName == that.predefinedShelfName;
  }

  @Override
  public int hashCode() {
    return Objects.hash(predefinedShelfName);
  }
}
