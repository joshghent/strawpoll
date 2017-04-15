const render = (data) => {
  const questionContainer = document.getElementById('question');
  let markup = '';

  const totalVotes = data.options.reduce((a, b) => { 
    return a + b.votes.length;
  }, 0);

  markup += `<h1>${data.question} - Total Votes: ${totalVotes}</h1>`;

  for (const option of data.options) {
    markup += `<li>${option.text} - ${option.votes.length}</li>`;
  }

  questionContainer.innerHTML = markup;
};

window.onload = () => {
  const urlPath = location.pathname.split('/');
  const pollId = urlPath[1];

  if (pollId) {
    const loadRequest = new XMLHttpRequest();
    loadRequest.open('GET', `/poll/${pollId}/results`, true);
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

const socket = io();

socket.on('vote', (args) => {
  console.log(args);
});
