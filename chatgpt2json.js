function downloadConversation() {
  function h(html) {
    return html.replace(/<p>/g, '\n\n')
      .replace(/<\/p>/g, '')
      .replace(/<b>/g, '**')
      .replace(/<\/b>/g, '**')
      .replace(/<i>/g, '_')
      .replace(/<\/i>/g, '_')
      .replace(/<code[^>]*>/g, (match) => {
        const lm = match.match(/class="[^"]*language-([^"]*)"/);
        return lm ? '\n```' + lm[1] + '\n' : '```';
      })
      .replace(/<\/code[^>]*>/g, '```')
      .replace(/<[^>]*>/g, '')
      .replace(/Copy code/g, '')
      .replace(/This content may violate our content policy. If you believe this to be in error, please submit your feedback — your input will aid our research in this area./g, '')
      .trim();
  }

  const e = document.querySelectorAll(".text-base");
  let arr = [];
  let role ="";
  let content ="";

  for (const s of e) {
    if (s.querySelector(".whitespace-pre-wrap")) {
      role = s.querySelector('img') ? 'user' : 'assistant';
      content = h(s.querySelector(".whitespace-pre-wrap").innerHTML);
      arr.push({
        'role': role,
        'content': content
      });
    }
  }

  console.log(arr);

  const o = document.createElement("a");
  o.download = "chatgpt2json.json";
  o.href = URL.createObjectURL(new Blob([JSON.stringify(arr)]));
  o.style.display = "none";
  document.body.appendChild(o);
  o.click();
}


chrome.action.onClicked.addListener((tab) => {
  if (tab.url.includes('https://chat')) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: downloadConversation
    });
  }
});

//credits: //https://www.reddit.com/r/ChatGPT/comments/zm237o/save_your_chatgpt_conversation_as_a_markdown_file/