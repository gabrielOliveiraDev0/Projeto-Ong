package com.projetoong.backend.service;

import com.projetoong.backend.model.Animal;
import com.projetoong.backend.model.MovimentacaoAnimal;
import com.projetoong.backend.model.StatusAnimal;
import com.projetoong.backend.repository.AnimalRepository;
import com.projetoong.backend.repository.MovimentacaoAnimalRepository;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class MovimentacaoAnimalService {
    private final MovimentacaoAnimalRepository movimentacoes;
    private final AnimalRepository animais;

    public MovimentacaoAnimalService(
            MovimentacaoAnimalRepository movimentacoes,
            AnimalRepository animais) {
        this.movimentacoes = movimentacoes;
        this.animais = animais;
    }

    public void registrarEntrada(Animal animal) {
        if (movimentacoes.existsByAnimalIdAnimalAndTipo(animal.getIdAnimal(), "ENTRADA")) {
            return;
        }

        registrar(animal, "ENTRADA", "Entrada do animal na ONG");
    }

    public void registrarSaida(Animal animal, String motivo) {
        if (movimentacoes.existsByAnimalIdAnimalAndTipo(animal.getIdAnimal(), "SAIDA")) {
            return;
        }

        registrar(animal, "SAIDA", motivo);
    }

    private void registrar(Animal animal, String tipo, String motivo) {
        MovimentacaoAnimal movimentacao = new MovimentacaoAnimal();
        movimentacao.setAnimal(animal);
        movimentacao.setTipo(tipo);
        movimentacao.setMotivo(motivo);
        movimentacao.setData(Instant.now());
        movimentacao.setStatusAnimal(animal.getStatusAnimal());
        movimentacoes.save(movimentacao);
    }

    public Map<String, Object> relatorio() {
        sincronizarHistoricoExistente();

        List<Animal> todos = animais.findAll().stream()
                .filter(a -> !a.isRemovido())
                .toList();

        List<Animal> naOng = todos.stream()
                .filter(a -> a.getStatusAnimal() != StatusAnimal.ADOTADO)
                .toList();

        List<MovimentacaoAnimal> historico = movimentacoes.findAllByOrderByDataDesc();

        Map<String, Object> resultado = new LinkedHashMap<>();
        resultado.put("totalNaOng", naOng.size());
        resultado.put("resgatados", contar(todos, StatusAnimal.RESGATADO));
        resultado.put("emTratamento", contar(todos, StatusAnimal.EM_TRATAMENTO));
        resultado.put("disponiveis", contar(todos, StatusAnimal.DISPONIVEL));
        resultado.put("adotados", contar(todos, StatusAnimal.ADOTADO));
        resultado.put("entradas", historico.stream().filter(m -> "ENTRADA".equals(m.getTipo())).count());
        resultado.put("saidas", historico.stream().filter(m -> "SAIDA".equals(m.getTipo())).count());
        resultado.put("animais", naOng);
        resultado.put("movimentacoes", historico);
        return resultado;
    }

    private void sincronizarHistoricoExistente() {
        for (Animal animal : animais.findAll()) {
            if (!movimentacoes.existsByAnimalIdAnimalAndTipo(animal.getIdAnimal(), "ENTRADA")) {
                registrar(animal, "ENTRADA", "Registro incorporado ao controle de animais");
            }

            if ((animal.isRemovido() || animal.getStatusAnimal() == StatusAnimal.ADOTADO)
                    && !movimentacoes.existsByAnimalIdAnimalAndTipo(animal.getIdAnimal(), "SAIDA")) {
                registrar(animal, "SAIDA", animal.getStatusAnimal() == StatusAnimal.ADOTADO
                        ? "Adoção registrada anteriormente"
                        : "Saída registrada anteriormente");
            }
        }
    }

    private long contar(List<Animal> lista, StatusAnimal status) {
        return lista.stream().filter(a -> a.getStatusAnimal() == status).count();
    }
}
