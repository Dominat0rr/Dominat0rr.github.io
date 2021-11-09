const jsonFilePath = "../../data/";
const jsonFileName = "projects.json";
const imageFilePath = "../../images/";
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
    // let output = `
    //     <div class="inner">
    //         <h3><i class="fas fa-exclamation-triangle"></i> Note: can take up to 30 seconds until dyno has started.</h3>
    //     </div>`;
    let filteredProjects = [];
    let _projects = projects; // duplicate to work with filtered tags (this has to be resetted everytime tho)

        _projects.forEach((project) => {
            let viewProject = "";
            let viewGithub = "";

            if (project.deployedUrl !== "")
                viewProject = `<li><a href="${project.deployedUrl}" class="button">View project</a></li>`;

            if (project.githubUrl === "private")
                viewGithub = `<li><a href="#" class="button private-button"><i class="far fa-eye-slash"></i> Private</a></li>`;
            else
                viewGithub = `<li><a href="${project.githubUrl}" class="button">View code</a></li>`;

                //<a href="#" class="image"><img src="${imageFilePath}${project.previewImage}" alt="project preview" data-position="center center" /></a>

                output += `
                    <section>
                        <img class="image" src="${imageFilePath}${project.previewImage}" alt="project preview" data-position="center center" />
                            <div class="content">
                                <div class="inner">
                                    <h2>${project.title}</h2>
                                    <p>${project.description}<br><br>Backend: ${project.backend}<br>Frontend: ${project.frontend}<br>Database: ${project.database}</p>
                                    <ul class="actions">
                                        ${viewProject}
                                        ${viewGithub}
                                    </ul>
                                </div>
                            </div>
                    </section>
                `;
        });

    projectsDiv.innerHTML = output;     
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
const intervalTime = 5000;   // interval time in miliseconds
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