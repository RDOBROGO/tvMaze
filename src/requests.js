export const getShowsByKey = key => {
return fetch(`http://api.tvmaze.com/singlesearch/shows?q=${key}`).then(resp => resp.json());
}

export const getShowsById = id => {
    return fetch(`http://api.tvmaze.com/shows/${id}?embed=cast`).then(resp => resp.json());
    }


