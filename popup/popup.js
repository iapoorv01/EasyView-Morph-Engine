document.addEventListener('DOMContentLoaded', () => {
  const promptInput = document.getElementById('morph-prompt');
  const morphBtn = document.getElementById('morph-btn');
  const chips = document.querySelectorAll('.chip');
  const statusArea = document.getElementById('status-area');
  const statusText = document.getElementById('status-text');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      promptInput.value = chip.dataset.prompt;
      promptInput.focus();
    });
  });

  morphBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) return;

    // UI feedback
    morphBtn.disabled = true;
    statusArea.classList.remove('hidden');
    statusText.textContent = 'Processing intent...';

    // Send to active tab content script
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        chrome.tabs.sendMessage(tab.id, {
          action: 'EXECUTE_MORPH',
          payload: { prompt }
        }, (response) => {
          statusArea.classList.add('hidden');
          morphBtn.disabled = false;
          
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
      statusArea.classList.add('hidden');
    }
  });
});
