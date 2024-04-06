package com.karankumar.bookproject.shelf.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.karankumar.bookproject.ExcludeFromJacocoGeneratedReport;
import com.karankumar.bookproject.account.model.User;
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
import org.apache.commons.lang3.StringUtils;

@Entity
@JsonIgnoreProperties(value = {"id", "books"})
@NoArgsConstructor(access = AccessLevel.PUBLIC)
@Getter
@Setter
@NamedEntityGraph(name = "CustomShelf.books", attributeNodes = @NamedAttributeNode("books"))
@ExcludeFromJacocoGeneratedReport
public class UserCreatedShelf extends Shelf {
  @OneToMany(fetch = FetchType.LAZY, mappedBy = "userCreatedShelf")
  protected Set<Book> books;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Setter(AccessLevel.NONE)
  private Long id;

  public UserCreatedShelf(String shelfName, User user) {
    super(shelfName, user);
  }

  public void setShelfName(String shelfName) {
    if (StringUtils.isBlank(shelfName)) {
      throw new IllegalArgumentException("Shelf name cannot be empty");
    }
    super.shelfName = shelfName;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    if (!super.equals(o)) return false;
    UserCreatedShelf that = (UserCreatedShelf) o;
    return id.equals(that.id) && books.equals(that.books);
  }

  @Override
  public int hashCode() {
    return Objects.hash(super.hashCode(), id, books);
  }
}
