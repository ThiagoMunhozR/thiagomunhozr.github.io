document.addEventListener('DOMContentLoaded', () => {
    const groupHeaders = document.querySelectorAll('.group-header');

    groupHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const groupName = header.getAttribute('data-group');
            const groupContent = document.getElementById(groupName);

            header.classList.toggle('active');
            if (groupContent.style.display === 'block') {
                groupContent.style.display = 'none';
            } else {
                groupContent.style.display = 'block';
            }
        });
    });
});
