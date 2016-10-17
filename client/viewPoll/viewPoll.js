(() => {
  const render = (data) => {
    const questionContainer = document.getElementById('question');
    
  };

  document.onload = () => {
    const urlPath = location.pathname.split('/');
    const pollId = urlPath[urlPath.length - 1];

    if (pollId) {
      const loadRequest = new XMLHttpRequest();
      loadRequest.open('GET', `/poll/${pollId}`, true);
      loadRequest.send();

      loadRequest.onload = () => {
        if (this.status >= 200 && this.status < 400) {
          const loadResponse = JSON.parse(this.response);
          render(loadResponse);
        }
      };
    }
  };
})();
