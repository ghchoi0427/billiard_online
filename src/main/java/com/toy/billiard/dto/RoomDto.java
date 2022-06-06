package com.toy.billiard.dto;

public class RoomDto {

    private Long id;
    private String name;
    private int joined;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getJoined() {
        return joined;
    }

    public void setJoined(int joined) {
        this.joined = joined;
    }

}
