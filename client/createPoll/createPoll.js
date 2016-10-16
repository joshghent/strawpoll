(() => {
  const savePollButton = document.getElementById('savePoll');

  savePollButton.addEventListener('click', () => {
    const questionText = document.getElementById('questionText').value;
    const questionOne = document.getElementById('questionOne').value;
    const questionTwo = document.getElementById('questionTwo').value;
    const questionThree = document.getElementById('questionThree').value;
    const savePollRequest = new XMLHttpRequest();
    let res;

    if (questionText) {
      savePollRequest.open('POST', '/save', true);
      savePollRequest.setRequestHeader('Content-type', 'application/json');
      savePollRequest.onload = () => {
        if (this.status >= 200 && this.status < 400) {
          res = JSON.parse(this.response);
          window.location.href = `/${res.poll}/`;
        }
      };

      savePollRequest.send(JSON.stringify({
        questionText,
        questionOne,
        questionTwo,
        questionThree,
      }));
    }
  });
})();
