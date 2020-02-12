const jsonFilePath = '../../data/';
const jsonFileName = 'projects.json';
const imageFilePath = '../../images/';
const projectsDiv = document.getElementById('projects');
const displayIcon = document.getElementById('display-icon');
const viewButton = document.getElementById('view-btn');
let gridView = true;
const topButton = document.getElementById("scroll-top-btn");

onload = () => {
    loadProjects();
};

window.onresize = () => {
    if (window.innerWidth < 770) {
        if (!gridView) {
            loadProjects();
        }
        hideViewButton(true);
    } else {
        hideViewButton(false);
    }
};

window.onscroll = () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        topButton.style.display = "block";
      } else {
        topButton.style.display = "none";
      }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function hideViewButton(hide) {
    if (hide) {
        viewButton.style.display = "none";
    } else {
        viewButton.style.display = "block";
    }
}

function loadProjects() {
    let loader = `<div class="loader"></div>`;
    projectsDiv.innerHTML = loader;
    //document.body.style.backgroundImage = 'none';

    fetch(jsonFilePath + jsonFileName)
    .then((response) => response.json())
    .then((data) => {
        let closeIndex;
        let output = '';
        data.forEach((project, index) => {
            if (index === 0 || index % 3 === 0) {
                output += '<div class="row row-projects">';
                closeIndex = index + 2;
            }

            let view_project = '';
            let view_github = '';
            if (project.deployedUrl !== '') {
                view_project = `<a href="${project.deployedUrl}" class="card-link btn btn-dark"><i class="fas fa-laptop-code"></i> View Project</a>`;
            }
            if (project.githubUrl === 'private') {
                view_github = `<p class="card-link"><i class="far fa-eye-slash"></i> Source private</p>`;
            } else {
                view_github = `<a href="${project.githubUrl}" class="card-link btn btn-dark"><i class="fas fa-code"></i> View Code</a>`;
            }

            output += `
                <div id="grid-view" class="col-md-4" data="${project.id}">
                    <div class="card card-grid" style="width: 100%;">
                        <img class="card-img-top" src="${imageFilePath}${project.previewImageSmall}" alt="project preview">
                        <div class="card-body">
                        <h5 class="card-title">${project.title}</h5>
                        <p class="card-text">${project.description}<br>Backend: ${project.backend}<br>Database: ${project.database}<br>Frontend: ${project.frontend}</p>
                        </div>
                        ${view_project}
                        ${view_github}
                    </div>
                </div>
            `;

            if (index === closeIndex) {
                output += '</div>';
            }
        });
        projectsDiv.innerHTML = output;
        gridView = true;
        changeButton();
    })
    .catch(error => console.log(error));
}

const viewbutton = document.getElementById('view-btn');
viewbutton.addEventListener('click', (e) => {
    projectsDiv.innerHTML = '';

    if (gridView) {
        let loader = `<div class="loader"></div>`;
        projectsDiv.innerHTML = loader;
        fetch(jsonFilePath + jsonFileName)
        .then((response) => response.json())
        .then((data) => {
            let closeIndex;
            let output = '';
            data.forEach((project) => {

                let view_project = '';
                let view_github = '';
                if (project.deployedUrl !== '') {
                    view_project = `<a href="${project.deployedUrl}" class="card-link btn btn-dark"><i class="fas fa-laptop-code"></i> View Project</a>`;
                }
                if (project.githubUrl === 'private') {
                    view_github = `<p class="card-link"><i class="far fa-eye-slash"></i> Source private</p>`;
                } else {
                    view_github = `<a href="${project.githubUrl}" class="card-link btn btn-dark"><i class="fas fa-code"></i> View Code</a>`;
                }

                output += `
                    <div class="card card-single mb-3" data="${project.id}">
                    <img class="card-img-top img-card" src="${imageFilePath}${project.previewImage}" alt="project preview">
                        <div class="card-body">
                        <h5 class="card-title">${project.title}</h5>
                        <p class="card-text">${project.description}<br>Backend: ${project.backend}<br>Database: ${project.database}<br>Frontend: ${project.frontend}</p>
                            ${view_project}
                            ${view_github}
                        </div>
                    </div>
                `;
            });
            projectsDiv.innerHTML = output;
            gridView = false;
            changeButton();
        })
        .catch(error => console.log(error));
    }
    else {
        loadProjects();
    }
});

function changeButton() {
    if (!gridView) {
        displayIcon.className = "fas fa-grip-horizontal";
    } else {
        displayIcon.className = "fas fa-grip-lines";
    }
}