// 获取DOM元素
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const typingIndicator = document.getElementById('typing-indicator');

// DeepSeek API设置
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
// 注意：在实际使用时，请替换为您自己的API密钥
const API_KEY = 'sk-your-api-key-here';

// 对话历史
let conversationHistory = [
    {
        role: "assistant",
        content: "您好！文琢 AI助手，很高兴为您服务。您可以问我任何问题，我会尽力提供帮助。请问今天有什么可以为您效劳的？"
    }
];

// 格式化时间
function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// 添加消息到聊天框
function addMessageToChatBox(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'message user-message' : 'message ai-message';

    const time = formatTime(new Date());

    messageDiv.innerHTML = `
        <div class="message-header">
            ${isUser ? '您' : '文琢 AI'}
            <div class="message-time">${time}</div>
        </div>
        <div>${message}</div>
    `;

    chatBox.appendChild(messageDiv);

    // 滚动到底部
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 显示正在输入指示器
function showTypingIndicator() {
    typingIndicator.style.display = 'block';
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 隐藏正在输入指示器
function hideTypingIndicator() {
    typingIndicator.style.display = 'none';
}

// 发送消息到DeepSeek API
async function sendMessageToDeepSeek(message) {
    try {
        // 更新对话历史
        conversationHistory.push({
            role: "user",
            content: message
        });

        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: conversationHistory,
                temperature: 0.7,
                max_tokens: 1024,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'API请求失败');
        }

        // 获取AI回复内容
        const aiResponse = data.choices[0].message.content;

        // 更新对话历史
        conversationHistory.push({
            role: "assistant",
            content: aiResponse
        });

        return aiResponse;
    } catch (error) {
        console.error('API调用错误:', error);
        return `抱歉，处理您的请求时出错了。请稍后再试。错误信息: ${error.message}`;
    }
}

// 处理用户发送消息
async function handleSendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // 添加用户消息到聊天框
    addMessageToChatBox(message, true);

    // 清空输入框
    userInput.value = '';

    // 禁用发送按钮
    sendBtn.disabled = true;

    // 显示正在输入指示器
    showTypingIndicator();

    try {
        // 调用DeepSeek API
        const aiResponse = await sendMessageToDeepSeek(message);

        // 添加AI回复到聊天框
        addMessageToChatBox(aiResponse, false);
    } catch (error) {
        addMessageToChatBox("抱歉，处理您的请求时出错了。请稍后再试。", false);
        console.error("API调用错误:", error);
    } finally {
        // 隐藏正在输入指示器
        hideTypingIndicator();

        // 重新启用发送按钮
        sendBtn.disabled = false;

        // 聚焦输入框
        userInput.focus();
    }
}

// 事件监听
sendBtn.addEventListener('click', handleSendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !sendBtn.disabled) {
        handleSendMessage();
    }
});

// 初始化聚焦输入框
userInput.focus();