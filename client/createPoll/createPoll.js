(() => {
  const savePollButton = document.getElementById('savePoll');

  savePollButton.addEventListener('click', (event) => {
    const questionText = document.getElementById('questionText').value;
    const optionOne = document.getElementById('questionOne').value;
    const optionTwo = document.getElementById('questionTwo').value;
    const optionThree = document.getElementById('questionThree').value;
    const savePollRequest = new XMLHttpRequest();
    let res;

    savePollRequest.open('POST', '/save', true);
    savePollRequest.setRequestHeader('Content-type', 'application/json');
    savePollRequest.onload = () => {
      if (savePollRequest.status >= 200 && savePollRequest.status < 400) {
        res = JSON.parse(savePollRequest.response);
        if (res.status === 'success' || res.status === undefined) {
          window.location.href += res.id;
        } else if (res.status === 'error') {
          document.querySelector('.errorMessage').style.display = 'inline-block';
          document.querySelector('.errorMessage').innerHTML = res.results;
        }
      }
    };

    savePollRequest.send(JSON.stringify({
      question: questionText,
      options: [
        { text: optionOne },
        { text: optionTwo },
        { text: optionThree },
      ],
    }));

    event.preventDefault();
    return false;
  });
})();
