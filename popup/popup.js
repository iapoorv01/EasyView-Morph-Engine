document.addEventListener('DOMContentLoaded', () => {
  const promptInput = document.getElementById('morph-prompt');
  const morphBtn = document.getElementById('morph-btn');
  const chips = document.querySelectorAll('.chip');
  const statusArea = document.getElementById('status-area');
  const statusText = document.querySelector('.status-content h4');
  const charCount = document.querySelector('.char-count');

  // Settings Logic
  const settingsBtn = document.querySelector('.settings-btn');
  const mainView = document.getElementById('main-view');
  const settingsView = document.getElementById('settings-view');
  const apiKeyInput = document.getElementById('gemini-api-key');
  const saveSettingsBtn = document.getElementById('save-settings-btn');
  const settingsStatus = document.getElementById('settings-status');

  if (settingsBtn && mainView && settingsView) {
    settingsBtn.addEventListener('click', () => {
      mainView.classList.toggle('hidden');
      settingsView.classList.toggle('hidden');
    });

    // Load existing API key
    chrome.storage.sync.get(['geminiApiKey'], (result) => {
      if (result.geminiApiKey) {
        apiKeyInput.value = result.geminiApiKey;
      }
    });

    // Save API key
    saveSettingsBtn.addEventListener('click', () => {
      const key = apiKeyInput.value.trim();
      chrome.storage.sync.set({ geminiApiKey: key }, () => {
        settingsStatus.style.display = 'block';
        setTimeout(() => {
          settingsStatus.style.display = 'none';
        }, 2500);
      });
    });
  }

  if (charCount) {
    promptInput.addEventListener('input', () => {
      charCount.textContent = `${promptInput.value.length} / 500`;
    });
  }

  chips.forEach(chip => {
    if (chip.classList.contains('locked')) return;
    chip.addEventListener('click', () => {
      promptInput.value = chip.dataset.prompt;
      promptInput.focus();
    });
  });

  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab) {
          chrome.tabs.sendMessage(tab.id, { action: 'RESET_PAGE' }, (response) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
              return;
            }
            if (response && response.success) {
              window.close(); // Close popup when successfully reset
            }
          });
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  morphBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) return;

    // UI feedback
    morphBtn.disabled = true;
    morphBtn.style.opacity = '0.7';
    statusArea.classList.remove('hidden');
    statusText.textContent = 'Scanning & Generating UI...';

    // Send to active tab content script
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        chrome.tabs.sendMessage(tab.id, {
          action: 'EXECUTE_DYNAMIC_MORPH',
          payload: { prompt }
        }, (response) => {
          statusArea.classList.add('hidden');
          morphBtn.disabled = false;
          morphBtn.style.opacity = '1';

          if (chrome.runtime.lastError) {
            console.error('Error sending message:', chrome.runtime.lastError);
            alert('Please refresh the page to use Morph Engine. Note: Extensions cannot run on Chrome Web Store or internal pages.');
            return;
          }

          if (response && response.success) {
            promptInput.value = '';
            window.close(); // Close popup on success
          }
        });
      }
    } catch (err) {
      console.error(err);
      morphBtn.disabled = false;
      morphBtn.style.opacity = '1';
      statusArea.classList.add('hidden');
    }
  });
});
