function addAnalyzeButton(tweetElement, tweetText) {
  const existingButton = tweetElement.querySelector('.second-thought-button');
  if (existingButton) return;

  const button = document.createElement("div");
  button.className = "second-thought-button";
  button.innerText = "ST";
  button.style.width = "28px";
  button.style.height = "28px";
  button.style.display = "flex";
  button.style.alignItems = "center";
  button.style.justifyContent = "center";
  button.style.fontSize = "12px";
  button.style.fontWeight = "bold";
  button.style.fontFamily = "sans-serif";
  button.style.color = "white";
  button.style.backgroundColor = "#8e1c24";
  button.style.borderRadius = "8px";
  button.style.position = "absolute";
  button.style.top = "8px";
  button.style.right = "8px";
  button.style.cursor = "pointer";
  button.style.zIndex = "99999";
  button.style.transition = "transform 0.2s ease, box-shadow 0.2s ease";
  button.style.boxShadow = "0 0 0 rgba(0,0,0,0)";

  button.onmouseenter = () => {
    button.style.transform = "scale(1.1)";
    button.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
  };

  button.onmouseleave = () => {
    button.style.transform = "scale(1)";
    button.style.boxShadow = "none";
  };

  button.onclick = (e) => {
    console.log("🟥 ST butonu tıklandı!");
    e.stopPropagation();

    const existingWrapper = tweetElement.querySelector('.second-thought-wrapper');
    if (existingWrapper) {
      existingWrapper.remove();
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "second-thought-wrapper";
    wrapper.style.display = "flex"; wrapper.style.pointerEvents = "auto";
    wrapper.style.justifyContent = "flex-start";
    wrapper.style.marginTop = "6px";
    wrapper.style.marginLeft = "4px";

    const loadingBox = document.createElement("div");
    loadingBox.className = "second-thought-warning";
    loadingBox.style.backgroundColor = "#f0f0f0";
    loadingBox.style.color = "#555";
    loadingBox.style.border = "1px solid #ccc";
    loadingBox.style.padding = "8px 12px";
    loadingBox.style.borderRadius = "4px";
    loadingBox.style.fontSize = "12px";
    loadingBox.style.opacity = "0";
    loadingBox.style.transition = "opacity 0.4s ease";
    loadingBox.style.display = "inline-block"; loadingBox.style.pointerEvents = "auto";
    loadingBox.style.width = "fit-content";
    loadingBox.style.maxWidth = "80%";
    loadingBox.style.wordBreak = "break-word";
    loadingBox.style.whiteSpace = "pre-wrap";
    loadingBox.style.boxSizing = "border-box";

    const spinner = document.createElement("div");
    spinner.style.border = "2px solid #ccc";
    spinner.style.borderTop = "2px solid #333";
    spinner.style.borderRadius = "50%";
    spinner.style.width = "16px";
    spinner.style.height = "16px";
    spinner.style.animation = "spin 1s linear infinite";
    spinner.style.margin = "0 auto";

    const spinnerStyle = document.createElement("style");
    spinnerStyle.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(spinnerStyle);

    loadingBox.appendChild(spinner);
    wrapper.appendChild(loadingBox);
    tweetElement.appendChild(wrapper);

    setTimeout(() => {
      loadingBox.style.opacity = "1";
    }, 10);

    chrome.runtime.sendMessage(
      {
        action: "analyze_tweet",
        text: tweetText
      },
      (response) => {
        if (response && response.message) {
          
    const msg = response.message
      .replace(/(Manipülatif mi\?)/g, "<strong>$1</strong>")
      .replace(/(Sebep:)/g, "<strong>$1</strong>");
    loadingBox.innerHTML = msg;
    

          if (response.message.includes("Manipülatif mi?: Evet")) {
            
      loadingBox.style.backgroundColor = "#f9e1e1";
      loadingBox.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
      loadingBox.style.padding = "6px 10px";
      loadingBox.style.lineHeight = "1.4";
      loadingBox.style.fontSize = "13px";
    
            loadingBox.style.color = "#721c24";
            loadingBox.style.border = "1px solid #f5c6cb";
          } else if (response.message.includes("Manipülatif mi?: Hayır")) {
            
      loadingBox.style.backgroundColor = "#e6f5e8";
      loadingBox.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
      loadingBox.style.padding = "6px 10px";
      loadingBox.style.lineHeight = "1.4";
      loadingBox.style.fontSize = "13px";
    
            loadingBox.style.color = "#155724";
            loadingBox.style.border = "1px solid #c3e6cb";
          } else {
            
      loadingBox.style.backgroundColor = "#fdf6d8";
      loadingBox.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
      loadingBox.style.padding = "6px 10px";
      loadingBox.style.lineHeight = "1.4";
      loadingBox.style.fontSize = "13px";
    
            loadingBox.style.color = "#856404";
            loadingBox.style.border = "1px solid #ffeeba";
          }
        } else {
          loadingBox.innerText = "Bir sorun oluştu. Lütfen tekrar deneyin.";
          
      loadingBox.style.backgroundColor = "#f9e1e1";
      loadingBox.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
      loadingBox.style.padding = "6px 10px";
      loadingBox.style.lineHeight = "1.4";
      loadingBox.style.fontSize = "13px";
    
          loadingBox.style.color = "#721c24";
          loadingBox.style.border = "1px solid #f5c6cb";
        }
      }
    );
  };

  tweetElement.style.position = "relative";
  tweetElement.appendChild(button);
}

function scanTweets() {
  console.log("🔍 scanTweets() çağrıldı...");
  const tweets = document.querySelectorAll('article');
  console.log(`🧮 ${tweets.length} article bulundu.`);

  tweets.forEach((tweet) => {
    if (!tweet.dataset.analyzed) {
      const textElem = tweet.querySelector('[data-testid="tweetText"]') || tweet.querySelector('div[lang]');
      if (textElem) {
        addAnalyzeButton(tweet, textElem.innerText);
        tweet.dataset.analyzed = "true";
      } else {
        console.log("⚠️ Tweet metni bulunamadı, atlandı.");
      }
    }
  });
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach(() => {
    scanTweets();
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
