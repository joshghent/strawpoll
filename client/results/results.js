const render = (data) => {
  const questionContainer = document.getElementById('question');
  let markup = '';

  const totalVotes = data.options.reduce((a, b) => { 
    return a + b.votes.length;
  }, 0);

  markup += `<h3>${data.question}</h3>`;

  for (const option of data.options) {
    markup += `<li id="${option._id}">${option.text} <span class="u-pull-right">${option.votes.length} Votes</span></li>`;
  }

  questionContainer.innerHTML = markup;
  document.getElementById('totalVotes').innerHTML = totalVotes;
};

window.onload = () => {
  const urlPath = location.pathname.split('/');
  const pollId = urlPath[1];

  document.querySelector('.results-container').innerHTML += `<a href="/${pollId}" class="button button-primary u-pull-right">Vote</a>`;

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

socket.on('vote', (newVote) => {
  document.querySelector(`[id="${newVote.id}"] span`).innerHTML = newVote.votes;
  document.getElementById('totalVotes').innerHTML = newVote.totalVotes;
});
