chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyze_tweet") {
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        model: "ft:gpt-4o-mini-2024-07-18:personal:mixed-data-mil:Ankery8o",
        messages: [
          {
            role: "system",
            content: "Sen bir medya okuryazarlık eğitmeni bir yapay zekasın. Kullanıcı sana bir tweet gösterecek. Tweet’i sosyal medya içeriği olarak değerlendir, manipülasyon, yönlendirme, eksik bilgi, duygu sömürüsü içerip içermediğini analiz et.\n\nYalnızca şu yapıda kısa bir yanıt ver:\n\nManipülatif mi?: Evet/Hayır\nSebep: [tek bir cümlelik açıklama]"
          },
          {
            role: "user",
            content: request.text
          }
        ]
      })
    })
    .then(res => res.json())
    .then(data => {
      const reply = data.choices?.[0]?.message?.content || "Modelden cevap alınamadı.";
      sendResponse({ message: reply });
    })
    .catch(() => sendResponse({ message: "OpenAI API ile bağlantı kurulamadı." }));
    return true;
  }
});
