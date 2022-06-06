package com.toy.billiard.controller;

import com.toy.billiard.domain.Room;
import com.toy.billiard.dto.RoomDto;
import com.toy.billiard.service.RoomService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/room/{id}")
    public String room(@CookieValue(name = "memberId", required = false) String username, Model model) {
        model.addAttribute("username", username);
        return "room";
    }

    @GetMapping("/createRoom")
    public String createRoom(Model model) {
        model.addAttribute("room", new RoomDto());
        return "create_room";
    }

    @PostMapping("/createRoom")
    public String createRoom(RoomDto dto) {
        Room room = new Room();
        room.setName(dto.getName());
        room.setJoined(1);
        roomService.save(room);
        return "redirect:/room/" + room.getId();
    }

}
