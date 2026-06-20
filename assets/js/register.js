
function switchTab(type) {

    document.getElementById('soloTab')
        .classList.remove('active-tab');

    document.getElementById('teamTab')
        .classList.remove('active-tab');

    if (type === 'solo') {
        document.getElementById('soloTab')
            .classList.add('active-tab');

        document.getElementById('soloForm')
            ?.classList.remove('hidden');

        document.getElementById('teamForm')
            ?.classList.add('hidden');
    }

    if (type === 'team') {
        document.getElementById('teamTab')
            .classList.add('active-tab');

        document.getElementById('teamForm')
            ?.classList.remove('hidden');

        document.getElementById('soloForm')
            ?.classList.add('hidden');
    }
}
