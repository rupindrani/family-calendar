package com.familycalendar.todo.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.*;

@Component
public class JwtFilter implements Filter {

    @Value("${jwt.secret}")
    private String secret;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        String auth = req.getHeader("Authorization");

        if (auth != null && auth.startsWith("Bearer ")) {
            try {
                Key key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
                Claims claims = Jwts.parserBuilder().setSigningKey(key).build()
                        .parseClaimsJws(auth.substring(7)).getBody();

                String userId = claims.getSubject();
                String name = claims.get("name", String.class);
                String email = claims.get("email", String.class);
                String familyId = claims.get("familyId", String.class);

                HttpServletRequestWrapper wrapped = new HttpServletRequestWrapper(req) {
                    private final Map<String, String> extra = Map.of(
                            "x-user-id", userId != null ? userId : "",
                            "x-user-name", name != null ? name : (email != null ? email : ""),
                            "x-family-id", familyId != null ? familyId : ""
                    );

                    @Override
                    public String getHeader(String name) {
                        String lower = name.toLowerCase();
                        return extra.containsKey(lower) ? extra.get(lower) : super.getHeader(name);
                    }

                    @Override
                    public Enumeration<String> getHeaders(String name) {
                        String lower = name.toLowerCase();
                        if (extra.containsKey(lower)) {
                            return Collections.enumeration(List.of(extra.get(lower)));
                        }
                        return super.getHeaders(name);
                    }

                    @Override
                    public Enumeration<String> getHeaderNames() {
                        List<String> names = new ArrayList<>(Collections.list(super.getHeaderNames()));
                        names.addAll(extra.keySet());
                        return Collections.enumeration(names);
                    }
                };
                chain.doFilter(wrapped, response);
                return;
            } catch (Exception ignored) {}
        }
        chain.doFilter(request, response);
    }
}
