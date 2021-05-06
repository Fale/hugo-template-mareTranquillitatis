document.addEventListener('DOMContentLoaded', function () {
    document.querySelector("#comment-submit").addEventListener('click', function submitComment() {
        var payload = {
            "resource": document.querySelector("input#comment-resource").value,
            "name": document.querySelector("input#comment-name").value,
            "email": document.querySelector("input#comment-email").value,
            "body": document.querySelector("textarea#comment-body").value,
        }

        var thanksMessage = document.createElement('p');

        fetch('{{ .Site.Params.Swlcs }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
        },
            body: JSON.stringify(payload),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            document.querySelector("form#comment").style.display = 'none';
            thanksMessage.innerText = "Thanks a lot for your comment! If the moderation is enabled, the comment has been added to the moderation queue. Otherwise, it will appear in a few minutes on the page."
            document.querySelector("h2#say-something").after(thanksMessage);
        })
        .catch((error) => {
            console.error('Error:', error);
            document.querySelector("form#comment").style.display = 'none';
            thanksMessage.innerText = "Oops... something went wrong! Sorry for that."
            document.querySelector("h2#say-something").after(thanksMessage);
        });
    });
});
