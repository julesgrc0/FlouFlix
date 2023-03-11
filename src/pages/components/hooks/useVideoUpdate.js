import React from "react";
import { grabbeVideoFromUrl, getTimeDiff, isUrlResponding } from '../api/utility';


export function useVideoUpdate(item, modifie) {
    const [error, setError] = React.useState(false);
    const [update, setUpdate] = React.useState(false);

    React.useEffect(() => {
        let days = getTimeDiff(new Date(item.update), new Date());

        if (item.video.referer.length == 0) {
            setError(true);
        } else if (item.video.url.length == 0)
        {
            setError(true);
            tryVideoUpdate();
        }
        else if (days >= 1) {
            tryVideoUpdate();
        }
    }, [item])

    const tryVideoUpdate = React.useCallback(() => {
        if (item.video.referer.length != 0) 
        {
            setUpdate(true);
            grabbeVideoFromUrl(item.video.referer, false).then(async (newVideo) => {

                if (newVideo.url.length != 0 && newVideo.url != item.video.url) 
                {
                    const err = await modifie({ ...item, video: newVideo, update: new Date().toISOString() })
                    setError(err);
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