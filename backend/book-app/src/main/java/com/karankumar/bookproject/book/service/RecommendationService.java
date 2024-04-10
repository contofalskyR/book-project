package com.karankumar.bookproject.book.service;

import com.karankumar.bookproject.book.model.Book;
import com.karankumar.bookproject.book.repository.BookRepository;
import com.karankumar.bookproject.shelf.service.PredefinedShelfService;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.logging.Level;

import org.apache.tomcat.util.digester.DocumentProperties;
import java.io.*;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Log
@Transactional
public class RecommendationService {

    private final BookRepository bookRepository;
    private final BookService bookService;

    private final PredefinedShelfService predefinedShelfService;

    public
        HashMap<String,Double> getTermFreqMap() {
            return termFreqMap;
        }
        HashMap<String,Integer> getWordCountMap() {
            return DocWordCounts;
        }
        void setTermFreqMap(HashMap<String,Double> inMap) {
            termFreqMap = new HashMap<String, Double>(inMap);
        }
        void setWordCountMap(HashMap<String,Integer> inMap) {
            DocWordCounts =new HashMap<String, Integer>(inMap);
        }
    private
        HashMap<String,Double> termFreqMap ;
        HashMap<String,Integer> DocWordCounts;

    public RecommendationService(
            BookRepository bookRepository,
            BookService bookService,
            PredefinedShelfService predefinedShelfService) {
        this.bookRepository = bookRepository;
        this.predefinedShelfService = predefinedShelfService;
        this.bookService = bookService;
        }

    public Book getRandomFavoriteBook(List<Book> favoriteBooks) {
        if (favoriteBooks == null || favoriteBooks.isEmpty()) {
            return null; // Handle the case when the list is empty or null
        }

        Random random = new Random();
        int randomIndex = random.nextInt(favoriteBooks.size()); // Generate a random index
        return favoriteBooks.get(randomIndex); // Return the book at the random index
    }

    /* 
    // Calculate IDF 
    private Map<String, Double> calculateInverseDocFreq(List<DocumentProperties> docProperties, List<String> allTerms) {
        Map<String, Double> inverseDocFreqMap = new HashMap<>();
        int size = docProperties.size();
        for (String word : allTerms) {
            double wordCount = 0;
            for (DocumentProperties docProperty : docProperties) {
                Map<String, Integer> tempMap = docProperty.getWordCountMap();
                if (tempMap.containsKey(word)) {
                    wordCount++;
                }
            }
            double temp = size / wordCount;
            double idf = 1 + Math.log(temp);
            inverseDocFreqMap.put(word, idf);
        }
        return inverseDocFreqMap;
    }
    */

    // Calculate TF
    private Map<String, Double> calculateTermFrequency(Map<String, Integer> wordCountMap) {
        Map<String, Double> termFreqMap = new HashMap<>();
        double sum = 0.0;
        for (int val : wordCountMap.values()) {
            sum += val;
        }
        for (Map.Entry<String, Integer> entry : wordCountMap.entrySet()) {
            double tf = entry.getValue() / sum;
            termFreqMap.put(entry.getKey(), tf);
        }
        return termFreqMap;
    }
    /* 
    // Remove duplicates from terms list
    Set<String> uniqueTerms = new HashSet<>(allTerms);
    allTerms = new ArrayList<>(uniqueTerms);
    

    // Calculate TF-IDF
    private Map<String, Double> calculateTfidf(String text, List<DocumentProperties> docProperties, List<String> allTerms) {
        Map<String, Integer> wordCount = getTermsFromFile(text);
        Map<String, Double> termFrequency = calculateTermFrequency(wordCount);
        Map<String, Double> inverseDocFreqMap = calculateInverseDocFreq(docProperties, allTerms);

        Map<String, Double> tfidfMap = new HashMap<>();
        for (Map.Entry<String, Double> entry : termFrequency.entrySet()) {
            String term = entry.getKey();
            double tf = entry.getValue();
            double idf = inverseDocFreqMap.getOrDefault(term, 0.0);
            double tfidf = tf * idf;
            tfidfMap.put(term, tfidf);
        }
        return tfidfMap;
    */

    // Calculate TF-IDF matrix
    private HashMap<Long,List<Double>> calculateTfMatrix(List<Book> allBooks, List<String> allTerms) {
        HashMap<Long, List<Double>> matrix = new HashMap<>();
        for (Book book : allBooks) {
            //Map<String, Double> tfMapForDocument = calculateTermFrequency(docProperty.getWordCountMap(), docProperty.getTotalWords());
            List<Double> tfmatrixRow = new ArrayList<>();
            

          
            
            // Add TF values for each term in the document
            for (String term : allTerms) {
                double tfidfValue = termFreqMap.getOrDefault(term, 0.0);
                tfmatrixRow.add(tfidfValue);
            }
            
            matrix.put(book.getId(),tfmatrixRow);
        }
        return matrix;
    }
        
