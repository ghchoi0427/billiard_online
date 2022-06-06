package com.toy.billiard.controller;

import com.toy.billiard.domain.Room;
import com.toy.billiard.dto.RoomDto;
import com.toy.billiard.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/home")
public class HomeController {

    @Autowired
    private final RoomService roomService;

    public HomeController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("")
    public String home(@CookieValue(name = "username", required = false) String username, Model model) {

        List<RoomDto> dtos = new ArrayList<>();

        for (Room r : roomService.getAllRooms()) {
            RoomDto dto = new RoomDto();
            dto.setId(r.getId());
            dto.setName(r.getName());
            dto.setJoined(r.getJoined());
            dtos.add(dto);
        }
        model.addAttribute("rooms", dtos);
        return "home";
    }
}
