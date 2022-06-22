const imageFilePath = "../../images/";
const projectsDiv = document.getElementById("projects");
const projectsInProgressDiv = document.getElementById("projectsInProgress");
let projects = [];
let projectsInProgress = [];


/* Load projects */
onload = () => {
    loadProjects();
    loadProjectsInProgress();
};


function loadProjects() {
    let jsonFilePath = "../../data/";
    let jsonFileName = "projects.json";

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


function loadProjectsInProgress() {
    let jsonFilePath = "../../data/";
    let jsonFileName = "projectsInProgress.json";

    fetch(jsonFilePath + jsonFileName)
    .then((response) => response.json())
    .then((data) => {
        data.forEach((project) => {
            projectsInProgress.push(project);
        })
        loadProjectsInProgressDiv();
    })
    .catch(error => console.error(error));
}


function loadProjectsDiv() {
    let loader = `<div class="loader"></div>`;
    projectsDiv.innerHTML = loader;
    let output = '';

        projects.forEach((project) => {
            let viewProject = "";
            let viewGithub = "";

            if (project.deployedUrl === "Request")
                viewProject = `<li><a href="#" class="button private-button"><i class="fa-solid fa-code-pull-request"></i> Ask for Demo</a></li>`;
            else if (project.deployedUrl !== "")
                viewProject = `<li><a href="${project.deployedUrl}" class="button">View project</a></li>`;

            if (project.githubUrl === "private")
                viewGithub = `<li><a href="#" class="button private-button"><i class="far fa-eye-slash"></i> Private</a></li>`;
            else
                viewGithub = `<li><a href="${project.githubUrl}" class="button">View code</a></li>`;

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


function loadProjectsInProgressDiv() {
    let loader = `<div class="loader"></div>`;
    projectsInProgressDiv.innerHTML = loader;
    let output = `<div class="inner">
					<h2>Work in progress</h2>
                        <div class="features">
                `;
    
    projectsInProgress.forEach((project) => {
        let viewGithub = "";

        if (project.githubUrl === "private")
            viewGithub = `<li><a href="#" class="button private-button"><i class="far fa-eye-slash"></i> Private</a></li>`;
        else if (project.githubUrl === "non")
            viewGithub = "";
        else
            viewGithub = `<li><a href="${project.githubUrl}" class="button">View code</a></li>`;

            output += `
                <section>
					<div class="content">
						<div class="inner">
                            <h3>${project.title}</h3>
                            <p>${project.description}<br><br>Backend: ${project.backend}<br>Frontend: ${project.frontend}<br>Database: ${project.database}</p>
                            <ul class="actions">${viewGithub}</ul>
						</div>
					</div>
				</section>
            `;
    });

    output += `
            </div>
        </div>
        `;

    projectsInProgressDiv.innerHTML = output; 
}