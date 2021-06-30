import { mapListToDomElements, createDomElem } from "./domInteractions.js";
import { getShowsByKey } from "./requests.js";

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
        getShowsByKey(this.selectedName).then(shows => this.renderCards(shows));
    }
    
    renderCards = shows => {
        this.viewElems.showsWrapper.innerHTML = "";

        for (const { show } of shows) {
            this.createShowCard(show);
        }
    }

    createShowCard = show => {
        const divCard = createDomElem('div', 'card');
        const divCardBody = createDomElem('div', 'card-body');
        const h5Card = createDomElem('h5', 'card-title', show.name);
        //const pCard = createDomElem('p', 'card-text', show.summary);
        const btnCard = createDomElem('button', 'btn btn-primary', 'Show details');

        let imgCard;
        if (show.image) imgCard = createDomElem('img', 'card-img-top', null, show.image.medium);
        else imgCard = createDomElem('img', 'card-img-top', null, 'https://via.placeholder.com/210x295');

        let pCard;
        if (show.summary) pCard = createDomElem('p', 'card-text', `${show.summary.slice(0, 80)}...`);
        else pCard = createDomElem('p', 'card-text', 'There is no summary fot that show yet.');

        divCard.appendChild(divCardBody);
        divCardBody.appendChild(imgCard);
        divCardBody.appendChild(h5Card);
        divCardBody.appendChild(pCard);
        divCardBody.appendChild(btnCard);

        this.viewElems.showsWrapper.appendChild(divCard);
    }
}

document.addEventListener('DOMContentLoaded', new TvMaze());