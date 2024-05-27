document.addEventListener("DOMContentLoaded", function() {
    const buttons = document.querySelectorAll('.btn, .discord-btn');
    const container = document.querySelector('.container');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            button.classList.add('btn-clicked');
            setTimeout(() => {
                button.classList.remove('btn-clicked');
            }, 300);
        });
    });

    container.classList.add('fade-in');
});
