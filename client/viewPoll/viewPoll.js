const render = (data) => {
  const questionContainer = document.getElementById('question');
  const optionsMarkup = `<ul class="questionOptions">
                          <li><input type="checkbox" /> ${data.optionOne}</li>
                          <li><input type="checkbox" /> ${data.optionTwo}</li>
                          <li><input type="checkbox" /> ${data.optionThree}</li>
                        </ul>`;
  questionContainer.innerHTML = optionsMarkup;
};

window.onload = () => {
  const urlPath = location.pathname.split('/');
  const pollId = urlPath[urlPath.length - 1];

  if (pollId) {
    const loadRequest = new XMLHttpRequest();
    loadRequest.open('GET', `/poll/${pollId}`, true);
    loadRequest.setRequestHeader('Content-type', 'application/json');
    loadRequest.send();

    loadRequest.onload = () => {
      if (loadRequest.status >= 200 && loadRequest.status < 400) {
        const loadResponse = JSON.parse(loadRequest.response);
        render(loadResponse);
      }
    };
  }
};
