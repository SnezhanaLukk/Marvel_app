import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const { loading, request, error, clearError } = useHttp();

    const _apiBase = 'https://marvel-server-zeta.vercel.app/';
    const _apiKey = 'apikey=d4eecb0c66dedbfae4eab45d312fc1df';

    const getAllCharacters = async (offset = 0, limit = 9, signal = null) => {
        const res = await request(
            `${_apiBase}characters?${_apiKey}&offset=${offset}&limit=${limit}`,
            'GET',
            null,
            {}, // Пустые заголовки
            signal
        );
        if (!res?.data?.results) throw new Error('Invalid API response');
        return res.data.results.map(_transformCharacter);
    };

    const getCharacter = async (id, signal = null) => {
        const res = await request(
            `${_apiBase}characters/${id}?${_apiKey}`,
            'GET',
            null,
            {}, // Пустые заголовки
            signal
        );
        return _transformCharacter(res.data.results[0]);
    };

    const _transformCharacter = (char) => ({
        id: char.id,
        name: char.name,
        description: char.description || "No description",
        thumbnail: `${char.thumbnail?.path}.${char.thumbnail?.extension}`,
        homepage: char.urls?.[0]?.url || '#',
        wiki: char.urls?.[1]?.url || '#',
        comics: char.comics?.items || []
    });
    // https://marvel-server-zeta.vercel.app/comics?limit=8&offset=0&apikey=d4eecb0c66dedbfae4eab45d312fc1df
    const getAllComics = async (offset = 0, limit = 8) => {
        const res = await request(`${_apiBase}comics?limit=${limit}&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }
    const _transformComics = (comics) => ({
        id: comics.id,
        title: comics.title,
        description: comics.description || "No description",
        pageCount: comics.pageCount ? `${comics.pageCount} p.` : "No information about the number of pages",
        thumbnail: `${comics.thumbnail?.path}.${comics.thumbnail?.extension}`,
        language: comics.textObjects[0]?.languages || "en-us",
        price: comics.prices[0].price ? `${comics.prices[0].price}$` : "not available",
    })
    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?&${_apiKey}`)
        return _transformComics(res.data.results[0]);
    }
    return { loading, error, getAllCharacters, getCharacter, clearError, getAllComics, getComic };
};

export default useMarvelService;


