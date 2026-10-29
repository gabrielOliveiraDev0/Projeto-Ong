package com.projetoong.backend.model;
import java.math.BigDecimal;
import java.time.LocalDate;
import jakarta.validation.constraints.*;
public record ItemEstoqueRequest(@NotBlank @Size(max=255) String nome, @NotNull CategoriaEstoque categoria,
    @NotNull @Digits(integer=12, fraction=8) @DecimalMin("0") BigDecimal quantidade, @NotBlank @Size(max=30) String unidade,
    @NotNull @Digits(integer=12, fraction=8) @DecimalMin("0") BigDecimal valorUnitario, @Size(max=255) String fornecedor,
    LocalDate dataEntrada, LocalDate validade, @NotNull @Digits(integer=12, fraction=8) @DecimalMin("0") BigDecimal estoqueMinimo,
    @Size(max=255) String marca, @Size(max=255) String especieIndicada, @Digits(integer=12, fraction=8) @DecimalMin("0.00000001") BigDecimal consumoRecomendado) {}
