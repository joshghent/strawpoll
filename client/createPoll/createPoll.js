(() => {
  const savePollButton = document.getElementById('savePoll');

  savePollButton.addEventListener('click', () => {
    const questionText = document.getElementById('questionText').value;
    const optionOne = document.getElementById('questionOne').value;
    const optionTwo = document.getElementById('questionTwo').value;
    const optionThree = document.getElementById('questionThree').value;
    const savePollRequest = new XMLHttpRequest();
    let res;

    if (questionText) {
      savePollRequest.open('POST', '/save', true);
      savePollRequest.setRequestHeader('Content-type', 'application/json');
      /*
      savePollRequest.onload = (e) => {
        if (savePollRequest.status >= 200 && savePollRequest.status < 400) {
          res = JSON.parse(savePollRequest.response);
        }
      };
      */

      savePollRequest.send(JSON.stringify({
        questionText,
        optionOne,
        optionTwo,
        optionThree,
      }));
    }
  });
})();
