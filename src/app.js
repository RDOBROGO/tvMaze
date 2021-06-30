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
    }

    setCurrentNameFilter = () => {
        this.selectedName = event.target.dataset.showName;
        this.fetchAndDisplayShows();
    }

    fetchAndDisplayShows = () => {
        getShowsByKey(this.selectedName).then(shows => this.renderCardsOnList(shows));
    }
    
    renderCardsOnList = shows => {
        Array.from(document.querySelectorAll('[data-show-id]')).forEach(btn => btn.removeEventListner('click', this.OpenDetailsView));
        this.viewElems.showsWrapper.innerHTML = "";

        for (const { show } of shows) {
            const card = this.createShowCard(show);
            this.viewElems.showsWrapper.appendChild(card);
        }
    }

    OpenDetailsView = event => {
        const { showId } = event.target.dataset;
        getShowsById(showId).then(show => {
            const card = this.createShowCard(show, true);
            this.viewElems.showPreview.appendChild(card);
            this.viewElems.showPreview.style.display = 'block';
        })
    }

    CloseDetailsView = event => {
        const { showId } = event.target.dataset;
        const closeBtn = document.querySelector(`[id="showPreview"] [data-show-id ="${showId}"]`);
        closeBtn.removeEventListener('click', this.CloseDetailsView)
        this.viewElems.showPreview.style.display = 'none';
        this.viewElems.showPreview.innerHTML = '';
    }

    createShowCard = (show, isDetailed) => {
        const divCard = createDomElem('div', 'card');
        const divCardBody = createDomElem('div', 'card-body');
        const h5Card = createDomElem('h5', 'card-title', show.name);
        const btnCard = createDomElem('button', 'btn btn-primary', 'Show details');

        let imgCard;
        if (show.image) {
            if (isDetailed) {
                imgCard = createDomElem('img', 'card-preview-bg');
                imgCard.style.backgroundImage = `url('${show.image.original}')`;
                
            } else {
                imgCard = createDomElem('img', 'card-img-top', null, show.image.medium);
            }
            
        } 
        else imgCard = createDomElem('img', 'card-img-top', null, 'https://via.placeholder.com/210x295');

        let pCard;
        if (show.summary){
            if (isDetailed) {
                pCard = createDomElem('p', 'card-text', show.summary);
            } else {
                pCard = createDomElem('p', 'card-text', `${show.summary.slice(0, 80)}...`);
            }    
        } 
        else pCard = createDomElem('p', 'card-text', 'There is no summary fot that show yet.');

        btnCard.dataset.showId = show.id;

        if (isDetailed) {
            btnCard.addEventListener('click', this.CloseDetailsView);
        } else {
            btnCard.addEventListener('click', this.OpenDetailsView);
        }
        

        divCard.appendChild(divCardBody);
        divCardBody.appendChild(imgCard);
        divCardBody.appendChild(h5Card);
        divCardBody.appendChild(pCard);
        divCardBody.appendChild(btnCard);

        return divCard;
    }
}

document.addEventListener('DOMContentLoaded', new TvMaze());