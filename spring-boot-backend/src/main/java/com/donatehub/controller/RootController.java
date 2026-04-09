package com.donatehub.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class RootController {

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Server is running");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/")
    public ResponseEntity<?> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "DonateHub API");
        response.put("version", "1.0.0");
        response.put("status", "running");
        return ResponseEntity.ok(response);
    }
}
