const jsonFilePath = "../../data/";
const jsonFileName = "projects.json";
const imageFilePath = "../../images/";
// const tags = ["Java", "Spring", "Hibernate", "Thymeleaf", "FreeMarker", "PHP", "Symfony", "Laravel", "Blade", "Twig", "Node.js", "React.js", "MERN", "MongoDB", "MySQL", "GraphQL"];
const tags = ["Java", "Spring", "Hibernate", "PHP", "Symfony", "Laravel", "Node.js", "React.js", "MERN", "MongoDB", "MySQL", "GraphQL"];
const projectsDiv = document.getElementById("projects");
const projectsFilterDiv = document.getElementById("projects-tags-filter");
const viewGridButton = document.getElementById("btn-grid");
const viewListButton = document.getElementById("btn-list");
const filterButton = document.getElementById("filter-btn");
let gridView = false;
let projects = [];
let selectedTags = new Set();


/* Load projects */
onload = () => {
    loadProjects();
};

window.onresize = () => {    
    if (viewListButton.parentNode.classList.contains("active")) {
        loadProjectsDiv(true, false);
    }
};

viewGridButton.addEventListener('click', () => {
    if (!viewGridButton.parentNode.classList.contains("active")) {
        viewGridButton.parentNode.classList.add("active");
        viewListButton.parentNode.classList.remove("active");
        loadProjectsDiv();
    }
});

function loadProjects() {
    fetch(jsonFilePath + jsonFileName)
    .then((response) => response.json())
    .then((data) => {
        data = data.reverse();
        data.forEach((project) => {
            projects.push(project);
        })
        loadProjectsDiv();
    })
    .catch(error => console.error(error));
}

function loadProjectsDiv(grid = true, filter = false) {
    let loader = `<div class="loader"></div>`;
    projectsDiv.innerHTML = loader;
    let closeIndex;
    let output = '';
    let filteredProjects = [];
    let _projects = projects; // duplicate to work with filtered tags (this has to be resetted everytime tho)

    // Ignore state fix for filter selection
    if (filter) {
        gridView = !gridView;
    }

    // Make a new array of projects regarding on matching tags that are selected
    if (selectedTags.size > 0) {
        projects.forEach(project => {
            projectTags = project.tags.split(" ");
            if (containsArrayObj(selectedTags, projectTags)) {
                filteredProjects.push(project);
            }
        })
        _projects = filteredProjects;
    }

    if (grid || (viewGridButton.parentNode.classList == "" && window.innerWidth >= 770)) {
        _projects.forEach((project, index) => {
            let view_project = "";
            let view_github = "";

            if (project.deployedUrl !== "") {
                view_project = `<a href="${project.deployedUrl}" class="card-link btn-project btn btn-dark"><i class="fas fa-laptop-code"></i> View Project</a>`;
            }

            if (project.githubUrl === "private") {
                view_github = `<p class="card-link btn-github"><i class="far fa-eye-slash"></i> Source private</p>`;
            } else {
                view_github = `<a href="${project.githubUrl}" class="card-link btn-github btn btn-dark"><i class="fas fa-code"></i> View Code</a>`;
            }

            if (grid) {  
                projectsDiv.style.gridTemplateColumns = "1fr 1fr 1fr";  
                output += `
                    <div id="grid-view" data="${project.id}">
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
            }
            else {
                projectsDiv.style.gridTemplateColumns = "1fr";
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
            }
        });

        projectsDiv.innerHTML = output;
        if (grid) {    
                gridView = true;
                viewGridButton.parentNode.classList.add("active");
                viewListButton.parentNode.classList.remove("active");
        } 
        else {
            gridView = false;
        }
        imageGallery();
    }        
}

viewListButton.addEventListener('click', (e) => {
    if (!viewListButton.parentNode.classList.contains("active") && window.innerWidth > 1050) {
        viewListButton.parentNode.classList.add("active");
        viewGridButton.parentNode.classList.remove("active");
        projectsDiv.innerHTML = '';

        loadProjectsDiv(false, false);
    }
});


/* Filter on tags */
filterButton.addEventListener('click',(e) => {
    if (e.target.tagName === "A") filterButton.classList.toggle("active");
    if (e.target.tagName === "A" && filterButton.classList.contains("active")) {
        loadFilterTags();
    }
    else if (e.target.tagName === "A" && !filterButton.classList.contains("active")) {
        removeFilterTags();
    }

    if (e.target.tagName === "INPUT") {
        if (selectedTags.has(e.target.value)) {
            selectedTags.delete(e.target.value);
        } else {
            selectedTags.add(e.target.value);
        }
        loadProjectsDiv(true);
    }
});

function loadFilterTags() {
    let output = `<div id='tags' class='tags'>
                    <div class='row'>`;
    tags.forEach(tag => {
        let checked = "";
        if (selectedTags.size > 0) checked = (selectedTags.has(tag)) ? "checked": "";
        output += `
            <div class='col-sm-2'>
                <input type='checkbox' name='tag' value='${tag}' ${checked}><label>${tag}</label>
            </div>
        `;
    });
    output += `</div>
            </div>`;
    projectsFilterDiv.innerHTML = output;
}

function removeFilterTags() {
    projectsFilterDiv.innerHTML = "";
}


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

let auto = false;            // true is auto image sliding
const intervalTime = 5000;  // interval time in miliseconds
let slideInterval;
let images = [];
let imageIndex = 0;
let cardImages;
let amount = 0;

function imageGallery() {

    let cardImages = document.querySelectorAll(".card-img");

    cardImages.forEach(image => {
        image.addEventListener('click', (e) => {
            display = true;
            images = [];
            
            let id = image.parentElement.parentElement.getAttribute('data');

            if (id == null) {
                id = image.parentElement.parentElement.parentElement.getAttribute('data');
            }

            const imageGalleryPath = imageFilePath + id;
            amount = projects[projects.length - id].amountOfPictures;

            if (amount <= 0 || amount == null) return;

            for (let i = 0; i < amount; i++) {
                images.push(imageGalleryPath + "/" + id + "_" + (i + 1) + ".png");
            }

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

                if (auto) {
                    clearInterval(slideInterval);
                    slideInterval = setInterval(function () { loadNextPicture(); }, intervalTime);
                }
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
    clearInterval(slideInterval);
});

document.addEventListener('keydown', e => {
    if (e.keyCode != '27') return;
    lightbox.classList.remove('active');
    imageIndex = 0;
    clearInterval(slideInterval);
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
    clearInterval(slideInterval);
})

//eventListener for mobile (swiping) => android tested
document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

let xDown = null;                                                        
let yDown = null;

function getTouches(evt) {
    return evt.touches ||             // browser API
           evt.originalEvent.touches; // jQuery
  }                                                     
  

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) return;

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
        if ( xDiff > 0 ) {
            loadPreviousPicture();
        } else {
            loadNextPicture();
        }                       
    } 
    // else {
    //     lightbox.classList.remove('active');
    //     imageIndex = 0;
    //     clearInterval(slideInterval);                                                          
    // }
    xDown = null;
    yDown = null;                                             
};


/* Functions / Helpers */
function containsArrayObj(set, array) {
    let value = false;
    
    if (set.size === 0 && array.length === 0) {
        value = true;
    }
    
    array.forEach(arrayObj => {
        set.forEach(setObj => {
            if (setObj.toLowerCase() == arrayObj.toLowerCase()) {
                value = true;
            }
        });
    });

    return value;
}