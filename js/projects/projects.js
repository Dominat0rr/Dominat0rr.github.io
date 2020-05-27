const jsonFilePath = '../../data/';
const jsonFileName = 'projects.json';
const imageFilePath = '../../images/';
const projectsDiv = document.getElementById('projects');
const displayIcon = document.getElementById('display-icon');
const viewGridButton = document.getElementById('btn-grid');
const viewListButton = document.getElementById('btn-list');
let gridView = true;
let projects = [];

onload = () => {
    loadProjects();
};

window.onresize = () => {
    if (window.innerWidth < 770) {
        if (!gridView) {
            loadProjects();
            viewGridButton.parentNode.classList.add('active');
            viewListButton.parentNode.classList.remove('active');
        }
    }
};

viewGridButton.addEventListener('click', () => {
    if (!viewGridButton.parentNode.classList.contains('active')) {
        viewGridButton.parentNode.classList.add('active');
        viewListButton.parentNode.classList.remove('active');
        loadProjects();
    }
});

function loadProjects() {
    let loader = `<div class="loader"></div>`;
    projectsDiv.innerHTML = loader;

    fetch(jsonFilePath + jsonFileName)
    .then((response) => response.json())
    .then((data) => {
        let closeIndex;
        let output = '';
        data = data.reverse();
        data.forEach((project, index) => {
            if (index === 0 || index % 3 === 0) {
                output += '<div class="row row-projects">';
                closeIndex = index + 2;
            }

            let view_project = '';
            let view_github = '';

            if (project.deployedUrl !== '') {
                view_project = `<a href="${project.deployedUrl}" class="card-link btn-project btn btn-dark"><i class="fas fa-laptop-code"></i> View Project</a>`;
            }

            if (project.githubUrl === 'private') {
                view_github = `<p class="card-link btn-github"><i class="far fa-eye-slash"></i> Source private</p>`;
            } else {
                view_github = `<a href="${project.githubUrl}" class="card-link btn-github btn btn-dark"><i class="fas fa-code"></i> View Code</a>`;
            }

            output += `
                <div id="grid-view" class="col-md-4" data="${project.id}">
                    <div class="card card-grid" style="width: 100%;">
                        <img class="card-img" src="${imageFilePath}${project.previewImage}" alt="project preview">
                        <div class="card-body">
                        <h5 class="card-title">${project.title}</h5>
                        <p class="card-text">${project.description}<br><br>Backend: ${project.backend}<br>Frontend: ${project.frontend}<br>Database: ${project.database}</p>
                        </div>
                        ${view_project}
                        ${view_github}
                    </div>
                </div>
            `;

            if (index === closeIndex) {
                output += '</div>';
            }

            projects.push(project);
        });
        projectsDiv.innerHTML = output;
        gridView = true;
        imageGallery();
    })
    .catch(error => console.error(error));
}

