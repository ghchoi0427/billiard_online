function sendShot(dx, dy) {
    if (stompClient) {
        var chatMessage = {
            sender: username,
            content: {
                dx: dx,
                dy: dy
            },
            type: 'SHOT'
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
    }
}