      /* 
        for (String term : allTerms) {
            double tfIdfValue = 0.0;
            double tfVal = tf.containsKey(term) ? tf.get(term) : 0.0;
            double idfVal = inverseDocFreqMap.getOrDefault(term, 0.0);
            tfIdfValue = tfVal * idfVal;
            tfidfRow.add(tfIdfValue);
        }
    */
/* 
    // Helper method to get book ID for a given description
    private String getBookIdForDescription(Map<String, String> bookIdToDescription, DocumentProperties docProperty) {
        for (Map.Entry<String, String> entry : bookIdToDescription.entrySet()) {
            if (entry.getValue().equals(docProperty.getSummary())) {
                return entry.getKey();
            }
        }
        return null; // Handle the case where book ID is not found
    }
    */

    /* 
            //create a new hashMap with Tf values in it.
            Iterator it = inputMap.entrySet().iterator();
            while (it.hasNext()) {
                Map.Entry pair = (Map.Entry)it.next();
                double tf = (Integer)pair.getValue()/ sum;
                termFreqMap.put((pair.getKey().toString()),tf);
            }
            return termFreqMap;

            public  boolean isDigit(String input) {
                String regex = "(.)*(\\d)(.)*";
                Pattern pattern = Pattern.compile(regex);
                Matcher matcher = pattern.matcher(input);
        
                boolean isMatched = matcher.matches();
                if (isMatched) {
                    return true;
                }
                return false;
            }

        */
    public static double cosineSimilarity(List<Double> A, List<Double> B) {
        double dotproduct = 0.0;
        double normA = 0.0;
            double normB = 0.0;
        
            for (int i = 0; i < A.size(); i++) {
                dotproduct += A.get(i) * B.get(i);
                normA += Math.pow(A.get(i), 2);
                normB += Math.pow(B.get(i), 2);
            }   
            return dotproduct / (Math.sqrt(normA) * Math.sqrt(normB));
        }

    private HashMap<Long,Double> calculateCosineSimilarities(HashMap<Long,List<Double>> tfidfMatrix, List<Double> favouritebookvector,Long bookId) {
        HashMap<Long,Double>  cosines = new HashMap<Long,Double>();
        for (Long key : tfidfMatrix.keySet()){

            List<Double> tfid = tfidfMatrix.get(key);
            if(tfid.equals(bookId)) continue;
            double similarity = cosineSimilarity(favouritebookvector, tfid);
            cosines.put(key,similarity);

        }
        

        return cosines;
        }

    public List<Book> getRecommendations(List<Book> favouriteBooks) {
        List<Book> allBooks = this.bookRepository.findAll();
        
        LOGGER.log(
                Level.INFO,
                "Calculating recommendations");

        List<String> userBookDescriptions = new ArrayList<>();
        Set<String> existingwords = new HashSet<>();
        for (Book book : favouriteBooks) {
            String summary = book.getSummary();
            for(String word: summary.split(" ")){
                if(!existingwords.contains(word)){
                    userBookDescriptions.add(word);

                }
            }
        }
        // Calculate TF-IDF matrix for book descriptions
        HashMap<Long,List<Double>> tfidfMatrix = calculateTfMatrix(allBooks, userBookDescriptions);
        Book fav = getRandomFavoriteBook(favouriteBooks);

        List<Double> randombookmatrix = tfidfMatrix.get(fav.getId());


        // Compute cosine similarity between user books and all other books
        HashMap<Long,Double> cosineSimilarities = calculateCosineSimilarities(tfidfMatrix, randombookmatrix, fav.getId());

        List<Book> recommendedBooks = new ArrayList<>();
        
                 // Create a list from the HashMap entries
        List<Map.Entry<Long, Double>> entryList = new ArrayList<>(cosineSimilarities.entrySet());
        
        // Sort the list based on the values (doubles) in descending order
        entryList.sort(Map.Entry.comparingByValue(Comparator.reverseOrder()));
        
        // Extract the top five entries
        List<Map.Entry<Long, Double>> topFiveEntries = entryList.subList(0, Math.min(5, entryList.size()));
        
        // Output the top five entries
        for (Map.Entry<Long, Double> entry : topFiveEntries) {
            recommendedBooks.add(bookService.findById(entry.getKey()).get());
        }
        return recommendedBooks;
    }
}