viewListButton.addEventListener('click', (e) => {
    if (!viewListButton.parentNode.classList.contains('active')) {
        viewListButton.parentNode.classList.add('active');
        viewGridButton.parentNode.classList.remove('active');
        projectsDiv.innerHTML = '';

        if (gridView) {
            let loader = `<div class="loader"></div>`;
            projectsDiv.innerHTML = loader;
            fetch(jsonFilePath + jsonFileName)
            .then((response) => response.json())
            .then((data) => {
                let output = '';
                data = data.reverse();
                data.forEach((project) => {

                    let view_project = '';
                    let view_github = '';

                    if (project.deployedUrl !== '') {
                        view_project = `<a href="${project.deployedUrl}" class="card-link btn-project btn btn-dark"><i class="fas fa-laptop-code"></i> View Project</a>`;
                    }

                    if (project.githubUrl === 'private') {
                        view_github = `<p class="card-link btn-github"><i class="far fa-eye-slash"></i> Source private</p>`;
                    } else {
                        view_github = `<a href="${project.githubUrl}" class="card-link btn-github btn btn-dark"><i class="fas fa-code"></i> View Code</a>`;
                    }

                    output += `
                        <div class="card card-single mb-3" data="${project.id}">
                            <div class="row">
                                <div class="col-md-6">
                                    <img class="card-img" src="${imageFilePath}${project.previewImage}" alt="project preview">
                                </div>
                                <div class="col-md-6">
                                    <div class="card-body">
                                        <h5 class="card-title">${project.title}</h5>
                                        <p class="card-text">${project.description}<br>Backend: ${project.backend}<br>Frontend: ${project.frontend}<br>Database: ${project.database}</p>
                                            ${view_project}
                                            ${view_github}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;

                    projects.push(project);
                });
                projectsDiv.innerHTML = output;
                gridView = false;
                imageGallery();
            })
            .catch(error => console.error(error));
        }
        else {
            loadProjects();
        }
    }
});


/* image gallery */
const lightbox = document.createElement("div");
lightbox.id = "lightbox";
document.body.appendChild(lightbox);

const buttonPrev = document.createElement("button");
buttonPrev.id = "btn-prev";
buttonPrev.innerHTML = "<i class='fas fa-arrow-left'></i>";

const buttonNext = document.createElement("button");
buttonNext.id = "btn-next";
buttonNext.innerHTML = "<i class='fas fa-arrow-right'></i>";

const buttonClose = document.createElement("button");
buttonClose.id = "btn-close";
buttonClose.innerHTML = "<i class='fas fa-times'></i>";


let images = [];
let imageIndex = 0;
let cardImages;
let amount = 0;

function imageGallery() {

    let cardImages = document.querySelectorAll(".card-img");

    console.log(cardImages);
    projects.reverse();
    console.log(projects);

    cardImages.forEach(image => {
        image.addEventListener('click', (e) => {
            images = [];
            
            let id = image.parentElement.parentElement.getAttribute('data');

            if (id == null) {
                id = image.parentElement.parentElement.parentElement.getAttribute('data');
            }

            const imageGalleryPath = imageFilePath + id;
            amount = projects[id - 1].amountOfPictures;

            if (amount <= 0 || amount == null) return;

            for (let i = 0; i < amount; i++) {
                console.log(imageGalleryPath + "/" + id  + "_" + (i + 1) + ".png");
                images.push(imageGalleryPath + "/" + id + "_" + (i + 1) + ".png");
            }

            console.log(imageGalleryPath);
            console.log(images);
            lightbox.classList.add('active');
            let img = document.createElement('img');
            img.src = images[0];

            /* Remove old images in the lightbox */
            while (lightbox.firstChild) {
                lightbox.removeChild(lightbox.firstChild);
            }

            lightbox.appendChild(img);
            lightbox.insertBefore(buttonClose, img);

            if (amount > 1) {
                lightbox.insertBefore(buttonPrev, img);
                lightbox.appendChild(buttonNext);
            }            
        });
    });
}

function loadNextPicture() {
    if (amount <= 1) return;
    imageIndex++;

    if (imageIndex > amount - 1) {
        imageIndex = 0;
    }

    while (lightbox.firstChild) {
        lightbox.removeChild(lightbox.firstChild);
    }

    lightbox.classList.add('active');
    let img = document.createElement('img');
    console.log(imageIndex);
    img.src = images[imageIndex];

    img.onload = () => {
        lightbox.appendChild(buttonPrev);
        lightbox.appendChild(img);
        lightbox.appendChild(buttonNext);
        lightbox.insertBefore(buttonClose, img);
    }
}

function loadPreviousPicture() {
    if (amount <= 1) return;
    imageIndex--;

    if (imageIndex < 0) {
        imageIndex = amount - 1;
    }

    while (lightbox.firstChild) {
        lightbox.removeChild(lightbox.firstChild);
    }

    lightbox.classList.add('active');
    let img = document.createElement('img');
    console.log(imageIndex);
    img.src = images[imageIndex];

    img.onload = () => {
        lightbox.appendChild(buttonPrev);
        lightbox.appendChild(img);
        lightbox.appendChild(buttonNext);
        lightbox.insertBefore(buttonClose, img);
    }
}

lightbox.addEventListener('click', e => {
    if (e.target !== e.currentTarget) return;
    lightbox.classList.remove('active');
    imageIndex = 0;
});

document.addEventListener('keydown', e => {
    if (e.keyCode != '27') return;
    lightbox.classList.remove('active');
    imageIndex = 0;
});

document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains("active")) return;
    if (images.length <= 0) return;
    if (e.keyCode != '37' && e.keyCode != '39') return;
    else if (e.keyCode == '39') loadNextPicture();
    else if (e.keyCode == '37') loadPreviousPicture();
});

buttonNext.addEventListener('click' , e => {
    loadNextPicture();
});

buttonPrev.addEventListener('click', e => {
    loadPreviousPicture();
});

buttonClose.addEventListener('click', e => {
    lightbox.classList.remove('active');
    imageIndex = 0;
})