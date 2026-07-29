package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
class DemoApplicationTests {

    @MockitoBean
    private ChatClient chatClient;

    @Test
    void contextLoads() {
    }

}
