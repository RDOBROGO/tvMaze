import { mapListToDomElements, createDomElem } from "./domInteractions.js";
import { getShowsByKey, getShowsById } from "./requests.js";

class TvMaze {
    constructor() {
        this.viewElems = {};
        this.showNameButtons = {};
        this.selectedName = "harry";
        this.initializeApp();
    }

    initializeApp = () => {
        this.connectDOMElements();
        this.setupListeners();
        this.fetchAndDisplayShows();
    }

    connectDOMElements = () => {
        const listOfIds = Array.from(document.querySelectorAll('[id]')).map(elem => elem.id);
        const listOfShowNames = Array.from(document.querySelectorAll('[data-show-name]')).map(elem => elem.dataset.showName);
        
        this.viewElems = mapListToDomElements(listOfIds, 'id');
        this.showNameButtons = mapListToDomElements(listOfShowNames, 'data-show-name');
    }

    setupListeners = () => {
        Object.keys(this.showNameButtons).forEach(showName => {
            this.showNameButtons[showName].addEventListener('click', this.setCurrentNameFilter);
        })
        this.viewElems["movieTitleButton"].addEventListener('click', () => {
            this.selectedName = this.viewElems["movieTitle"].value;
            this.viewElems["movieTitle"].value = '';
            this.fetchAndDisplayShows();
        })
    }

    setCurrentNameFilter = event => {
        this.selectedName = event.target.dataset.showName;
        this.fetchAndDisplayShows();
    }

    fetchAndDisplayShows = () => {
        getShowsByKey(this.selectedName).then(shows => this.renderCardsOnList(shows));
    }
    
    renderCardsOnList = shows => {
        if (shows.length === 0) {
            this.viewElems.SearchError.style.display = "block";
            this.viewElems.showsWrapper.innerText = "";
        } else {
            this.viewElems.SearchError.style.display = "none";

            const showButtons = document.querySelectorAll('[data-show-id]');

            for (let button of showButtons) button.removeEventListener('click', this.OpenDetailsView);
            //Array.from(document.querySelectorAll('[data-show-id]')).forEach(btn => btn.removeEventListner('click', this.OpenDetailsView));
            this.viewElems.showsWrapper.innerHTML = "";
                for (const { show } of shows) {
                    const card = this.createShowCard(show);
                    this.viewElems.showsWrapper.appendChild(card);
                }
            } 
    }

    OpenDetailsView = event => {
        document.body.style.overflow = 'hidden';
        const { showId } = event.target.dataset;
        getShowsById(showId).then(show => {
            const card = this.createShowCard(show, true);
            this.viewElems.showPreview.appendChild(card);
            this.viewElems.showPreview.style.display = 'block';
        })
    }

    CloseDetailsView = event => {
        document.body.style.overflow = 'scroll';
        const { showId } = event.target.dataset;
        const closeBtn = document.querySelectorAll(`[id="showPreview"] [data-show-id ="${showId}"]`);

        for (let button of closeBtn) button.removeEventListener('click', this.CloseDetailsView);
        
        this.viewElems.showPreview.style.display = 'none';
        this.viewElems.showPreview.innerHTML = '';
    }

    createShowCard = (show, isDetailed) => {
        const divCard = createDomElem('div', 'card');
        const divCardBody = createDomElem('div', 'card-body');
        const h5Card = createDomElem('h5', 'card-title', show.name);
        let btnCard = createDomElem('button', 'btn btn-primary', 'Show details');
        const btnCardX = createDomElem('button', 'btn btn-x');
        const XIcon = createDomElem('i', 'bi bi-x-circle');

        btnCardX.appendChild(XIcon);

        let imgCard;
        let pCard;
        

        if (show.image) {
            if (isDetailed) {
                imgCard = createDomElem('img', 'card-preview-bg');
                imgCard.style.backgroundImage = `url('${show.image.original}')`;
                
            } else {
                imgCard = createDomElem('img', 'card-img-top', null, show.image.medium);
            }
            
        } 
        else imgCard = createDomElem('img', 'card-img-top', null, 'https://via.placeholder.com/210x295');

        
        if (show.summary){

            const text = show.summary;
            text.replace('<', "");

            console.log(text);
            if (isDetailed) {
                pCard = createDomElem('p', 'card-text', show.summary);
            } else {
                pCard = createDomElem('p', 'card-text', `${show.summary.slice(0, 80)}...`);
            }    
        } 
        else pCard = createDomElem('p', 'card-text', 'There is no summary fot that show yet.');

        btnCard.dataset.showId = show.id;
        btnCardX.dataset.showId = show.id;

        if (isDetailed) {
            divCardBody.appendChild(btnCardX);
            btnCard.innerText = 'Close details';
            btnCardX.addEventListener('click', this.CloseDetailsView);
            btnCard.addEventListener('click', this.CloseDetailsView);
        } else {
            btnCard.addEventListener('click', this.OpenDetailsView);
        }
        
        ;
        divCard.appendChild(divCardBody);
        divCardBody.appendChild(imgCard);
        divCardBody.appendChild(h5Card);
        divCardBody.appendChild(pCard);
        divCardBody.appendChild(btnCard);

        return divCard;
    }
}

document.addEventListener('DOMContentLoaded', new TvMaze());