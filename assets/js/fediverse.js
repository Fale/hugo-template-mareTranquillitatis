document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('#fediverse-load');
    var container = document.querySelector('#fediverse-comments');
    var legacy = document.querySelector('#legacy-comments');
    var urlInput = document.querySelector('#fediverse-url');
    var tokenInput = document.querySelector('#fediverse-token');

    function esc(str) {
        var d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    function showLegacy() {
        if (legacy) { legacy.hidden = false; }
    }

    btn.addEventListener('click', function () {
        btn.disabled = true;
        btn.textContent = 'Loading…';

        if (!urlInput) {
            btn.remove();
            showLegacy();
            if (!legacy) { container.innerHTML = '<p>No comments yet.</p>'; }
            return;
        }

        var postUrl = urlInput.value;
        var token = tokenInput ? tokenInput.value : '';
        var statusId = postUrl.split('/').pop();
        var instanceUrl = postUrl.split('/').slice(0, 3).join('/');
        var headers = {};
        if (token) { headers['Authorization'] = 'Bearer ' + token; }

        fetch(instanceUrl + '/api/v1/statuses/' + statusId + '/context', { headers: headers })
            .then(function (response) { return response.json(); })
            .then(function (data) {
                btn.remove();
                showLegacy();
                var replies = data.descendants;
                if (!replies || replies.length === 0) {
                    if (!legacy) { container.innerHTML = '<p>No comments yet.</p>'; }
                    return;
                }
                container.innerHTML = '';
                replies.forEach(function (reply) {
                    var date = new Date(reply.created_at);
                    var dateStr = date.toISOString().slice(0, 10) + ' ' + date.toTimeString().slice(0, 8);
                    var handle = '@' + esc(reply.account.acct);

                    var card = document.createElement('div');
                    card.className = 'card fediverse-comment';
                    card.innerHTML =
                        '<div class="fediverse-header">' +
                            '<img class="fediverse-avatar" src="' + esc(reply.account.avatar) + '" alt="" width="48" height="48">' +
                            '<div class="fediverse-meta">' +
                                '<strong><a href="' + esc(reply.account.url) + '">' + esc(reply.account.display_name || reply.account.username) + '</a></strong>' +
                                '<span class="fediverse-handle">' + handle + '</span>' +
                            '</div>' +
                            '<a class="fediverse-date" href="' + esc(reply.url) + '">' + dateStr + '</a>' +
                        '</div>' +
                        '<div class="fediverse-content">' + reply.content + '</div>';
                    container.appendChild(card);
                });
            })
            .catch(function () {
                btn.remove();
                showLegacy();
                container.innerHTML = '<p>Could not load Fediverse comments.</p>';
            });
    });
});
