package com.pedido.ms_pedido.repository;

import com.pedido.ms_pedido.model.DetallePedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Long> {

    List<DetallePedido> findByPedidoId(Long pedidoId);

    void deleteByPedidoId(Long pedidoId);
}