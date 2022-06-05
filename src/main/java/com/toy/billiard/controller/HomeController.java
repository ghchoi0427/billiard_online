package com.toy.billiard.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("/")
public class HomeController {

    @GetMapping("/home")
    public String home(HttpServletRequest request) {
        Cookie[] list = request.getCookies();
        for (Cookie cookie : list) {
            if (cookie.getName().equals("username")) {
                System.out.println(cookie.getValue());
            }
        }
        return "home";
    }
}
