const render = (data) => {
  const questionContainer = document.getElementById('question');
  let markup = '';

  const totalVotes = data.options.reduce((a, b) => { 
    return a + b.votes.length;
  }, 0);

  markup += `<h2>${data.question}</h2>`;

  for (const option of data.options) {
    markup += `<li id="${option._id}">${option.text} <span class="pull-right">${option.votes.length} Votes</span></li>`;
  }

  questionContainer.innerHTML = markup;
  document.getElementById('totalVotes').innerHTML = totalVotes;
};

window.onload = () => {
  const urlPath = location.pathname.split('/');
  const pollId = urlPath[1];

  document.querySelector('.results-container').innerHTML += `<div class="col-lg-6 col-md-6 col-xs-6 pull-right"><a href="/${pollId}" class="btn btn-primary pull-right">Vote</a></div>`;

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
