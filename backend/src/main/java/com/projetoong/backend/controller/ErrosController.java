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
    @ExceptionHandler({org.springframework.dao.ConcurrencyFailureException.class, org.springframework.dao.DataIntegrityViolationException.class})
    public ResponseEntity<Map<String,String>> conflito(Exception e) { return ResponseEntity.status(409).body(Map.of("message", "O registro foi alterado por outro usuário ou conflita com um registro existente. Atualize e tente novamente.")); }
    @ExceptionHandler(org.springframework.web.multipart.MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String,String>> tamanho(Exception e) { return ResponseEntity.status(413).body(Map.of("message", "O arquivo deve ter até 5 MB.")); }
    @ExceptionHandler({org.springframework.web.servlet.resource.NoResourceFoundException.class, org.springframework.web.servlet.NoHandlerFoundException.class})
    public ResponseEntity<Map<String,String>> naoEncontrado(Exception e) { return ResponseEntity.status(404).body(Map.of("message", "Registro não encontrado.")); }
    @ExceptionHandler({org.springframework.web.bind.MissingServletRequestParameterException.class, org.springframework.web.method.annotation.MethodArgumentTypeMismatchException.class, org.springframework.http.converter.HttpMessageNotReadableException.class})
    public ResponseEntity<Map<String,String>> parametros(Exception e) { return ResponseEntity.badRequest().body(Map.of("message", "Dados ou parâmetros inválidos.")); }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String,String>> interno(Exception e) {
        if (e instanceof org.springframework.web.ErrorResponse erro && erro.getStatusCode().is4xxClientError()) return ResponseEntity.status(erro.getStatusCode()).body(Map.of("message", "Requisição inválida ou operação não permitida."));
        org.slf4j.LoggerFactory.getLogger(ErrosController.class).error("Falha ao processar requisição: {}", e.getClass().getSimpleName());
        return ResponseEntity.internalServerError().body(Map.of("message", "Erro interno do servidor."));
    }
}
