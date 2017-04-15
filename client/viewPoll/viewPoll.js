const render = (data) => {
  const questionContainer = document.getElementById('question');
  let markup = '';
  markup += `<h1>${data.question}</h1>`;

  for (const option of data.options) {
    markup += `<li><input type="checkbox" value="${option._id}" /> ${option.text}</li>`;
  }

  questionContainer.innerHTML = markup;
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

document.getElementById('submitVote').addEventListener('click', () => {
  const userVote = document.querySelector('#question input:checked').value;
  const urlPath = location.pathname.split('/');
  const pollId = urlPath[urlPath.length - 1];

  if (userVote) {
    const voteRequest = new XMLHttpRequest();
    voteRequest.open('PUT', `/poll/${pollId}`, true);
    voteRequest.setRequestHeader('Content-type', 'application/json');
    voteRequest.send(JSON.stringify({optionId: userVote }));

    voteRequest.onload = () => {
      if (voteRequest.status >= 200 && voteRequest.status < 400) {
        window.location.replace(window.location.href + '/results');
      }
    };
  }
});
