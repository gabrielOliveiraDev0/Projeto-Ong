package com.projetoong.backend.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.*;
import java.util.Map;
@RestControllerAdvice
public class ErrosController {
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String,String>> resposta(ResponseStatusException e) { return ResponseEntity.status(e.getStatusCode()).body(Map.of("message",e.getReason()==null?"Operação não permitida":e.getReason())); }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,String>> validacao(MethodArgumentNotValidException e) { return ResponseEntity.badRequest().body(Map.of("message",e.getBindingResult().getFieldErrors().stream().map(f->f.getField()+": "+f.getDefaultMessage()).findFirst().orElse("Dados inválidos"))); }
}
