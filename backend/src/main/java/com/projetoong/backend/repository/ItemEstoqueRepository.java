package com.projetoong.backend.repository;
import com.projetoong.backend.model.ItemEstoque;
import org.springframework.data.jpa.repository.*;
import jakarta.persistence.LockModeType;
import java.util.List;
public interface ItemEstoqueRepository extends JpaRepository<ItemEstoque,Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select i from ItemEstoque i order by i.id")
    List<ItemEstoque> bloquearTodos();
}
