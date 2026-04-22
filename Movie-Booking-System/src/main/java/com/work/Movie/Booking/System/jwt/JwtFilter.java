package com.work.Movie.Booking.System.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtFilter(JwtService jwtService, CustomUserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                username = jwtService.extractUsername(token);
                logger.debug("Extracted username from token: {}", username);
            } catch (io.jsonwebtoken.ExpiredJwtException e) {
                logger.warn("JWT Token expired: {}", e.getMessage());
            } catch (Exception e) {
                logger.error("JWT Token validation failed: {}", e.getMessage());
            }
        } else if (authHeader != null) {
            logger.warn("Authorization header found but does not start with 'Bearer '");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            logger.debug("Authenticating user by subject (ID): {}", username);
            
            UserDetails userDetails = null;
            try {
                // Try to load by ID first (new token format)
                Long userId = Long.parseLong(username);
                userDetails = userDetailsService.loadUserById(userId);
            } catch (NumberFormatException e) {
                // Fallback for old tokens that still use username as subject
                logger.warn("Subject is not a numeric ID, falling back to username lookup: {}", username);
                userDetails = userDetailsService.loadUserByUsername(username);
            }

            if (jwtService.validateToken(token, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                logger.debug("Successfully authenticated user: {} and set SecurityContext", username);
            } else {
                logger.warn("Token validation failed for user: {}", username);
            }
        }

        filterChain.doFilter(request, response);
    }
}
