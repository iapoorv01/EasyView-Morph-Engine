document.addEventListener('DOMContentLoaded', () => {
  const promptInput = document.getElementById('morph-prompt');
  const morphBtn = document.getElementById('morph-btn');
  const chips = document.querySelectorAll('.chip');
  const statusArea = document.getElementById('status-area');
  const statusText = document.querySelector('.status-content h4');
  const charCount = document.querySelector('.char-count');

  const activeMorphHint = document.getElementById('active-morph-hint');
  const recentPromptsSection = document.getElementById('recent-prompts-section');
  const recentPromptsList = document.getElementById('recent-prompts-list');

  const renderRecentPrompts = (recentPrompts) => {
    if (recentPrompts.length > 0 && recentPromptsSection && recentPromptsList) {
      recentPromptsSection.classList.remove('hidden');
      recentPromptsList.innerHTML = '';
      recentPrompts.forEach(p => {
        const el = document.createElement('div');
        el.style.cssText = 'padding: 8px 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 11px; color: #475569; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s;';
        // Escape user prompt to avoid XSS (basic)
        const safeP = p.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        el.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg><span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1;">${safeP}</span>`;
        el.addEventListener('mouseover', () => el.style.background = '#f1f5f9');
        el.addEventListener('mouseout', () => el.style.background = '#f8fafc');
        el.addEventListener('click', () => {
          promptInput.value = p;
          promptInput.focus();
        });
        recentPromptsList.appendChild(el);
      });
    }
  };

  // Load state
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs[0]) {
      try {
        const url = new URL(tabs[0].url);
        const hostname = url.hostname;

        chrome.storage.local.get(['savedMorphs', 'recentPrompts'], (result) => {
          // Check for active morph on this site
          const savedMorphs = result.savedMorphs || {};
          if (savedMorphs[hostname] && activeMorphHint) {
            activeMorphHint.classList.remove('hidden');
          }

          // Check for recent prompts
          const recentPrompts = result.recentPrompts || [];
          renderRecentPrompts(recentPrompts);
        });
      } catch (e) {
        // Invalid URL for extension (e.g., chrome://)
      }
    }
  });

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
      promptInput.style.height = 'auto';
      promptInput.style.height = Math.min(promptInput.scrollHeight, 120) + 'px';
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
    statusArea.classList.remove('error');
    statusText.style.color = '';
    statusText.textContent = 'Scanning & Generating UI...';

    // Add thinking animation classes
    document.querySelector('.prompt-container').classList.add('thinking');
    morphBtn.classList.add('thinking');

    // Send to active tab content script
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        chrome.tabs.sendMessage(tab.id, {
          action: 'EXECUTE_DYNAMIC_MORPH',
          payload: { prompt }
        }, (response) => {
          morphBtn.disabled = false;
          morphBtn.style.opacity = '1';
          document.querySelector('.prompt-container').classList.remove('thinking');
          morphBtn.classList.remove('thinking');

          if (chrome.runtime.lastError) {
            console.error('Error sending message:', chrome.runtime.lastError);
            statusArea.classList.add('hidden');
            alert('Please refresh the page to use Morph Engine. Note: Extensions cannot run on Chrome Web Store or internal pages.');
            return;
          }

          if (response && response.success) {
            statusArea.classList.add('hidden');

            // Save prompt to history
            chrome.storage.local.get(['recentPrompts'], (res) => {
              let rp = res.recentPrompts || [];
              rp = rp.filter(p => p !== prompt); // remove duplicates
              rp.unshift(prompt);
              if (rp.length > 3) rp.pop(); // keep top 3
              chrome.storage.local.set({ recentPrompts: rp }, () => {
                renderRecentPrompts(rp);
              });

              if (activeMorphHint) {
                activeMorphHint.classList.remove('hidden');
              }
            });
            // We'll leave the popup open for debugging
            // window.close(); 
          } else {
            // Display error in the status area
            statusText.textContent = `Error: ${response?.error || 'Failed to apply morph.'}`;
            statusArea.classList.remove('hidden');
            statusArea.classList.add('error');
          }
        });
      }
    } catch (err) {
      console.error(err);
      morphBtn.disabled = false;
      morphBtn.style.opacity = '1';
      document.querySelector('.prompt-container').classList.remove('thinking');
      morphBtn.classList.remove('thinking');
      statusArea.classList.add('hidden');
    }
  });
});
