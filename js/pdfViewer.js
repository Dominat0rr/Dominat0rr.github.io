// Location of pdf view
const url = '../pdf/CV.pdf';

let pdfDoc = null;
let pageNum = 1;
let pageIsRendering = false;
let pageNumIsPending = null;

const scale = 1.5;
const canvas = document.querySelector('#pdf-render');
const context = canvas.getContext('2d');


// Render the page
const renderPage = (num) => {
    pageIsRendering = true;
    
    // Get page
    pdfDoc.getPage(num)
        .then(page => {
            // console.log(page);
            // Set scale
            const viewport = page.getViewport( { scale } );
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport
            }

            page.render(renderContext)
                .promise
                .then(() => {
                    pageIsRendering = false;

                    if (pageNumIsPending !== null) {
                        renderPage(pageNumIsPending);
                        pageNumIsPending = null;
                    }
                });

            // Output current page
            document.querySelector('#page-num').textContent = num;
        });
}

// Check for pages rendering
const queueRenderPage = (num) => {
    if (pageIsRendering) {
        pageNumIsPending = num;
    }
    else {
        renderPage(num);
    }
};

// Show Previous Page
const showPrevPage = () => {
    if (pageNum <= 1) {
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
};

// Show Next Page
const showNextPage = () => {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
};

// Get Document
pdfjsLib.getDocument(url)
    .promise
    .then((pdfDocA) => {
        pdfDoc = pdfDocA;
        // console.log(pdfDoc);
        document.querySelector('#page-count').textContent = pdfDoc.numPages;
        renderPage(pageNum);
    })
    .catch((error) => {
        // Display error
        const div = document.createElement('div');
        div.className = 'error';
        div.appendChild(document.createTextNode(error.message));
        document.querySelector('body').insertBefore(div, canvas);
        // Remove top bar
        document.querySelector('.top-bar').style.display = 'none';
    });

// Button events
document.querySelector('#prev-page').addEventListener('click', showPrevPage);
document.querySelector('#next-page').addEventListener('click', showNextPage);