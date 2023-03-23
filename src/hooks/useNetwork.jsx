import { Network } from '@capacitor/network'
import React from 'react';

export function useNetwork()
{
    const [connected, setConnected] = React.useState(true);

    React.useEffect(()=>{

        Network.getStatus().then((status)=>{
            setConnected(status.connected)
        })

        Network.addListener("networkStatusChange", (status)=>{
            setConnected(status.connected)
        })
        
        return ()=>{
            Network.removeAllListeners();
        }
    }, [])

    return {
        connected
    };
}