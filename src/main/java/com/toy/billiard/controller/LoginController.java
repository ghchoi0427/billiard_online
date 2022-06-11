package com.toy.billiard.controller;

import com.toy.billiard.dto.LoginDto;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

@Controller
@RequestMapping("")
public class LoginController {

    @GetMapping("/")
    public String login(Model model) {
        model.addAttribute("loginDto", new LoginDto());
        return "login";
    }

    @PostMapping("/login")
    public String login(LoginDto dto, HttpServletResponse response) {
        Cookie cookie = new Cookie("username", dto.getUsername());
        cookie.setDomain("localhost");
        cookie.setMaxAge(30 * 60);
        cookie.setSecure(true);
        response.addCookie(cookie);

        return "redirect:/home";
    }
}
