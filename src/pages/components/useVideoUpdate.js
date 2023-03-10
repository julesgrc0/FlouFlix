import React from "react";
import { grabbeVideoFromUrl, isUrlResponding, calculateDaysBetweenDates } from '../../utility';


export function useVideoUpdate(item, modifie)
{
    const [error, setError] = React.useState(false);
    const [update, setUpdate] = React.useState(false);

    React.useEffect(() => {
        if (item.video.url.length == 0 || item.video.referer.length == 0) {
            setError(true);
        } else {
            let days = calculateDaysBetweenDates(new Date(item.update), new Date());
            if (days >= 1) {
                tryVideoUpdate();
            } else {
                isUrlResponding(item.video.url, item.video.referer).then((state) => {
                    if (!state) {
                        setError(true);
                    }
                })
            }
        }
    }, [item])

    const tryVideoUpdate = React.useCallback(() => {
        if (item.video.referer.length != 0) {
            setUpdate(true);
            grabbeVideoFromUrl(item.video.referer, false).then(async (newVideo) => {

                if (newVideo.url.length != 0 && newVideo.url != item.video.url) {
                   await modifie({ ...item, video: newVideo, update: new Date().toISOString() })
                }
                setTimeout(() => {
                    setUpdate(false);
                }, 400);
            })
        }
    }, [setUpdate])

    return {
        update: tryVideoUpdate,
        error,
        loading: update
    }
}