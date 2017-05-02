const optionSelected = (event) => {
  const elemID = event.target.id;

  const optionsCheckboxes = document.querySelectorAll('.options-checkbox');

  for (let i = 0; i < optionsCheckboxes.length; i += 1) {
    optionsCheckboxes[i].checked = false;
  }

  document.getElementById(elemID).checked = true;
};

const render = (data) => {
  const questionContainer = document.getElementById('question');
  let markup = '';
  markup += `<h2>${data.question}</h2>`;

  const optionsList = [];

  for (const option of data.options) {
    markup += `<li><input type="checkbox" value="${option._id}" class="options-checkbox" id="${option._id}"/> ${option.text}</li>`;
    optionsList.push(option._id);
  }

  questionContainer.innerHTML = markup;

  for (const id of optionsList) {
    document.getElementById(id).addEventListener('click', optionSelected);
  }
};

window.onload = () => {
  const urlPath = location.pathname.split('/');
  const pollId = urlPath[urlPath.length - 1];

  document.querySelector('.results-button-container').innerHTML = `<a href="/${pollId}/results" class="btn btn-primary pull-right hundred-percent">Results</a>`;

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

document.getElementById('newVote').addEventListener('submit', (e) => {
  e.preventDefault();
  let userVote = document.querySelector('#question input:checked');
  const urlPath = location.pathname.split('/');
  const pollId = urlPath[urlPath.length - 1];

  if (userVote) {
    userVote = userVote.value;
    const voteRequest = new XMLHttpRequest();
    voteRequest.open('PUT', `/poll/${pollId}`, true);
    voteRequest.setRequestHeader('Content-type', 'application/json');
    voteRequest.send(JSON.stringify({optionId: userVote }));

    voteRequest.onload = () => {
      if (voteRequest.status >= 200 && voteRequest.status < 400) {
        window.location.href += '/results';
      }
    };
  } else {
    document.querySelector('.errorMessage').style.display = 'inline-block';
    document.querySelector('.errorMessage').innerHTML = 'Please select an option to vote for!';
  }
});
