import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import AppBanner from '../appBanner/AppBanner';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';
// import uw from '../../resources/img/UW.png';
// import xMen from '../../resources/img/x-men.png';


const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [newItemsLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const loadMoreLimit = 4;

    const { loading, error, getAllComics } = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        const limit = initial ? 8 : 4;
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset, limit)
            .then(onComicsListLoaded)
    }

    const onComicsListLoaded = (newComicsList) => {
        const limit = comicsList.length === 0 ? 8 : 4;
        let ended = false;
        if (newComicsList.length < loadMoreLimit) {
            ended = true;
        }
        setComicsList(comicsList => [...comicsList, ...newComicsList]);
        setNewItemLoading(false);
        setOffset(offset => offset + limit);
        setComicsEnded(comicsEnded => ended);
    }

    function renderItems(arr) {
        const items = arr.map((item) => {
            return (
                <li
                    className="comics__item"
                    key={item.id}
                    tabIndex={0}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img" />
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        })
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }
    const items = renderItems(comicsList);
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading && !newItemsLoading ? <Spinner /> : null;

    return (
        <div className="comics__list">
            <AppBanner />
            {errorMessage}
            {spinner}
            {items}
            <button
                className="button button__main button__long"
                disabled={newItemsLoading}
                style={{ 'display': comicsEnded ? 'none' : 'block' }}
                onClick={() => onRequest(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;