import React, { useState, useEffect, useRef, useMemo } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

import PropTypes from "prop-types";

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [offset, setOffset] = useState(0);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [charEnded, setCharEnded] = useState(false);
    const initialLimit = 9;
    const loadMoreLimit = 3;
    const itemRefs = useRef([]);

    const marvelService = useMemo(() => new MarvelService(), []);
    const abortControllerRef = useRef(new AbortController());

    useEffect(() => {
        // Выносим логику прямо в эффект чтоб убрать ошибку Line 27:8:  React Hook useEffect has a missing dependency: 'onCharListLoaded'. 
        const controller = new AbortController();
        abortControllerRef.current = controller;
        let isMounted = true;

        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const newChars = await marvelService.getAllCharacters(
                    0,
                    initialLimit,
                    controller.signal
                );
                if (isMounted) {
                    setCharList(newChars);
                    setOffset(initialLimit);
                    setCharEnded(newChars.length < initialLimit);
                    setLoading(false);
                }
            } catch {
                if (isMounted) onError();
            }
        };

        fetchInitialData();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [marvelService]); // Только стабильные зависимости

    // useEffect(() => {
    //     return () => {
    //         abortRequests();
    //     }
    // })

    // const abortRequests = () => {
    //     abortController.abort();
    //     // abortController = new AbortController();
    // }

    // const onCharListLoaded = () => {
    //     const controller = new AbortController();
    //     abortControllerRef.current = controller;
    //     let isMounted = true;
    //     setLoading(true);
    //     marvelService.getAllCharacters(0, initialLimit, controller.signal)
    //         .then(newChars => {
    //             if (isMounted) {
    //                 setCharList(newChars);
    //                 setOffset(initialLimit);
    //                 setCharEnded(newChars.length < initialLimit);
    //                 setLoading(false);
    //             }
    //         })
    //         .catch(() => isMounted && onError());
    // };


    const loadMoreCharacters = () => {
        const controller = new AbortController();
        abortControllerRef.current = controller;
        let isMounted = true;
        setNewItemsLoading(true);
        marvelService.getAllCharacters(offset, loadMoreLimit, controller.signal)
            .then(newChars => {
                if (isMounted) {
                    setCharList(prev => [...prev, ...newChars]);
                    setOffset(prev => prev + loadMoreLimit);
                    setCharEnded(newChars.length < loadMoreLimit);
                    setNewItemsLoading(false);
                }
            })
            .catch(() => isMounted && onError());
    };

    const onError = () => {
        setLoading(false);
        setError(true);
        setNewItemsLoading(false);
    };



    const focusOnItem = (index) => {
        itemRefs.current.forEach(item =>
            item?.classList.remove('char__item_selected')
        );
        const item = itemRefs.current[index];
        if (item) {
            item.classList.add('char__item_selected');
            item.focus();
        }
    };

    function renderItems(arr) {
        return (
            <ul className="char__grid">
                {arr.map((item, i) => (
                    <li
                        className="char__item "
                        key={item.id}
                        ref={el => itemRefs.current[i] = el}
                        onClick={() => {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === ' ' || e.key === 'Enter') {
                                e.preventDefault();
                                props.onCharSelected(item.id);
                                focusOnItem(item.id - 1);
                            }
                        }}
                        tabIndex={0}
                    >
                        <img
                            src={item.thumbnail}
                            alt={item.name}
                            style={{ 'objectFit': 'cover' }}
                        />
                        <div className="char__name">{item.name}</div>
                    </li>
                ))}
            </ul>
        )
    }


    const items = renderItems(charList);
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? items : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button
                className="button button__main button__long"
                onClick={loadMoreCharacters}
                disabled={newItemsLoading || charEnded}
                style={{ display: charEnded || loading ? 'none' : 'block' }}
            >
                <div className="inner">
                    {newItemsLoading ? 'Loading...' : 'Load more'}
                </div>
            </button>
        </div>
    )

}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;