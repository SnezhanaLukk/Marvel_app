import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

class CharList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            charList: [],
            loading: true,
            error: false,
            offset: 0,
            initialLimit: 9,
            loadMoreLimit: 3,
            newItemsLoading: false,
            charEnded: false
        }
        this.marvelService = new MarvelService();
        this.abortController = new AbortController();
    }

    componentDidMount() {
        this.onCharListLoaded();
    }

    componentWillUnmount() {
        this.abortRequests();
    }
    abortRequests = () => {
        this.abortController.abort();
        this.abortController = new AbortController();
    }

    onCharListLoaded = () => {
        const { initialLimit } = this.state;
        this.setState({ loading: true });

        this.marvelService.getAllCharacters(0, initialLimit, this.abortController.signal)
            .then(newChars => {
                this.setState({
                    charList: newChars,
                    loading: false,
                    offset: initialLimit,
                    charEnded: newChars.length < initialLimit
                });
            })
            .catch(this.onError);
    }


    loadMoreCharacters = () => {
        const { offset, loadMoreLimit } = this.state;
        this.setState({ newItemsLoading: true });
        this.marvelService.getAllCharacters(offset, loadMoreLimit, this.abortController.signal)
            .then(newChars => {
                this.setState(({ charList }) => ({
                    charList: [...charList, ...newChars],
                    newItemsLoading: false,
                    offset: offset + loadMoreLimit,
                    charEnded: newChars.length < loadMoreLimit
                }));
            })
            .catch(this.onError);
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true,
            newItemsLoading: false
        });
    }

    renderItems(arr) {
        const { onCharSelected } = this.props;

        return (
            <ul className="char__grid" key='23456098'>
                {arr.map(item => (
                    <li className="char__item "
                        key={item.id}
                        onClick={() => onCharSelected(item.id)}>
                        <img src={item.thumbnail} alt={item.name} style={{ 'objectFit': 'cover' }} />
                        <div className="char__name">{item.name}</div>
                    </li>
                ))}
            </ul>
        )
    }

    render() {
        const { charList, loading, error, newItemsLoading, charEnded } = this.state;
        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long"
                    onClick={this.loadMoreCharacters}
                    disabled={newItemsLoading || charEnded}
                    style={{ display: charEnded || loading ? 'none' : 'block' }}>
                    <div className="inner">{newItemsLoading ? 'Loading...' : 'Load more'}</div>
                </button>
            </div>
        )
    }
}

export default CharList;