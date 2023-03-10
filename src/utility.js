import { CapacitorHttp } from "@capacitor/core";
import { Toast } from '@capacitor/toast';

const API_KEY = "675eba7a24c6d06fa76bf002db96f803";

export function calculateDaysBetweenDates(date1, date2) {
    var oneDay = 24 * 60 * 60 * 1000;
    var date1InMillis = date1.getTime();
    var date2InMillis = date2.getTime();
    var days = Math.round(Math.abs(date2InMillis - date1InMillis) / oneDay);
    console.log(days);
    return days;
}

export function searchApiMovies(name, type) {
    return new Promise((res, rej) => {
        CapacitorHttp.get({
            url: `https://api.themoviedb.org/3/search/${type == "movie" ? "movie" : "tv"
                }?api_key=${API_KEY}&language=fr-FR&query=${name}`,
            responseType: "json"
        })
            .then(({data}) => {
                const json = data;
                if (json.results && json.results.length > 0) {
                    res({
                        image:
                            json.results[0].backdrop_path != null
                                ? "https://image.tmdb.org/t/p/w500" +
                                json.results[0].backdrop_path
                                : "",
                        overview: json.results[0].overview != null ? json.results[0].overview : "",
                    });
                } else {
                    res({
                        image: "",
                        overview: "",
                    });
                }
            })
            .catch(() => {
                res({
                    image: "",
                    overview: "",
                });
            });
    });
}

export function grabbeVideoFromUrl(url, message = true) {
    return new Promise((res, rej) => {
        CapacitorHttp.get({
            url,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            readTimeout: 5000,
            connectTimeout: 5000
        })
            .then((response) => {
                const regex = /\bhttps?:\/\/\S+\.mp4\b/;
                const mp4Urls = response.data.match(regex);
                if (mp4Urls == null) {
                    if (message) {
                        Toast.show({
                            text: "La récuperation de la source a échouer..."
                        })
                    }
                }
                res({
                    url: mp4Urls != null ? mp4Urls[0] : "",
                    referer: url,
                });
            })
            .catch((err) => {
                if (message) {
                    Toast.show({
                        text: "La récuperation de la source a échouer..."
                    })
                }
                res({
                    url: "",
                    referer: url,
                });
            });
    });
}

export async function parseFile(lines)
{
    let newItems = [];
    let list = [];
    let title = "";

    const addit = async (line) => {
        let parts = line.split(":");
        if (parts.length >= 2) {
            let ptitle = parts[0];
            let purl = line.replace(ptitle + ":", "");

            if (isUrlValid(purl)) {
                const pvideo = await grabbeVideoFromUrl(purl, false);
                list.push({
                    title: ptitle,
                    video: pvideo,
                    date: new Date().toLocaleDateString("fr"),
                });
            }
        }
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (
            (line.startsWith("[") && line.endsWith("]")) ||
            i == lines.length - 1
        ) {
            await addit(line);

            if (title.length != 0) {
                newItems.push({
                    title,
                    list,
                    type: list.length <= 1 ? "movie" : "serie",
                });
            }

            list = [];
            title = line.replace("[", "").replace("]", "");
        } else if (title.length != 0) {
            await addit(line);
        }
    }

    return newItems;
}

export async function isUrlResponding(url, referer = "")
{   
    let headers = {
        "Access-Control-Allow-Origin": "*"
    }
    if(referer.length != 0)
    {
        headers["Referer"] = referer;
    }

    return new Promise((res, rej)=>{
        CapacitorHttp.request({
            method: 'HEAD',
            url,
            headers
        }).then(response => {
            res(true)
        }).catch(()=>{
            res(false);
        });
    })
}

export function isUrlValid(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}
