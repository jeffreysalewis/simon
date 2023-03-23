function displayPicture() {
    const random = Math.floor(Math.random() * 1000);
    fetch(`https://picsum.photos/v2/list?page=${random}&limit=1`)
        .then((response) => response.json())
        .then((data) => {
            const containerEl = document.querySelector('#picture');
            const width = containerEl.offsetWidth;
            const height = containerEl.offsetHeight;
            const imgUrl = `https://picsum.photos/id/${data[0].id}/${width}/${height}?grayscale`;
        })
}