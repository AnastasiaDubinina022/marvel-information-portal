
function upgradeToHttps(url) {
    if (typeof url !== 'string') return url;  
    if (url.startsWith('http://')) {
        return url.replace('http://', 'https://')  
    }
    return url; 
}

export default upgradeToHttps;