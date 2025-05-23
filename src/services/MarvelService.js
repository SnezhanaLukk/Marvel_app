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
        description: char.description || "Нет описания",
        thumbnail: `${char.thumbnail?.path}.${char.thumbnail?.extension}`,
        homepage: char.urls?.[0]?.url || '#',
        wiki: char.urls?.[1]?.url || '#',
        comics: char.comics?.items || []
    });

    return { loading, error, getAllCharacters, getCharacter, clearError };
};

export default useMarvelService;
// import { useHttp } from "../hooks/http.hook";

// const useMarvelService = () => {

//     const { loading, request, error, clearError } = useHttp();

//     const _apiBase = 'https://marvel-server-zeta.vercel.app/';
//     const _apiKey = 'apikey=d4eecb0c66dedbfae4eab45d312fc1df';

//     const getAllCharacters = async (offset = 0, limit = 9, signal = null) => {
//         const res = await request(`${_apiBase}characters?${_apiKey}&offset=${offset}&limit=${limit}`, signal);
//         if (!res?.data?.results) throw new Error('Invalid API response');
//         return res.data.results.map(_transformCharacter);
//     };
//     const getCharacter = async (id, signal = null) => {
//         const res = await request(`${_apiBase}characters/${id}?${_apiKey}`, { signal });
//         if (!res.data?.results?.length) {
//             throw new Error('Character not found');
//         }
//         return _transformCharacter(res.data.results[0]);
//     };
//     const _transformCharacter = (char) => {
//         return {
//             id: char.id,
//             name: char.name,
//             description: char.description ? `${char.description.slice(0, 210)}...` : "No description for this character",
//             thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
//             homepage: char.urls[0].url,
//             wiki: char.urls[1].url,
//             comics: char.comics.items,
//         }
//     }
//     return { loading, error, getAllCharacters, getCharacter, clearError }
// }
// export default useMarvelService;

// import { useHttp } from "../hooks/http.hook";

// const useMarvelService = () => {
//     const { loading, request, error, clearError } = useHttp();

//     const _apiBase = 'https://marvel-server-zeta.vercel.app/';
//     const _apiKey = 'apikey=d4eecb0c66dedbfae4eab45d312fc1df';

//     const _baseOffset = 0;

//     const getAllCharacters = async (offset = _baseOffset) => {
//         const res = await request(
//             `${_apiBase}characters?${_apiKey}&offset=${offset}&limit=9`
//         );
//         return res.data.results.map(_transformCharacter);
//     };

//     const getCharacter = async (id) => {
//         const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
//         return _transformCharacter(res.data.results[0]);
//     };

//     // const getAllComics = async (offset = 0) => {
//     //     const res = await request(
//     //         `${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`
//     //     );
//     //     return res.data.results.map(_transformComics);
//     // };

//     // const getComics = async (id) => {
//     //     const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
//     //     return _transformComics(res.data.results[0]);
//     // };

//     const _transformCharacter = (char) => {
//         return {
//             id: char.id,
//             name: char.name,
//             description: char.description
//                 ? `${char.description.slice(0, 210)}...`
//                 : "There is no description for this character",
//             thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
//             homepage: char.urls[0].url,
//             wiki: char.urls[1].url,
//             comics: char.comics.items,
//         };
//     };

//     // const _transformComics = (comics) => {
//     //     return {
//     //         id: comics.id,
//     //         title: comics.title,
//     //         description: comics.description || "There is no description",
//     //         pageCount: comics.pageCount
//     //             ? `${comics.pageCount} p.`
//     //             : "No information about the number of pages",
//     //         thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension,
//     //         language: comics.textObjects[0]?.language || "en-us",
//     //         // optional chaining operator
//     //         price: comics.prices[0].price
//     //             ? `${comics.prices[0].price}$`
//     //             : "not available",
//     //     };
//     // };

//     return {
//         loading,
//         error,
//         clearError,
//         getAllCharacters,
//         getCharacter,
//         // getAllComics,
//         // getComics,
//     };
// };

// export default useMarvelService;


