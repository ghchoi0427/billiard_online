package com.toy.billiard.domain;

public class ChatMessage {
    private MessageType type;
    private String content;
    private String sender;
    private float dx;
    private float dy;
    private int roomId;
    private int cueDegree;

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE,
        PRESENT,
        DONE,
        SHOT,
        CUE
    }

    public int getRoomId() {
        return roomId;
    }

    public void setRoomId(int roomId) {
        this.roomId = roomId;
    }

    public int getCueDegree() {
        return cueDegree;
    }

    public void setCueDegree(int cueDegree) {
        this.cueDegree = cueDegree;
    }

    public float getDx() {
        return dx;
    }

    public void setDx(float dx) {
        this.dx = dx;
    }

    public float getDy() {
        return dy;
    }

    public void setDy(float dy) {
        this.dy = dy;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }
}