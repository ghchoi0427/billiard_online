package com.toy.billiard.repository;

import com.toy.billiard.domain.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    @Override
    List<Room> findAll();

    List<Room> findByName(String name);
}
