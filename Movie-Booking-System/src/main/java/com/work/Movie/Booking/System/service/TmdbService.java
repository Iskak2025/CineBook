package com.work.Movie.Booking.System.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.work.Movie.Booking.System.entities.Movie;
import com.work.Movie.Booking.System.enums.Genre;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;

@Service
public class TmdbService {

    @Value("${tmdb.api.key}")
    private String apiKey;

    @Value("${tmdb.base.url}")
    private String baseUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String getPopularMovies() {
        String url = String.format("%s/movie/popular?api_key=%s", baseUrl, apiKey);
        return restTemplate.getForObject(url, String.class);
    }

    public String searchMovies(String query) {
        String url = String.format("%s/search/movie?api_key=%s&query=%s", baseUrl, apiKey, query);
        return restTemplate.getForObject(url, String.class);
    }

    public String getMovieDetails(Long tmdbId) {
        String url = String.format("%s/movie/%d?api_key=%s", baseUrl, tmdbId, apiKey);
        return restTemplate.getForObject(url, String.class);
    }

    public String getTopRatedMovies() {
        String url = String.format("%s/movie/top_rated?api_key=%s", baseUrl, apiKey);
        return restTemplate.getForObject(url, String.class);
    }

    public String getNowPlayingMovies() {
        String url = String.format("%s/movie/now_playing?api_key=%s", baseUrl, apiKey);
        return restTemplate.getForObject(url, String.class);
    }

    public Movie fetchAndMapMovie(Long tmdbId) {
        try {
            String json = getMovieDetails(tmdbId);
            JsonNode node = objectMapper.readTree(json);

            String firstGenre = "DRAMA";
            if (node.has("genres") && node.get("genres").isArray() && node.get("genres").size() > 0) {
                firstGenre = node.get("genres").get(0).get("name").asText().toUpperCase();
            }

            Genre genre;
            try {
                // Map common TMDB genres to our Enum
                if (firstGenre.contains("THRILLER")) genre = Genre.THRILLER;
                else if (firstGenre.contains("ACTION")) genre = Genre.ACTION;
                else if (firstGenre.contains("COMEDY")) genre = Genre.COMEDY;
                else if (firstGenre.contains("ROMANCE")) genre = Genre.ROMANTIC;
                else if (firstGenre.contains("HISTORY")) genre = Genre.HISTORICAL;
                else if (firstGenre.contains("ANIMATION")) genre = Genre.ANIMATION;
                else genre = Genre.valueOf(firstGenre);
            } catch (Exception e) {
                genre = Genre.DRAMA;
            }

            LocalDate releaseDate = null;
            if (node.has("release_date") && !node.get("release_date").asText().isEmpty()) {
                try {
                    releaseDate = LocalDate.parse(node.get("release_date").asText());
                } catch (Exception e) {
                    releaseDate = LocalDate.now();
                }
            } else {
                releaseDate = LocalDate.now();
            }

            return Movie.builder()
                    .tmdbId(tmdbId)
                    .movieName(node.has("title") ? node.get("title").asText() : "Unknown Movie")
                    .description(node.has("overview") ? node.get("overview").asText() : "")
                    .rating(node.has("vote_average") ? node.get("vote_average").asDouble() : 0.0)
                    .duration(node.has("runtime") ? node.get("runtime").asLong() : 120)
                    .imgUrl(node.has("poster_path") && !node.get("poster_path").isNull() 
                            ? "https://image.tmdb.org/t/p/w500" + node.get("poster_path").asText() 
                            : null)
                    .backdropUrl(node.has("backdrop_path") && !node.get("backdrop_path").isNull() 
                            ? "https://image.tmdb.org/t/p/original" + node.get("backdrop_path").asText() 
                            : null)
                    .genre(genre)
                    .releaseDate(releaseDate)
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching or parsing movie from TMDB: " + e.getMessage());
        }
    }
}
